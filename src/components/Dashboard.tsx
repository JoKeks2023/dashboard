import ServiceCard from './ServiceCard';
import MetricChart from './MetricChart';
import { services } from '../services';
import { useSystemMetrics } from '../hooks/useSystemMetrics';
import { usePortainerData } from '../hooks/usePortainerData';

/**
 * Dashboard - Responsive Grid mit Service-Karten und Metriken.
 */
export default function Dashboard() {
  const portainerService = services.find(s => s.apiType === 'portainer');
  const portainerData = portainerService?.apiToken 
    ? usePortainerData(portainerService.url, portainerService.apiToken) 
    : { data: null };

  const containerCount = portainerData.data?.total ?? 0;
  const metrics = useSystemMetrics(containerCount);

  return (
    <div className="space-y-6">
      {/* Metrics Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricChart
          data={metrics.cpu}
          title="CPU Auslastung"
          color="#3b82f6"
          unit="%"
          max={100}
        />
        <MetricChart
          data={metrics.memory}
          title="RAM Auslastung"
          color="#10b981"
          unit="%"
          max={100}
        />
        <MetricChart
          data={metrics.containers}
          title="Container"
          color="#f59e0b"
          unit=""
          max={Math.max(containerCount + 5, 10)}
        />
      </div>

      {/* Service Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => (
          <ServiceCard key={service.name} service={service} />
        ))}
      </div>
    </div>
  );
}
