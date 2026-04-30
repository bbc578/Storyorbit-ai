const STORE_KEY = "storyorbit_studio_v2";
const API_BASE_URL = (window.STORYORBIT_API_BASE_URL || "http://127.0.0.1:8787").replace(/\/$/, "");

const templates = {
  urban: {
    name: "霓虹城继承人",
    world: {
      title: "霓虹城继承人",
      genre: "都市悬疑短剧",
      audience: "18-30 岁短剧用户",
      tone: "紧张、反转、强钩子",
      conflict: "一个外卖员发现自己是科技集团失踪继承人，但集团里所有人都希望他继续失踪。",
      rules: "继承权必须由董事会确认；继承人死亡确认书一旦签署，集团资产将在 72 小时内重组；任何人公开提及旧继承人都会被安全系统标记。",
      foreshadowing: "被篡改的派单地址、旧照片背面的编号、母亲留下的空白遗嘱。"
    },
    eventPrompt: "林澈在送餐时进入星环科技顶层会议室，发现董事会正在讨论“确认继承人死亡”的文件。沈遥在现场，但她假装不认识林澈。",
    outputMode: "短剧分镜",
    characters: [
      ["林澈", "主角", "查清父亲失踪真相", "确认自己不是被制造出来的替身", "害怕所有记忆都是假的", "克制、短句、藏信息", "表面是外卖员，真实身份是星环科技失踪继承人。", "记得母亲让他永远不要进入星环大楼。", "不能主动承认继承人身份。"],
      ["沈遥", "保护者", "阻止继承权战争失控", "不让林澈立刻回到集团", "害怕林澈知道她参与隐藏身份", "温柔、回避、保护性表达", "受林澈母亲委托保护他，公开场合必须假装陌生。", "记得林澈母亲临终前交给她一枚芯片。", "不能在董事会成员面前说出真相。"],
      ["秦越", "反派", "摧毁林澈可信度", "证明自己比继承人更配掌控集团", "害怕被当成永远无法继承的外人", "强势、压迫、反问", "星环科技代理 CEO，曾是林澈父亲的学生。", "记得导师曾说他不适合掌权。", "不能直接杀死林澈，必须让他社会性死亡。"]
    ]
  },
  fantasy: {
    name: "烬海王座",
    world: {
      title: "烬海王座",
      genre: "玄幻网文",
      audience: "喜欢成长、权谋、宗门冲突的网文读者",
      tone: "热血、成长、爽感",
      conflict: "被逐出宗门的废脉少年发现自己能听见上古王座的低语，但每次借用力量都会失去一段记忆。",
      rules: "烬海力量不能连续使用三次；王座只回应失去过至亲的人；宗门血誓一旦违背会反噬灵脉。",
      foreshadowing: "主角缺失的童年、师姐手腕的黑色誓纹、反派总在月食之夜消失。"
    },
    eventPrompt: "陆燃在宗门试炼中被迫进入禁地，烬海王座第一次回应他，同时宗主宣布他盗取禁术。",
    outputMode: "网文章节大纲",
    characters: [
      ["陆燃", "主角", "夺回被污蔑的人生", "找回被王座吞掉的记忆", "害怕自己最终变成王座傀儡", "克制、短句、藏信息", "被逐出宗门，与师姐有未解误会。", "记得母亲死前说不要相信月食。", "不能连续三次使用烬海力量。"],
      ["谢无咎", "反派", "夺取王座承认", "证明血统比意志更重要", "害怕自己只是宗主棋子", "强势、压迫、反问", "宗主亲传弟子，表面维护宗门规矩。", "记得自己曾被王座拒绝。", "不能承认自己嫉妒陆燃。"],
      ["顾青瓷", "保护者", "保住陆燃性命", "隐藏当年灭门真相", "害怕陆燃恨她", "古典、庄重、带宿命感", "陆燃师姐，曾被迫参与封印陆燃记忆。", "记得禁地真正入口。", "不能在宗主面前暴露誓纹。"]
    ]
  },
  game: {
    name: "灰港协议",
    world: {
      title: "灰港协议",
      genre: "游戏任务线",
      audience: "喜欢赛博潜入、阵营选择和多结局 RPG 的玩家",
      tone: "克制、悬疑、压迫",
      conflict: "玩家扮演的调查员必须在三大阵营之间找出失踪 AI 的下落，但每个阵营都掌握一部分真实协议。",
      rules: "灰港没有永久盟友；每次上传记忆都会改变 NPC 对玩家的信任；AI 不会撒谎，但会隐藏上下文。",
      foreshadowing: "码头 17 号空仓库、重复出现的白噪声、NPC 在不同周目说出同一句话。"
    },
    eventPrompt: "玩家在灰港码头接到匿名委托，要求在 12 小时内找到失踪 AI 的容器，否则全城记忆备份会被清空。",
    outputMode: "游戏任务链",
    characters: [
      ["调查员", "主角", "找出失踪 AI 的容器", "查清自己是否也是备份人格", "害怕玩家身份是伪造的", "理性、分析、像任务指令", "与各阵营都保持临时合作。", "记得上一周目失败的碎片。", "不能同时向两个阵营提交同一证据。"],
      ["莫拉", "盟友", "帮助玩家进入灰港底层网络", "保护自己的妹妹备份", "害怕备份被重置", "玩世不恭、讽刺、节奏快", "黑市修复师，对玩家半信半疑。", "记得玩家曾在另一周目救过她。", "不会免费提供第二次帮助。"],
      ["白塔主管", "反派", "回收失踪 AI", "销毁灰港所有非法人格备份", "害怕白塔秩序被证明建立在谎言上", "强势、压迫、反问", "城市安全系统的代表。", "记得灰港协议原始签署人名单。", "不能承认 AI 拥有法律人格。"]
    ]
  }
};

