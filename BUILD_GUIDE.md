# Homelab Dashboard - Kompletter Aufbau & Dokumentation

## 📋 Projektübersicht

**Projekt:** Modernes Homelab-Dashboard  
**Tech-Stack:** React 18 + TypeScript + Tailwind CSS + Recharts + Express + WebSocket  
**Erstellt:** 10. Januar 2026  
**Status:** Vollständig implementiert, bereit zum Aufbau

---

## 🎯 Ziele & Features (von Anfang an geplant)

### Allgemein / Layout
✅ Vollständig in TypeScript (.tsx Dateien)  
✅ Responsive Grid mit Tailwind CSS  
✅ Dunkles Theme standardmäßig  
✅ Karten (Cards) für jeden Service  
✅ Grid passt sich automatisch an (1 Spalte mobil, 2 Tablet, 3+ Desktop)  
✅ Header mit Titel „Mein Homelab Dashboard"  
✅ Footer optional für Version / Info  

### Services
✅ Dashboard zeigt mehrere Services: Portainer, Webmin, Usermin, Cockpit, Home Assistant  
✅ Jede Karte mit: Titel, Status-Indikator, API-Daten, „Öffnen"-Button, Tooltip  

### Status-Check
✅ Alle 5 Sekunden automatischer Status-Check  
✅ Status-Indikator: grün/rot  
✅ fetch mit `{ method: "HEAD", mode: "no-cors" }`  

### Interaktivität
✅ Buttons öffnen Service in neuem Tab  
✅ Hover zeigt Tooltip/Beschreibung  
✅ Dropdown für Actions (Restart/Logs/Terminal)  

### Code-Architektur
✅ Modular: Dashboard.tsx, ServiceCard.tsx, services.ts  
✅ Hooks: useServiceStatus, usePortainerData, useHomeAssistantData, useWebSocketLogs, useSystemMetrics  
✅ App.tsx → Header + Dashboard  
✅ Tailwind CSS über `className`  

### Extras (Zusätzlich implementiert)
✅ Recharts-Visualisierungen für CPU, RAM, Container  
✅ WebSocket Live-Logs mit Modal-Viewer  
✅ Backend-Proxy für CORS + Runtime-Config  
✅ Animationen (Fade-in, Pulse, Slide)  
✅ Dark/Light Mode Toggle  
✅ Docker-Support mit Multi-Container-Setup  

---

## 📁 Vollständige Dateistruktur zum Aufbauen

### Root-Verzeichnis-Dateien

#### `package.json`
```json
{
  "name": "homelab-dashboard",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "setup": "node ./scripts/setup-services.mjs",
    "backend": "node ./backend/server.js",
    "start": "concurrently \"npm run backend\" \"npm run dev\""
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "recharts": "^2.10.3",
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "ws": "^8.16.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.39",
    "@types/react-dom": "^18.2.17",
    "typescript": "^5.6.2",
    "vite": "^5.0.0",
    "@vitejs/plugin-react": "^4.2.0",
    "tailwindcss": "^3.4.1",
    "postcss": "^8.4.31",
    "autoprefixer": "^10.4.16",
    "concurrently": "^8.2.2"
  }
}
```

#### `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "moduleResolution": "Bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "types": ["vite/client"]
  },
  "include": ["src"]
}
```

#### `vite.config.ts`
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173
  }
});
```

#### `tailwind.config.ts`
```typescript
import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        card: '0 2px 10px rgba(0,0,0,0.2)'
      }
    }
  },
  plugins: []
} satisfies Config;
```

#### `postcss.config.js`
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
};
```

#### `index.html`
```html
<!doctype html>
<html lang="de" class="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Mein Homelab Dashboard</title>
  </head>
  <body class="bg-slate-900 text-white min-h-screen">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

#### `nginx.conf`
```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Enable gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### `Dockerfile` (Frontend)
```dockerfile
# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config if needed
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### `docker-compose.yml`
```yaml
version: '3.8'

services:
  # Backend für WebSocket-Logs und Runtime-Config
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: homelab-backend
    ports:
      - "3001:3001"
    restart: unless-stopped
    networks:
      - homelab

  # Frontend Dashboard
  homelab-dashboard:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: homelab-dashboard
    ports:
      - "3000:80"
    environment:
      - VITE_PORTAINER_URL=${VITE_PORTAINER_URL:-http://localhost:9000}
      - VITE_WEBMIN_URL=${VITE_WEBMIN_URL:-http://localhost:10000}
      - VITE_USERMIN_URL=${VITE_USERMIN_URL:-http://localhost:20000}
      - VITE_COCKPIT_URL=${VITE_COCKPIT_URL:-http://localhost:9090}
      - VITE_HOME_ASSISTANT_URL=${VITE_HOME_ASSISTANT_URL:-http://localhost:8123}
      - VITE_BACKEND_URL=http://backend:3001
      - VITE_BACKEND_WS_URL=ws://backend:3001/ws
    depends_on:
      - backend
    restart: unless-stopped
    networks:
      - homelab

networks:
  homelab:
    driver: bridge
```

