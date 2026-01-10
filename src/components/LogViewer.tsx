import { useState } from 'react';
import { useWebSocketLogs, type LogEntry } from '../hooks/useWebSocketLogs';

type LogViewerProps = {
  serviceName: string;
  onClose: () => void;
};

/**
 * LogViewer - Live-Log-Anzeige mit WebSocket
 */
export default function LogViewer({ serviceName, onClose }: LogViewerProps) {
  const [enabled, setEnabled] = useState(true);
  const { logs, connected, clearLogs } = useWebSocketLogs(serviceName, enabled);

  const getLevelColor = (level: LogEntry['level']) => {
    switch (level) {
      case 'error': return 'text-red-400';
      case 'warn': return 'text-yellow-400';
      default: return 'text-slate-300';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold">Live Logs: {serviceName}</h3>
            <div className="flex items-center gap-2">
              <span className={`status-dot ${connected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm text-slate-400">
                {connected ? 'Verbunden' : 'Getrennt'}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setEnabled(!enabled)}
              className="px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm transition-colors"
            >
              {enabled ? 'Pause' : 'Resume'}
            </button>
            <button
              onClick={clearLogs}
              className="px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm transition-colors"
            >
              Clear
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded-lg text-sm transition-colors"
            >
              Schließen
            </button>
          </div>
        </div>

        {/* Logs */}
        <div className="flex-1 overflow-y-auto p-4 font-mono text-sm space-y-1">
          {logs.length === 0 ? (
            <div className="text-center text-slate-400 py-8">
              Keine Logs verfügbar. Warte auf Daten...
            </div>
          ) : (
            logs.map((log, idx) => (
              <div key={idx} className="flex gap-3 animate-fade-in">
                <span className="text-slate-500 whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
                <span className={`font-semibold ${getLevelColor(log.level)}`}>
                  [{log.level.toUpperCase()}]
                </span>
                <span className="text-slate-200 flex-1">{log.message}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
