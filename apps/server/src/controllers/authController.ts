import type { Request as ExpressRequest } from "express";
import { Get, Request, Route } from "tsoa";

@Route("auth")
export class AuthController {
  @Get("/me")
  public getMe(@Request() req: ExpressRequest) {
    if (!req.user) {
      return { loggedIn: false };
    }
    return {
      loggedIn: true,
      sub: req.user?.sub,
      groups: req.user?.groups,
    };
  }
}
