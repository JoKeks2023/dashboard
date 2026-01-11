import { useEffect, useState } from 'react';

export type MetricDataPoint = {
  timestamp: number;
  value: number;
};

export type SystemMetrics = {
  cpu: MetricDataPoint[];
  memory: MetricDataPoint[];
  containers: MetricDataPoint[];
};

/**
 * useSystemMetrics - Sammelt historische Metriken für Charts
 * Nutzt Portainer für Container-Count, Cockpit muss System-Metriken liefern
 */
export function useSystemMetrics(
  containerCount: number,
  cockpitUrl?: string
) {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpu: [],
    memory: [],
    containers: []
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      const now = Date.now();
      
      // CPU und Memory-Daten müssen von Cockpit oder anderem Monitoring-System kommen
      // Für jetzt zeigen wir nur Container-Count an
      setMetrics((prev) => ({
        cpu: prev.cpu, // Wird später von Cockpit gefüllt
        memory: prev.memory, // Wird später von Cockpit gefüllt
        containers: [...prev.containers.slice(-19), { timestamp: now, value: containerCount }]
      }));
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 5000); // Alle 5 Sekunden

    return () => clearInterval(interval);
  }, [containerCount, cockpitUrl]);

  return metrics;
}
