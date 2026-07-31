import * as Joi from 'joi';

const envValidationSchema = Joi.object({
  PORT: Joi.number().default(3000),
  DATABASE_URL: Joi.string()
    .uri({ scheme: ['postgresql', 'postgres'] })
    .required(),
  CORS_ORIGIN: Joi.string().required(),
  GITHUB_USERNAME: Joi.string().required(),
  GITHUB_TOKEN: Joi.string().allow('').optional(),
  GITHUB_CACHE_TTL_SECONDS: Joi.number().default(300),
  RESEND_API_KEY: Joi.string().required(),
  CONTACT_FROM_EMAIL: Joi.string().required(),
  CONTACT_NOTIFICATION_EMAIL: Joi.string().email().required(),
}).unknown(true);

export function validateEnv(
  config: Record<string, unknown>,
): Record<string, unknown> {
  const result: Joi.ValidationResult = envValidationSchema.validate(config, {
    abortEarly: false,
  });
  if (result.error) {
    throw new Error(`Environment validation failed: ${result.error.message}`);
  }
  return result.value as Record<string, unknown>;
}
