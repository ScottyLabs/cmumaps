import type { Request as ExpressRequest } from "express";
import { Get, Request, Route } from "tsoa";

interface Response {
  loggedIn: boolean;
  user: {
    sub: string;
    groups: string[];
    email: string;
    name: string;
  } | null;
}

@Route("auth")
export class AuthController {
  @Get("/me")
  public getMe(@Request() req: ExpressRequest): Response {
    if (!req.user) {
      return { loggedIn: false, user: null };
    }

    return {
      loggedIn: true,
      user: {
        sub: req.user.sub,
        groups: req.user.groups ?? [],
        email: req.user.email ?? "Unknown",
        name: req.user.name ?? "Unknown",
      },
    };
  }
}
