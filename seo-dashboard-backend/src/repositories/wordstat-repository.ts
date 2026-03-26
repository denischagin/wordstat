import { $Enums, PrismaClient } from "@/generated/prisma/client";

export class WordstatRepository {
  // public tempData: {
  //   data: {
  //     [key: string]: {
  //       date: string;
  //       count: number;
  //     }[];
  //   };
  //   status: "not-started" | "pending" | "success" | "error" | "many-retries";
  //   activeTokens: Set<string>;
  // } = {
  //   status: "not-started",
  //   data: {},
  //   activeTokens: new Set(),
  // };
  // public addData(
  //   key: string,
  //   data: {
  //     date: string;
  //     count: number;
  //   }[],
  // ) {
  //   this.tempData.data[key] = data;
  // }
  // public changeStatus(
  //   status: "pending" | "success" | "error" | "not-started" | "many-retries",
  // ) {
  //   this.tempData.status = status;
  // }
  // public clearStatus() {
  //   this.tempData.status === "not-started";
  // }
  // public clearData() {
  //   this.tempData.data = {};
  // }
  // public addActiveToken(token: string) {
  //   this.tempData.activeTokens.add(token);
  // }
  // public deleteActiveToken(token: string) {
  //   this.tempData.activeTokens.delete(token);
  // }
  // public checkActiveToken(token: string) {
  //   return this.tempData.activeTokens.has(token);
  // }
  // public get(): typeof this.tempData {
  //   return this.tempData;
  // }
  constructor(private prismaClient: PrismaClient) {}

  public async updateUser(yandexId: string, username: string) {
    return this.prismaClient.user.update({
      where: { yandexId },
      data: { username },
    });
  }

  public async createTask(
    userId: string,
    phrases: string[],
    status: $Enums.TaskStatus = "PENDING",
  ) {
    return this.prismaClient.task.create({
      data: {
        phrases: {
          create: phrases.map((phrase) => ({ title: phrase })),
        },
        user: { connect: { yandexId: userId } },
        status: status,
      },
    });
  }

  public async getPhrase(taskId: number, title: string) {
    return this.prismaClient.phrase.findUnique({
      where: { taskId_title: { taskId, title } },
    });
  }

  public async addStatsForPhrase(
    phraseId: number,
    data: { date: string; count: number }[],
  ) {
    return this.prismaClient.phrase.update({
      where: { id: phraseId },
      data: {
        phaseStats: {
          create: data.map((item) => ({ date: item.date, count: item.count })),
        },
      },
    });
  }

  public async getTasks(userId: string) {
    return this.prismaClient.task.findMany({
      where: { user: { yandexId: userId } },
    });
  }

  public async getTaskById(id: number) {
    return this.prismaClient.task.findUnique({
      where: { id },
      include: {
        phrases: {
          include: {
            phaseStats: true,
          },
        },
      },
    });
  }

  public async changeTaskStatus(id: number, status: $Enums.TaskStatus) {
    return this.prismaClient.task.update({
      where: { id },
      data: { status },
    });
  }

  // public async createPhraseStats(
  //   taskId: number,
  //   data: { date: string; count: number }[],
  // ) {
  //   return this.prismaClient.phraseStat.crea;
  // }
}
