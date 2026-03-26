import jwt from "jsonwebtoken";

export const ACCESS_EXPIRES_IN = "15m";
export const REFRESH_EXPIRES_IN_MS = 7 * 24 * 60 * 60 * 1000;

export interface JwtPayload {
  yandexId: string;
}

function getAccessSecret(): string {
  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret) throw new Error("JWT_ACCESS_SECRET не задан в .env");
  return secret;
}

function getRefreshSecret(): string {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) throw new Error("JWT_REFRESH_SECRET не задан в .env");
  return secret;
}

export function signAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, getAccessSecret(), { expiresIn: ACCESS_EXPIRES_IN });
}

export function signRefreshToken(payload: JwtPayload): string {
  return jwt.sign(payload, getRefreshSecret(), { expiresIn: "7d" });
}

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, getAccessSecret()) as JwtPayload;
}

export function verifyRefreshToken(token: string): JwtPayload {
  return jwt.verify(token, getRefreshSecret()) as JwtPayload;
}
