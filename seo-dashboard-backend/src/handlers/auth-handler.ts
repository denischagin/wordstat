import express, { Router } from "express";
import z from "zod";
import { AuthService } from "@/services/auth-service";
import { asyncHandler, CustomError } from "@/middlware/errors";
import { validateBody } from "@/validation/validate-body-middlware";

const yandexTokenSchema = z.object({
  yandexToken: z.string(),
});

const REFRESH_COOKIE = "refreshToken";
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export class AuthHandler {
  public router: Router = express.Router();

  constructor(private authService: AuthService) {
    this.router.post(
      "/login/yandex",
      validateBody(yandexTokenSchema),
      asyncHandler(async (req, res) => {
        const tokens = await this.authService.loginWithYandex(
          req.body.yandexToken,
        );
        res.cookie(REFRESH_COOKIE, tokens.refreshToken, COOKIE_OPTIONS);
        res.json({ accessToken: tokens.accessToken });
      }),
    );

    this.router.post(
      "/refresh",
      asyncHandler(async (req, res) => {
        const refreshToken = req.cookies?.[REFRESH_COOKIE];
        console.log(refreshToken);
        if (!refreshToken)
          throw new CustomError("Refresh токен не найден", 401);

        const tokens = await this.authService.refresh(refreshToken);
        res.cookie(REFRESH_COOKIE, tokens.refreshToken, COOKIE_OPTIONS);
        res.json({ accessToken: tokens.accessToken });
      }),
    );

    this.router.post(
      "/logout",
      asyncHandler(async (req, res) => {
        const refreshToken = req.cookies?.[REFRESH_COOKIE];
        if (refreshToken) await this.authService.logout(refreshToken);
        res.clearCookie(REFRESH_COOKIE);
        res.json({ ok: true });
      }),
    );
  }
}
