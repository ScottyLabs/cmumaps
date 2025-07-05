import { z } from "zod";

// Define the schema as an object with all of the env
// variables and their types
const envSchema = z.object({
  VITE_SERVER_URL: z.string().url(),
  VITE_RUST_SERVER_URL: z.string().url(),
  VITE_CLERK_PUBLISHABLE_KEY: z.string(),
  VITE_MAPKIT_TOKEN: z.string().optional(),
  VITE_PUBLIC_POSTHOG_HOST: z.string().optional(),
  VITE_PUBLIC_POSTHOG_KEY: z.string().optional(),
});

// Validate `process.env` against our schema
// and return the result
const env = envSchema.parse(import.meta.env);

// Export the result so we can use it in the project
export default env;
