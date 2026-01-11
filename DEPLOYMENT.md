# 🚀 Deployment Guide

## Quick Deploy (Empfohlen)

### Ein-Zeilen-Installation

```bash
curl -sSL https://raw.githubusercontent.com/JoKeks2023/dashboard/main/install.sh | bash
```

Das Script:
- ✅ Lädt `docker-compose.prod.yml` herunter
- ✅ Lädt `update.sh` für Updates herunter
- ✅ Pullt die neuesten Docker Images
- ✅ Startet das Dashboard

Dashboard läuft dann auf: **http://localhost:3000**

---

## Manuelle Installation

### 1. docker-compose.prod.yml herunterladen

```bash
wget https://raw.githubusercontent.com/JoKeks2023/dashboard/main/docker-compose.prod.yml
```

### 2. Dashboard starten

```bash
docker-compose -f docker-compose.prod.yml up -d
```

### 3. Logs prüfen

```bash
docker-compose -f docker-compose.prod.yml logs -f
```

---

## 🔄 Updates

### Mit Update-Script (Empfohlen)

```bash
./update.sh
```

Das Script:
1. Pullt neueste Images von GitHub Container Registry
2. Stoppt alte Container
3. Startet neue Container
4. Zeigt Status an

### Manuell

```bash
# Neue Images pullen
docker-compose -f docker-compose.prod.yml pull

# Container neu starten
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d
```

---

## 📦 Verfügbare Versionen

Die Docker Images werden automatisch bei jedem Release gebaut:

- **Latest**: `ghcr.io/jokeks2023/dashboard:latest`
- **Specific Version**: `ghcr.io/jokeks2023/dashboard:v0.1.0`
- **Backend**: `ghcr.io/jokeks2023/dashboard-backend:latest`

### Spezifische Version verwenden

Ändere in `docker-compose.prod.yml`:

```yaml
services:
  dashboard:
    image: ghcr.io/jokeks2023/dashboard:v0.1.0  # Statt :latest
```

---

## 🔧 Konfiguration

### Service-URLs anpassen

Das Dashboard nutzt `.env.local` für die Konfiguration. Bei Docker-Deployment gibt es zwei Optionen:

#### Option 1: Umgebungsvariablen (Empfohlen)

Erstelle `.env` Datei im gleichen Verzeichnis wie `docker-compose.prod.yml`:

```bash
VITE_PORTAINER_URL=http://192.168.0.117:9000
VITE_WEBMIN_URL=http://192.168.0.117:10000
VITE_USERMIN_URL=http://192.168.0.117:20000
VITE_COCKPIT_URL=http://192.168.0.117:9090
VITE_HOME_ASSISTANT_URL=http://homeassistant.local:8123
VITE_PORTAINER_TOKEN=ptr_xxx...
VITE_HOME_ASSISTANT_TOKEN=eyJhbGci...
```

Dann in `docker-compose.prod.yml` ergänzen:

```yaml
services:
  dashboard:
    image: ghcr.io/jokeks2023/dashboard:latest
    env_file: .env  # <-- Hinzufügen
    # ...
```

#### Option 2: Rebuild mit eigener Config

```bash
# Repository klonen
git clone https://github.com/JoKeks2023/dashboard.git
cd dashboard

# Setup ausführen
npm run setup

# Eigenes Image bauen
docker build -t homelab-dashboard:custom .

# Mit eigenem Image starten
docker run -d -p 3000:80 homelab-dashboard:custom
```

---

## 🌐 Reverse Proxy Setup

### Mit nginx

```nginx
server {
    listen 80;
    server_name dashboard.meinehomelab.de;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Mit Traefik

```yaml
labels:
  - "traefik.enable=true"
  - "traefik.http.routers.dashboard.rule=Host(`dashboard.meinehomelab.de`)"
  - "traefik.http.routers.dashboard.entrypoints=websecure"
  - "traefik.http.routers.dashboard.tls.certresolver=letsencrypt"
```

---

## 🛠️ Troubleshooting

### Container startet nicht

```bash
# Logs prüfen
docker-compose -f docker-compose.prod.yml logs

# Status prüfen
docker-compose -f docker-compose.prod.yml ps
```

### Port bereits belegt

Ändere Port in `docker-compose.prod.yml`:

```yaml
services:
  dashboard:
    ports:
      - "8080:80"  # Statt 3000:80
```

### Services nicht erreichbar

1. **Netzwerk prüfen**: Kann der Docker-Container die Services erreichen?
2. **CORS-Problem**: Siehe README.md → Sicherheit
3. **Firewall**: Ports freigeben

### Dashboard zeigt keine Daten

1. **API-Tokens prüfen**: Sind Portainer/Home Assistant Tokens gültig?
2. **Service-URLs prüfen**: Sind die URLs von Container aus erreichbar?
3. **Browser Console**: F12 → Console → Fehler prüfen

---

## 🔒 Produktions-Best-Practices

### 1. HTTPS verwenden

Nutze Let's Encrypt mit nginx oder Traefik für SSL/TLS.

### 2. Authentifizierung hinzufügen

```nginx
# In nginx
location / {
    auth_basic "Homelab Dashboard";
    auth_basic_user_file /etc/nginx/.htpasswd;
    proxy_pass http://localhost:3000;
}
```

### 3. Backup der Konfiguration

```bash
# .env sichern
cp .env .env.backup

# docker-compose.prod.yml sichern
cp docker-compose.prod.yml docker-compose.prod.yml.backup
```

### 4. Automatische Updates

Mit Watchtower:

```yaml
services:
  watchtower:
    image: containrrr/watchtower
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    command: --interval 3600 --cleanup
```

---

## 📊 Monitoring

### Container-Status prüfen

```bash
docker-compose -f docker-compose.prod.yml ps
```

### Ressourcen-Verbrauch

```bash
docker stats homelab-dashboard homelab-backend
```

### Health-Checks

```bash
# Dashboard
curl http://localhost:3000

# Backend
curl http://localhost:3001/health
```

---

## 🆘 Support

Bei Problemen:
1. GitHub Issues: https://github.com/JoKeks2023/dashboard/issues
2. Logs prüfen: `docker-compose -f docker-compose.prod.yml logs`
3. README.md durchlesen

---

**Happy Homelabbing! 🏠**
