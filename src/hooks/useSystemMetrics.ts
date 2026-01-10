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
 */
export function useSystemMetrics(containerCount: number) {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpu: [],
    memory: [],
    containers: []
  });

  useEffect(() => {
    const addDataPoint = () => {
      const now = Date.now();
      const cpuValue = Math.random() * 100;
      const memoryValue = 50 + Math.random() * 30;

      setMetrics((prev) => ({
        cpu: [...prev.cpu.slice(-19), { timestamp: now, value: cpuValue }],
        memory: [...prev.memory.slice(-19), { timestamp: now, value: memoryValue }],
        containers: [...prev.containers.slice(-19), { timestamp: now, value: containerCount }]
      }));
    };

    addDataPoint();
    const interval = setInterval(addDataPoint, 5000); // Alle 5 Sekunden

    return () => clearInterval(interval);
  }, [containerCount]);

  return metrics;
}
