import type * as express from "express";
import { Get, Request, Route, Security } from "tsoa";
import env from "@/env";

export interface UserInfoResponse {
  user: {
    id: string;
    email: string;
    name: string;
  } | null;
}

@Route("/auth")
export class AuthController {
  @Security("oauth2")
  @Get("/userInfo")
  public async userInfo(
    @Request() request: express.Request,
  ): Promise<UserInfoResponse> {
    if (!request.user) return { user: null };

    const res = await fetch(env.AUTH_USER_INFO_URL, {
      headers: { Authorization: `Bearer ${request.user?.token}` },
    });
    const data = await res.json();
    return {
      user: {
        id: data.sub as string,
        email: data.email as string,
        name: data.name as string,
      },
    };
  }
}
