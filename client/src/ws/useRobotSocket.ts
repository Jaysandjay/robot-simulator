import { useState, useEffect } from 'react';
import type { Robot } from '../types/robot';

export function useRobotSocket(token: string) {
  const [robots, setRobots] = useState<Robot[]>([]);
  const [connected, setConnected] = useState(false);
  const [updateCount, setUpdateCount] = useState(0);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    let ws: WebSocket | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let destroyed = false;

    function connect() {
      if (destroyed) return;
      ws = new WebSocket(`ws://${window.location.host}/ws?token=${token}`);

      ws.onopen = () => setConnected(true);
      ws.onclose = () => {
        if (destroyed) return;
        setConnected(false);
        reconnectTimer = setTimeout(connect, 3000);
      };
      ws.onerror = () => ws?.close();
      ws.onmessage = (e) => {
        try {
          const msg = JSON.parse(e.data as string);
          if (msg.type !== 'robot_update') return;
          setRobots(msg.robots as Robot[]);
          setUpdateCount((c) => c + 1);
          setLastUpdated(new Date());
        } catch {
          // ignore parse errors
        }
      };
    }

    connect();

    return () => {
      destroyed = true;
      if (reconnectTimer !== null) clearTimeout(reconnectTimer);
      ws?.close();
    };
  }, [token]);

  return { robots, connected, updateCount, lastUpdated };
}