const $ = (id) => document.getElementById(id);
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`);

let store = loadStore();
let activeTab = "dashboard";
let selectedBranchIndex = 0;
let aiProxyStatus = { ok: false, hasKey: false, model: "" };
let progressTimer = null;

const pageMeta = {
  dashboard: ["总览", "从设定、资料、角色、推演、压力测试到导出，完成一个可落地的故事项目。"],
  starter: ["新手模式", "只输入一句故事点子，自动生成世界观、角色卡、伏笔和第一幕事件。"],
  world: ["世界设定", "维护 Story Bible、世界规则、核心冲突和长期伏笔。"],
  sources: ["资料导入", "导入设定文档、章节草稿、人物小传，并抽取可用信息。"],
  characters: ["角色记忆", "维护角色目标、秘密、关系、长期记忆和不可违反的人设规则。"],
  simulation: ["剧情推演", "输入事件，让多个角色围绕同一冲突产生反应和分支。"],
  visuals: ["关系与分支", "用关系图和分支树展示故事结构。"],
  stress: ["压力测试", "用更专业的 10 个维度检查剧情质量。"],
  outputs: ["交付物", "导出 Story Bible、角色记忆包、短剧分镜、连载大纲和项目提案。"]
};

function loadStore() {
  const raw = localStorage.getItem(STORE_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (parsed.projects?.length) return parsed;
    } catch {}
  }
  const project = createProjectFromTemplate("urban");
  return { activeProjectId: project.id, projects: [project] };
}

function saveStore(show = false) {
  readForms();
  localStorage.setItem(STORE_KEY, JSON.stringify(store));
  renderAll();
  if (show) toast("已保存到浏览器本地。");
}

function currentProject() {
  return store.projects.find((item) => item.id === store.activeProjectId) || store.projects[0];
}

function createProjectFromTemplate(key) {
  const source = templates[key];
  return {
    id: uid(),
    name: source.name,
    world: structuredClone(source.world),
    sources: [],
    characters: source.characters.map(([name, role, goal, hidden, fear, speech, relations, memory, hardRules]) => ({
      id: uid(), name, role, goal, hidden, fear, speech, relations, memory, hardRules, eventLog: []
    })),
    eventPrompt: source.eventPrompt,
    outputMode: source.outputMode,
    intensity: 4,
    timeline: [],
    runs: [],
    selectedBranchIndex: 0
  };
}

function blankProject() {
  return {
    id: uid(),
    name: "未命名故事",
    world: { title: "未命名故事", genre: "都市悬疑短剧", audience: "", tone: "紧张、反转、强钩子", conflict: "", rules: "", foreshadowing: "" },
    sources: [],
    characters: [],
    eventPrompt: "",
    outputMode: "短剧分镜",
    intensity: 4,
    timeline: [],
    runs: [],
    selectedBranchIndex: 0
  };
}

function projectFromBootstrap(data) {
  const world = data.world || {};
  return {
    id: uid(),
    name: world.title || "新故事宇宙",
    world: {
      title: world.title || "新故事宇宙",
      genre: world.genre || "都市悬疑短剧",
      audience: world.audience || "",
      tone: world.tone || "紧张、反转、强钩子",
      conflict: world.conflict || "",
      rules: world.rules || "",
      foreshadowing: world.foreshadowing || ""
    },
    sources: data.sourceDraft ? [{
      id: uid(),
      title: "AI 生成项目摘要",
      text: data.sourceDraft,
      analysis: parseSourceText(data.sourceDraft),
      createdAt: new Date().toISOString()
    }] : [],
    characters: (data.characters || []).map((c) => ({
      id: uid(),
      name: c.name || "未命名角色",
      role: c.role || "角色",
      goal: c.goal || "推动剧情",
      hidden: c.hidden || "隐藏真实动机",
      fear: c.fear || "失去主动权",
      speech: c.speech || "克制、短句、藏信息",
      relations: c.relations || "与核心冲突相关。",
      memory: c.memory || "暂无长期记忆。",
      hardRules: c.hardRules || "不得违背核心人设。",
      eventLog: []
    })),
    eventPrompt: data.eventPrompt || "",
    outputMode: data.outputMode || "短剧分镜",
    intensity: 4,
    timeline: [],
    runs: [],
    selectedBranchIndex: 0
  };
}

function switchTab(tab) {
  activeTab = tab;
  document.querySelectorAll(".nav-item").forEach((item) => item.classList.toggle("active", item.dataset.tab === tab));
  document.querySelectorAll(".tab-panel").forEach((panel) => panel.classList.toggle("active", panel.id === `tab-${tab}`));
  $("pageTitle").textContent = pageMeta[tab][0];
  $("pageSubtitle").textContent = pageMeta[tab][1];
}

function readForms() {
  const p = currentProject();
  if (!$("worldTitle")) return;
  p.world.title = $("worldTitle").value.trim();
  p.world.genre = $("worldGenre").value;
  p.world.audience = $("worldAudience").value.trim();
  p.world.tone = $("worldTone").value;
  p.world.conflict = $("worldConflict").value.trim();
  p.world.rules = $("worldRules").value.trim();
  p.world.foreshadowing = $("worldForeshadowing").value.trim();
  p.name = p.world.title || p.name;
  p.eventPrompt = $("eventPrompt").value.trim();
  p.outputMode = $("outputMode").value;
  p.intensity = Number($("intensity").value);
}

function writeForms() {
  const p = currentProject();
  $("worldTitle").value = p.world.title || "";
  $("worldGenre").value = p.world.genre || "都市悬疑短剧";
  $("worldAudience").value = p.world.audience || "";
  $("worldTone").value = p.world.tone || "紧张、反转、强钩子";
  $("worldConflict").value = p.world.conflict || "";
  $("worldRules").value = p.world.rules || "";
  $("worldForeshadowing").value = p.world.foreshadowing || "";
  $("eventPrompt").value = p.eventPrompt || "";
  $("outputMode").value = p.outputMode || "短剧分镜";
  $("intensity").value = p.intensity || 4;
  $("sourceTitle").value = "";
  $("sourceText").value = "";
}

function renderProjects() {
  $("projectSelect").innerHTML = store.projects.map((p) => `<option value="${p.id}">${escapeHtml(p.name)}</option>`).join("");
  $("projectSelect").value = store.activeProjectId;
}

function renderDashboard() {
  const p = currentProject();
  const worldScore = score([p.world.title, p.world.audience, p.world.conflict, p.world.rules, p.world.foreshadowing], 20);
  const characterScore = Math.min(100, p.characters.length * 22 + p.characters.filter((c) => c.memory && c.hardRules).length * 8);
  const continuityScore = Math.min(100, p.timeline.length * 18 + p.runs.length * 16);
  const exportScore = Math.min(100, worldScore * 0.35 + characterScore * 0.25 + (p.runs.length ? 40 : 0));
  const healthScore = Math.round((worldScore * 0.3) + (characterScore * 0.25) + (continuityScore * 0.2) + (exportScore * 0.25));
  const state = getProjectState(p, { worldScore, characterScore, continuityScore, exportScore, healthScore });
  $("dashWorldScore").textContent = Math.round(worldScore);
  $("dashCharacterScore").textContent = Math.round(characterScore);
  $("dashContinuityScore").textContent = Math.round(continuityScore);
  $("dashExportScore").textContent = Math.round(exportScore);
  $("projectHealthScore").textContent = `${healthScore}%`;
  $("projectHealthScore").style.setProperty("--health", `${healthScore}%`);
  $("projectHealthTitle").textContent = state.title;
  $("projectHealthSummary").textContent = state.summary;
  $("projectStageLabel").textContent = state.stage;
  $("projectStageHint").textContent = state.hint;
  $("launchReadinessPill").textContent = state.readiness;
  $("primaryWorkflowAction").textContent = state.primaryLabel;
  $("primaryWorkflowAction").dataset.targetTab = state.primaryTab;
  $("secondaryWorkflowAction").dataset.targetTab = p.runs.length ? "outputs" : "starter";
  $("secondaryWorkflowAction").textContent = p.runs.length ? "查看交付物" : "用新手模式开始";
  setChecked("checkStory", worldScore >= 60);
  setChecked("checkCharacters", p.characters.length >= 3);
  setChecked("checkEvent", Boolean(p.eventPrompt));
  setChecked("checkRun", p.runs.length > 0);
  setChecked("checkExport", exportScore >= 65);
  renderWorkflowState(p);
  renderRecentActivity(p);
}

function setChecked(id, value) {
  const el = $(id);
  if (el) el.checked = Boolean(value);
}

function getProjectState(p, scores) {
  if (scores.worldScore < 60) {
    return {
      title: "先把故事宇宙搭起来",
      summary: "输入一句故事点子，系统会生成世界观、核心冲突、角色和第一幕事件。",
      stage: "创建中",
      hint: "完成后会自动进入可编辑项目。",
      readiness: "Draft",
      primaryTab: "starter",
      primaryLabel: "开始创建"
    };
  }
  if (p.characters.length < 3) {
    return {
      title: "补齐可运行的角色阵容",
      summary: "至少 3 个角色会让剧情推演更有冲突和分支价值。",
      stage: "设定完善中",
      hint: "重点补目标、秘密、恐惧和硬规则。",
      readiness: "Setup",
      primaryTab: "characters",
      primaryLabel: "完善角色"
    };
  }
  if (!p.eventPrompt) {
    return {
      title: "输入下一幕剧情事件",
      summary: "给角色一个明确冲突，StoryOrbit 才能生成反应、分支和质检结果。",
      stage: "准备推演",
      hint: "事件越具体，推演越可用。",
      readiness: "Ready",
      primaryTab: "simulation",
      primaryLabel: "输入事件"
    };
  }
  if (!p.runs.length) {
    return {
      title: "运行第一次剧情推演",
      summary: "让角色智能体、导演智能体和质检智能体共同生成下一步故事路线。",
      stage: "待运行",
      hint: "可使用本地规则，也可启用云端 AI 增强。",
      readiness: "Ready",
      primaryTab: "simulation",
      primaryLabel: "运行推演"
    };
  }
  return {
    title: "项目已进入可交付状态",
    summary: "你可以继续推进分支，也可以导出 Story Bible、角色记忆包、分镜、大纲或项目提案。",
    stage: "可交付",
    hint: `${p.runs.length} 次推演，${p.timeline.length} 个事件。`,
    readiness: "Deliverable",
    primaryTab: "outputs",
    primaryLabel: "导出交付物"
  };
}

function renderWorkflowState(p) {
  const states = [
    ["flowStarter", p.world.title ? "已创建" : "未开始", Boolean(p.world.title)],
    ["flowWorld", p.world.conflict && p.world.rules ? "已完善" : "待完善", Boolean(p.world.conflict && p.world.rules)],
    ["flowCharacters", p.characters.length >= 3 ? `${p.characters.length} 个角色` : `${p.characters.length} / 3`, p.characters.length >= 3],
    ["flowSimulation", p.runs.length ? `${p.runs.length} 次推演` : "待运行", p.runs.length > 0],
    ["flowOutputs", p.runs.length ? "可导出" : "未就绪", p.runs.length > 0]
  ];
  states.forEach(([id, text, done]) => {
    const el = $(id);
    if (!el) return;
    el.textContent = text;
    el.closest(".workflow-step")?.classList.toggle("done", done);
  });
}

function renderRecentActivity(p) {
  const items = [
    p.world.title ? `项目：${p.world.title}` : "还没有项目标题",
    p.characters.length ? `角色记忆：${p.characters.length} 个角色` : "角色记忆待创建",
    p.runs.length ? `最近推演：第 ${p.runs[0].episode} 幕 · ${p.runs[0].eventPrompt.slice(0, 36)}` : "还没有运行剧情推演",
    p.runs.length ? `可导出：${p.outputMode || "Story Bible"}` : "导出会在推演后解锁"
  ];
  $("recentActivity").innerHTML = items.map((item) => `<div class="activity-item">${escapeHtml(item)}</div>`).join("");
}

function renderStarterPreview(data) {
  if (!data) return;
  $("starterPreview").textContent = [
    `项目：${data.world?.title || "未命名"}`,
    `类型：${data.world?.genre || ""}`,
    `受众：${data.world?.audience || ""}`,
    "",
    "核心冲突：",
    data.world?.conflict || "",
    "",
    "世界规则：",
    data.world?.rules || "",
    "",
    "长期伏笔：",
    data.world?.foreshadowing || "",
    "",
    "角色：",
    ...(data.characters || []).map((c) => `- ${c.name}（${c.role}）：${c.goal} / 隐藏目标：${c.hidden}`),
    "",
    "第一幕事件：",
    data.eventPrompt || ""
  ].join("\n");
}

function startProgress(title, steps) {
  clearInterval(progressTimer);
  $("progressPanel").hidden = false;
  $("progressTitle").textContent = title;
  $("progressPercent").textContent = "0%";
  $("progressBar").style.width = "0%";
  $("progressSteps").innerHTML = steps.map((step, index) => `<div class="progress-step ${index === 0 ? "active" : ""}" data-step="${index}">${step}</div>`).join("");
  let value = 0;
  let activeIndex = 0;
  progressTimer = setInterval(() => {
    value = Math.min(92, value + Math.max(1, Math.round((96 - value) / 14)));
    activeIndex = Math.min(steps.length - 1, Math.floor(value / (100 / steps.length)));
    updateProgress(value, activeIndex);
  }, 900);
}

function updateProgress(percent, activeIndex) {
  $("progressPercent").textContent = `${Math.round(percent)}%`;
  $("progressBar").style.width = `${Math.round(percent)}%`;
  document.querySelectorAll(".progress-step").forEach((item, index) => {
    item.classList.toggle("done", index < activeIndex);
    item.classList.toggle("active", index === activeIndex);
  });
}

function finishProgress(message) {
  clearInterval(progressTimer);
  progressTimer = null;
  updateProgress(100, document.querySelectorAll(".progress-step").length);
  $("progressTitle").textContent = message;
  setTimeout(() => {
    $("progressPanel").hidden = true;
  }, 1400);
}

function failProgress(message) {
  clearInterval(progressTimer);
  progressTimer = null;
  $("progressTitle").textContent = message;
  $("progressPercent").textContent = "失败";
  setTimeout(() => {
    $("progressPanel").hidden = true;
  }, 2600);
}

function pickIdeaProfile(idea, genre) {
  const clean = idea.replace(/[，。！？；：、“”‘’《》（）()]/g, " ");
  const words = [...new Set((clean.match(/[\u4e00-\u9fa5]{2,8}/g) || [])
    .filter((item) => !commonWords.has(item))
    .filter((item) => !/一个|发现|自己|所有|认识|系统|时候|因为|但是|如果|每次/.test(item)))];
  const titleSeed = words.find((word) => /城|港|岛|塔|门|局|院|仓|码头|王座|协议|计划|档案/.test(word)) || words[0] || idea.slice(0, 8);
  const title = titleSeed.length >= 4 ? titleSeed : `${titleSeed}档案`;
  const protagonistType = (idea.match(/一个([\u4e00-\u9fa5]{2,7}?)(发现|收到|进入|醒来|得到|拥有)/) || [])[1] || "普通人";
  const coreObject = words.find((word) => /系统|仓库|档案|编号|门|钥匙|记忆|梦|时间|码头|协议|王座/.test(word)) || titleSeed;
  const setting = words.find((word) => /城|港|岛|塔|学校|医院|集团|码头|仓库|宗门|游戏|车站|小区/.test(word)) || "关键地点";
  const isGame = genre === "游戏任务线";
  const isFantasy = genre.includes("玄幻");
  return {
    title,
    protagonistType,
    coreObject,
    setting,
    lead: isFantasy ? "陆烬" : isGame ? "调查员" : "许沉",
    protector: isFantasy ? "青璃" : isGame ? "莫拉" : "梁晚",
    villain: isFantasy ? "谢玄" : isGame ? "白塔主管" : "周砚",
    ally: isFantasy ? "灰袍医师" : isGame ? "线人K" : "老档案员",
    betrayer: isFantasy ? "同门师兄" : isGame ? "灰港内鬼" : "匿名证人"
  };
}

function localCharactersForIdea(idea, genre, count, profile) {
  const base = [
    {
      name: profile.lead,
      role: "主角",
      goal: `查清“${profile.coreObject}”为什么会指向自己`,
      hidden: `确认自己是否就是这个事件中被隐藏或被制造出来的关键人物`,
      fear: `害怕继续追查会让身边人承担代价`,
      speech: "克制、短句、藏信息",
      relations: `以“${profile.protagonistType}”身份卷入事件，和保护者互相利用又互相保护。`,
      memory: `只记得和“${profile.setting}”有关的一段破碎记忆：有人警告他不要回应异常信号。`,
      hardRules: `不能轻易相信任何完整档案；每次接近“${profile.coreObject}”都必须先确认代价。`
    },
    {
      name: profile.protector,
      role: "保护者",
      goal: `阻止${profile.lead}过早接触最终真相`,
      hidden: `她知道“${profile.coreObject}”背后的部分秘密，但不敢全部说出`,
      fear: `害怕${profile.lead}知道自己曾参与隐瞒`,
      speech: "温柔、回避、保护性表达",
      relations: `表面帮助${profile.lead}，实际也在利用他打开下一层线索。`,
      memory: `保存着一份和“${profile.setting}”有关的旧证据。`,
      hardRules: `不能在公开场合说出${profile.lead}的真实身份或最终真相。`
    },
    {
      name: profile.villain,
      role: "反派",
      goal: `维持“${profile.coreObject}”背后的现有秩序`,
      hidden: `证明自己当年的选择是正确的`,
      fear: `害怕被过去被抹除或牺牲的人追责`,
      speech: "强势、压迫、反问",
      relations: `掌握关键权限，表面敌视${profile.lead}，实际知道主角过去。`,
      memory: `记得最初事故发生时，${profile.coreObject}第一次失控。`,
      hardRules: `不能直接消灭${profile.lead}，只能让他失去可信度或选择错误路线。`
    },
    {
      name: profile.ally,
      role: "盟友",
      goal: `帮主角找到“${profile.coreObject}”的使用方法`,
      hidden: `自己也想借主角完成一件旧事`,
      fear: `害怕再次成为旁观者`,
      speech: "玩世不恭、讽刺、节奏快",
      relations: `掌握边缘线索，和反派阵营有旧关系。`,
      memory: `见过一次规则被打破后的后果。`,
      hardRules: `不会免费提供第二次帮助。`
    },
    {
      name: profile.betrayer,
      role: "背叛者",
      goal: `把主角引向一个看似正确的错误答案`,
      hidden: `保护自己曾经出卖过的人`,
      fear: `害怕真实记录被恢复`,
      speech: "理性、分析、像任务指令",
      relations: `同时向主角和反派提供半真半假的信息。`,
      memory: `记得真正的第一现场并不在${profile.setting}。`,
      hardRules: `每次说真话时必须混入一个误导信息。`
    }
  ];
  return base.slice(0, count);
}

function buildLocalStarter() {
  const idea = $("starterIdea").value.trim();
  if (!idea) {
    toast("先输入一句故事点子。");
    return null;
  }
  const genre = $("starterGenre").value;
  const tone = $("starterTone").value;
  const audience = $("starterAudience").value.trim() || "18-30 岁内容用户";
  const characterCount = Number($("starterCharacterCount").value || 3);
  const profile = pickIdeaProfile(idea, genre);
  const title = profile.title;
  const characters = localCharactersForIdea(idea, genre, characterCount, profile);
  const outputMode = genre === "游戏任务线" ? "游戏任务链" : genre.includes("网文") ? "网文章节大纲" : "短剧分镜";
  return {
    world: {
      title,
      genre,
      audience,
      tone,
      conflict: idea,
      rules: `核心规则：围绕“${profile.coreObject}”的每一次推进，都会触发一个现实代价。\n禁忌设定：任何角色直接说出最终真相，都会导致相关证据被抹除或改写。\n场景规则：“${profile.setting}”是第一层真相入口，但不是最终现场。`,
      foreshadowing: `${profile.lead}身上的异常编号、${profile.protector}保存的旧证据、${profile.villain}回避的监控死角、“${profile.coreObject}”第一次出现时留下的错误时间戳。`
    },
    characters,
    eventPrompt: `第一幕：${profile.lead}在${profile.setting}发现“${profile.coreObject}”与自己身份有关的第一份证据；${profile.protector}试图阻止他继续追查，${profile.villain}同时启动封锁程序，并宣布如果倒计时结束，和${profile.lead}有关的一段记录将被永久改写。`,
    outputMode,
    sourceDraft: `故事点子：${idea}\n类型：${genre}\n风格：${tone}\n目标受众：${audience}\n本地生成摘要：故事围绕“${profile.coreObject}”展开，第一真相入口位于“${profile.setting}”，主角身份和证据改写机制是连续推演核心。`
  };
}

function applyBootstrapProject(data, sourceLabel) {
  const project = projectFromBootstrap(data);
  store.projects.push(project);
  store.activeProjectId = project.id;
  writeForms();
  renderStarterPreview(data);
  saveStore(false);
  switchTab("world");
  toast(`${sourceLabel}已生成故事宇宙。`);
}

async function generateStarterWithAi() {
  const idea = $("starterIdea").value.trim();
  if (!idea) return toast("先输入一句故事点子。");
  try {
    startProgress("AI 正在生成故事宇宙", ["解析点子", "生成世界观", "生成角色", "写入项目"]);
    toast("AI 正在生成故事宇宙...");
    const response = await fetch(`${API_BASE_URL}/api/bootstrap`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idea,
        genre: $("starterGenre").value,
        tone: $("starterTone").value,
        audience: $("starterAudience").value.trim() || "18-30 岁内容用户",
        characterCount: Number($("starterCharacterCount").value)
      })
    });
    const result = await response.json();
    if (!response.ok || !result.ok) throw new Error(result.error || `HTTP ${response.status}`);
    applyBootstrapProject(result.data, "AI");
    finishProgress("故事宇宙生成完成");
  } catch (error) {
    console.warn(error);
    failProgress("AI 生成失败");
    toast("云端 AI 暂不可用，你可以使用本地快速生成。");
  }
}

function renderStats() {
  const p = currentProject();
  $("statCharacters").textContent = p.characters.length;
  $("statSources").textContent = p.sources.length;
  $("statEvents").textContent = p.timeline.length;
  $("statRuns").textContent = p.runs.length;
  $("statTokens").textContent = estimateTokens(p);
  if ($("apiStatus")) {
    $("apiStatus").textContent = aiProxyStatus.ok && aiProxyStatus.hasKey
      ? (aiProxyStatus.mode === "multi-agent" ? "云端增强" : "需要更新")
      : "离线模式";
  }
}

function renderBible() {
  const p = currentProject();
  $("biblePreview").textContent = buildBibleMarkdown(p);
}

function parseSourceText(text) {
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const names = [...new Set((text.match(/[\u4e00-\u9fa5]{2,4}/g) || []).filter((item) => !commonWords.has(item)).slice(0, 10))];
  const rules = lines.filter((line) => /规则|禁忌|必须|不能|代价|协议|血誓|继承权/.test(line)).slice(0, 6);
  const events = lines.filter((line) => /发现|宣布|背叛|进入|失踪|死亡|任务|试炼|委托/.test(line)).slice(0, 6);
  const hooks = lines.filter((line) => /反转|秘密|真相|伏笔|钩子|隐藏|身份/.test(line)).slice(0, 6);
  return { names, rules, events, hooks, wordCount: text.length };
}

function renderSourceAnalysis(analysis) {
  if (!analysis) {
    $("sourceAnalysis").textContent = "粘贴资料后点击“分析资料”，系统会抽取疑似角色、规则、事件和伏笔。";
    return;
  }
  $("sourceAnalysis").textContent = [
    `字数：${analysis.wordCount}`,
    "",
    `疑似角色：${analysis.names.join("、") || "未发现"}`,
    "",
    `规则/禁忌：\n${analysis.rules.map((x) => `- ${x}`).join("\n") || "- 未发现"}`,
    "",
    `剧情事件：\n${analysis.events.map((x) => `- ${x}`).join("\n") || "- 未发现"}`,
    "",
    `伏笔/秘密：\n${analysis.hooks.map((x) => `- ${x}`).join("\n") || "- 未发现"}`
  ].join("\n");
}

function addSource() {
  const p = currentProject();
  const text = $("sourceText").value.trim();
  if (!text) return toast("先粘贴或导入资料。");
  const analysis = parseSourceText(text);
  p.sources.unshift({ id: uid(), title: $("sourceTitle").value.trim() || `资料 ${p.sources.length + 1}`, text, analysis, createdAt: new Date().toISOString() });
  if (!p.world.rules && analysis.rules.length) p.world.rules = analysis.rules.join("\n");
  if (!p.world.foreshadowing && analysis.hooks.length) p.world.foreshadowing = analysis.hooks.join("\n");
  writeForms();
  saveStore(false);
  toast("资料已加入项目。");
}

function renderSources() {
  const p = currentProject();
  $("sourceCountPill").textContent = `${p.sources.length} 份资料`;
  const list = $("sourceList");
  if (!p.sources.length) {
    list.innerHTML = `<div class="empty">还没有资料。导入世界观、章节草稿或角色小传后，推演会更完整。</div>`;
    return;
  }
  list.innerHTML = p.sources.map((s) => `
    <article class="card">
      <div class="card-head"><h3>${escapeHtml(s.title)}</h3><span class="pill">${s.analysis.wordCount} 字</span></div>
      <p>疑似角色：${escapeHtml(s.analysis.names.join("、") || "无")}</p>
      <p>提取事件：${escapeHtml(s.analysis.events.slice(0, 2).join(" / ") || "无")}</p>
      <div class="card-actions"><button class="btn danger" data-delete-source="${s.id}">删除</button></div>
    </article>
  `).join("");
  list.querySelectorAll("[data-delete-source]").forEach((btn) => btn.addEventListener("click", () => {
    p.sources = p.sources.filter((s) => s.id !== btn.dataset.deleteSource);
    saveStore(false);
  }));
}

function clearCharacterForm() {
  ["characterName", "characterGoal", "characterHidden", "characterFear", "characterRelations", "characterMemory", "characterHardRules"].forEach((id) => $(id).value = "");
  $("characterRole").value = "主角";
  $("characterSpeech").value = "克制、短句、藏信息";
}

function addCharacter() {
  const p = currentProject();
  const name = $("characterName").value.trim();
  if (!name) return toast("先填写角色名字。");
  p.characters.push({
    id: uid(),
    name,
    role: $("characterRole").value,
    goal: $("characterGoal").value.trim() || "推动当前剧情",
    hidden: $("characterHidden").value.trim() || "隐藏真实动机",
    fear: $("characterFear").value.trim() || "失去主动权",
    speech: $("characterSpeech").value,
    relations: $("characterRelations").value.trim() || "与核心冲突存在直接关系。",
    memory: $("characterMemory").value.trim() || "暂无长期记忆。",
    hardRules: $("characterHardRules").value.trim() || "不得违背既有人设目标。",
    eventLog: []
  });
  clearCharacterForm();
  saveStore(false);
  toast("角色已加入。");
}

function renderCharacters() {
  const p = currentProject();
  $("characterCountPill").textContent = `${p.characters.length} 个角色`;
  const list = $("characterList");
  if (!p.characters.length) {
    list.innerHTML = `<div class="empty">还没有角色。至少创建 3 个角色，关系图和推演会更完整。</div>`;
    renderSimulationChecks();
    return;
  }
  list.innerHTML = p.characters.map((c) => `
    <article class="card">
      <div class="card-head"><h3>${escapeHtml(c.name)} · ${escapeHtml(c.role)}</h3><span class="pill">${escapeHtml(c.speech.split("、")[0])}</span></div>
      <ul>
        <li>表层目标：${escapeHtml(c.goal)}</li>
        <li>隐藏目标：${escapeHtml(c.hidden)}</li>
        <li>恐惧弱点：${escapeHtml(c.fear)}</li>
        <li>关系记忆：${escapeHtml(c.relations)}</li>
        <li>长期记忆：${escapeHtml(c.memory || "暂无")}</li>
        <li>人设规则：${escapeHtml(c.hardRules || "暂无")}</li>
      </ul>
      <p>事件日志：${escapeHtml((c.eventLog || []).slice(0, 3).join(" / ") || "暂无")}</p>
      <div class="card-actions"><button class="btn danger" data-delete-character="${c.id}">删除</button></div>
    </article>
  `).join("");
  list.querySelectorAll("[data-delete-character]").forEach((btn) => btn.addEventListener("click", () => {
    p.characters = p.characters.filter((c) => c.id !== btn.dataset.deleteCharacter);
    saveStore(false);
  }));
  renderSimulationChecks();
}

function renderSimulationChecks() {
  const p = currentProject();
  const box = $("simulationCharacterChecks");
  if (!p.characters.length) {
    box.innerHTML = `<div class="empty">暂无角色可选。</div>`;
    return;
  }
  box.innerHTML = p.characters.map((c, i) => `
    <label class="check-item"><input type="checkbox" value="${c.id}" ${i < 6 ? "checked" : ""}>${escapeHtml(c.name)} · ${escapeHtml(c.role)}</label>
  `).join("");
}

async function runSimulation() {
  const p = currentProject();
  saveStore(false);
  const selectedIds = [...$("simulationCharacterChecks").querySelectorAll("input:checked")].map((x) => x.value);
  const selected = p.characters.filter((c) => selectedIds.includes(c.id));
  if (!p.eventPrompt) return toast("先输入剧情事件。");
  if (selected.length < 2) return toast("至少选择 2 个角色。");
  let run;
  if ($("useCloudAi")?.checked) {
    try {
      startProgress("AI 多智能体推演中", ["角色智能体", "导演智能体", "质检智能体", "编剧智能体"]);
      toast("AI 正在生成剧情推演...");
      run = await buildCloudAiRun(p, selected);
      finishProgress("多智能体推演完成");
    } catch (error) {
      console.warn(error);
      failProgress("AI 推演失败，已回退本地");
      toast("云端 AI 暂不可用，已使用本地推演。");
      run = buildLocalRun(p, selected);
    }
  } else {
    run = buildLocalRun(p, selected);
  }
  applyRun(p, selected, run);
}

function buildLocalRun(p, selected) {
  return {
    id: uid(),
    createdAt: new Date().toISOString(),
    episode: p.timeline.length + 1,
    eventPrompt: p.eventPrompt,
    outputMode: p.outputMode,
    intensity: p.intensity,
    reactions: selected.map((c) => buildReaction(p, c)),
    branches: buildBranches(p, selected),
    stress: buildStressReport(p, selected),
    advice: buildAdvice(p, selected),
    script: buildScript(p, selected)
  };
}

async function buildCloudAiRun(p, selected) {
  const response = await fetch(`${API_BASE_URL}/api/simulate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      project: p,
      characters: selected,
      eventPrompt: p.eventPrompt,
      outputMode: p.outputMode,
      intensity: p.intensity
    })
  });
  const result = await response.json();
  if (!response.ok || !result.ok) {
    throw new Error(result.error || `HTTP ${response.status}`);
  }
  const data = normalizeAiRun(result.data);
  return {
    id: uid(),
    createdAt: new Date().toISOString(),
    episode: p.timeline.length + 1,
    eventPrompt: p.eventPrompt,
    outputMode: p.outputMode,
    intensity: p.intensity,
    source: "cloud-multi-agent",
    agentTrace: data.agentTrace,
    reactions: data.reactions,
    branches: data.branches,
    stress: data.stress,
    advice: data.advice,
    script: data.script
  };
}

