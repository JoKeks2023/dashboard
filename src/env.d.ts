/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PORTAINER_URL: string;
  readonly VITE_WEBMIN_URL: string;
  readonly VITE_USERMIN_URL: string;
  readonly VITE_COCKPIT_URL: string;
  readonly VITE_HOME_ASSISTANT_URL: string;
  readonly VITE_PORTAINER_TOKEN?: string;
  readonly VITE_HOME_ASSISTANT_TOKEN?: string;
  readonly VITE_BACKEND_URL?: string;
  readonly VITE_BACKEND_WS_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
