# StoryOrbit AI Deployment Guide

StoryOrbit AI has two parts:

- `app/`: static HTML/CSS/JavaScript frontend.
- `server/server.py`: local or hosted Python API proxy for cloud AI calls.

Never place API keys in `app/`. Frontend files are public once deployed.

## Option 1: Local Demo

Use this when testing the project on your own machine.

1. Start the AI proxy:

```powershell
cd Storyorbit-ai
.\start-ai-server.bat
```

2. Enter a compatible cloud AI API key when prompted.
3. Open the frontend:

```text
app/index.html
```

This mode keeps the API key only in the local terminal environment.

## Option 2: Static Frontend Only

Use this when you want to show the UI and offline rule engine.

Deploy the `app/` folder to:

- GitHub Pages
- Cloudflare Pages
- Vercel
- Netlify

Without a backend, users can still use local generation, but cloud AI enhancement will not work.

## Option 3: Full Public Version

Use this when other users need cloud AI generation.

1. Deploy `server/server.py` to a backend host.
2. Set environment variables on the server:

```text
STORYORBIT_API_KEY=your_api_key
STORYORBIT_API_BASE_URL=https://your-openai-compatible-endpoint/v1
STORYORBIT_MODEL=your-model-name
STORYORBIT_AI_PROVIDER=OpenAI-compatible AI
STORYORBIT_PORT=8787
STORYORBIT_AGENT_WORKERS=4
```

3. Put the backend behind HTTPS, for example:

```text
https://api.your-domain.com
```

4. Update `app/config.js`:

```js
window.STORYORBIT_API_BASE_URL = "https://api.your-domain.com";
```

5. Deploy the `app/` folder to a static hosting platform.

## Recommended Architecture

```text
User browser -> static frontend -> your backend API -> AI provider
```

The API key must stay in backend environment variables only.
