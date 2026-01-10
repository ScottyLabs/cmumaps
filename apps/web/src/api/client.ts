import createFetchClient from "openapi-fetch";
import createClient from "openapi-react-query";
import { env } from "@/env.ts";
import type { paths } from "../../../server/build/swagger.d.ts";

const fetchClient = createFetchClient<paths>({
  baseUrl: `${env.VITE_SERVER_URL}`,
  credentials: "include",
});

const $api = createClient(fetchClient);

export { $api };
