/** biome-ignore-all lint/style/useNamingConvention: Environment variables are in all caps */
import { z } from "zod";

// Define the schema as an object with all of the env
// variables and their types
const envSchema = z.object({
  VITE_CLERK_PUBLISHABLE_KEY: z.string(),
  VITE_MAPKIT_TOKEN: z.string().optional(),
  VITE_PUBLIC_POSTHOG_HOST: z.string().optional(),
  VITE_PUBLIC_POSTHOG_KEY: z.string().optional(),
  VITE_SERVER_URL: z.url(),
});

// Validate `process.env` against our schema
// and return the result
const parsed = envSchema.safeParse(import.meta.env);

if (!parsed.success) {
  throw new Error("Invalid environment variables");
}

const env = parsed.data;

// Export the result so we can use it in the project
export { env };