function normalizeAiRun(data) {
  const branches = Array.isArray(data.branches) ? data.branches.slice(0, 3) : [];
  while (branches.length < 3) {
    branches.push({ title: `备用路线 ${branches.length + 1}`, score: 70, summary: "模型未补全该路线。", nextEvent: "继续围绕当前冲突推进下一幕。", payoff: "需要人工补充。" });
  }
  return {
    reactions: Array.isArray(data.reactions) ? data.reactions : [],
    branches: branches.map((b) => ({
      title: String(b.title || "未命名路线"),
      score: clamp(Number(b.score || 70), 0, 100),
      summary: String(b.summary || ""),
      nextEvent: String(b.nextEvent || "继续推进该分支。"),
      payoff: String(b.payoff || "")
    })),
    stress: Array.isArray(data.stress) ? data.stress.map((m) => ({ name: String(m.name), score: clamp(Number(m.score || 60), 0, 100), risk: Boolean(m.risk) })) : [],
    advice: Array.isArray(data.advice) ? data.advice.map(String) : ["模型未返回修改建议。"],
    script: Array.isArray(data.script) ? data.script.map(String) : ["模型未返回分镜。"],
    agentTrace: Array.isArray(data.agentTrace) ? data.agentTrace : []
  };
}

function applyRun(p, selected, run) {
  p.runs.unshift(run);
  p.timeline.push({ id: uid(), title: `第 ${run.episode} 幕`, event: p.eventPrompt, createdAt: run.createdAt });
  p.selectedBranchIndex = 0;
  selected.forEach((c) => {
    c.eventLog = c.eventLog || [];
    c.eventLog.unshift(`第 ${run.episode} 幕：${p.eventPrompt.slice(0, 36)}${p.eventPrompt.length > 36 ? "..." : ""}`);
    c.memory = enrichMemory(c.memory, run.eventPrompt);
  });
  saveStore(false);
  switchTab("simulation");
  toast(run.source === "cloud-multi-agent" ? "AI 多智能体推演已完成，并写入角色记忆。" : "剧情推演已完成，并写入角色记忆。");
}

