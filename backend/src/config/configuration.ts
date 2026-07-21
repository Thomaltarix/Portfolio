export interface AppConfig {
  readonly port: number;
  readonly databaseUrl: string;
  readonly corsOrigin: string;
  readonly github: {
    readonly username: string;
    readonly token: string | undefined;
    readonly cacheTtlSeconds: number;
  };
}

export default (): AppConfig => ({
  port: Number(process.env.PORT),
  databaseUrl: process.env.DATABASE_URL as string,
  corsOrigin: process.env.CORS_ORIGIN as string,
  github: {
    username: process.env.GITHUB_USERNAME as string,
    token: process.env.GITHUB_TOKEN || undefined,
    cacheTtlSeconds: Number(process.env.GITHUB_CACHE_TTL_SECONDS),
  },
});
