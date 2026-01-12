/** biome-ignore-all lint/style/useNamingConvention: environment variables are in all caps */
import process from "node:process";
import { z } from "zod";

// Define the schema as an object with all of the env
// variables and their types
const envSchema = z.object({
  ALLOWED_ORIGINS_REGEX: z.string(),
  APP_ENV: z.enum(["development", "production"]),
  AUTH_CLIENT_ID: z.string(),
  AUTH_CLIENT_SECRET: z.string(),
  AUTH_SESSION_SECRET: z.string(),
  DATABASE_URL: z.string(),
  REDIS_URL: z.string(),
  SERVER_PORT: z.number().default(80),
  SERVER_URL: z.url(),
});

// Validate `process.env` against our schema and return the result
const env = envSchema.parse(process.env);

// Export the result so we can use it in the project
export { env };