async function checkAiStatus(showToast = true) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/status`, { cache: "no-store" });
    const data = await response.json();
    aiProxyStatus = data;
    const isMultiAgent = data.ok && data.hasKey && data.mode === "multi-agent";
    if ($("apiStatus")) $("apiStatus").textContent = data.ok && data.hasKey ? (isMultiAgent ? "云端增强" : "需要更新") : "离线模式";
    if (showToast) {
      if (isMultiAgent) toast("云端 AI 增强已就绪。");
      else if (data.ok && data.hasKey) toast("AI 服务需要更新，请重新启动服务。");
      else toast("当前为离线模式，可使用本地规则生成。");
    }
    return isMultiAgent;
  } catch {
    aiProxyStatus = { ok: false, hasKey: false, model: "" };
    if ($("apiStatus")) $("apiStatus").textContent = "离线模式";
    if (showToast) toast("当前为离线模式，可使用本地规则生成。");
    return false;
  }
}

function buildReaction(p, c) {
  const action = {
    主角: "会优先确认自己能掌握的证据，同时避免暴露底牌",
    反派: "会控制场面、制造心理压力，并寻找让对方失信的机会",
    保护者: "会表面保持距离，暗中提供离场或反击线索",
    盟友: "会用低风险行动为主角争取时间",
    背叛者: "会释放半真半假的信息，让局面向自己有利的方向倾斜",
    导师: "会用规则和试炼逼迫主角做出选择",
    观众代理: "会关注钩子、爽点、情绪回报和断章点"
  }[c.role] || "会按自身目标推动冲突升级";
  return {
    name: c.name,
    role: c.role,
    reaction: `${c.name}${action}。表层目标是“${c.goal}”，隐藏目标是“${c.hidden}”。`,
    dialogue: makeDialogue(c),
    memoryUse: `本轮调用了长期记忆：“${(c.memory || "").slice(0, 42)}”。人设硬规则：“${(c.hardRules || "").slice(0, 42)}”。`
  };
}

function makeDialogue(c) {
  if (c.speech.includes("强势")) return "“你以为你看到的，就是真相吗？”";
  if (c.speech.includes("温柔")) return "“现在别问，先离开这里。”";
  if (c.speech.includes("讽刺")) return "“这地方每天都有人走错门，但不是每个人都能安全出去。”";
  if (c.speech.includes("理性")) return "“当前优先级：保留证据，降低暴露概率。”";
  if (c.speech.includes("古典")) return "“命数已动，退一步便是万劫。”";
  return "“我只问一个问题：这件事是谁安排的？”";
}

function buildBranches(p, characters) {
  const names = characters.map((c) => c.name).join("、");
  const base = Number(p.intensity || 4);
  return [
    { title: "强反转路线", score: Math.min(98, 76 + base * 4), summary: `${names}在同一场景正面碰撞，主角公开关键证据或身份，形成单集爆点。`, nextEvent: "反转公开后，敌对阵营立刻伪造第二份证据，迫使主角在公开辩解和继续潜伏之间选择。", payoff: "传播性强，但需要提前埋好进入现场的合理理由。" },
    { title: "悬疑调查路线", score: Math.min(95, 72 + base * 3), summary: "主角暂时撤退，只带走一个线索，下一幕围绕线索来源和背后操盘者展开。", nextEvent: "主角追查线索来源时发现资料被人故意留下，保护者和反派都可能是投放者。", payoff: "连载空间大，适合中长线，但单集爽感要靠断章强化。" },
    { title: "复杂关系路线", score: Math.min(96, 74 + base * 3), summary: "反派或导师主动接近主角，伪装成引路人，让信任关系发生裂缝。", nextEvent: "伪装成盟友的人给出一条正确线索，但线索会让主角误伤真正保护者。", payoff: "人物关系更高级，适合 IP 化，但对白和伏笔要求更高。" }
  ];
}

function buildStressReport(p, characters) {
  const hasVillain = characters.some((c) => c.role === "反派");
  const hasProtector = characters.some((c) => c.role === "保护者");
  const hasLead = characters.some((c) => c.role === "主角");
  const sourceBonus = Math.min(12, p.sources.length * 4);
  const memoryBonus = characters.filter((c) => c.memory && c.hardRules).length * 3;
  const eventLen = p.eventPrompt.length;
  return [
    metric("逻辑一致性", 62 + sourceBonus + (eventLen > 45 ? 12 : 0), false),
    metric("人设一致性", 58 + memoryBonus + (hasLead ? 8 : 0), false),
    metric("伏笔回收", 45 + (p.world.foreshadowing ? 22 : 0) + p.timeline.length * 4, false),
    metric("情绪曲线", 54 + p.intensity * 7 + (hasProtector ? 6 : 0), false),
    metric("前 5 秒钩子", 56 + p.intensity * 8 + (p.world.genre.includes("短剧") ? 10 : 0), false),
    metric("付费点/断章点", 50 + p.runs.length * 6 + p.intensity * 6, false),
    metric("爽点密度", 52 + p.intensity * 8 + (hasVillain ? 6 : 0), false),
    metric("反派动机", 42 + (hasVillain ? 28 : 0) + memoryBonus, false),
    metric("世界规则使用", 48 + (p.world.rules ? 26 : 0) + sourceBonus, false),
    metric("巧合风险", eventLen < 35 ? 74 : 44, true)
  ];
}

function metric(name, scoreValue, risk) {
  return { name, score: clamp(scoreValue, 5, 99), risk };
}

function buildAdvice(p, characters) {
  const advice = [];
  if (!p.sources.length) advice.push("增加至少一份设定资料或章节草稿，让世界观和推演有依据。");
  if (!p.world.foreshadowing) advice.push("补充长期伏笔，否则连续推进时容易变成单集事件。");
  if (!characters.some((c) => c.role === "反派")) advice.push("缺少明确反派或阻力角色，冲突会偏弱。");
  if (!characters.some((c) => c.role === "保护者")) advice.push("加入保护者或误导者，可以让关系张力更复杂。");
  if (p.eventPrompt.length < 40) advice.push("当前事件描述偏短，建议补充时间压力、地点限制和失败代价。");
  advice.push("下一轮建议选择一条分支推进，并让角色记忆影响后续反应。");
  return advice;
}

function buildScript(p, characters) {
  const lead = characters.find((c) => c.role === "主角") || characters[0];
  const pressure = characters.find((c) => c.role === "反派") || characters[1] || characters[0];
  const helper = characters.find((c) => c.role === "保护者") || characters[2] || characters[0];
  if (p.outputMode === "游戏任务链") {
    return [`任务 1：${lead.name}发现异常事件并获得第一条证据。`, `任务 2：玩家避开${pressure.name}的监控，完成潜入、谈判或欺骗。`, `任务 3：${helper.name}给出半真半假的线索，开启阵营选择。`, "任务 4：玩家选择公开证据或继续隐藏身份，进入不同结局分支。"];
  }
  if (p.outputMode === "网文章节大纲") {
    return [`第 1 章：${lead.name}误入核心场景，看到足以改变身份的证据。`, `第 2 章：${pressure.name}表面放走主角，实际开始布置追踪。`, `第 3 章：${helper.name}隐瞒真相，引发信任裂缝。`, "第 4 章：主角发现事件不是巧合，而是有人刻意安排。"];
  }
  return [`0-5 秒：${lead.name}进入禁区，镜头给到关键文件或证据。`, `5-15 秒：${pressure.name}发现异常，用一句压迫性台词控制现场。`, `15-30 秒：${lead.name}看到与自己身份相关的细节，情绪被击穿。`, `30-45 秒：${helper.name}表面冷漠，暗中给出逃离提示。`, "45-60 秒：主角转身离开，镜头留下一个证明“这不是巧合”的线索。"];
}

function continueSelectedBranch() {
  const p = currentProject();
  const run = p.runs[0];
  if (!run) return toast("先运行一次推演。");
  const branch = run.branches[p.selectedBranchIndex || 0];
  p.eventPrompt = branch.nextEvent;
  p.timeline.push({ id: uid(), title: `分支选择：${branch.title}`, event: branch.summary, createdAt: new Date().toISOString() });
  writeForms();
  saveStore(false);
  switchTab("simulation");
  toast("已把所选分支推进为下一幕事件。");
}

function latestRun() {
  return currentProject().runs[0] || null;
}

function renderRun() {
  const p = currentProject();
  const run = latestRun();
  const reactions = $("reactionList");
  const branches = $("branchList");
  if (!run) {
    reactions.innerHTML = `<div class="empty">还没有推演结果。输入事件并运行一次剧情推演。</div>`;
    branches.innerHTML = `<div class="empty">暂无剧情分支。</div>`;
    renderStress();
    return;
  }
  reactions.innerHTML = run.reactions.map((r) => `
    <article class="card">
      <div class="card-head"><h3>${escapeHtml(r.name)} · ${escapeHtml(r.role)}</h3>${run.source === "cloud-multi-agent" ? '<span class="pill">AI 生成</span>' : ""}</div>
      <p>${escapeHtml(r.reaction)}</p>
      <p><strong>台词：</strong>${escapeHtml(r.dialogue)}</p>
      <p><strong>记忆调用：</strong>${escapeHtml(r.memoryUse)}</p>
    </article>
  `).join("");
  branches.innerHTML = run.branches.map((b, i) => `
    <article class="branch-card ${i === (p.selectedBranchIndex || 0) ? "selected" : ""}" data-branch="${i}">
      <div class="branch-score"><span>${escapeHtml(b.title)}</span><span>${b.score}</span></div>
      <p>${escapeHtml(b.summary)}</p>
      <p>${escapeHtml(b.payoff)}</p>
    </article>
  `).join("");
  branches.querySelectorAll("[data-branch]").forEach((el) => el.addEventListener("click", () => {
    p.selectedBranchIndex = Number(el.dataset.branch);
    saveStore(false);
  }));
}

function renderStress() {
  const run = latestRun();
  if (!run) {
    $("stressReport").innerHTML = `<div class="empty">运行推演后生成 10 维压力测试。</div>`;
    $("revisionAdvice").textContent = "暂无建议。";
    return;
  }
  $("stressReport").innerHTML = run.stress.map((m) => `
    <div class="stress-row">
      <span>${escapeHtml(m.name)}</span>
      <div class="meter ${m.risk ? "warn" : ""}"><span style="width:${m.score}%"></span></div>
      <strong>${m.score}</strong>
    </div>
  `).join("");
  $("revisionAdvice").textContent = run.advice.map((x, i) => `${i + 1}. ${x}`).join("\n");
}

function renderVisuals() {
  renderRelationshipGraph();
  renderBranchTree();
}

function renderRelationshipGraph() {
  const p = currentProject();
  const graph = $("relationshipGraph");
  if (!p.characters.length) {
    graph.innerHTML = `<div class="empty">创建角色后生成关系图。</div>`;
    return;
  }
  const w = 620;
  const h = 420;
  const cx = w / 2;
  const cy = h / 2;
  const radius = Math.min(170, 48 + p.characters.length * 18);
  const nodes = p.characters.map((c, i) => {
    const angle = (Math.PI * 2 * i) / p.characters.length - Math.PI / 2;
    return { c, x: cx + Math.cos(angle) * radius, y: cy + Math.sin(angle) * radius };
  });
  const lines = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i];
      const b = nodes[j];
      if (sharesRelation(a.c, b.c) || i === 0 || j === 0) lines.push(lineHtml(a, b));
    }
  }
  graph.innerHTML = [...lines, ...nodes.map((n) => `<div class="graph-node" style="left:${n.x / w * 100}%;top:${n.y / h * 100}%"><strong>${escapeHtml(n.c.name)}</strong><span>${escapeHtml(n.c.role)}</span></div>`)].join("");
}

function lineHtml(a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx) * 180 / Math.PI;
  return `<div class="graph-line" style="left:${a.x / 620 * 100}%;top:${a.y / 420 * 100}%;width:${len / 620 * 100}%;transform:rotate(${angle}deg)"></div>`;
}

function sharesRelation(a, b) {
  const text = `${a.relations} ${b.relations}`;
  return text.includes(a.name) || text.includes(b.name) || a.role === "主角" || b.role === "主角";
}

function renderBranchTree() {
  const p = currentProject();
  const run = latestRun();
  if (!run) {
    $("branchTree").innerHTML = `<div class="empty">运行推演后生成分支树。</div>`;
    return;
  }
  $("branchTree").innerHTML = [
    `<div class="tree-node"><strong>当前事件</strong><p>${escapeHtml(run.eventPrompt)}</p></div>`,
    ...run.branches.map((b) => `<div class="tree-node child"><strong>${escapeHtml(b.title)} · ${b.score}</strong><p>${escapeHtml(b.summary)}</p></div><div class="tree-node grandchild"><strong>下一幕</strong><p>${escapeHtml(b.nextEvent)}</p></div>`)
  ].join("");
}

function renderOutput(type = null) {
  const selected = type || $("outputText").dataset.currentOutput || "pitch";
  $("outputText").dataset.currentOutput = selected;
  const p = currentProject();
  const run = latestRun();
  const map = {
    bible: buildBibleMarkdown(p),
    memory: buildMemoryMarkdown(p),
    script: buildScriptMarkdown(p, run),
    outline: buildOutlineMarkdown(p, run),
    game: buildGameMarkdown(p, run),
    pitch: buildPitchMarkdown(p, run)
  };
  $("outputText").value = map[selected] || "";
}

function buildBibleMarkdown(p) {
  return `# ${p.world.title || "未命名故事"} Story Bible

