export interface AppConfig {
  readonly nodeEnv: string;
  readonly port: number;
  readonly databaseUrl: string;
  readonly corsOrigin: string;
  readonly github: {
    readonly username: string;
    readonly token: string | undefined;
    readonly cacheTtlSeconds: number;
  };
  readonly resendApiKey: string;
  readonly contactFromEmail: string;
  readonly contactNotificationEmail: string;
  readonly jwtSecret: string;
  readonly jwtExpiresInSeconds: number;
}

export default (): AppConfig => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT),
  databaseUrl: process.env.DATABASE_URL as string,
  corsOrigin: process.env.CORS_ORIGIN as string,
  github: {
    username: process.env.GITHUB_USERNAME as string,
    token: process.env.GITHUB_TOKEN || undefined,
    cacheTtlSeconds: Number(process.env.GITHUB_CACHE_TTL_SECONDS),
  },
  resendApiKey: process.env.RESEND_API_KEY as string,
  contactFromEmail: process.env.CONTACT_FROM_EMAIL as string,
  contactNotificationEmail: process.env.CONTACT_NOTIFICATION_EMAIL as string,
  jwtSecret: process.env.JWT_SECRET as string,
  jwtExpiresInSeconds: Number(process.env.JWT_EXPIRES_IN_SECONDS) || 7_200,
});
