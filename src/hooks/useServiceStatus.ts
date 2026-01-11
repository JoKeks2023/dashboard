import { useEffect, useRef, useState } from 'react';

/**
 * useServiceStatus - Pollt alle 5 Sekunden den Erreichbarkeitsstatus eines Services.
 */
export function useServiceStatus(url: string) {
  const [online, setOnline] = useState<boolean>(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const check = async () => {
      try {
        await fetch(url, {
          method: 'HEAD',
          mode: 'no-cors',
          cache: 'no-cache'
        });
        // Bei no-cors ist type 'opaque', also immer success wenn erreichbar
        setOnline(true);
        setLastChecked(new Date());
      } catch (error) {
        setOnline(false);
        setLastChecked(new Date());
      }
    };

    // Initial check
    check();

    // Alle 5 Sekunden
    timerRef.current = window.setInterval(check, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [url]);

  return { online, lastChecked };
}