import type { paths } from "@cmumaps/server/build/swagger.d.ts";
import createFetchClient from "openapi-fetch";
import createClient from "openapi-react-query";
import env from "@/env";

const fetchClient = createFetchClient<paths>({
  baseUrl: `${env.VITE_SERVER_URL}/`,
});

const $api = createClient(fetchClient);

export default $api;
