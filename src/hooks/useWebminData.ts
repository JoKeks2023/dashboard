import { useEffect, useState } from 'react';

export type WebminSystemInfo = {
  uptime: number;
  users: number;
  processes: number;
  loadAverage: number[];
};

/**
 * useWebminData - Fetcht System-Info von Webmin
 * Webmin API: https://webmin.com/docs/modules/system-information/
 */
export function useWebminData(baseUrl: string) {
  const [data, setData] = useState<WebminSystemInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Webmin API endpoint für System-Status
        // Format: http://server:10000/sysinfo.cgi?mode=json
        const response = await fetch(`${baseUrl}/sysinfo.cgi?mode=json`, {
          credentials: 'include',
          headers: {
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status} - Webmin API not accessible`);
        }

        const info = await response.json();
        
        setData({
          uptime: info.uptime || 0,
          users: info.users || 0,
          processes: info.processes || 0,
          loadAverage: info.load || [0, 0, 0]
        });
        setError(null);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Fehler beim Laden';
        setError(errorMsg);
        console.error('Webmin API error:', errorMsg);
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
