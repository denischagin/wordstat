import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "@/utils/jwt";
import { CustomError } from "@/middlware/errors";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return next(new CustomError("Токен не предоставлен", 401));

  try {
    const payload = verifyAccessToken(token);
    req.yandexId = payload.yandexId;
    next();
  } catch {
    next(new CustomError("Недействительный или истёкший токен", 401));
  }
}
