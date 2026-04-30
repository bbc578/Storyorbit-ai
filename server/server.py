import json
import os
import re
import sys
import traceback
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer


HOST = "127.0.0.1"
PORT = int(os.getenv("STORYORBIT_PORT", "8787"))
PROVIDER_NAME = os.getenv("STORYORBIT_AI_PROVIDER", "OpenAI-compatible AI")
BASE_URL = (
    os.getenv("STORYORBIT_API_BASE_URL")
    or os.getenv("DASHSCOPE_BASE_URL")
    or "https://dashscope.aliyuncs.com/compatible-mode/v1"
)
MODEL = os.getenv("STORYORBIT_MODEL") or os.getenv("DASHSCOPE_MODEL") or "qwen-plus"
MAX_CHARACTER_WORKERS = int(os.getenv("STORYORBIT_AGENT_WORKERS", "4"))


STRESS_DIMENSIONS = [
    ("逻辑一致性", False),
    ("人设一致性", False),
    ("伏笔回收", False),
    ("情绪曲线", False),
    ("前 5 秒钩子", False),
    ("付费点/断章点", False),
    ("爽点密度", False),
    ("反派动机", False),
    ("世界规则使用", False),
    ("巧合风险", True),
]


def get_api_key():
    return clean_api_key(os.getenv("STORYORBIT_API_KEY") or os.getenv("DASHSCOPE_API_KEY") or "")


def call_ai(messages, model=None, temperature=0.7):
    api_key = get_api_key()
    if not api_key:
        raise RuntimeError("STORYORBIT_API_KEY is missing. DASHSCOPE_API_KEY is also supported for compatibility.")

    url = f"{BASE_URL.rstrip('/')}/chat/completions"
    body = json.dumps(
        {
            "model": model or MODEL,
            "messages": messages,
            "temperature": temperature,
        },
        ensure_ascii=False,
    ).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=body,
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=120) as response:
        data = json.loads(response.read().decode("utf-8"))
    return data["choices"][0]["message"]["content"]


def clean_api_key(value):
    value = (value or "").strip().strip('"').strip("'")
    match = re.search(r"sk-[A-Za-z0-9_\-]{16,}", value)
    if match:
        return match.group(0)
    value = re.sub(r"\s+", "", value)
    if len(value) >= 8:
        try:
            value.encode("ascii")
            return value
        except UnicodeEncodeError:
            return ""
    return ""


def extract_json(text):
    text = text.strip()
    if text.startswith("```"):
        parts = text.split("```")
        text = max(parts, key=len).strip()
        if text.lower().startswith("json"):
            text = text[4:].strip()
    start = text.find("{")
    end = text.rfind("}")
    if start == -1 or end == -1 or end <= start:
        raise ValueError("Model response did not contain a JSON object")
    return json.loads(text[start : end + 1])


