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
