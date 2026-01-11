# 🔧 GitHub Actions & Container Registry Setup

## Voraussetzungen

Bevor der erste Release funktioniert, müssen GitHub Actions und Container Registry eingerichtet werden.

---

## 1️⃣ GitHub Container Registry aktivieren

### Schritt 1: Package Permissions setzen

1. Gehe zu: https://github.com/JoKeks2023/dashboard/settings/actions
2. Scrolle zu **"Workflow permissions"**
3. Wähle: **"Read and write permissions"** ✅
4. Aktiviere: **"Allow GitHub Actions to create and approve pull requests"** ✅
5. Klicke **Save**

### Schritt 2: Package Visibility (nach erstem Release)

Nach dem ersten Release erscheinen Packages unter:
https://github.com/JoKeks2023?tab=packages

Dann:
1. Klicke auf das Package `dashboard`
2. **Package settings** → **Change visibility**
3. Wähle **Public** (damit User es ohne Login pullen können)
4. Wiederhole für `dashboard-backend`

---

## 2️⃣ Erster Release erstellen

### Prüfen ob Actions-Dateien existieren

```bash
ls -la .github/workflows/
```

Sollte zeigen:
- `docker-publish.yml` ✅
- `release.yml` ✅

### Release erstellen

```bash
# Option 1: Mit npm Script
npm run release

# Option 2: Manuell
git tag -a v0.1.0 -m "Initial release v0.1.0"
git push origin v0.1.0
```

---

## 3️⃣ GitHub Actions beobachten

### Actions-Tab öffnen

Gehe zu: https://github.com/JoKeks2023/dashboard/actions

Du siehst zwei Workflows:
1. **Build and Publish Docker Image** 🐳
2. **Create Release** 📦

### Workflow-Status

**Build and Publish Docker Image:**
- ⏱️ Dauer: ~5-8 Minuten
- Schritte:
  1. Checkout repository
  2. Set up Docker Buildx
  3. Login to ghcr.io
  4. Build Frontend image (~4 min)
  5. Push Frontend image
  6. Build Backend image (~1 min)
  7. Push Backend image

**Create Release:**
- ⏱️ Dauer: ~30 Sekunden
- Erstellt GitHub Release mit Changelog

---

## 4️⃣ Troubleshooting

### ❌ Error: "Resource not accessible by integration"

**Problem:** Workflow hat keine Schreibrechte

**Lösung:**
1. Repository Settings → Actions → General
2. Workflow permissions → **Read and write permissions**
3. Save

### ❌ Error: "denied: permission_denied"

**Problem:** Keine Berechtigung für Container Registry

**Lösung:**
1. Prüfe ob `GITHUB_TOKEN` korrekt ist (ist automatisch gesetzt)
2. Prüfe Workflow permissions (siehe oben)

### ❌ Workflow läuft nicht

**Problem:** Workflow wird nicht getriggert

**Lösung:**
```bash
# Prüfe ob Tag korrekt gepusht wurde
git tag -l

# Push Tag erneut
git push origin v0.1.0 --force
```

### ❌ "Image not found" beim Pullen

**Problem:** Package ist private

**Lösung:**
1. https://github.com/JoKeks2023?tab=packages
2. Package → Settings → Change visibility → Public

---

## 5️⃣ Erfolgreiche Einrichtung verifizieren

### Prüfe Docker Images

Nach erfolgreichem Workflow:

```bash
# Images sollten pullbar sein
docker pull ghcr.io/jokeks2023/dashboard:latest
docker pull ghcr.io/jokeks2023/dashboard-backend:latest
```

### Prüfe GitHub Release

Gehe zu: https://github.com/JoKeks2023/dashboard/releases

Du solltest sehen:
- **v0.1.0** Release
- Generated Changelog
- Source Code (zip/tar.gz)

### Prüfe Container Registry

Gehe zu: https://github.com/JoKeks2023?tab=packages

Du solltest sehen:
- `dashboard` Package
- `dashboard-backend` Package
- Tag `latest` und `v0.1.0`

---

## 6️⃣ Workflow-Dateien erklärt

### `.github/workflows/docker-publish.yml`

```yaml
# Wird getriggert bei:
on:
  push:
    tags:
      - 'v*.*.*'  # z.B. v0.1.0, v1.2.3
  workflow_dispatch:  # Manueller Trigger

# Was es macht:
1. Baut Frontend-Docker-Image
2. Baut Backend-Docker-Image  
3. Pusht beide zu ghcr.io/jokeks2023/dashboard
4. Erstellt Tags: latest, v0.1.0, 0.1, 0
```

### `.github/workflows/release.yml`

```yaml
# Wird getriggert bei:
on:
  push:
    tags:
      - 'v*.*.*'

# Was es macht:
1. Generiert Changelog aus Commits
2. Erstellt GitHub Release
3. Fügt Release Notes hinzu
```

---

## 7️⃣ Nächste Releases

Nach dem ersten Release ist alles automatisiert:

```bash
# 1. Entwickle neue Features
git add .
git commit -m "feat: neue feature"
git push

# 2. Release erstellen
npm run release
# Version: 0.2.0

# 3. Push
git push origin main
git push origin v0.2.0

# 4. Warten (~5-8 min)
# - GitHub Actions baut Images
# - Release wird erstellt

# 5. User updaten
./update.sh
```

---

## 8️⃣ Badge für README

Nach erstem Release kannst du Badges hinzufügen:

```markdown
![Docker Image](https://ghcr-badge.deta.dev/jokeks2023/dashboard/latest_tag?trim=major&label=latest)
![Docker Pulls](https://ghcr-badge.deta.dev/jokeks2023/dashboard/size)
```

---

## ✅ Checkliste für ersten Release

- [ ] GitHub Actions Permissions gesetzt (Read & Write)
- [ ] `.github/workflows/` Dateien gepusht
- [ ] Git Tag erstellt: `git tag -a v0.1.0 -m "Release v0.1.0"`
- [ ] Tag gepusht: `git push origin v0.1.0`
- [ ] Actions-Tab beobachtet: Workflows erfolgreich
- [ ] Packages auf Public gesetzt
- [ ] `docker pull ghcr.io/jokeks2023/dashboard:latest` funktioniert
- [ ] `install.sh` getestet

---

## 🆘 Support

Bei Problemen:
1. GitHub Actions Logs checken: https://github.com/JoKeks2023/dashboard/actions
2. Issues öffnen: https://github.com/JoKeks2023/dashboard/issues
3. Workflow manuell triggern: Actions → Build and Publish → Run workflow

---

**Nächster Schritt:** [Ersten Release erstellen](#2️⃣-erster-release-erstellen)
