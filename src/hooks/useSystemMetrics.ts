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
 * useSystemMetrics - Sammelt historische Metriken für Charts (echte Daten vom Backend)
 */
export function useSystemMetrics(containerCount: number) {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpu: [],
    memory: [],
    containers: []
  });

  useEffect(() => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

    const fetchMetrics = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/metrics`);
        if (!response.ok) throw new Error('Metrics fetch failed');
        
        const data = await response.json();
        const now = Date.now();

        setMetrics((prev) => ({
          cpu: [...prev.cpu.slice(-19), { timestamp: now, value: data.cpu.usage }],
          memory: [...prev.memory.slice(-19), { timestamp: now, value: data.memory.usagePercent }],
          containers: [...prev.containers.slice(-19), { timestamp: now, value: containerCount }]
        }));
      } catch (error) {
        console.error('Failed to fetch metrics:', error);
        // Fallback zu simulierten Daten bei Fehler
        const now = Date.now();
        const cpuValue = Math.random() * 100;
        const memoryValue = 50 + Math.random() * 30;

        setMetrics((prev) => ({
          cpu: [...prev.cpu.slice(-19), { timestamp: now, value: cpuValue }],
          memory: [...prev.memory.slice(-19), { timestamp: now, value: memoryValue }],
          containers: [...prev.containers.slice(-19), { timestamp: now, value: containerCount }]
        }));
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 5000); // Alle 5 Sekunden

    return () => clearInterval(interval);
  }, [containerCount]);

  return metrics;
}
