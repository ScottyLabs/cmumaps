import type * as express from "express";
import { Get, Request, Route, Security } from "tsoa";

@Route("/auth")
export class AuthController {
  @Security("oauth2")
  @Get("/userInfo")
  public async userInfo(@Request() request: express.Request) {
    return request.user;
  }
}
