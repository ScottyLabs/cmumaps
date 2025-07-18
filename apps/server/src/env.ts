import { z } from "zod";

// Define the schema as an object with all of the env
// variables and their types
const envSchema = z.object({
  AUTH_ISSUER: z.url(),
  AUTH_JWKS_URI: z.url(),
  SERVER_PORT: z.number().default(80),
});

// Validate `process.env` against our schema and return the result
const env = envSchema.parse(process.env);

// Export the result so we can use it in the project
export default env;
