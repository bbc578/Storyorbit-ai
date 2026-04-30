# StoryOrbit AI Technical Architecture

## Overview

StoryOrbit AI is a lightweight story-universe simulation product. It is designed to run as a static frontend with an optional Python AI proxy.

```text
Browser app -> StoryOrbit API proxy -> AI provider
```

The current implementation is provider-neutral at the product layer. The local proxy currently supports DashScope/Qwen-compatible chat completion APIs, and the frontend labels this as cloud AI enhancement instead of tying the user experience to one provider.

## Frontend

Location: `app/`

- `index.html`: product interface and panels.
- `styles.css`: responsive dark workspace UI.
- `app.js`: local state, story operations, simulation logic, export logic, and API calls.
- `config.js`: frontend API base URL.

The frontend can run directly from `file:///` and does not require a build step.

## Backend Proxy

Location: `server/server.py`

The backend is a minimal Python HTTP server. It keeps the API key out of the frontend and exposes:

- `GET /api/status`: checks whether cloud AI is configured.
- `POST /api/bootstrap`: turns one story idea into a complete starter universe.
- `POST /api/simulate`: runs the multi-agent story simulation.

## Multi-Agent Flow

Cloud simulation uses several specialized agents:

1. Bootstrap Agent: expands a beginner idea into Story Bible, characters, and the first event.
2. Character Agents: generate independent reactions from each selected character.
3. Director Agent: combines reactions into three possible plot branches.
4. Critic Agent: evaluates logic, pacing, character consistency, hooks, and risk.
5. Scriptwriter Agent: turns the chosen result into usable creative deliverables.

Character agents are executed independently so the result is closer to a real multi-agent process than a single monolithic prompt.

## Offline Fallback

The app includes a local rule engine for:

- starter universe generation
- character memory cards
- branch suggestions
- stress test scoring
- export templates

This makes the product testable even before a cloud AI key is configured.

## Security

- API keys are read from environment variables.
- `app/` never stores secrets.
- `.env`, `.env.*`, key files, caches, logs, and dependency folders are ignored by Git.

## Deployment Model

For a real public launch:

```text
Static hosting: app/
Backend hosting: server/server.py or an equivalent production API service
Secret storage: backend environment variables
```

The current Python server is suitable for demos and lightweight deployment. For production traffic, it should be moved behind a more robust web server or rewritten into the target backend framework.
