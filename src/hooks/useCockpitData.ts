import { useEffect, useState } from 'react';

export type CockpitSystemInfo = {
  hostname: string;
  os: string;
  kernel: string;
  cpuCount: number;
  memoryTotal: number;
  memoryUsed: number;
  loadAverage: number[];
};

/**
 * useCockpitData - Fetcht System-Info von Cockpit
 * Nutzt entweder direkte API oder Backend-Proxy
 */
export function useCockpitData(baseUrl: string) {
  const [data, setData] = useState<CockpitSystemInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Cockpit hat keine öffentliche REST API, nutze Backend Metrics als Fallback
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
        const response = await fetch(`${backendUrl}/api/metrics`);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const metrics = await response.json();
        
        setData({
          hostname: metrics.hostname,
          os: metrics.platform,
          kernel: '-',
          cpuCount: metrics.cpu.cores,
          memoryTotal: metrics.memory.total,
          memoryUsed: metrics.memory.used,
          loadAverage: metrics.loadavg
        });
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Fehler beim Laden');
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Alle 30 Sekunden

    return () => clearInterval(interval);
  }, [baseUrl]);

  return { data, loading, error };
}
