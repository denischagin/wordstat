import { PrismaClient } from "@/generated/prisma/client";

export class AuthRepository {
  constructor(private prismaClient: PrismaClient) {}

  public saveRefreshToken(userId: string, tokenHash: string, expiresAt: Date) {
    return this.prismaClient.refreshToken.create({
      data: { userId, token: tokenHash, expiresAt },
    });
  }

  public findRefreshToken(tokenHash: string) {
    return this.prismaClient.refreshToken.findUnique({ where: { token: tokenHash } });
  }

  public deleteRefreshToken(tokenHash: string) {
    return this.prismaClient.refreshToken.delete({ where: { token: tokenHash } });
  }

  public deleteAllUserRefreshTokens(userId: string) {
    return this.prismaClient.refreshToken.deleteMany({ where: { userId } });
  }

  public upsertUser(yandexId: string, username: string, yandexToken: string) {
    return this.prismaClient.user.upsert({
      where: { yandexId },
      update: { username, yandexToken },
      create: { yandexId, username, yandexToken },
    });
  }

  public async getUser(yandexId: string) {
    return this.prismaClient.user.findUnique({ where: { yandexId } });
  }
}
