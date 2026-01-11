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
 * Cockpit API: https://cockpit-project.org/guide/latest/api-base1.html
 */
export function useCockpitData(baseUrl: string) {
  const [data, setData] = useState<CockpitSystemInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Cockpit API endpoint für System-Info
        // Format: http://server:9090/cockpit/system/info
        const response = await fetch(`${baseUrl}/cockpit/system/info`, {
          credentials: 'include',
          headers: {
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status} - Cockpit API not accessible`);
        }

        const info = await response.json();
        
        setData({
          hostname: info.hostname || 'Unknown',
          os: info.operating_system || 'Unknown',
          kernel: info.kernel || 'Unknown',
          cpuCount: info.cpu_count || 0,
          memoryTotal: info.memory_total || 0,
          memoryUsed: info.memory_used || 0,
          loadAverage: info.load_average || [0, 0, 0]
        });
        setError(null);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Fehler beim Laden';
        setError(errorMsg);
        console.error('Cockpit API error:', errorMsg);
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