def ask_json(agent_name, system_prompt, user_prompt, temperature=0.7):
    content = call_ai(
        [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        temperature=temperature,
    )
    try:
        return extract_json(content), content
    except Exception as exc:
        raise ValueError(f"{agent_name} returned invalid JSON: {exc}\nRaw response:\n{content}") from exc


def build_context(payload):
    project = payload.get("project", {})
    world = project.get("world", {})
    sources = project.get("sources", [])
    timeline = project.get("timeline", [])
    event = payload.get("eventPrompt", "")
    output_mode = payload.get("outputMode", "短剧分镜")
    intensity = payload.get("intensity", 4)

    source_text = "\n".join(
        [f"- {source.get('title', '未命名资料')}: {source.get('text', '')[:900]}" for source in sources[:4]]
    )
    timeline_text = "\n".join(
        [f"- {item.get('title', '事件')}: {item.get('event', '')}" for item in timeline[-6:]]
    )
    return {
        "world": world,
        "sources": source_text or "暂无导入资料",
        "timeline": timeline_text or "暂无历史事件",
        "event": event,
        "output_mode": output_mode,
        "intensity": intensity,
    }


def character_agent(context, character):
    system = (
        "你是 StoryOrbit AI 的角色智能体。你只能站在当前角色视角行动。"
        "必须严格遵守角色目标、隐藏目标、恐惧、长期记忆和人设硬规则。"
        "只输出合法 JSON。"
    )
    user = f"""
请基于故事世界和当前事件，生成该角色的反应。

输出 JSON：
{{
  "name": "角色名",
  "role": "角色定位",
  "reaction": "角色会如何行动，必须结合表层目标和隐藏目标",
  "dialogue": "一句符合该角色说话风格的台词",
  "memoryUse": "本轮如何使用长期记忆和人设硬规则"
}}

故事世界：
项目名：{context["world"].get("title")}
类型：{context["world"].get("genre")}
受众：{context["world"].get("audience")}
基调：{context["world"].get("tone")}
核心冲突：{context["world"].get("conflict")}
世界规则：{context["world"].get("rules")}
长期伏笔：{context["world"].get("foreshadowing")}

历史事件：
{context["timeline"]}

资料：
{context["sources"]}

当前事件：
{context["event"]}

当前角色：
名字：{character.get("name")}
定位：{character.get("role")}
表层目标：{character.get("goal")}
隐藏目标：{character.get("hidden")}
恐惧/弱点：{character.get("fear")}
说话风格：{character.get("speech")}
关系记忆：{character.get("relations")}
长期记忆：{character.get("memory")}
人设硬规则：{character.get("hardRules")}
""".strip()
    data, raw = ask_json(f"CharacterAgent:{character.get('name')}", system, user, temperature=0.75)
    return {
        "name": str(data.get("name") or character.get("name") or "未知角色"),
        "role": str(data.get("role") or character.get("role") or "角色"),
        "reaction": str(data.get("reaction") or ""),
        "dialogue": str(data.get("dialogue") or ""),
        "memoryUse": str(data.get("memoryUse") or ""),
        "_raw": raw,
    }


def director_agent(context, reactions):
    system = (
        "你是 StoryOrbit AI 的导演智能体。你负责把角色反应汇总成可选择的剧情路线。"
        "你关注冲突升级、节奏、分支差异和下一幕可推进性。只输出合法 JSON。"
    )
    user = f"""
请根据角色智能体反应，生成 3 条剧情分支。

输出 JSON：
{{
  "branches": [
    {{"title": "路线名", "score": 0-100, "summary": "分支摘要", "nextEvent": "选择该分支后的下一幕事件", "payoff": "优点与风险"}}
  ]
}}

要求：
1. branches 必须正好 3 条。
2. 三条路线必须明显不同。
3. 每条 nextEvent 都要能直接作为下一轮推演输入。
4. 剧情强度：{context["intensity"]}/5。

输出格式目标：{context["output_mode"]}

故事核心冲突：
{context["world"].get("conflict")}

世界规则：
{context["world"].get("rules")}

当前事件：
{context["event"]}

角色反应：
{json.dumps([{k: v for k, v in item.items() if not k.startswith("_")} for item in reactions], ensure_ascii=False)}
""".strip()
    data, raw = ask_json("DirectorAgent", system, user, temperature=0.72)
    branches = data.get("branches") if isinstance(data.get("branches"), list) else []
    return normalize_branches(branches), raw


def critic_agent(context, reactions, branches):
    system = (
        "你是 StoryOrbit AI 的质检智能体。你负责严格找问题，而不是夸奖作品。"
        "你必须从商业短剧、网文连载和游戏叙事角度评估。只输出合法 JSON。"
    )
    dimension_text = "、".join([name for name, _ in STRESS_DIMENSIONS])
    user = f"""
请对本轮剧情推演做专业压力测试。

输出 JSON：
{{
  "stress": [
    {{"name": "维度名", "score": 0-100, "risk": false}}
  ],
  "advice": ["具体修改建议 1", "具体修改建议 2", "具体修改建议 3"]
}}

stress 必须包含这 10 个维度，名称必须完全一致：
{dimension_text}

其中“巧合风险”的 risk 必须为 true，其他维度 risk 为 false。
分数越高代表该维度越强；但“巧合风险”越高代表风险越高。

故事世界：
{json.dumps(context["world"], ensure_ascii=False)}

当前事件：
{context["event"]}

角色反应：
{json.dumps([{k: v for k, v in item.items() if not k.startswith("_")} for item in reactions], ensure_ascii=False)}

剧情分支：
{json.dumps(branches, ensure_ascii=False)}
""".strip()
    data, raw = ask_json("CriticAgent", system, user, temperature=0.55)
    return normalize_stress(data.get("stress")), normalize_list(data.get("advice"), "需要补充更具体的修改建议。"), raw


def scriptwriter_agent(context, reactions, branches):
    system = (
        "你是 StoryOrbit AI 的交付物智能体。你负责把推演结果转成可交付内容。"
        "根据目标输出格式生成短剧分镜、网文章节节点或游戏任务链。只输出合法 JSON。"
    )
    user = f"""
请把本轮推演转成“{context["output_mode"]}”。

输出 JSON：
{{
  "script": ["节点 1", "节点 2", "节点 3", "节点 4"]
}}

要求：
1. 如果是短剧分镜，要包含时间段、画面动作、台词或钩子。
2. 如果是网文章节大纲，要包含章节推进和断章点。
3. 如果是游戏任务链，要包含目标、阻碍、玩家选择和结果。

故事类型：{context["world"].get("genre")}
目标受众：{context["world"].get("audience")}
当前事件：{context["event"]}
角色反应：{json.dumps([{k: v for k, v in item.items() if not k.startswith("_")} for item in reactions], ensure_ascii=False)}
剧情分支：{json.dumps(branches, ensure_ascii=False)}
""".strip()
    data, raw = ask_json("ScriptwriterAgent", system, user, temperature=0.68)
    return normalize_list(data.get("script"), "模型未返回交付节点。"), raw


def normalize_list(value, fallback):
    if not isinstance(value, list):
        return [fallback]
    return [str(item) for item in value if str(item).strip()] or [fallback]


def normalize_branches(value):
    branches = []
    for index, item in enumerate(value[:3]):
        branches.append(
            {
                "title": str(item.get("title") or f"路线 {index + 1}"),
                "score": clamp(item.get("score"), 0, 100, default=70),
                "summary": str(item.get("summary") or ""),
                "nextEvent": str(item.get("nextEvent") or "继续围绕当前冲突推进下一幕。"),
                "payoff": str(item.get("payoff") or ""),
            }
        )
    while len(branches) < 3:
        n = len(branches) + 1
        branches.append(
            {
                "title": f"备用路线 {n}",
                "score": 70,
                "summary": "该路线需要继续补充。",
                "nextEvent": "继续围绕当前冲突推进下一幕。",
                "payoff": "需要人工补充优点与风险。",
            }
        )
    return branches


def normalize_stress(value):
    by_name = {}
    if isinstance(value, list):
        for item in value:
            by_name[str(item.get("name"))] = item
    result = []
    for name, risk in STRESS_DIMENSIONS:
        item = by_name.get(name, {})
        result.append(
            {
                "name": name,
                "score": clamp(item.get("score"), 0, 100, default=60),
                "risk": risk,
            }
        )
    return result


def clamp(value, min_value, max_value, default=0):
    try:
        number = int(round(float(value)))
    except (TypeError, ValueError):
        number = default
    return max(min_value, min(max_value, number))


def run_multi_agent_simulation(payload):
    context = build_context(payload)
    characters = payload.get("characters", [])
    if not characters:
        raise ValueError("No characters provided")

    reactions = []
    raw_agent_outputs = {}
    max_workers = max(1, min(MAX_CHARACTER_WORKERS, len(characters)))
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        futures = {executor.submit(character_agent, context, character): character for character in characters}
        for future in as_completed(futures):
            character = futures[future]
            reaction = future.result()
            raw_agent_outputs[f"character:{character.get('name')}"] = reaction.pop("_raw", "")
            reactions.append(reaction)

    # Preserve selected character order after parallel calls.
    order = {character.get("name"): index for index, character in enumerate(characters)}
    reactions.sort(key=lambda item: order.get(item.get("name"), 999))

    branches, director_raw = director_agent(context, reactions)
    stress, advice, critic_raw = critic_agent(context, reactions, branches)
    script, scriptwriter_raw = scriptwriter_agent(context, reactions, branches)

    raw_agent_outputs["director"] = director_raw
    raw_agent_outputs["critic"] = critic_raw
    raw_agent_outputs["scriptwriter"] = scriptwriter_raw

    return {
        "reactions": reactions,
        "branches": branches,
        "stress": stress,
        "advice": advice,
        "script": script,
        "agentTrace": [
            {"name": "Character Agents", "count": len(reactions), "status": "completed"},
            {"name": "Director Agent", "count": 1, "status": "completed"},
            {"name": "Critic Agent", "count": 1, "status": "completed"},
            {"name": "Scriptwriter Agent", "count": 1, "status": "completed"},
        ],
        "rawAgents": raw_agent_outputs,
    }


def bootstrap_story_universe(payload):
    idea = payload.get("idea", "").strip()
    if not idea:
        raise ValueError("idea is required")
    genre = payload.get("genre", "都市悬疑短剧")
    tone = payload.get("tone", "紧张、反转、强钩子")
    audience = payload.get("audience", "18-30 岁内容用户")
    character_count = clamp(payload.get("characterCount"), 3, 5, default=3)

    system = (
        "你是 StoryOrbit AI 的故事宇宙架构师。"
        "你擅长把一句故事点子扩展成可推演的故事项目。"
        "只输出合法 JSON，不要 Markdown，不要解释。"
    )
    user = f"""
请把用户的一句话故事点子扩展成完整故事宇宙。

输出 JSON：
{{
  "world": {{
    "title": "项目名称",
    "genre": "类型",
    "audience": "目标受众",
    "tone": "情绪基调",
    "conflict": "核心冲突",
    "rules": "世界规则 / 禁忌设定",
    "foreshadowing": "长期伏笔"
  }},
  "characters": [
    {{
      "name": "角色名",
      "role": "主角/反派/保护者/盟友/背叛者/导师/观众代理",
      "goal": "表层目标",
      "hidden": "隐藏目标",
      "fear": "恐惧或弱点",
      "speech": "说话风格",
      "relations": "关系记忆",
      "memory": "长期记忆",
      "hardRules": "不可违反的人设规则"
    }}
  ],
  "eventPrompt": "第一幕剧情事件",
  "outputMode": "短剧分镜/网文章节大纲/游戏任务链",
  "sourceDraft": "可放入资料库的项目摘要"
}}

要求：
1. characters 数量必须是 {character_count}。
2. 至少包含 1 个主角、1 个反派、1 个保护者或盟友。
3. 世界规则必须能影响后续剧情推演，不能只是背景介绍。
4. 第一幕事件必须有强冲突、时间压力和明确失败代价。
5. 不要仿写现有受版权保护 IP。

用户点子：
{idea}

类型：{genre}
风格：{tone}
目标受众：{audience}
""".strip()
    data, raw = ask_json("BootstrapAgent", system, user, temperature=0.78)
    return normalize_bootstrap(data), raw


def normalize_bootstrap(data):
    world = data.get("world") if isinstance(data.get("world"), dict) else {}
    characters = data.get("characters") if isinstance(data.get("characters"), list) else []
    normalized_characters = []
    for item in characters[:5]:
        normalized_characters.append(
            {
                "name": str(item.get("name") or "未命名角色"),
                "role": str(item.get("role") or "角色"),
                "goal": str(item.get("goal") or "推动剧情"),
                "hidden": str(item.get("hidden") or "隐藏真实动机"),
                "fear": str(item.get("fear") or "失去主动权"),
                "speech": str(item.get("speech") or "克制、短句、藏信息"),
                "relations": str(item.get("relations") or "与核心冲突相关。"),
                "memory": str(item.get("memory") or "暂无长期记忆。"),
                "hardRules": str(item.get("hardRules") or "不得违背核心人设。"),
            }
        )
    return {
        "world": {
            "title": str(world.get("title") or "未命名故事"),
            "genre": str(world.get("genre") or "都市悬疑短剧"),
            "audience": str(world.get("audience") or "内容用户"),
            "tone": str(world.get("tone") or "紧张、反转、强钩子"),
            "conflict": str(world.get("conflict") or ""),
            "rules": str(world.get("rules") or ""),
            "foreshadowing": str(world.get("foreshadowing") or ""),
        },
        "characters": normalized_characters,
        "eventPrompt": str(data.get("eventPrompt") or ""),
        "outputMode": str(data.get("outputMode") or "短剧分镜"),
        "sourceDraft": str(data.get("sourceDraft") or ""),
    }


class Handler(BaseHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(204)
        self.end_headers()

    def do_GET(self):
        if self.path == "/api/status":
            self.json_response(
                {
                    "ok": True,
                    "hasKey": bool(get_api_key()),
                    "provider": PROVIDER_NAME,
                    "model": MODEL,
                    "baseUrl": BASE_URL,
                    "mode": "multi-agent",
                    "characterWorkers": MAX_CHARACTER_WORKERS,
                }
            )
            return
        self.send_response(404)
        self.end_headers()

    def do_POST(self):
        try:
            length = int(self.headers.get("Content-Length", "0"))
            payload = json.loads(self.rfile.read(length).decode("utf-8")) if length else {}

            if self.path == "/api/simulate":
                data = run_multi_agent_simulation(payload)
                self.json_response({"ok": True, "data": data})
                return

            if self.path == "/api/bootstrap":
                data, raw = bootstrap_story_universe(payload)
                self.json_response({"ok": True, "data": data, "raw": raw})
                return

            self.send_response(404)
            self.end_headers()
        except urllib.error.HTTPError as exc:
            detail = exc.read().decode("utf-8", errors="replace")
            self.json_response({"ok": False, "error": f"AI provider HTTP {exc.code}", "detail": detail}, status=502)
        except Exception as exc:
            traceback.print_exc()
            self.json_response({"ok": False, "error": str(exc)}, status=500)

    def json_response(self, value, status=200):
        data = json.dumps(value, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def log_message(self, fmt, *args):
        sys.stderr.write("%s - %s\n" % (self.address_string(), fmt % args))


if __name__ == "__main__":
    server = ThreadingHTTPServer((HOST, PORT), Handler)
    print(f"StoryOrbit AI multi-agent proxy running at http://{HOST}:{PORT}")
    print(f"Provider: {PROVIDER_NAME}")
    print(f"Model: {MODEL}")
    print(f"Character workers: {MAX_CHARACTER_WORKERS}")
    print("Press Ctrl+C to stop.")
    server.serve_forever()
