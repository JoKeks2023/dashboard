import { useState, useEffect } from 'react';

export interface Service {
  id: string;
  name: string;
  url: string;
  description: string;
  icon: string;
  apiType?: string;
  apiToken?: string;
}

export function useServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/config');
      if (!response.ok) throw new Error('Failed to load config');
      
      const config = await response.json();
      setServices(config.services || []);
    } catch (err) {
      console.error('Error loading services:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return { services, loading, error, reload: loadServices };
}
