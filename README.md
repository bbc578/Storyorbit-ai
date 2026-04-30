# StoryOrbit AI

StoryOrbit AI is a story-universe simulation studio for short-drama writers, web-novel authors, game narrative designers, and IP creators.

It helps creators turn an idea into a structured story project: world rules, character memory, plot branches, pressure testing, and exportable deliverables.

## Highlights

- Beginner mode: enter one story idea and generate a complete story universe.
- Professional workspace: edit Story Bible, source materials, character memory, and plot events.
- Multi-agent workflow: character agents, director agent, critic agent, and scriptwriter agent.
- Character memory: goals, hidden motives, fears, relationships, long-term memory, and hard rules.
- Plot simulation: generate character reactions, three branches, and the next event.
- Story QA: 10-dimension stress test for logic, character consistency, hooks, payoff, and coincidence risk.
- Visual maps: character relationship graph and plot branch tree.
- Export: Story Bible, character memory pack, short-drama storyboard, serial outline, game quest chain, and project pitch.
- Offline fallback: local rule engine works even without a cloud AI service.

## Project Structure

```text
StoryOrbit_AI/
  app/                    Static frontend
    index.html
    styles.css
    app.js
    config.js             Frontend API endpoint config
  server/
    server.py             Local/cloud API proxy and multi-agent orchestration
  docs/                   Product docs and application materials
  DEPLOY.md               Deployment guide
  start-qwen-server.bat   Windows launcher for local AI proxy
  start-qwen-server.ps1
```

## Local Usage

Open the frontend directly:

```text
D:\StoryOrbit_AI\app\index.html
```

The app can run in offline mode with local generation.

For cloud AI enhanced generation:

1. Start the local proxy:

```text
D:\StoryOrbit_AI\start-qwen-server.bat
```

2. Enter your DashScope/Qwen API key when prompted.
3. Keep the terminal window open.
4. Open `app/index.html`.
5. In the sidebar, check AI status and enable cloud AI enhancement.

API keys are never written into frontend files.

## Multi-Agent Flow

When cloud AI is enabled, one simulation uses several agents:

1. Bootstrap Agent: expands a one-line idea into a story universe for beginner mode.
2. Character Agents: each selected character independently generates reaction, dialogue, and memory usage.
3. Director Agent: combines character reactions into three plot branches.
4. Critic Agent: runs a 10-dimension plot stress test and gives revision advice.
5. Scriptwriter Agent: converts the result into storyboard, serial outline, or game quest chain.

## Deployment

See [DEPLOY.md](./DEPLOY.md).

Recommended architecture:

```text
Browser frontend -> your backend API -> DashScope/Qwen
```

Do not put cloud AI API keys in `app/`.

## Current Status

This is a working MVP:

- Static frontend is complete.
- Local generation is available.
- Qwen-compatible multi-agent backend is available.
- Deployment path is documented.

## Security Notes

- Do not commit `.env` files or API keys.
- If an API key was ever pasted into chat or a public place, revoke it and create a new one.
- The frontend is public by nature; secrets must only live in the backend environment.

