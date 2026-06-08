import asyncio
import json
import os
from datetime import datetime, timedelta, timezone

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Query, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from jose import JWTError, jwt
from pydantic import BaseModel

from robots import RobotSimulator

load_dotenv()

AUTH_USERNAME = os.environ["AUTH_USERNAME"]
AUTH_PASSWORD = os.environ["AUTH_PASSWORD"]
JWT_SECRET = os.environ["JWT_SECRET"]
ALGORITHM = "HS256"

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

simulator = RobotSimulator(num_robots=5)


class LoginRequest(BaseModel):
    username: str
    password: str


def create_token(subject: str) -> str:
    exp = datetime.now(timezone.utc) + timedelta(hours=24)
    return jwt.encode({"sub": subject, "exp": exp}, JWT_SECRET, algorithm=ALGORITHM)


def verify_token(token: str) -> str:
    payload = jwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])
    return str(payload["sub"])


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


@app.post("/auth/login")
async def login(req: LoginRequest):
    if req.username != AUTH_USERNAME or req.password != AUTH_PASSWORD:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"token": create_token(req.username)}


@app.websocket("/ws")
async def websocket_endpoint(
    websocket: WebSocket, token: str | None = Query(default=None)
):
    if not token:
        await websocket.close(code=4001)
        return
    try:
        verify_token(token)
    except JWTError:
        await websocket.close(code=4001)
        return

    await manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)
