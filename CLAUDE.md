# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Robot Fleet Dashboard — a real-time telemetry visualization system. A Python FastAPI backend simulates 5 robots and streams state over WebSocket. A React (Vite) frontend connects directly to the backend WebSocket via a Vite dev-server proxy and renders a Canvas arena with status cards.

## Architecture

Two-tier pipeline:

```
[Python FastAPI backend]  ws://localhost:8000/ws
        ↓  (proxied through Vite at /ws)
[React + Vite frontend]   http://localhost:3000
```

- **`server/main.py`** — FastAPI app with a `/ws` WebSocket endpoint and a broadcast loop that pushes robot state every second. CORS middleware is enabled.
- **`server/robots.py`** — Robot simulator: physics, battery depletion, status transitions (moving/charging/error/idle), and task assignment.
- **`client/src/ws/useRobotSocket.ts`** — Custom hook that manages the WebSocket connection to `ws://<host>/ws`, auto-reconnects on disconnect, and returns live robot data.
- **`client/src/pages/LiveTelemetry.tsx`** — Main page: composes the Header, ConnectionBanner, Arena, and RobotCard components using the socket hook.
- **`client/src/components/Arena.tsx`** — Canvas arena rendering (100×100 m grid, robot positions + headings).
- **`client/src/components/RobotCard.tsx`** — Per-robot status card with battery indicator and telemetry stats.
- **`client/vite.config.ts`** — Vite config: runs on port 3000, proxies `/ws` to `ws://localhost:8000`.

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

Types are defined in `client/src/types/robot.ts`.

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

This uses `concurrently` to run `npm start --prefix server` (uvicorn on port 8000) and `npm run dev --prefix client` (Vite dev server on port 3000) in parallel. Open `http://localhost:3000` in a browser.

## Dependencies

| Layer | File | Key packages |
|-------|------|-------------|
| Backend | `server/requirements.txt` | fastapi, uvicorn[standard] |
| Frontend | `client/package.json` | react ^19, react-router-dom ^7, vite ^6, typescript ^5.7 |

CSS is split into per-component CSS Modules (`*.module.css`). No additional test runner or linter is configured.
