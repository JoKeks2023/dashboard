import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import SetupWizard from './components/SetupWizard';

const ASCII_LOGO = `
 ██████╗██╗   ██╗██████╗ ███████╗██████╗ ██████╗ ██╗   ██╗███╗   ██╗██╗  ██╗
██╔════╝╚██╗ ██╔╝██╔══██╗██╔════╝██╔══██╗██╔══██╗██║   ██║████╗  ██║██║ ██╔╝
██║      ╚████╔╝ ██████╔╝█████╗  ██████╔╝██████╔╝██║   ██║██╔██╗ ██║█████╔╝ 
██║       ╚██╔╝  ██╔══██╗██╔══╝  ██╔══██╗██╔═══╝ ██║   ██║██║╚██╗██║██╔═██╗
╚██████╗   ██║   ██████╔╝███████╗██║  ██║██║     ╚██████╔╝██║ ╚████║██║  ██╗
 ╚═════╝   ╚═╝   ╚═════╝ ╚══════╝╚═╝  ╚═╝╚═╝      ╚═════╝ ╚═╝  ╚═══╝╚═╝  ╚═╝`;

/**
 * App - Cyberpunk ASCII Dashboard
 */
export default function App() {
  const [setupComplete, setSetupComplete] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    checkSetupStatus();
    const interval = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(interval);
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

  const now = new Date();
  const timeString = now.toLocaleTimeString('de-DE', { hour12: false });
  const dateString = now.toLocaleDateString('de-DE');

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center scanlines"
        style={{ backgroundColor: 'var(--cyber-bg)', fontFamily: "'Share Tech Mono', monospace" }}
      >
        <div className="text-center">
          <pre className="text-xs leading-tight mb-4" style={{ color: 'var(--cyber-cyan)', textShadow: '0 0 8px var(--cyber-cyan)' }}>
{`  ██╗      ██████╗  █████╗ ██████╗ ██╗███╗   ██╗ ██████╗ 
  ██║     ██╔═══██╗██╔══██╗██╔══██╗██║████╗  ██║██╔════╝ 
  ██║     ██║   ██║███████║██║  ██║██║██╔██╗ ██║██║  ███╗
  ██║     ██║   ██║██╔══██║██║  ██║██║██║╚██╗██║██║   ██║
  ███████╗╚██████╔╝██║  ██║██████╔╝██║██║ ╚████║╚██████╔╝
  ╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚═════╝ ╚═╝╚═╝  ╚═══╝ ╚═════╝ `}
          </pre>
          <p className="text-sm animate-blink cursor-blink" style={{ color: 'var(--cyber-green)' }}>
            &gt; INITIALIZING SYSTEM
          </p>
        </div>
      </div>
    );
  }

  if (!setupComplete) {
    return <SetupWizard onComplete={handleSetupComplete} />;
  }

  return (
    <div
      className="min-h-screen flex flex-col scanlines"
      style={{ backgroundColor: 'var(--cyber-bg)', fontFamily: "'Share Tech Mono', monospace" }}
    >
      {/* Header */}
      <header style={{ backgroundColor: 'var(--cyber-bg2)', borderBottom: '1px solid var(--cyber-cyan)', boxShadow: '0 0 12px var(--cyber-cyan)' }}>
        {/* Top status bar */}
        <div
          className="w-full px-4 py-1 text-xs flex justify-between items-center"
          style={{ backgroundColor: 'var(--cyber-bg)', borderBottom: '1px dashed var(--cyber-dim)', color: 'var(--cyber-dim)' }}
        >
          <span>&gt;&gt; HOMELAB.SYS v0.1.0 &lt;&lt;</span>
          <span style={{ color: 'var(--cyber-green)' }}>
            {dateString} | {timeString} &nbsp;
            <span className="animate-blink">▮</span>
          </span>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          {/* ASCII Logo - hidden on very small screens */}
          <pre
            className="hidden lg:block text-[7px] leading-tight mb-1 animate-flicker overflow-x-auto"
            style={{ color: 'var(--cyber-cyan)', textShadow: '0 0 6px var(--cyber-cyan)' }}
          >
            {ASCII_LOGO}
          </pre>

          {/* Mobile / small title */}
          <div className="lg:hidden flex items-center gap-2 mb-1">
            <span className="text-neon-cyan text-xl font-bold tracking-widest">&gt;_CYBERPUNK</span>
          </div>

          {/* Subtitle row */}
          <div className="flex items-center justify-between">
            <p className="text-xs" style={{ color: 'var(--cyber-magenta)', textShadow: '0 0 4px var(--cyber-magenta)' }}>
              ╔═[ HOMELAB CONTROL MATRIX ]═╗ &nbsp;
              <span style={{ color: 'var(--cyber-green)' }}>JACKED IN</span>
              &nbsp;╚═══════════════════════╝
            </p>
            <div className="flex gap-2 items-center text-xs" style={{ color: 'var(--cyber-dim)' }}>
              <span>[ <span style={{ color: 'var(--cyber-green)' }}>NET:</span> OK ]</span>
              <span>[ <span style={{ color: 'var(--cyber-cyan)' }}>SYS:</span> ACTIVE ]</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        <Dashboard />
      </main>

      {/* Footer */}
      <footer
        className="py-3 mt-4 text-xs text-center"
        style={{ backgroundColor: 'var(--cyber-bg2)', borderTop: '1px solid var(--cyber-cyan)', color: 'var(--cyber-dim)' }}
      >
        <span>&lt; HOMELAB.SYS v0.1.0 &gt;</span>
        &nbsp;|&nbsp;
        <span style={{ color: 'var(--cyber-green)' }}>ALL SYSTEMS NOMINAL</span>
        &nbsp;|&nbsp;
        <span style={{ color: 'var(--cyber-magenta)' }}>© {new Date().getFullYear()} CYBERSPACE</span>
        &nbsp;|&nbsp;
        <span className="animate-blink">▮</span>
      </footer>
    </div>
  );
}
