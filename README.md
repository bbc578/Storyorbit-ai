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
  docs/                   Product docs, user guide, and examples
  DEPLOY.md               Deployment guide
  start-ai-server.bat     Windows launcher for local AI proxy
  start-ai-server.ps1
```

## Quick Start

Clone the repository:

```bash
git clone https://github.com/bbc578/Storyorbit-ai.git
cd Storyorbit-ai
```

Open the app:

```text
app/index.html
```

StoryOrbit AI can run without an API key. In offline mode, the built-in local rule engine can create starter universes, character memory cards, plot branches, stress tests, and exports.

## Optional AI Backend

For stronger multi-agent generation, run the optional local AI proxy:

```bash
start-ai-server.bat
```

Then enter a compatible cloud AI API key when prompted, keep the terminal window open, and enable cloud AI enhancement in the app sidebar.

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
Browser frontend -> your backend API -> AI provider
```

Do not put cloud AI API keys in `app/`.

## Current Status

This is a working MVP:

- Static frontend is complete.
- Local generation is available.
- Cloud-AI-compatible multi-agent backend is available.
- Deployment path is documented.

## Security Notes

- Do not commit `.env` files or API keys.
- If an API key was ever pasted into chat or a public place, revoke it and create a new one.
- The frontend is public by nature; secrets must only live in the backend environment.
