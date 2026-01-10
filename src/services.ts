export type Service = {
  name: string;
  url: string;
  description?: string;
  icon?: string;
  iframe?: boolean;
  wsUrl?: string;
  apiType?: 'portainer' | 'homeassistant' | 'generic';
  apiToken?: string;
};

const env = import.meta.env;

export const services: Service[] = [
  {
    name: 'Portainer',
    url: env.VITE_PORTAINER_URL || 'http://localhost:9000',
    description: 'Docker Container Management',
    icon: '🐳',
    apiType: 'portainer',
    apiToken: env.VITE_PORTAINER_TOKEN
  },
  {
    name: 'Webmin',
    url: env.VITE_WEBMIN_URL || 'http://localhost:10000',
    description: 'Linux System Administration',
    icon: '🖥️',
    apiType: 'generic'
  },
  {
    name: 'Usermin',
    url: env.VITE_USERMIN_URL || 'http://localhost:20000',
    description: 'User Account Management',
    icon: '👤',
    apiType: 'generic'
  },
  {
    name: 'Cockpit',
    url: env.VITE_COCKPIT_URL || 'http://localhost:9090',
    description: 'Server Monitoring',
    icon: '📊',
    apiType: 'generic'
  },
  {
    name: 'Home Assistant',
    url: env.VITE_HOME_ASSISTANT_URL || 'http://localhost:8123',
    description: 'Smart Home Automation',
    icon: '🏠',
    apiType: 'homeassistant',
    apiToken: env.VITE_HOME_ASSISTANT_TOKEN
  }
];
