import { useEffect, useState } from 'react';

/**
 * ThemeToggle - Optionaler Dark/Light Toggle, standardmäßig dark.
 */
export default function ThemeToggle() {
  const [dark, setDark] = useState<boolean>(true);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'light') {
      setDark(false);
      document.documentElement.classList.remove('dark');
    } else {
      setDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggle = () => {
    const newDark = !dark;
    setDark(newDark);
    if (newDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <button
      onClick={toggle}
      className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors"
      title={dark ? 'Light Mode aktivieren' : 'Dark Mode aktivieren'}
    >
      <span className="text-xl">{dark ? '☀️' : '🌙'}</span>
    </button>
  );
}
