import { WordstatHandler } from "@/handlers/wordstat-handler";
import { WordstatRepository } from "@/repositories/wordstat-repository";
import { WordstatService } from "@/services/wordstat-service";
import { AuthRepository } from "@/repositories/auth-repository";
import { AuthService } from "@/services/auth-service";
import { AuthHandler } from "@/handlers/auth-handler";
import express from "express";
import cors from "cors";
import { YandexWordstatRepository } from "@/repositories/yandex-wordstat-repository";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { errorHandlerMiddlware, notFoundMiddlware } from "@/middlware/errors";
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

dotenv.config();
const app = express();
const port = 3000;

const prismaClient = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});
app.use(cors());
app.use(cookieParser());
app.use(express.json());

const wordstatRepository = new WordstatRepository(prismaClient);
const authRepository = new AuthRepository(prismaClient);
const yandexWordstatRepository = new YandexWordstatRepository();

const wordstatService = new WordstatService(
  wordstatRepository,
  yandexWordstatRepository,
  authRepository,
);
const authService = new AuthService(authRepository, yandexWordstatRepository);

const wordstatHandler = new WordstatHandler(wordstatService);
const authHandler = new AuthHandler(authService);

app.use("/api/v1", wordstatHandler.router, authHandler.router);
app.use(errorHandlerMiddlware);
app.use(notFoundMiddlware);

app.listen(port, () => {
  console.log(`Seo Dashboard listening on port ${port}`);
});
