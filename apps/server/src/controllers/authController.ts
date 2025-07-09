import type * as express from "express";
import { Get, Request, Route, Security } from "tsoa";

@Route("/auth")
export class AuthController {
  @Security("oauth2")
  @Get("/userInfo")
  public async userInfo(@Request() request: express.Request) {
    return fetch("https://auth.slabs-dev.org/application/o/userinfo/", {
      headers: {
        Authorization: `Bearer ${request.user?.token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        return {
          id: data.sub as string,
          email: data.email as string,
          name: data.name as string,
        };
      });
  }
}