#### `.env.example`
```bash
# Service-URLs
VITE_PORTAINER_URL=http://localhost:9000
VITE_WEBMIN_URL=http://localhost:10000
VITE_USERMIN_URL=http://localhost:20000
VITE_COCKPIT_URL=http://localhost:9090
VITE_HOME_ASSISTANT_URL=http://localhost:8123

# Optional: API Tokens für erweiterte Daten
VITE_PORTAINER_TOKEN=
VITE_HOME_ASSISTANT_TOKEN=

# Backend für WebSocket-Logs und Runtime-Config (optional)
VITE_BACKEND_URL=http://localhost:3001
VITE_BACKEND_WS_URL=ws://localhost:3001/ws
```

#### `.gitignore`
```
# Dependencies
node_modules/
npm-debug.log
npm-debug.log.*
yarn-error.log
yarn-debug.log.*
pnpm-debug.log*
lerna-debug.log*

# Build outputs
dist/
dist-ssr/
build/
out/
.next/

# Environment variables (nie ins Repo!)
.env
.env.local
.env.*.local

# IDE & Editor
.vscode/
.idea/
*.swp
*.swo
*~
.DS_Store
*.sublime-project
*.sublime-workspace
.vim/
*.iml

# OS
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Testing
coverage/
.nyc_output/

# Logs
logs/
*.log
*.log.*

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Docker
.docker/
docker-compose.override.yml

# Temporary files
*.tmp
*.temp
.cache/
.parcel-cache/

# macOS
.AppleDouble
.LSOverride

# Windows
Thumbs.db
ehthumbs.db

# Miscellaneous
.vuepress/dist
site/dist
dist-ssr
.env.production.local
```

#### `deploy.sh`
```bash
#!/bin/bash
# Quick deploy script für Homelab Dashboard

set -e

echo "🏠 Homelab Dashboard - Docker Deployment"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
  echo "⚠️  Keine .env.local gefunden. Führe Setup aus..."
  npm run setup
fi

echo ""
echo "📦 Building Docker Image..."
docker build -t homelab-dashboard:latest .

echo ""
echo "✅ Build erfolgreich!"
echo ""
echo "Starten mit:"
echo "  docker run -d -p 3000:80 --name homelab-dashboard homelab-dashboard:latest"
echo ""
echo "Oder mit docker-compose:"
echo "  docker-compose up -d"
echo ""
```

---

### `src/` Dateien

#### `src/main.tsx`
```typescript
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

#### `src/index.css`
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Base styles for dark theme */
@layer base {
  html.dark {
    color-scheme: dark;
  }
}

/* Card and transitions */
@layer components {
  .card {
    @apply rounded-xl shadow-card bg-slate-800 text-white;
  }
  .status-dot {
    @apply inline-block w-2 h-2 rounded-full;
  }
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@keyframes slideIn {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

.animate-pulse-slow {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.animate-slide-in {
  animation: slideIn 0.4s ease-out;
}
```

#### `src/env.d.ts`
```typescript
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PORTAINER_URL: string;
  readonly VITE_WEBMIN_URL: string;
  readonly VITE_USERMIN_URL: string;
  readonly VITE_COCKPIT_URL: string;
  readonly VITE_HOME_ASSISTANT_URL: string;
  readonly VITE_PORTAINER_TOKEN?: string;
  readonly VITE_HOME_ASSISTANT_TOKEN?: string;
  readonly VITE_BACKEND_URL?: string;
  readonly VITE_BACKEND_WS_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

#### `src/services.ts`
```typescript
export type Service = {
  name: string;
  url: string;
  description?: string;
  icon?: string;
  iframe?: boolean;
  wsUrl?: string;
  apiType?: 'portainer' | 'homeassistant' | 'generic';
  apiToken?: string;
};

const env = import.meta.env;

