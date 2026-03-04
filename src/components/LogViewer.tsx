import { useState } from 'react';
import { useWebSocketLogs, type LogEntry } from '../hooks/useWebSocketLogs';

type LogViewerProps = {
  serviceName: string;
  onClose: () => void;
};

/**
 * LogViewer - Cyberpunk terminal log display with WebSocket
 */
export default function LogViewer({ serviceName, onClose }: LogViewerProps) {
  const [enabled, setEnabled] = useState(true);
  const { logs, connected, clearLogs } = useWebSocketLogs(serviceName, enabled);

  const getLevelColor = (level: LogEntry['level']): string => {
    switch (level) {
      case 'error': return 'var(--cyber-red)';
      case 'warn':  return 'var(--cyber-yellow)';
      default:      return 'var(--cyber-silver)';
    }
  };
  const getLevelGlow = (level: LogEntry['level']): string => {
    switch (level) {
      case 'error': return '0 0 4px var(--cyber-red)';
      case 'warn':  return '0 0 4px var(--cyber-yellow)';
      default:      return 'none';
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(2px)', fontFamily: "'Share Tech Mono', monospace" }}
    >
      <div
        className="max-w-4xl w-full max-h-[80vh] flex flex-col"
        style={{ backgroundColor: 'var(--cyber-bg)', border: '1px solid var(--cyber-cyan)', boxShadow: '0 0 24px var(--cyber-cyan), 0 0 4px var(--cyber-magenta)' }}
      >
        {/* Title bar */}
        <div
          className="px-4 py-1 text-xs flex items-center gap-2"
          style={{ backgroundColor: 'var(--cyber-cyan)', color: 'var(--cyber-bg)' }}
        >
          <span className="font-bold">[ TERMINAL LOG VIEWER ]</span>
          <span className="flex-1 text-center">// {serviceName.toUpperCase()}.LOG</span>
          <span>{connected ? '● LIVE' : '○ DISCONNECTED'}</span>
        </div>

        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-2 text-xs"
          style={{ borderBottom: '1px dashed var(--cyber-dim)' }}
        >
          <div className="flex items-center gap-3">
            <span style={{ color: 'var(--cyber-magenta)' }}>&gt; NODE: {serviceName.toUpperCase()}</span>
            <span style={{ color: connected ? 'var(--cyber-green)' : 'var(--cyber-red)', textShadow: connected ? '0 0 4px var(--cyber-green)' : '0 0 4px var(--cyber-red)' }}>
              {connected ? '[ONLINE]' : '[OFFLINE]'}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setEnabled(!enabled)}
              className="btn-cyber text-xs"
            >
              {enabled ? 'PAUSE' : 'RESUME'}
            </button>
            <button
              onClick={clearLogs}
              className="btn-cyber btn-cyber-magenta text-xs"
            >
              CLEAR
            </button>
            <button
              onClick={onClose}
              className="btn-cyber btn-cyber-red text-xs"
            >
              X CLOSE
            </button>
          </div>
        </div>

        {/* Log area */}
        <div
          className="flex-1 overflow-y-auto p-4 text-xs space-y-1"
          style={{ backgroundColor: 'var(--cyber-bg2)' }}
        >
          {logs.length === 0 ? (
            <div className="text-center py-8">
              <pre style={{ color: 'var(--cyber-dim)' }}>
{`  +---------------------------+
  |  AWAITING SIGNAL...       |
  |  > NO LOGS RECEIVED       |
  +---------------------------+`}
              </pre>
              <p className="mt-2 animate-blink" style={{ color: 'var(--cyber-cyan)' }}>
                &gt; SCANNING...
              </p>
            </div>
          ) : (
            logs.map((log, idx) => (
              <div key={idx} className="flex gap-3 animate-fade-in font-mono">
                <span style={{ color: 'var(--cyber-dim)', whiteSpace: 'nowrap' }}>
                  [{new Date(log.timestamp).toLocaleTimeString()}]
                </span>
                <span className="font-bold" style={{ color: getLevelColor(log.level), textShadow: getLevelGlow(log.level) }}>
                  {log.level.toUpperCase()}
                </span>
                <span className="flex-1" style={{ color: 'var(--cyber-silver)' }}>{log.message}</span>
              </div>
            ))
          )}
        </div>

        {/* Footer bar */}
        <div
          className="px-4 py-1 text-xs flex justify-between"
          style={{ borderTop: '1px dashed var(--cyber-dim)', color: 'var(--cyber-dim)' }}
        >
          <span>LINES: {logs.length}</span>
          <span className="animate-blink" style={{ color: 'var(--cyber-cyan)' }}>▮</span>
          <span>STATUS: {connected ? 'CONNECTED' : 'DISCONNECTED'}</span>
        </div>
      </div>
    </div>
  );
}
