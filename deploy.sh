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
