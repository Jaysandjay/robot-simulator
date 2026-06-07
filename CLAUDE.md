# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Robot Fleet Dashboard — a real-time telemetry visualization system. A Python FastAPI backend simulates 5 robots and streams state over WebSocket to a Node.js relay, which broadcasts to a browser-based Canvas dashboard.

## Architecture

Three-tier pipeline:

```
[Python FastAPI backend]  ws://localhost:8000/ws
        ↓
[Node.js Express relay]   ws://localhost:3000
        ↓
[Browser Canvas frontend] http://localhost:3000
```

- **`server/main.py`** — FastAPI app with a `/ws` WebSocket endpoint and a broadcast loop that pushes robot state every second. CORS middleware is enabled.
- **`server/robots.py`** — Robot simulator: physics, battery depletion, status transitions (moving/charging/error/idle), and task assignment.
- **`client/index.js`** — Relay server. Connects upstream to `ws://localhost:8000/ws`, rebroadcasts every message to all connected browsers, auto-reconnects on disconnect.
- **`client/public/index.html`** — Single-file frontend. Canvas arena rendering (100×100m grid, robot positions + headings) and status cards. Auto-reconnects to relay.

### WebSocket message format

```json
{
  "type": "robot_update",
  "timestamp": "<ISO8601>",
  "robots": [
    { "id": "robot_1", "position": {"x": 50.2, "y": 30.1},
      "heading": 45.3, "speed": 1.5,
      "status": "moving|charging|error|idle",
      "battery": 85.5, "task": "patrolling|delivery|waiting|charging" }
  ]
}
```

## Running the stack

**First-time setup:**
```bash
pip install -r server/requirements.txt
npm install                  # installs concurrently (root)
npm install --prefix client
```

**Start both services together (from repo root):**
```bash
npm run dev
```

This uses `concurrently` to run `npm start --prefix server` (uvicorn on port 8000) and `npm start --prefix client` (Node relay on port 3000) in parallel. Open `http://localhost:3000` in a browser.

## Dependencies

| Layer | File | Key packages |
|-------|------|-------------|
| Backend | `server/requirements.txt` | fastapi, uvicorn[standard] |
| Relay | `client/package.json` | express ^4.18.2, ws ^8.16.0 |
| Frontend | — | Vanilla JS, Canvas API (no build step) |

No test runner, linter, or build tooling is configured.