export const services: Service[] = [
  {
    name: 'Portainer',
    url: env.VITE_PORTAINER_URL ?? 'http://localhost:9000',
    description: 'Docker-Management für Container und Stacks',
    icon: '🧩',
    iframe: false,
    apiType: 'portainer',
    apiToken: env.VITE_PORTAINER_TOKEN
  },
  {
    name: 'Webmin',
    url: env.VITE_WEBMIN_URL ?? 'http://localhost:10000',
    description: 'Webbasierte Systemverwaltung',
    icon: '🛠️',
    iframe: false,
    apiType: 'generic'
  },
  {
    name: 'Usermin',
    url: env.VITE_USERMIN_URL ?? 'http://localhost:20000',
    description: 'Benutzer-Self-Service Verwaltung',
    icon: '👤',
    iframe: false,
    apiType: 'generic'
  },
  {
    name: 'Cockpit',
    url: env.VITE_COCKPIT_URL ?? 'http://localhost:9090',
    description: 'Serververwaltung, Logs & Terminal',
    icon: '📟',
    iframe: false,
    apiType: 'generic'
  },
  {
    name: 'Home Assistant',
    url: env.VITE_HOME_ASSISTANT_URL ?? 'http://localhost:8123',
    description: 'Smart Home Automations',
    icon: '🏠',
    iframe: false,
    apiType: 'homeassistant',
    apiToken: env.VITE_HOME_ASSISTANT_TOKEN
  }
];
```

#### `src/App.tsx`
```typescript
import Dashboard from './components/Dashboard';
import ThemeToggle from './components/ThemeToggle';

/**
 * App - Header + Dashboard + optionaler Footer.
 */
export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-20 bg-slate-900/80 backdrop-blur border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Mein Homelab Dashboard</h1>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Dashboard />
        </div>
      </main>

      <footer className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-3 text-sm text-slate-400">
          Version v0.1.0 · Lokal deploybar · Nur Frontend
        </div>
      </footer>
    </div>
  );
}
```

#### `src/types/api.ts`
```typescript
// Portainer API Types
export type PortainerContainer = {
  Id: string;
  Names: string[];
  State: string;
  Status: string;
  Image: string;
};

export type PortainerStats = {
  running: number;
  stopped: number;
  total: number;
};

// Home Assistant API Types
export type HomeAssistantState = {
  entity_id: string;
  state: string;
  attributes: Record<string, any>;
  last_changed: string;
};

export type HomeAssistantStats = {
  entities: number;
  domains: Record<string, number>;
};

// Cockpit/System Stats
export type SystemStats = {
  cpu: number;
  memory: { used: number; total: number };
  uptime: number;
};

// Generic Service Data
export type ServiceData = {
  type: 'portainer' | 'homeassistant' | 'system' | 'generic';
  stats?: PortainerStats | HomeAssistantStats | SystemStats;
  lastUpdate?: Date;
  error?: string;
};
```

#### `src/hooks/useServiceStatus.ts`
```typescript
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
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3000);
      try {
        await fetch(url, { method: 'HEAD', mode: 'no-cors', signal: controller.signal });
        setOnline(true);
      } catch (e) {
        setOnline(false);
      } finally {
        clearTimeout(timeout);
        setLastChecked(new Date());
      }
    };

    check();
    timerRef.current = window.setInterval(check, 5000);

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [url]);

  return { online, lastChecked };
}
```

#### `src/hooks/usePortainerData.ts`
```typescript
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
        setError('Portainer Token fehlt');
        setLoading(false);
        return;
      }

      try {
        const endpointId = 1;
        const response = await fetch(`${baseUrl}/api/endpoints/${endpointId}/docker/containers/json?all=1`, {
          headers: {
            'X-API-Key': token,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const containers = await response.json();
        const running = containers.filter((c: any) => c.State === 'running').length;
        const total = containers.length;

        setData({
          running,
          stopped: total - running,
          total,
        });
        setError(null);
      } catch (e: any) {
        setError(e.message || 'Fehler beim Abrufen');
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000);

    return () => clearInterval(interval);
  }, [baseUrl, token]);

  return { data, loading, error };
}
```

#### `src/hooks/useHomeAssistantData.ts`
```typescript
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
        setError('Home Assistant Token fehlt');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${baseUrl}/api/states`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
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
          domains,
        });
        setError(null);
      } catch (e: any) {
        setError(e.message || 'Fehler beim Abrufen');
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000);

    return () => clearInterval(interval);
  }, [baseUrl, token]);

  return { data, loading, error };
}
```

