import { AuthRepository } from "@/repositories/auth-repository";
import { YandexWordstatRepository } from "@/repositories/yandex-wordstat-repository";
import { encrypt, decrypt, hashToken } from "@/utils/crypto";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  REFRESH_EXPIRES_IN_MS,
} from "@/utils/jwt";
import { CustomError } from "@/middlware/errors";

export class AuthService {
  constructor(
    private authRepository: AuthRepository,
    private yandexRepository: YandexWordstatRepository,
  ) {}

  public async loginWithYandex(yandexToken: string) {
    let loginInfo;
    try {
      loginInfo = await this.yandexRepository.getLoginInfo(yandexToken);
    } catch {
      throw new CustomError("Неверный Yandex токен", 403);
    }

    const encryptedToken = encrypt(yandexToken);
    await this.authRepository.upsertUser(loginInfo.id, loginInfo.login, encryptedToken);

    return this.issueTokenPair(loginInfo.id);
  }

  public async refresh(refreshToken: string) {
    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      throw new CustomError("Недействительный refresh токен", 401);
    }

    const tokenHash = hashToken(refreshToken);
    const stored = await this.authRepository.findRefreshToken(tokenHash);
    if (!stored || stored.expiresAt < new Date()) {
      throw new CustomError("Refresh токен истёк или не найден", 401);
    }

    await this.authRepository.deleteRefreshToken(tokenHash);
    return this.issueTokenPair(payload.yandexId);
  }

  public async logout(refreshToken: string) {
    await this.authRepository.deleteRefreshToken(hashToken(refreshToken)).catch(() => {});
  }

  public getDecryptedYandexToken(encryptedToken: string): string {
    return decrypt(encryptedToken);
  }

  private async issueTokenPair(yandexId: string) {
    const accessToken = signAccessToken({ yandexId });
    const refreshToken = signRefreshToken({ yandexId });
    const expiresAt = new Date(Date.now() + REFRESH_EXPIRES_IN_MS);

    await this.authRepository.saveRefreshToken(yandexId, hashToken(refreshToken), expiresAt);

    return { accessToken, refreshToken };
  }
}
