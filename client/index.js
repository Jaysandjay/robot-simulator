const WebSocket = require('ws');
const express = require('express');
const http = require('http');
const path = require('path');

const FASTAPI_URL = 'ws://localhost:8000/ws';
const PORT = 3000;

const app = express();
app.use(express.static(path.join(__dirname, 'public')));

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const browserClients = new Set();
let updateCount = 0;

wss.on('connection', (ws) => {
  browserClients.add(ws);
  ws.on('close', () => browserClients.delete(ws));
});

function broadcast(raw) {
  for (const client of browserClients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(raw);
    }
  }
}

function connectToFastAPI() {
  const ws = new WebSocket(FASTAPI_URL);

  ws.on('open', () => {
    console.log('[relay] Connected to FastAPI at', FASTAPI_URL);
  });

  ws.on('message', (data) => {
    updateCount++;
    const raw = data.toString();
    try {
      const msg = JSON.parse(raw);
      const ts = msg.timestamp ? msg.timestamp.slice(11, 19) : '?';
      process.stdout.write(`\r[relay] #${updateCount}  robots: ${msg.robots?.length ?? 0}  time: ${ts}  browsers: ${browserClients.size}   `);
    } catch (_) {}
    broadcast(raw);
  });

  ws.on('close', () => {
    console.log('\n[relay] FastAPI disconnected — retrying in 3s…');
    setTimeout(connectToFastAPI, 3000);
  });

  ws.on('error', (err) => {
    console.error(`\n[relay] Connection error: ${err.message}`);
  });
}

server.listen(PORT, () => {
  console.log(`[relay] Dashboard →  http://localhost:${PORT}`);
  connectToFastAPI();
});

process.on('SIGINT', () => {
  process.stdout.write('\n');
  console.log('[relay] Shutting down…');
  server.close(() => process.exit(0));
});
