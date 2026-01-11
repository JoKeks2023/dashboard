# 🏠 Homelab Dashboard

Ein modernes, responsives Dashboard zur Überwachung deiner Homelab-Services. Entwickelt mit React 18, TypeScript, Tailwind CSS und Recharts.

![Dashboard Screenshot](https://img.shields.io/badge/React-18-blue?logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?logo=typescript) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-06B6D4?logo=tailwind-css)

## 🎯 Features

### 📊 Service-Überwachung
- **Portainer**: Container-Statistiken (Running/Stopped/Total)
- **Home Assistant**: Entitäten-Count und Domain-Übersicht
- **Cockpit**: System-Info (CPU Cores, Memory, Hostname, Load Average)
- **Webmin/Usermin**: Server-Status (Uptime, Prozesse, Users, Load)

### ⚡ Live-Features
- **Status-Checks**: Automatische Erreichbarkeitsprüfung alle 5 Sekunden
- **API-Integration**: Echte Daten von allen Services via REST APIs
- **Container-Metriken**: Live-Visualisierung mit Recharts
- **WebSocket-Logs**: Vorbereitet für Live-Log-Streaming

### 🎨 UI/UX
- **Dark Mode**: Standardmäßig aktiviert mit Toggle
- **Responsive**: Optimiert für Mobile, Tablet und Desktop
- **Animationen**: Smooth Transitions und Fade-In-Effekte
- **Fehlerbehandlung**: Klare Anzeige wenn Services nicht erreichbar

## 🚀 Quick Start

### 1. Repository klonen

```bash
git clone https://github.com/JoKeks2023/dashboard.git
cd dashboard
```

### 2. Dependencies installieren

```bash
npm install
```

### 3. Services konfigurieren

```bash
npm run setup
```

Gib die URLs deiner Services ein (z.B. `http://192.168.0.117:9000` für Portainer).
Optional kannst du API-Tokens für erweiterte Daten eingeben.

### 4. Dashboard starten

```bash
npm start
```

Das Dashboard läuft dann auf:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3001

## 📋 Voraussetzungen

- **Node.js** 20.x oder höher
- **npm** oder **yarn**
- **Zugriff** auf deine Homelab-Services (URLs + optional API-Tokens)

### API-Tokens beschaffen

#### Portainer
1. Portainer öffnen → **Settings** → **Users**
2. Dein User → **Settings** → **Add access token**
3. Token kopieren und in `.env.local` eintragen

#### Home Assistant
1. Home Assistant öffnen → **Profil** (unten links)
2. Ganz nach unten → **Long-Lived Access Tokens**
3. **Create Token** → Token kopieren

## 🔧 Konfiguration

### Umgebungsvariablen

Die Datei `.env.local` wird beim Setup automatisch erstellt. Du kannst sie auch manuell anpassen:

```bash
# Service-URLs
VITE_PORTAINER_URL=http://192.168.0.117:9000
VITE_WEBMIN_URL=http://192.168.0.117:10000
VITE_USERMIN_URL=http://192.168.0.117:20000
VITE_COCKPIT_URL=http://192.168.0.117:9090
VITE_HOME_ASSISTANT_URL=http://homeassistant.local:8123

# API Tokens (optional für erweiterte Daten)
VITE_PORTAINER_TOKEN=ptr_xxx...
VITE_HOME_ASSISTANT_TOKEN=eyJhbGci...

# Backend (für WebSocket-Logs)
VITE_BACKEND_URL=http://localhost:3001
VITE_BACKEND_WS_URL=ws://localhost:3001/ws
```

Nach Änderungen:
```bash
npm run dev  # oder npm run build
```

## 🐳 Docker Deployment

### Mit Docker Compose (empfohlen)

```bash
docker-compose up -d
```

Dashboard läuft dann auf: http://localhost:3000

### Einzelner Container

```bash
# Frontend bauen
docker build -t homelab-dashboard:latest .

# Container starten
docker run -d -p 3000:80 --name homelab-dashboard homelab-dashboard:latest
```

### Mit Deploy-Script

```bash
chmod +x deploy.sh
./deploy.sh
```

## 📁 Projektstruktur

```
dashboard/
├── src/
│   ├── components/          # React-Komponenten
│   │   ├── Dashboard.tsx    # Haupt-Dashboard
│   │   ├── ServiceCard.tsx  # Service-Karte
│   │   ├── MetricChart.tsx  # Recharts-Visualisierung
│   │   ├── LogViewer.tsx    # WebSocket Log-Viewer
│   │   └── ThemeToggle.tsx  # Dark/Light Mode
│   ├── hooks/               # Custom React Hooks
│   │   ├── useServiceStatus.ts
│   │   ├── usePortainerData.ts
│   │   ├── useHomeAssistantData.ts
│   │   ├── useCockpitData.ts
│   │   ├── useWebminData.ts
│   │   ├── useSystemMetrics.ts
│   │   └── useWebSocketLogs.ts
│   ├── types/               # TypeScript-Typen
│   ├── services.ts          # Service-Konfiguration
│   ├── App.tsx              # App-Container
│   └── main.tsx             # Entry-Point
├── backend/                 # Express Backend
│   ├── server.js            # WebSocket + CORS Proxy
│   └── Dockerfile
├── scripts/                 # Setup-Scripts
│   └── setup-services.mjs
├── Dockerfile               # Frontend-Container
├── docker-compose.yml       # Multi-Container-Setup
└── nginx.conf              # Nginx-Konfiguration

```

## 🛠️ Development

### Scripts

```bash
npm run dev       # Vite Dev-Server (Frontend)
npm run build     # Production Build
npm run preview   # Build Preview
npm run backend   # Backend-Server starten
npm run setup     # Interaktives Setup
npm start         # Frontend + Backend gleichzeitig
```

### Neue Services hinzufügen

1. Service in `src/services.ts` hinzufügen:

```typescript
{
  name: 'Mein Service',
  url: env.VITE_MY_SERVICE_URL || 'http://localhost:8080',
  description: 'Service-Beschreibung',
  icon: '🔧',
  apiType: 'generic'
}
```

2. Optional: Custom Hook für API-Daten erstellen
3. ServiceCard zeigt Service automatisch an

## 🔒 Sicherheit

### CORS-Probleme

Wenn deine Services CORS-Anfragen blockieren:

1. **Option 1**: Backend-Proxy nutzen (bereits implementiert)
2. **Option 2**: CORS-Headers auf Server-Seite setzen
3. **Option 3**: Reverse-Proxy (nginx) mit CORS-Headers

### API-Tokens

- ⚠️ **Niemals Tokens ins Git-Repository committen!**
- `.env.local` ist in `.gitignore` enthalten
- Für Production: Nutze Docker Secrets oder Umgebungsvariablen

## 🌐 Remote-Zugriff

Das Dashboard ist vollständig remote-fähig:

1. **Dashboard deployen**: Auf Server/NAS mit Docker
2. **Reverse-Proxy**: nginx/Traefik für HTTPS
3. **VPN**: Für sicheren Zugriff von außen (WireGuard/Tailscale)

### Beispiel nginx-Config

```nginx
server {
    listen 443 ssl;
    server_name dashboard.meinehomelab.de;
    
    ssl_certificate /etc/ssl/certs/dashboard.crt;
    ssl_certificate_key /etc/ssl/private/dashboard.key;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 📊 API-Endpoints

Das Dashboard nutzt folgende APIs:

| Service | Endpoint | Authentifizierung |
|---------|----------|-------------------|
| Portainer | `/api/endpoints/1/docker/containers/json` | Header: `X-API-Key` |
| Home Assistant | `/api/states` | Header: `Authorization: Bearer` |
| Cockpit | `/cockpit/system/info` | Session-based |
| Webmin | `/sysinfo.cgi?mode=json` | Session-based |

## 🤝 Contributing

Contributions sind willkommen! Bitte:

1. Fork das Repository
2. Feature-Branch erstellen (`git checkout -b feature/AmazingFeature`)
3. Änderungen committen (`git commit -m 'Add AmazingFeature'`)
4. Branch pushen (`git push origin feature/AmazingFeature`)
5. Pull Request öffnen

## 📝 Changelog

### v0.1.0 (2026-01-11)
- ✅ Initiales Release
- ✅ Support für Portainer, Home Assistant, Cockpit, Webmin, Usermin
- ✅ Live Status-Checks und Container-Metriken
- ✅ Dark Mode mit Toggle
- ✅ Docker-Support
- ✅ Vollständig remote-fähig

## 📄 Lizenz

MIT License - siehe [LICENSE](LICENSE) Datei für Details.

## 🙏 Credits

Entwickelt mit:
- [React](https://react.dev/) - UI-Framework
- [TypeScript](https://www.typescriptlang.org/) - Type Safety
- [Vite](https://vitejs.dev/) - Build Tool
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Recharts](https://recharts.org/) - Visualisierung
- [Express](https://expressjs.com/) - Backend

---

**Made with ❤️ for the Homelab Community**