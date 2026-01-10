import { useEffect, useState } from 'react';
import type { HomeAssistantStats } from '../types/api';

/**
 * useHomeAssistantData - Fetcht Entitäten-Stats von Home Assistant API
 */
export function useHomeAssistantData(baseUrl: string, token?: string) {
  const [data, setData] = useState<HomeAssistantStats | null>(null);
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
        const response = await fetch(`${baseUrl}/api/states`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const states = await response.json();
        const domains: Record<string, number> = {};

        states.forEach((state: any) => {
          const domain = state.entity_id.split('.')[0];
          domains[domain] = (domains[domain] || 0) + 1;
        });

        setData({
          entities: states.length,
          domains
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