## 类型
${p.world.genre}

## 目标受众
${p.world.audience || "待定义"}

## 情绪基调
${p.world.tone}

## 核心冲突
${p.world.conflict || "待补充"}

## 世界规则
${p.world.rules || "待补充"}

## 长期伏笔
${p.world.foreshadowing || "待补充"}
`;
}

function buildMemoryMarkdown(p) {
  return `# 角色记忆包

${p.characters.map((c) => `## ${c.name}（${c.role}）
- 表层目标：${c.goal}
- 隐藏目标：${c.hidden}
- 恐惧弱点：${c.fear}
- 关系记忆：${c.relations}
- 长期记忆：${c.memory}
- 人设规则：${c.hardRules}
- 事件日志：${(c.eventLog || []).join(" / ") || "暂无"}`).join("\n\n")}
`;
}

function buildScriptMarkdown(p, run) {
  if (!run) return "请先运行一次剧情推演。";
  return `# ${p.world.title} - ${run.outputMode}

## 事件
${run.eventPrompt}

## 分镜 / 节点
${run.script.map((x, i) => `${i + 1}. ${x}`).join("\n")}

## 当前选择分支
${run.branches[p.selectedBranchIndex || 0].title}

${run.branches[p.selectedBranchIndex || 0].summary}
`;
}

function buildOutlineMarkdown(p, run) {
  if (!run) return "请先运行一次剧情推演。";
  return `# 连续剧情大纲