#### `src/hooks/useWebSocketLogs.ts`
```typescript
import { useEffect, useRef, useState } from 'react';

export type LogEntry = {
  type: 'log';
  service: string;
  timestamp: string;
  message: string;
  level: 'info' | 'warn' | 'error';
};

/**
 * useWebSocketLogs - Verbindet zu WebSocket-Server und empfängt Live-Logs
 */
export function useWebSocketLogs(serviceName: string, enabled: boolean = true) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [connected, setConnected] = useState<boolean>(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const wsUrl = import.meta.env.VITE_BACKEND_WS_URL || 'ws://localhost:3001/ws';
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log(`WebSocket connected for ${serviceName}`);
      setConnected(true);
      ws.send(JSON.stringify({ type: 'subscribe', service: serviceName }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'log') {
        setLogs((prev) => [...prev.slice(-99), data]);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setConnected(false);
    };

    wsRef.current = ws;

    return () => {
      ws.close();
    };
  }, [serviceName, enabled]);

  const clearLogs = () => setLogs([]);

  return { logs, connected, clearLogs };
}
```

#### `src/hooks/useSystemMetrics.ts`
```typescript
import { useEffect, useState } from 'react';

export type MetricDataPoint = {
  timestamp: number;
  value: number;
};

export type SystemMetrics = {
  cpu: MetricDataPoint[];
  memory: MetricDataPoint[];
  containers: MetricDataPoint[];
};

/**
 * useSystemMetrics - Sammelt historische Metriken für Charts
 */
export function useSystemMetrics(containerCount: number) {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpu: [],
    memory: [],
    containers: []
  });

  useEffect(() => {
    const addDataPoint = () => {
      const now = Date.now();
      const cpuUsage = Math.random() * 100;
      const memoryUsage = 60 + Math.random() * 30;

      setMetrics((prev) => ({
        cpu: [...prev.cpu.slice(-19), { timestamp: now, value: cpuUsage }],
        memory: [...prev.memory.slice(-19), { timestamp: now, value: memoryUsage }],
        containers: [...prev.containers.slice(-19), { timestamp: now, value: containerCount }]
      }));
    };

    addDataPoint();
    const interval = setInterval(addDataPoint, 5000);

    return () => clearInterval(interval);
  }, [containerCount]);

  return metrics;
}
```

