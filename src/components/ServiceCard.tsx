import { useState } from 'react';
import { Service } from '../services';
import { useServiceStatus } from '../hooks/useServiceStatus';
import { usePortainerData } from '../hooks/usePortainerData';
import { useHomeAssistantData } from '../hooks/useHomeAssistantData';
import { useCockpitData } from '../hooks/useCockpitData';
import { useWebminData } from '../hooks/useWebminData';
import LogViewer from './LogViewer';

/**
 * ServiceCard - Einzelne Service-Karte mit Status-Check und API-Daten statt Iframes.
 */
export default function ServiceCard({ service }: { service: Service }) {
  const { online, lastChecked } = useServiceStatus(service.url);
  const [actionsOpen, setActionsOpen] = useState<boolean>(false);
  const [showLogs, setShowLogs] = useState<boolean>(false);

  // API Data Hooks
  const portainerData = service.apiType === 'portainer' 
    ? usePortainerData(service.url, service.apiToken) 
    : { data: null, loading: false, error: null };
  
  const haData = service.apiType === 'homeassistant' 
    ? useHomeAssistantData(service.url, service.apiToken) 
    : { data: null, loading: false, error: null };

  const cockpitData = service.apiType === 'cockpit'
    ? useCockpitData(service.url)
    : { data: null, loading: false, error: null };

  const webminData = service.apiType === 'webmin' || service.apiType === 'usermin'
    ? useWebminData(service.url)
    : { data: null, loading: false, error: null };

  const openService = () => {
    window.open(service.url, '_blank', 'noopener,noreferrer');
  };

  const statusColor = online ? 'bg-green-500' : 'bg-red-500';

  return (
    <div className="card p-4 transition-transform duration-200 hover:scale-[1.01]">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-3xl">{service.icon || '📦'}</span>
          <div>
            <h3 className="font-semibold text-lg">{service.name}</h3>
            {service.description && (
              <p className="text-sm text-slate-400">{service.description}</p>
            )}
          </div>
        </div>
        
        {/* Status Indicator */}
        <div className="flex items-center gap-2" title={online ? 'Online' : 'Offline'}>
          <span className={`status-dot ${statusColor} ${online ? 'animate-pulse-slow' : ''}`} />
          <span className="text-xs text-slate-400">
            {online ? 'Online' : 'Offline'}
          </span>
        </div>
      </div>

      {/* API Data Display */}
      {portainerData.data && (
        <div className="mb-3 p-3 bg-slate-700/50 rounded-lg">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-2xl font-bold text-green-400">{portainerData.data.running}</div>
              <div className="text-xs text-slate-400">Running</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-400">{portainerData.data.stopped}</div>
              <div className="text-xs text-slate-400">Stopped</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">{portainerData.data.total}</div>
              <div className="text-xs text-slate-400">Total</div>
            </div>
          </div>
        </div>
      )}

      {haData.data && (
        <div className="mb-3 p-3 bg-slate-700/50 rounded-lg">
          <div className="text-center mb-2">
            <div className="text-2xl font-bold text-blue-400">{haData.data.entities}</div>
            <div className="text-xs text-slate-400">Entitäten</div>
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {Object.entries(haData.data.domains).slice(0, 5).map(([domain, count]) => (
              <span key={domain} className="text-xs bg-slate-600 px-2 py-1 rounded">
                {domain}: {count}
              </span>
            ))}
          </div>
        </div>
      )}

      {cockpitData.data && (
        <div className="mb-3 p-3 bg-slate-700/50 rounded-lg">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <div className="text-slate-400">CPU Cores</div>
              <div className="font-semibold">{cockpitData.data.cpuCount}</div>
            </div>
            <div>
              <div className="text-slate-400">Memory</div>
              <div className="font-semibold">{(cockpitData.data.memoryTotal / 1024 / 1024 / 1024).toFixed(1)} GB</div>
            </div>
            <div>
              <div className="text-slate-400">Hostname</div>
              <div className="font-semibold text-xs">{cockpitData.data.hostname}</div>
            </div>
            <div>
              <div className="text-slate-400">Load Avg</div>
              <div className="font-semibold text-xs">{cockpitData.data.loadAverage[0].toFixed(2)}</div>
            </div>
          </div>
        </div>
      )}

      {webminData.data && (
        <div className="mb-3 p-3 bg-slate-700/50 rounded-lg">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <div className="text-slate-400">Uptime</div>
              <div className="font-semibold">{Math.floor(webminData.data.uptime / 86400)}d {Math.floor((webminData.data.uptime % 86400) / 3600)}h</div>
            </div>
            <div>
              <div className="text-slate-400">Processes</div>
              <div className="font-semibold">{webminData.data.processes}</div>
            </div>
            <div>
              <div className="text-slate-400">Load Avg</div>
              <div className="font-semibold">{webminData.data.loadAverage[0].toFixed(2)}</div>
            </div>
            <div>
              <div className="text-slate-400">Active Users</div>
              <div className="font-semibold">{webminData.data.users}</div>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={openService}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors font-medium"
        >
          Öffnen
        </button>
        
        <div className="relative">
          <button
            onClick={() => setActionsOpen(!actionsOpen)}
            className="bg-slate-700 hover:bg-slate-600 text-white py-2 px-4 rounded-lg transition-colors"
            title="Weitere Aktionen"
          >
            ⚙️
          </button>
          
          {actionsOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-slate-700 rounded-lg shadow-xl z-10 animate-fade-in">
              <button
                onClick={() => {
                  setShowLogs(true);
                  setActionsOpen(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-slate-600 rounded-t-lg transition-colors"
              >
                📋 Logs anzeigen
              </button>
              <button
                className="w-full text-left px-4 py-2 hover:bg-slate-600 transition-colors"
                onClick={() => setActionsOpen(false)}
              >
                🔄 Restart (Demo)
              </button>
              <button
                className="w-full text-left px-4 py-2 hover:bg-slate-600 rounded-b-lg transition-colors"
                onClick={() => setActionsOpen(false)}
              >
                🖥️ Terminal (Demo)
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Last Check */}
      {lastChecked && (
        <div className="mt-2 text-xs text-slate-500 text-center">
          Letzter Check: {lastChecked.toLocaleTimeString()}
        </div>
      )}

      {/* Log Viewer Modal */}
      {showLogs && (
        <LogViewer 
          serviceName={service.name}
          onClose={() => setShowLogs(false)}
        />
      )}
    </div>
  );
}
