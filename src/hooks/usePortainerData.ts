import { useEffect, useState } from 'react';
import type { PortainerStats } from '../types/api';

/**
 * usePortainerData - Fetcht Container-Stats von Portainer API
 */
export function usePortainerData(baseUrl: string, token?: string) {
  const [data, setData] = useState<PortainerStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setLoading(false);
        setError('Kein API-Token verfügbar');
        return;
      }

      try {
        const response = await fetch(`${baseUrl}/api/endpoints/1/docker/containers/json?all=true`, {
          headers: {
            'X-API-Key': token
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const containers = await response.json();
        const running = containers.filter((c: any) => c.State === 'running').length;
        const stopped = containers.filter((c: any) => c.State !== 'running').length;

        setData({
          running,
          stopped,
          total: containers.length
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
  }, [baseUrl, token]);

  return { data, loading, error };
}
