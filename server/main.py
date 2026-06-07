import asyncio
import json
from datetime import datetime, timezone

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from robots import RobotSimulator

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

simulator = RobotSimulator(num_robots=5)


class ConnectionManager:
    def __init__(self):
        self._connections: list[WebSocket] = []

    async def connect(self, ws: WebSocket):
        await ws.accept()
        self._connections.append(ws)

    def disconnect(self, ws: WebSocket):
        if ws in self._connections:
            self._connections.remove(ws)

    async def broadcast(self, message: str):
        dead: list[WebSocket] = []
        for ws in list(self._connections):
            try:
                await ws.send_text(message)
            except Exception:
                dead.append(ws)
        for ws in dead:
            if ws in self._connections:
                self._connections.remove(ws)


manager = ConnectionManager()


@app.on_event("startup")
async def startup():
    asyncio.create_task(_broadcast_loop())


async def _broadcast_loop():
    while True:
        simulator.tick()
        payload = json.dumps(
            {
                "type": "robot_update",
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "robots": simulator.snapshot(),
            }
        )
        await manager.broadcast(payload)
        await asyncio.sleep(1)


@app.get("/")
async def health():
    return {"status": "ok", "robots": len(simulator.robots)}


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        if websocket in manager._connections:
            manager._connections.remove(websocket)
