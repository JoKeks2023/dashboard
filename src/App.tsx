import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import ThemeToggle from './components/ThemeToggle';
import SetupWizard from './components/SetupWizard';

/**
 * App - Header + Dashboard + optionaler Footer.
 */
export default function App() {
  const [setupComplete, setSetupComplete] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSetupStatus();
  }, []);

  const checkSetupStatus = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/config');
      const config = await response.json();
      setSetupComplete(config.setupComplete || false);
    } catch (error) {
      console.error('Failed to check setup status:', error);
      setSetupComplete(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSetupComplete = () => {
    setSetupComplete(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-gray-600 dark:text-gray-400">Lade Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!setupComplete) {
    return <SetupWizard onComplete={handleSetupComplete} />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-slate-800 shadow-lg border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="text-3xl">🏠</span>
              Mein Homelab Dashboard
            </h1>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <Dashboard />
      </main>

      {/* Optional Footer */}
      <footer className="bg-slate-800 border-t border-slate-700 py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-400 text-sm">
          Homelab Dashboard v0.1.0 • Erstellt {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
}
