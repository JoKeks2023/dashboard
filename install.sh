#!/bin/bash
# Initial deployment script für Homelab Dashboard

set -e

echo "🏠 Homelab Dashboard - Initial Deployment"
echo ""

# Farben
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Prüfe Voraussetzungen
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker ist nicht installiert${NC}"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ docker-compose ist nicht installiert${NC}"
    exit 1
fi

echo -e "${BLUE}📥 Downloading docker-compose.prod.yml...${NC}"
curl -o docker-compose.prod.yml https://raw.githubusercontent.com/JoKeks2023/dashboard/main/docker-compose.prod.yml

echo ""
echo -e "${BLUE}📥 Downloading update script...${NC}"
curl -o update.sh https://raw.githubusercontent.com/JoKeks2023/dashboard/main/update.sh
chmod +x update.sh

echo ""
echo -e "${YELLOW}🔧 Configuration${NC}"
echo "Das Dashboard benötigt Zugriff auf deine Services."
echo ""
echo -e "${YELLOW}Hinweis:${NC} Du musst die Service-URLs im Dashboard selbst konfigurieren."
echo "Nach dem Start öffne: http://localhost:3000"
echo ""

read -p "Deployment starten? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
fi

echo ""
echo -e "${YELLOW}📦 Pulling Docker images...${NC}"
docker-compose -f docker-compose.prod.yml pull

echo ""
echo -e "${YELLOW}🚀 Starting containers...${NC}"
docker-compose -f docker-compose.prod.yml up -d

echo ""
echo -e "${GREEN}✅ Deployment erfolgreich!${NC}"
echo ""
echo -e "${GREEN}Dashboard läuft auf: http://localhost:3000${NC}"
echo ""
echo "Nützliche Befehle:"
echo -e "  ${BLUE}Update:${NC}        ./update.sh"
echo -e "  ${BLUE}Logs:${NC}          docker-compose -f docker-compose.prod.yml logs -f"
echo -e "  ${BLUE}Status:${NC}        docker-compose -f docker-compose.prod.yml ps"
echo -e "  ${BLUE}Stop:${NC}          docker-compose -f docker-compose.prod.yml down"
echo -e "  ${BLUE}Restart:${NC}       docker-compose -f docker-compose.prod.yml restart"
