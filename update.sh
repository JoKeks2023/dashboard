#!/bin/bash
# Update script für Homelab Dashboard

set -e

echo "🔄 Homelab Dashboard Update"
echo ""

# Farben für Output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Prüfe ob docker-compose installiert ist
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ docker-compose ist nicht installiert${NC}"
    exit 1
fi

# Prüfe ob docker-compose.prod.yml existiert
if [ ! -f "docker-compose.prod.yml" ]; then
    echo -e "${RED}❌ docker-compose.prod.yml nicht gefunden${NC}"
    exit 1
fi

echo -e "${YELLOW}📦 Pulling latest images...${NC}"
docker-compose -f docker-compose.prod.yml pull

echo ""
echo -e "${YELLOW}🛑 Stopping old containers...${NC}"
docker-compose -f docker-compose.prod.yml down

echo ""
echo -e "${YELLOW}🚀 Starting new containers...${NC}"
docker-compose -f docker-compose.prod.yml up -d

echo ""
echo -e "${GREEN}✅ Update completed!${NC}"
echo ""
echo "Dashboard läuft auf: http://localhost:3000"
echo ""
echo "Logs anzeigen:"
echo "  docker-compose -f docker-compose.prod.yml logs -f"
echo ""
echo "Status prüfen:"
echo "  docker-compose -f docker-compose.prod.yml ps"
