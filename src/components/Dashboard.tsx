import ServiceCard from './ServiceCard';
import MetricChart from './MetricChart';
import { useServices } from '../hooks/useServices';
import { useSystemMetrics } from '../hooks/useSystemMetrics';
import { usePortainerData } from '../hooks/usePortainerData';

/**
 * Dashboard - Cyberpunk ASCII grid with service cards and metrics.
 */
export default function Dashboard() {
  const { services, loading } = useServices();
  
  const portainerService = services.find(s => s.apiType === 'portainer');
  const portainerData = portainerService?.apiToken 
    ? usePortainerData(portainerService.url, portainerService.apiToken) 
    : { data: null };

  const containerCount = portainerData.data?.total ?? 0;
  const metrics = useSystemMetrics(containerCount);

  const hasContainerData = metrics.containers.length > 0;

  if (loading) {
    return (
      <div className="text-center py-12" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
        <pre className="text-xs leading-loose mb-4" style={{ color: 'var(--cyber-green)', textShadow: '0 0 6px var(--cyber-green)' }}>
{`  +---------------------------+
  |  LOADING SERVICE MATRIX  |
  |  ████████████░░░░  75%   |
  +---------------------------+`}
        </pre>
        <p className="text-sm animate-blink" style={{ color: 'var(--cyber-cyan)' }}>
          &gt; Scanning network nodes...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
      {/* Section Header */}
      <div className="text-xs" style={{ color: 'var(--cyber-dim)' }}>
        <span style={{ color: 'var(--cyber-cyan)' }}>&gt;&gt;</span>
        {' '}SYSTEM OVERVIEW{' '}
        <span style={{ color: 'var(--cyber-cyan)' }}>
          [{services.length} NODE{services.length !== 1 ? 'S' : ''} DETECTED]
        </span>
      </div>

      {/* Metrics Charts */}
      {hasContainerData && (
        <>
          <div className="text-xs mb-2" style={{ color: 'var(--cyber-magenta)' }}>
            ╔═[ TELEMETRY ]═════════════════╗
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <MetricChart
              data={metrics.containers}
              title="CONTAINER COUNT"
              color="#00ffff"
              unit=""
              max={Math.max(containerCount + 5, 10)}
            />
          </div>
          <div className="text-xs" style={{ color: 'var(--cyber-magenta)' }}>
            ╚═══════════════════════════════╝
          </div>
        </>
      )}

      {/* Service Cards Grid */}
      <div className="text-xs mb-2" style={{ color: 'var(--cyber-magenta)' }}>
        ╔═[ SERVICE NODES ]═════════════╗
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => (
          <ServiceCard key={service.name} service={service} />
        ))}
      </div>
      <div className="text-xs" style={{ color: 'var(--cyber-magenta)' }}>
        ╚═══════════════════════════════╝
      </div>
    </div>
  );
}
