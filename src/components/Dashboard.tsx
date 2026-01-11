import ServiceCard from './ServiceCard';
import MetricChart from './MetricChart';
import { useServices } from '../hooks/useServices';
import { useSystemMetrics } from '../hooks/useSystemMetrics';
import { usePortainerData } from '../hooks/usePortainerData';

/**
 * Dashboard - Responsive Grid mit Service-Karten und Metriken.
 */
export default function Dashboard() {
  const { services, loading } = useServices();
  
  const portainerService = services.find(s => s.apiType === 'portainer');
  const portainerData = portainerService?.apiToken 
    ? usePortainerData(portainerService.url, portainerService.apiToken) 
    : { data: null };

  const containerCount = portainerData.data?.total ?? 0;
  const metrics = useSystemMetrics(containerCount);

  // Nur Container-Chart zeigen, da CPU/Memory von Remote-Services kommen müssen
  const hasContainerData = metrics.containers.length > 0;

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">⏳</div>
        <p className="text-gray-600 dark:text-gray-400">Lade Services...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Metrics Charts - Nur Container-Count (Rest kommt von Remote-Services) */}
      {hasContainerData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <MetricChart
            data={metrics.containers}
            title="Container"
            color="#f59e0b"
            unit=""
            max={Math.max(containerCount + 5, 10)}
          />
        </div>
      )}

      {/* Service Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => (
          <ServiceCard key={service.name} service={service} />
        ))}
      </div>
    </div>
  );
}