${p.timeline.map((e, i) => `## ${i + 1}. ${e.title}\n${e.event}`).join("\n\n")}

## 最新三条分支
${run.branches.map((b) => `- ${b.title}：${b.summary}`).join("\n")}
`;
}

function buildGameMarkdown(p, run) {
  if (!run) return "请先运行一次剧情推演。";
  return `# 游戏任务链

${buildScript(p, p.characters).map((x, i) => `${i + 1}. ${x}`).join("\n")}

## 阵营/角色
${p.characters.map((c) => `- ${c.name}：${c.goal}`).join("\n")}
`;
}

function buildPitchMarkdown(p, run) {
  return `# 故事项目提案：${p.world.title}

## 一句话卖点
${p.world.conflict || "待补充"}

## 已完成产品能力
多项目管理、资料导入、角色长期记忆、连续剧情推进、专业压力测试、关系图、分支树、Markdown 导出。

## 创作价值
该项目包含明确的核心冲突、角色秘密、连续推进机制和可测试的剧情分支，适合扩展为短剧、网文、游戏任务线或 IP 设定。

## 最新推演结论
${run ? run.advice.join("\n") : "尚未运行推演。"}
`;
}

function downloadMarkdown() {
  const p = currentProject();
  const blob = new Blob([$("outputText").value], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${p.world.title || "storyorbit"}-${new Date().toISOString().slice(0, 10)}.md`;
  a.click();
  URL.revokeObjectURL(url);
}

