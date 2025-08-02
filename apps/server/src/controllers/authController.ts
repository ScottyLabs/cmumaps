import type * as express from "express";
import { Get, Request, Route, Security } from "tsoa";
import env from "../env";

export interface UserInfoResponse {
  user: {
    id: string;
    email: string;
    name: string;
    groups: string[];
  } | null;
}

@Route("/auth")
export class AuthController {
  @Security("oauth2")
  @Get("/token")
  public async token(@Request() request: express.Request) {
    return { token: request.user?.token ?? null };
  }

  @Security("oauth2")
  @Get("/userInfo")
  public async userInfo(
    @Request() request: express.Request,
  ): Promise<UserInfoResponse> {
    if (env.NODE_ENV === "development") {
      return {
        user: {
          id: "dev",
          email: "dev@andrew.cmu.edu",
          name: "Dev",
          groups: [],
        },
      };
    }

    if (!request.user) return { user: null };

    const res = await fetch(env.AUTH_USER_INFO_URL, {
      headers: { Authorization: `Bearer ${request.user.token}` },
    });

    try {
      const data = await res.json();
      return {
        user: {
          id: data.sub as string,
          email: data.email as string,
          name: data.name as string,
          groups: data.groups as string[],
        },
      };
    } catch (error) {
      console.error("Error fetching user info", error);
      return { user: null };
    }
  }
}
