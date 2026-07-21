interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_ANALYTICS_SCRIPT_URL?: string;
  readonly VITE_ANALYTICS_SITE_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
