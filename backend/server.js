import express from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import os from 'os';

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

// System Metrics Endpoint
app.get('/api/metrics', (req, res) => {
  const cpus = os.cpus();
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;
  
  // Calculate CPU usage
  let totalIdle = 0;
  let totalTick = 0;
  
  cpus.forEach(cpu => {
    for (const type in cpu.times) {
      totalTick += cpu.times[type];
    }
    totalIdle += cpu.times.idle;
  });
  
  const idle = totalIdle / cpus.length;
  const total = totalTick / cpus.length;
  const usage = 100 - (100 * idle / total);
  
  res.json({
    cpu: {
      usage: Math.round(usage * 10) / 10,
      cores: cpus.length,
      model: cpus[0].model
    },
    memory: {
      total: totalMem,
      used: usedMem,
      free: freeMem,
      usagePercent: Math.round((usedMem / totalMem) * 100 * 10) / 10
    },
    uptime: os.uptime(),
    platform: os.platform(),
    hostname: os.hostname(),
    loadavg: os.loadavg()
  });
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
    try {
      const data = JSON.parse(message.toString());
      
      if (data.action === 'subscribe') {
        console.log(`Client subscribed to service: ${data.service}`);
        
        // Demo: Sende Mock-Logs alle 3 Sekunden
        const interval = setInterval(() => {
          if (ws.readyState === ws.OPEN) {
            const mockLog = {
              type: 'log',
              service: data.service,
              timestamp: new Date().toISOString(),
              message: `[${data.service}] Sample log message at ${new Date().toLocaleTimeString()}`,
              level: ['info', 'warn', 'error'][Math.floor(Math.random() * 3)]
            };
            ws.send(JSON.stringify(mockLog));
          } else {
            clearInterval(interval);
          }
        }, 3000);
        
        ws.on('close', () => {
          clearInterval(interval);
          console.log('Client disconnected');
        });
      }
    } catch (err) {
      console.error('Failed to parse WebSocket message:', err);
    }
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📡 WebSocket server running on ws://localhost:${PORT}/ws`);
});
