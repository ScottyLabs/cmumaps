/** biome-ignore-all lint/style/useNamingConvention: environment variables are in all caps */
import process from "node:process";
import { z } from "zod";

// Define the schema as an object with all of the env
// variables and their types
const envSchema = z.object({
  SERVER_PORT: z.number().default(80),
  CLERK_PUBLISHABLE_KEY: z.string(),
  CLERK_SECRET_KEY: z.string(),
  DATABASE_URL: z.string(),
  ALLOWED_ORIGINS_REGEX: z.string(),
  CLERK_MACHINE_SECRET: z.string(),
});

// Validate `process.env` against our schema and return the result
const env = envSchema.parse(process.env);

// Export the result so we can use it in the project
export { env };