#### `src/components/ServiceCard.tsx`
```typescript
import { useState } from 'react';
import { Service } from '../services';
import { useServiceStatus } from '../hooks/useServiceStatus';
import { usePortainerData } from '../hooks/usePortainerData';
import { useHomeAssistantData } from '../hooks/useHomeAssistantData';
import LogViewer from './LogViewer';

/**
 * ServiceCard - Einzelne Service-Karte mit Status-Check und API-Daten statt Iframes.
 */
export default function ServiceCard({ service }: { service: Service }) {
  const { online, lastChecked } = useServiceStatus(service.url);
  const [actionsOpen, setActionsOpen] = useState<boolean>(false);
  const [showLogs, setShowLogs] = useState<boolean>(false);

  // API Data Hooks
  const portainerData = service.apiType === 'portainer' 
    ? usePortainerData(service.url, service.apiToken) 
    : { data: null, loading: false, error: null };
  
  const haData = service.apiType === 'homeassistant' 
    ? useHomeAssistantData(service.url, service.apiToken) 
    : { data: null, loading: false, error: null };

  const openService = () => {
    window.open(service.url, '_blank', 'noopener,noreferrer');
  };

  const statusColor = online ? 'bg-green-500' : 'bg-red-500';

  return (
    <div className="card p-4 transition-transform duration-200 hover:scale-[1.01]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span 
            className={`status-dot ${statusColor} ${online ? 'animate-pulse-slow' : ''}`} 
            aria-label={online ? 'Online' : 'Offline'} 
          />
          <h3 className="text-lg font-semibold">
            {service.icon ? <span className="mr-2" aria-hidden>{service.icon}</span> : null}
            {service.name}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              className="px-3 py-1 rounded-md bg-slate-700 hover:bg-slate-600 transition"
              onClick={() => setActionsOpen((o) => !o)}
              title="Weitere Aktionen"
            >
              Aktionen ▾
            </button>
            {actionsOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-slate-800 border border-slate-700 rounded-md shadow-card z-10">
                <button className="block w-full text-left px-3 py-2 hover:bg-slate-700" onClick={() => alert('Restart (UI only)')}>Restart Service</button>
                <button 
                  className="block w-full text-left px-3 py-2 hover:bg-slate-700" 
                  onClick={() => { setShowLogs(true); setActionsOpen(false); }}
                >
                  Live Logs
                </button>
                <button className="block w-full text-left px-3 py-2 hover:bg-slate-700" onClick={() => alert('Terminal (UI only)')}>Terminal</button>
              </div>
            )}
          </div>
          <button
            className="px-3 py-1 rounded-md bg-blue-600 hover:bg-blue-500 transition"
            onClick={openService}
            title={service.description ?? 'Service öffnen'}
          >
            Öffnen
          </button>
        </div>
      </div>

      {lastChecked && (
        <p className="text-xs text-slate-300 mt-1">Zuletzt geprüft: {lastChecked.toLocaleTimeString()}</p>
      )}

      {/* API Data Display */}
      <div className="mt-3">
        {service.apiType === 'portainer' && (
          <div className="p-3 bg-slate-700/50 rounded-md">
            {portainerData.loading && <p className="text-sm text-slate-300">Lade Daten...</p>}
            {portainerData.error && <p className="text-sm text-red-400">⚠️ {portainerData.error}</p>}
            {portainerData.data && (
              <div className="space-y-1">
                <p className="text-sm font-semibold text-green-400">Container Stats:</p>
                <p className="text-sm">🟢 Laufend: <span className="font-mono">{portainerData.data.running}</span></p>
                <p className="text-sm">🔴 Gestoppt: <span className="font-mono">{portainerData.data.stopped}</span></p>
                <p className="text-sm">📦 Gesamt: <span className="font-mono">{portainerData.data.total}</span></p>
              </div>
            )}
            {!portainerData.data && !portainerData.loading && !portainerData.error && (
              <p className="text-sm text-slate-400">Kein API-Token konfiguriert</p>
            )}
          </div>
        )}

        {service.apiType === 'homeassistant' && (
          <div className="p-3 bg-slate-700/50 rounded-md">
            {haData.loading && <p className="text-sm text-slate-300">Lade Daten...</p>}
            {haData.error && <p className="text-sm text-red-400">⚠️ {haData.error}</p>}
            {haData.data && (
              <div className="space-y-1">
                <p className="text-sm font-semibold text-blue-400">Entitäten:</p>
                <p className="text-sm">📊 Gesamt: <span className="font-mono">{haData.data.entities}</span></p>
                <div className="text-xs text-slate-300 mt-2">
                  {Object.entries(haData.data.domains).slice(0, 5).map(([domain, count]) => (
                    <span key={domain} className="inline-block mr-2 mb-1 px-2 py-0.5 bg-slate-800 rounded">
                      {domain}: {count}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {!haData.data && !haData.loading && !haData.error && (
              <p className="text-sm text-slate-400">Kein API-Token konfiguriert</p>
            )}
          </div>
        )}

        {service.apiType === 'generic' && (
          <div className="p-3 bg-slate-700/50 rounded-md">
            <p className="text-sm text-slate-400">
              {service.description || 'Öffne Service über den Button oben'}
            </p>
          </div>
        )}
      </div>

      {/* Log Viewer Modal */}
      {showLogs && (
        <LogViewer serviceName={service.name} onClose={() => setShowLogs(false)} />
      )}
    </div>
  );
}
```

#### `src/components/Dashboard.tsx`
```typescript
import ServiceCard from './ServiceCard';
import MetricChart from './MetricChart';
import { services } from '../services';
import { useSystemMetrics } from '../hooks/useSystemMetrics';
import { usePortainerData } from '../hooks/usePortainerData';

/**
 * Dashboard - Responsive Grid mit Service-Karten und Metriken.
 */
export default function Dashboard() {
  const portainerService = services.find(s => s.apiType === 'portainer');
  const portainerData = portainerService?.apiToken 
    ? usePortainerData(portainerService.url, portainerService.apiToken) 
    : { data: null };

  const containerCount = portainerData.data?.total ?? 0;
  const metrics = useSystemMetrics(containerCount);

  return (
    <div className="space-y-6">
      {/* Metriken */}
      <div className="animate-fade-in">
        <h2 className="text-xl font-bold mb-3">📊 System-Übersicht</h2>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <MetricChart 
            data={metrics.cpu} 
            title="CPU-Auslastung" 
            color="#3b82f6" 
            unit="%" 
          />
          <MetricChart 
            data={metrics.memory} 
            title="RAM-Nutzung" 
            color="#10b981" 
            unit="%" 
          />
          <MetricChart 
            data={metrics.containers} 
            title="Container" 
            color="#8b5cf6" 
            unit="" 
            max={Math.max(containerCount + 5, 20)}
          />
        </div>
      </div>

      {/* Services */}
      <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <h2 className="text-xl font-bold mb-3">🚀 Services</h2>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {services.map((s) => (
            <ServiceCard key={s.name} service={s} />
          ))}
        </div>
      </div>
    </div>
  );
}
```