function renderAll() {
  renderProjects();
  renderStats();
  renderDashboard();
  renderBible();
  renderSources();
  renderCharacters();
  renderRun();
  renderStress();
  renderVisuals();
  renderOutput();
}

function estimateTokens(p) {
  const size = JSON.stringify(p).length;
  return `${Math.max(1, Math.round((size * 1.8 + p.runs.length * 4200) / 1000))}k`;
}

function score(items, weight) {
  return Math.min(100, items.filter((x) => String(x || "").trim()).length * weight);
}

function enrichMemory(memory, event) {
  const snippet = event.slice(0, 36) + (event.length > 36 ? "..." : "");
  const next = `${memory || "暂无长期记忆。"}\n最新记忆：参与事件“${snippet}”。`;
  return next.length > 360 ? next.slice(next.length - 360) : next;
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, Math.round(v)));
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function toast(message) {
  const el = $("toast");
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => el.classList.remove("show"), 1800);
}

const commonWords = new Set(["故事", "角色", "主角", "反派", "世界", "规则", "目标", "事件", "秘密", "真相", "任务", "剧情", "系统", "玩家", "身份", "集团", "宗门"]);

document.querySelectorAll(".nav-item").forEach((btn) => btn.addEventListener("click", () => switchTab(btn.dataset.tab)));
document.querySelectorAll(".workflow-step").forEach((btn) => btn.addEventListener("click", () => switchTab(btn.dataset.flowTab)));
$("openStarterTop").addEventListener("click", () => switchTab("starter"));
$("primaryWorkflowAction").addEventListener("click", () => switchTab($("primaryWorkflowAction").dataset.targetTab || "starter"));
$("secondaryWorkflowAction").addEventListener("click", () => switchTab($("secondaryWorkflowAction").dataset.targetTab || "outputs"));
$("projectSelect").addEventListener("change", () => {
  saveStore(false);
  store.activeProjectId = $("projectSelect").value;
  writeForms();
  renderAll();
});
$("newBlankProject").addEventListener("click", () => {
  const p = blankProject();
  store.projects.push(p);
  store.activeProjectId = p.id;
  writeForms();
  saveStore(false);
  toast("已创建空白项目。");
});
$("duplicateProject").addEventListener("click", () => {
  const copy = structuredClone(currentProject());
  copy.id = uid();
  copy.name = `${copy.name} 副本`;
  copy.world.title = copy.name;
  store.projects.push(copy);
  store.activeProjectId = copy.id;
  writeForms();
  saveStore(false);
});
$("deleteProject").addEventListener("click", () => {
  if (store.projects.length === 1) return toast("至少保留一个项目。");
  store.projects = store.projects.filter((p) => p.id !== store.activeProjectId);
  store.activeProjectId = store.projects[0].id;
  writeForms();
  saveStore(false);
});
document.querySelectorAll("[data-template]").forEach((btn) => btn.addEventListener("click", () => {
  const p = createProjectFromTemplate(btn.dataset.template);
  store.projects.push(p);
  store.activeProjectId = p.id;
  writeForms();
  saveStore(false);
  toast("已载入案例模板。");
}));
$("saveProject").addEventListener("click", () => saveStore(true));
$("runSimulationTop").addEventListener("click", runSimulation);
$("runSimulation").addEventListener("click", runSimulation);
$("checkApi").addEventListener("click", () => checkAiStatus(true));
$("starterGenerate").addEventListener("click", generateStarterWithAi);
$("starterLocal").addEventListener("click", () => {
  const data = buildLocalStarter();
  if (data) applyBootstrapProject(data, "本地");
});
$("continueSelectedBranch").addEventListener("click", continueSelectedBranch);
$("parseSource").addEventListener("click", () => renderSourceAnalysis(parseSourceText($("sourceText").value)));
$("addSource").addEventListener("click", addSource);
$("sourceFile").addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  $("sourceTitle").value = $("sourceTitle").value || file.name.replace(/\.[^.]+$/, "");
  $("sourceText").value = await file.text();
  renderSourceAnalysis(parseSourceText($("sourceText").value));
});
$("addCharacter").addEventListener("click", addCharacter);
$("clearCharacterForm").addEventListener("click", clearCharacterForm);
document.querySelectorAll("[data-output]").forEach((btn) => btn.addEventListener("click", () => renderOutput(btn.dataset.output)));
$("downloadMarkdown").addEventListener("click", downloadMarkdown);

writeForms();
renderSourceAnalysis(null);
renderAll();
switchTab(activeTab);
checkAiStatus(false);
