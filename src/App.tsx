import Dashboard from './components/Dashboard';
import ThemeToggle from './components/ThemeToggle';

/**
 * App - Header + Dashboard + optionaler Footer.
 */
export default function App() {
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
