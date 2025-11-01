import createFetchClient from "openapi-fetch";
import createClient from "openapi-react-query";
import env from "@/env";
import type { paths } from "../../../server/build/swagger.d.ts";

const fetchClient = createFetchClient<paths>({
  baseUrl: `${env.VITE_SERVER_URL}`,
  fetch: async (input: Request) => {
    if (window.Clerk?.session) {
      const token = await window.Clerk.session.getToken();
      input.headers.set("Authorization", `Bearer ${token}`);
      return fetch(input);
    }

    return fetch(input);
  },
});

const $api = createClient(fetchClient);

export default $api;
