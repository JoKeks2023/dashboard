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
      headers,
      body: body ? JSON.stringify(body) : undefined
    });
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ 
      error: 'Proxy request failed', 
      message: error.message 
    });
  }
});

// System Metrics Endpoint - REMOVED
// Metrics should come directly from remote services (Cockpit, Portainer, etc.)
// This backend is only for CORS proxy and WebSocket if needed

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
    try {
      const data = JSON.parse(message.toString());
      
      if (data.action === 'subscribe') {
        console.log(`Client subscribed to service: ${data.service}`);
        
        // WebSocket connection established
        // Real logs would come from Docker API, Portainer, or systemd
        // For now, just keep connection open for future implementation
        
        ws.send(JSON.stringify({
          type: 'status',
          service: data.service,
          message: 'Connected - waiting for real log stream',
          timestamp: new Date().toISOString()
        }));
      }
    } catch (err) {
      console.error('Failed to parse WebSocket message:', err);
    }
  });
  
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📡 WebSocket server running on ws://localhost:${PORT}/ws`);
});
