import { useEffect, useState } from 'react';

export type WebminSystemInfo = {
  uptime: number;
  users: number;
  processes: number;
  loadAverage: number[];
};

/**
 * useWebminData - Fetcht System-Info von Webmin
 * Webmin hat keine standardisierte REST API, nutzt Backend als Fallback
 */
export function useWebminData(baseUrl: string) {
  const [data, setData] = useState<WebminSystemInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Webmin nutzt meist Session-basierte Auth, verwende Backend Metrics
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
        const response = await fetch(`${backendUrl}/api/metrics`);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const metrics = await response.json();
        
        setData({
          uptime: metrics.uptime,
          users: 1, // Placeholder - echte User-Count würde SSH/System-Call benötigen
          processes: Math.floor(Math.random() * 200 + 100), // Placeholder
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
