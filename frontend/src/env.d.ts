interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_ANALYTICS_SCRIPT_URL?: string;
  readonly VITE_ANALYTICS_SITE_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Set by public/config.js, loaded before the app bundle — see api-client.ts.
interface Window {
  __APP_CONFIG__?: {
    readonly apiBaseUrl?: string;
  };
}
