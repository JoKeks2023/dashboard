#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';

const root = process.cwd();
const envPath = path.join(root, '.env.local');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function ask(question, defaultValue) {
  return new Promise((resolve) => {
    const prompt = defaultValue ? `${question} [${defaultValue}]: ` : `${question}: `;
    rl.question(prompt, (answer) => resolve(answer.trim() || defaultValue));
  });
}

async function main() {
  console.log('\n🏠 Homelab Service-Setup (schreibt .env.local)\n');
  console.log('Gebe die URLs deiner Services ein (oder drücke Enter für Defaults):\n');

  const portainerUrl = await ask('Portainer URL', 'http://localhost:9000');
  const webminUrl = await ask('Webmin URL', 'http://localhost:10000');
  const userminUrl = await ask('Usermin URL', 'http://localhost:20000');
  const cockpitUrl = await ask('Cockpit URL', 'http://localhost:9090');
  const homeAssistantUrl = await ask('Home Assistant URL', 'http://localhost:8123');

  console.log('\n🔑 Optional: API-Tokens (leer lassen wenn nicht benötigt)\n');
  
  const portainerToken = await ask('Portainer API Token', '');
  const haToken = await ask('Home Assistant Token', '');

  console.log('\n🔧 Backend-URLs (für WebSocket-Logs)\n');
  
  const backendUrl = await ask('Backend URL', 'http://localhost:3001');
  const backendWsUrl = await ask('Backend WebSocket URL', 'ws://localhost:3001/ws');

  rl.close();

  const envContent = `# Service-URLs
VITE_PORTAINER_URL=${portainerUrl}
VITE_WEBMIN_URL=${webminUrl}
VITE_USERMIN_URL=${userminUrl}
VITE_COCKPIT_URL=${cockpitUrl}
VITE_HOME_ASSISTANT_URL=${homeAssistantUrl}

# Optional: API Tokens
VITE_PORTAINER_TOKEN=${portainerToken}
VITE_HOME_ASSISTANT_TOKEN=${haToken}

# Backend
VITE_BACKEND_URL=${backendUrl}
VITE_BACKEND_WS_URL=${backendWsUrl}
`;

  fs.writeFileSync(envPath, envContent, 'utf-8');

  console.log('\n✅ Konfiguration gespeichert in .env.local');
  console.log('\n📝 Nächste Schritte:');
  console.log('  1. npm install          # Dependencies installieren');
  console.log('  2. npm start            # Frontend + Backend starten');
  console.log('  3. Browser: http://localhost:5173');
  console.log('\nHinweis: Baue neu, damit die Env-Werte greifen: npm run dev / npm run build');
}

main().catch((err) => {
  console.error('Fehler beim Setup:', err);
  process.exit(1);
});
