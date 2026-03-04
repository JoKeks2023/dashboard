import { useState } from 'react';
import { Service } from '../services';
import { useServiceStatus } from '../hooks/useServiceStatus';
import { usePortainerData } from '../hooks/usePortainerData';
import { useHomeAssistantData } from '../hooks/useHomeAssistantData';
import { useCockpitData } from '../hooks/useCockpitData';
import { useWebminData } from '../hooks/useWebminData';
import LogViewer from './LogViewer';

/**
 * ServiceCard - Cyberpunk ASCII-bordered service node card.
 */
export default function ServiceCard({ service }: { service: Service }) {
  const { online, lastChecked } = useServiceStatus(service.url);
  const [showLogs, setShowLogs] = useState<boolean>(false);

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

  const onlineColor = online ? 'var(--cyber-green)' : 'var(--cyber-red)';
  const onlineGlow = online
    ? '0 0 4px var(--cyber-green), 0 0 8px var(--cyber-green)'
    : '0 0 4px var(--cyber-red)';

  return (
    <div
      className="card p-3 animate-fade-in"
      style={{ fontFamily: "'Share Tech Mono', monospace" }}
    >
      {/* ASCII Top border label */}
      <div className="text-xs mb-2" style={{ color: 'var(--cyber-cyan)', textShadow: '0 0 4px var(--cyber-cyan)' }}>
        ╔══[ NODE: {service.name.toUpperCase()} ]
      </div>

      {/* Header row */}
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3
            className="font-bold text-base tracking-widest"
            style={{ color: 'var(--cyber-cyan)', textShadow: '0 0 6px var(--cyber-cyan)' }}
          >
            {(service.icon ? service.icon + ' ' : '') + service.name.toUpperCase()}
          </h3>
          {service.description && (
            <p className="text-xs mt-0.5" style={{ color: 'var(--cyber-dim)' }}>
              &gt; {service.description}
            </p>
          )}
        </div>

        {/* Status */}
        <div className="flex items-center gap-1 text-xs">
          <span
            className={`status-dot ${online ? 'animate-pulse-slow' : ''}`}
            style={{ backgroundColor: onlineColor, boxShadow: onlineGlow }}
          />
          <span style={{ color: onlineColor, textShadow: onlineGlow }}>
            {online ? 'ONLINE' : 'OFFLINE'}
          </span>
        </div>
      </div>

      <hr className="ascii-divider" />

      {/* Portainer Data */}
      {portainerData.data && (
        <div className="cyber-panel mb-2 text-xs">
          <div className="mb-1" style={{ color: 'var(--cyber-magenta)' }}>&gt; DOCKER STATUS</div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-lg font-bold" style={{ color: 'var(--cyber-green)', textShadow: '0 0 6px var(--cyber-green)' }}>
                {portainerData.data.running}
              </div>
              <div style={{ color: 'var(--cyber-dim)' }}>RUN</div>
            </div>
            <div>
              <div className="text-lg font-bold" style={{ color: 'var(--cyber-red)', textShadow: '0 0 6px var(--cyber-red)' }}>
                {portainerData.data.stopped}
              </div>
              <div style={{ color: 'var(--cyber-dim)' }}>STOP</div>
            </div>
            <div>
              <div className="text-lg font-bold" style={{ color: 'var(--cyber-cyan)', textShadow: '0 0 6px var(--cyber-cyan)' }}>
                {portainerData.data.total}
              </div>
              <div style={{ color: 'var(--cyber-dim)' }}>TOTAL</div>
            </div>
          </div>
        </div>
      )}

      {/* Home Assistant Data */}
      {haData.data && (
        <div className="cyber-panel mb-2 text-xs">
          <div className="mb-1" style={{ color: 'var(--cyber-magenta)' }}>&gt; HA ENTITIES</div>
          <div className="text-center mb-2">
            <div className="text-2xl font-bold" style={{ color: 'var(--cyber-cyan)', textShadow: '0 0 6px var(--cyber-cyan)' }}>
              {haData.data.entities}
            </div>
            <div style={{ color: 'var(--cyber-dim)' }}>ENTITIES</div>
          </div>
          <div className="flex flex-wrap gap-1 justify-center">
            {Object.entries(haData.data.domains).slice(0, 5).map(([domain, count]) => (
              <span key={domain} className="cyber-tag">
                {domain}:{count as number}
              </span>
            ))}
          </div>
        </div>
      )}

      {haData.error && !haData.loading && (
        <div className="cyber-panel mb-2 text-xs" style={{ borderColor: 'var(--cyber-red)', color: 'var(--cyber-red)' }}>
          !! API UNREACHABLE !!
        </div>
      )}

      {/* Cockpit Data */}
      {cockpitData.data && (
        <div className="cyber-panel mb-2 text-xs">
          <div className="mb-1" style={{ color: 'var(--cyber-magenta)' }}>&gt; HOST STATS</div>
          <div className="grid grid-cols-2 gap-1">
            <div>
              <span style={{ color: 'var(--cyber-dim)' }}>CPU:</span>{' '}
              <span style={{ color: 'var(--cyber-cyan)' }}>{cockpitData.data.cpuCount}x</span>
            </div>
            <div>
              <span style={{ color: 'var(--cyber-dim)' }}>MEM:</span>{' '}
              <span style={{ color: 'var(--cyber-cyan)' }}>{(cockpitData.data.memoryTotal / 1024 / 1024 / 1024).toFixed(1)}GB</span>
            </div>
            <div>
              <span style={{ color: 'var(--cyber-dim)' }}>HOST:</span>{' '}
              <span style={{ color: 'var(--cyber-green)' }}>{cockpitData.data.hostname}</span>
            </div>
            <div>
              <span style={{ color: 'var(--cyber-dim)' }}>LOAD:</span>{' '}
              <span style={{ color: 'var(--cyber-yellow)' }}>{cockpitData.data.loadAverage[0].toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      {cockpitData.error && !cockpitData.loading && (
        <div className="cyber-panel mb-2 text-xs" style={{ borderColor: 'var(--cyber-red)', color: 'var(--cyber-red)' }}>
          !! API UNREACHABLE !!
        </div>
      )}

      {/* Webmin Data */}
      {webminData.data && (
        <div className="cyber-panel mb-2 text-xs">
          <div className="mb-1" style={{ color: 'var(--cyber-magenta)' }}>&gt; SYSTEM INFO</div>
          <div className="grid grid-cols-2 gap-1">
            <div>
              <span style={{ color: 'var(--cyber-dim)' }}>UPTIME:</span>{' '}
              <span style={{ color: 'var(--cyber-cyan)' }}>
                {Math.floor(webminData.data.uptime / 86400)}D {Math.floor((webminData.data.uptime % 86400) / 3600)}H
              </span>
            </div>
            <div>
              <span style={{ color: 'var(--cyber-dim)' }}>PROCS:</span>{' '}
              <span style={{ color: 'var(--cyber-cyan)' }}>{webminData.data.processes}</span>
            </div>
            <div>
              <span style={{ color: 'var(--cyber-dim)' }}>LOAD:</span>{' '}
              <span style={{ color: 'var(--cyber-yellow)' }}>{webminData.data.loadAverage[0].toFixed(2)}</span>
            </div>
            <div>
              <span style={{ color: 'var(--cyber-dim)' }}>USERS:</span>{' '}
              <span style={{ color: 'var(--cyber-green)' }}>{webminData.data.users}</span>
            </div>
          </div>
        </div>
      )}

      {webminData.error && !webminData.loading && (
        <div className="cyber-panel mb-2 text-xs" style={{ borderColor: 'var(--cyber-red)', color: 'var(--cyber-red)' }}>
          !! API UNREACHABLE !!
        </div>
      )}

      <hr className="ascii-divider" />

      {/* Actions */}
      <div className="flex gap-2 mt-2">
        <button
          onClick={openService}
          className="btn-cyber flex-1 text-xs"
        >
          &gt;&gt; OPEN
        </button>
        <button
          onClick={() => setShowLogs(true)}
          className="btn-cyber btn-cyber-magenta text-xs px-3"
          title="Logs anzeigen"
        >
          LOG
        </button>
      </div>

      {/* Last Check */}
      {lastChecked && (
        <div className="mt-2 text-xs text-center" style={{ color: 'var(--cyber-dim)' }}>
          LAST PING: {lastChecked.toLocaleTimeString()}
        </div>
      )}

      {/* ASCII bottom border - matches top ╔══[ NODE: {name} ] = name.length+13 chars, so bottom needs name.length+11 ═ chars */}
      <div className="text-xs mt-2" style={{ color: 'var(--cyber-cyan)', textShadow: '0 0 4px var(--cyber-cyan)' }}>
        ╚{'═'.repeat(Math.max(0, service.name.length + 11))}╝
      </div>

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
