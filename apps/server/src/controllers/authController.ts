import type * as express from "express";
import { Get, Request, Route, Security } from "tsoa";

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
    if (!request.user) {
      return { user: null };
    }

    return fetch("https://auth.slabs-dev.org/application/o/userinfo/", {
      headers: {
        Authorization: `Bearer ${request.user?.token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        return {
          user: {
            id: data.sub as string,
            email: data.email as string,
            name: data.name as string,
          },
        };
      });
  }
}