#### `src/components/MetricChart.tsx`
```typescript
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { MetricDataPoint } from '../hooks/useSystemMetrics';

type MetricChartProps = {
  data: MetricDataPoint[];
  title: string;
  color: string;
  unit?: string;
  max?: number;
};

/**
 * MetricChart - Wiederverwendbare Chart-Komponente für Metriken
 */
export default function MetricChart({ data, title, color, unit = '%', max = 100 }: MetricChartProps) {
  const chartData = data.map((d) => ({
    time: new Date(d.timestamp).toLocaleTimeString(),
    value: d.value
  }));

  const latestValue = data.length > 0 ? data[data.length - 1].value : 0;

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-slate-300">{title}</h3>
        <span className="text-2xl font-bold" style={{ color }}>
          {latestValue.toFixed(1)}{unit}
        </span>
      </div>
      <ResponsiveContainer width="100%" height={120}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.8} />
              <stop offset="95%" stopColor={color} stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis 
            dataKey="time" 
            stroke="#64748b" 
            fontSize={10}
            tickFormatter={(val) => val.split(':').slice(0, 2).join(':')}
          />
          <YAxis 
            stroke="#64748b" 
            fontSize={10}
            domain={[0, max]}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1e293b', 
              border: '1px solid #334155',
              borderRadius: '8px'
            }}
            formatter={(value: number) => [`${value.toFixed(1)}${unit}`, title]}
          />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke={color} 
            fill={`url(#gradient-${color})`} 
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
```

#### `src/components/LogViewer.tsx`
```typescript
import { useState } from 'react';
import { useWebSocketLogs, type LogEntry } from '../hooks/useWebSocketLogs';

type LogViewerProps = {
  serviceName: string;
  onClose: () => void;
};

/**
 * LogViewer - Live-Log-Anzeige mit WebSocket
 */
export default function LogViewer({ serviceName, onClose }: LogViewerProps) {
  const [enabled, setEnabled] = useState(true);
  const { logs, connected, clearLogs } = useWebSocketLogs(serviceName, enabled);

  const getLevelColor = (level: LogEntry['level']) => {
    switch (level) {
      case 'error': return 'text-red-400';
      case 'warn': return 'text-yellow-400';
      default: return 'text-slate-300';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold">📜 Logs: {serviceName}</h2>
            <span className={`px-2 py-1 rounded text-xs ${connected ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
              {connected ? '🟢 Live' : '🔴 Offline'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1 rounded-md bg-slate-700 hover:bg-slate-600 transition text-sm"
              onClick={() => setEnabled(!enabled)}
            >
              {enabled ? 'Pause' : 'Resume'}
            </button>
            <button
              className="px-3 py-1 rounded-md bg-slate-700 hover:bg-slate-600 transition text-sm"
              onClick={clearLogs}
            >
              Clear
            </button>
            <button
              className="px-3 py-1 rounded-md bg-red-600 hover:bg-red-500 transition text-sm"
              onClick={onClose}
            >
              Schließen
            </button>
          </div>
        </div>

        {/* Logs */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-900 font-mono text-sm">
          {logs.length === 0 && (
            <p className="text-slate-500 text-center py-8">
              {connected ? 'Warte auf Logs...' : 'Nicht verbunden'}
            </p>
          )}
          {logs.map((log, idx) => (
            <div key={idx} className="mb-1 hover:bg-slate-800/50 px-2 py-1 rounded">
              <span className="text-slate-500 text-xs">
                {new Date(log.timestamp).toLocaleTimeString()}
              </span>
              {' '}
              <span className={getLevelColor(log.level)}>
                [{log.level.toUpperCase()}]
              </span>
              {' '}
              <span className="text-slate-200">{log.message}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-700 text-xs text-slate-400">
          {logs.length} Einträge · WebSocket verbunden: {connected ? 'Ja' : 'Nein'}
        </div>
      </div>
    </div>
  );
}
```

#### `src/components/ThemeToggle.tsx`
```typescript
import { useEffect, useState } from 'react';

/**
 * ThemeToggle - Optionaler Dark/Light Toggle, standardmäßig dark.
 */
export default function ThemeToggle() {
  const [dark, setDark] = useState<boolean>(true);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved) {
      const isDark = saved === 'dark';
      setDark(isDark);
      document.documentElement.classList.toggle('dark', isDark);
    } else {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  return (
    <button
      className="px-3 py-1 rounded-md bg-slate-700 hover:bg-slate-600 transition"
      onClick={toggle}
      title="Dark/Light umschalten"
    >
      {dark ? '🌙 Dark' : '☀️ Light'}
    </button>
  );
}
```

---

### `scripts/` Dateien

#### `scripts/setup-services.mjs`
```javascript
#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';

const root = process.cwd();
const envPath = path.join(root, '.env.local');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function ask(question, defaultValue) {
  return new Promise((resolve) => {
    rl.question(`${question} [${defaultValue}]: `, (answer) => {
      resolve(answer?.trim() ? answer.trim() : defaultValue);
    });
  });
}

async function main() {
  console.log('\nHomelab Service-Setup (schreibt .env.local)');
  console.log('Drücke Enter, um den vorgeschlagenen Wert zu übernehmen.');
  console.log('API-Tokens sind optional - leer lassen wenn nicht benötigt.\n');

  const defaults = {
    PORTAINER_URL: process.env.VITE_PORTAINER_URL || 'http://localhost:9000',
    WEBMIN_URL: process.env.VITE_WEBMIN_URL || 'http://localhost:10000',
    USERMIN_URL: process.env.VITE_USERMIN_URL || 'http://localhost:20000',
    COCKPIT_URL: process.env.VITE_COCKPIT_URL || 'http://localhost:9090',
    HOME_ASSISTANT_URL: process.env.VITE_HOME_ASSISTANT_URL || 'http://localhost:8123',
    PORTAINER_TOKEN: process.env.VITE_PORTAINER_TOKEN || '',
    HOME_ASSISTANT_TOKEN: process.env.VITE_HOME_ASSISTANT_TOKEN || '',
    BACKEND_URL: process.env.VITE_BACKEND_URL || 'http://localhost:3001',
    BACKEND_WS_URL: process.env.VITE_BACKEND_WS_URL || 'ws://localhost:3001/ws'
  };

  const portainer = await ask('Portainer URL', defaults.PORTAINER_URL);
  const webmin = await ask('Webmin URL', defaults.WEBMIN_URL);
  const usermin = await ask('Usermin URL', defaults.USERMIN_URL);
  const cockpit = await ask('Cockpit URL', defaults.COCKPIT_URL);
  const ha = await ask('Home Assistant URL', defaults.HOME_ASSISTANT_URL);
  
  console.log('\n--- Optional: API Tokens (leer lassen zum Überspringen) ---');
  const portainerToken = await ask('Portainer API Token', defaults.PORTAINER_TOKEN);
  const haToken = await ask('Home Assistant Token', defaults.HOME_ASSISTANT_TOKEN);
  
  console.log('\n--- Backend für Live-Logs & Charts (leer lassen für Standard) ---');
  const backendUrl = await ask('Backend URL', defaults.BACKEND_URL);
  const backendWsUrl = await ask('Backend WebSocket URL', defaults.BACKEND_WS_URL);

  rl.close();

  const lines = [
    `VITE_PORTAINER_URL=${portainer}`,
    `VITE_WEBMIN_URL=${webmin}`,
    `VITE_USERMIN_URL=${usermin}`,
    `VITE_COCKPIT_URL=${cockpit}`,
    `VITE_HOME_ASSISTANT_URL=${ha}`,
    '',
    '# API Tokens (optional)',
    portainerToken ? `VITE_PORTAINER_TOKEN=${portainerToken}` : '# VITE_PORTAINER_TOKEN=',
    haToken ? `VITE_HOME_ASSISTANT_TOKEN=${haToken}` : '# VITE_HOME_ASSISTANT_TOKEN=',
    '',
    '# Backend (optional)',
    `VITE_BACKEND_URL=${backendUrl}`,
    `VITE_BACKEND_WS_URL=${backendWsUrl}`,
    ''
  ].join('\n');

  fs.writeFileSync(envPath, lines, 'utf8');
  console.log(`\nGespeichert: ${envPath}`);
  console.log('Hinweis: Baue neu, damit die Env-Werte greifen: npm run dev / npm run build');
}

main().catch((err) => {
  console.error('Fehler beim Setup:', err);
  process.exit(1);
});
```

---

### `backend/` Dateien

#### `backend/package.json`
```json
{
  "type": "module"
}
```

#### `backend/Dockerfile`
```dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json ./

# Install dependencies (express, cors, ws)
RUN npm install express cors ws

# Copy server
COPY server.js ./

EXPOSE 3001

CMD ["node", "server.js"]
```

#### `backend/server.js`
```javascript
import express from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Runtime Config Storage (in-memory, könnte auch Redis/DB sein)
let runtimeConfig = {
  services: [],
  tokens: {}
};

// Config Endpoints
app.get('/api/config', (req, res) => {
  res.json(runtimeConfig);
});

app.post('/api/config', (req, res) => {
  runtimeConfig = { ...runtimeConfig, ...req.body };
  res.json({ success: true, config: runtimeConfig });
});

// Proxy für API-Calls (vermeidet CORS-Probleme)
app.post('/api/proxy', async (req, res) => {
  const { url, method = 'GET', headers = {}, body } = req.body;
  
  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      body: body ? JSON.stringify(body) : undefined
    });
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const server = createServer(app);

// WebSocket Server für Live-Logs
const wss = new WebSocketServer({ server, path: '/ws' });

wss.on('connection', (ws) => {
  console.log('WebSocket client connected');
  
  ws.on('message', (message) => {
    const data = JSON.parse(message.toString());
    
    // Handle verschiedene Log-Typen
    if (data.type === 'subscribe') {
      console.log(`Client subscribed to: ${data.service}`);
      
      // Demo: Sende mock logs
      const mockLogInterval = setInterval(() => {
        if (ws.readyState === ws.OPEN) {
          ws.send(JSON.stringify({
            type: 'log',
            service: data.service,
            timestamp: new Date().toISOString(),
            message: `[${data.service}] Log entry at ${new Date().toLocaleTimeString()}`,
            level: Math.random() > 0.8 ? 'error' : 'info'
          }));
        } else {
          clearInterval(mockLogInterval);
        }
      }, 2000);
      
      ws.on('close', () => {
        clearInterval(mockLogInterval);
        console.log('Client disconnected');
      });
    }
  });
  
  ws.send(JSON.stringify({ 
    type: 'connected', 
    message: 'WebSocket connection established' 
  }));
});

server.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📡 WebSocket server running on ws://localhost:${PORT}/ws`);
});
```

---

## 🚀 Schritt-für-Schritt Aufbau auf anderem Computer

### 1. Repository klonen
```bash
git clone https://github.com/JoKeks2023/dashboard.git
cd dashboard
```

### 2. Alle Dateien erstellen
Erstelle die Dateistruktur exakt wie oben dokumentiert. Wichtig:
- Alle Dateien im richtigen Verzeichnis
- `scripts/setup-services.mjs` ausführbar machen: `chmod +x scripts/setup-services.mjs`
- Deploy-Script ausführbar: `chmod +x deploy.sh`

### 3. Dependencies installieren
```bash
npm install
```

### 4. Konfiguration erstellen
```bash
npm run setup
```
Folge den Prompts und gebe URLs und optional Tokens ein.

### 5. Development-Server starten
```bash
npm start
```

Dies startet gleichzeitig:
- Frontend: http://localhost:5173
- Backend: http://localhost:3001

### 6. Production-Build
```bash
npm run build
```

### 7. Docker-Deployment
```bash
docker-compose up -d
```

Dashboard läuft dann auf: http://localhost:3000

---

## 🔑 API-Tokens beschaffen

### Portainer API Token
1. Im Portainer-Dashboard einloggen (Port 9000)
2. Settings → Users
3. Dein User → Settings
4. "Add access token"
5. Token kopieren und in `.env.local` eintragen

### Home Assistant Token
1. Home Assistant öffnen (Port 8123)
2. Profil (unten links)
3. Ganz nach unten: "Long-Lived Access Tokens"
4. "Create Token" → Namen eingeben
5. Token kopieren und in `.env.local` eintragen

---

## 📝 Wichtige Hinweise

### Build-Warnung ignorieren
```
(!) Some chunks are larger than 500 kB after minification.
```
Das ist normal wegen Recharts. Später mit Code-Splitting optimierbar.

### CORS-Probleme
Falls API-Calls blockt werden:
- Backend-Proxy nutzen: `/api/proxy`
- Oder Reverse-Proxy (nginx) mit CORS-Headers

### WebSocket-Logs
Aktuell Mock-Daten. Für echte Logs:
- Docker-API-Logs streamen
- Portainer-Logs nutzen
- Home Assistant-Event-Stream

### System-Metriken
Aktuell simulierte Daten. Für echte Metriken:
- Cockpit-API anbinden
- Prometheus/node-exporter
- Docker-Stats API

---

## 🔧 Wichtige npm Scripts

```bash
npm run dev          # Vite Dev-Server
npm run build        # Production Build
npm run preview      # Build Preview
npm run backend      # Backend-Server nur
npm run setup        # Interaktives Setup
npm start            # Frontend + Backend gleichzeitig
```

---

## 🐳 Docker Commands

```bash
# Build
docker build -t homelab-dashboard .

# Run
docker run -d -p 3000:80 homelab-dashboard

# With docker-compose
docker-compose up -d
docker-compose logs -f
docker-compose down
```

---

**Viel Erfolg beim Aufbau! 🚀**
