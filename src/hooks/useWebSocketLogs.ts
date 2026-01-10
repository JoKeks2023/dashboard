import { useEffect, useRef, useState } from 'react';

export type LogEntry = {
  type: 'log';
  service: string;
  timestamp: string;
  message: string;
  level: 'info' | 'warn' | 'error';
};

/**
 * useWebSocketLogs - Verbindet zu WebSocket-Server und empfängt Live-Logs
 */
export function useWebSocketLogs(serviceName: string, enabled: boolean = true) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [connected, setConnected] = useState<boolean>(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const wsUrl = import.meta.env.VITE_BACKEND_WS_URL || 'ws://localhost:3001/ws';

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setConnected(true);
        ws.send(JSON.stringify({ action: 'subscribe', service: serviceName }));
      };

      ws.onmessage = (event) => {
        try {
          const log: LogEntry = JSON.parse(event.data);
          if (log.type === 'log' && log.service === serviceName) {
            setLogs((prev) => [...prev.slice(-99), log]); // Max 100 Logs
          }
        } catch (err) {
          console.error('Failed to parse WebSocket message:', err);
        }
      };

      ws.onerror = () => setConnected(false);
      ws.onclose = () => setConnected(false);

      return () => {
        ws.close();
      };
    } catch (err) {
      console.error('WebSocket connection failed:', err);
      setConnected(false);
    }
  }, [serviceName, enabled]);

  const clearLogs = () => setLogs([]);

  return { logs, connected, clearLogs };
}
