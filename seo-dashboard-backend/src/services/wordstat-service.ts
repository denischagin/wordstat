import { CustomError } from "@/middlware/errors";
import { AuthRepository } from "@/repositories/auth-repository";
import { WordstatRepository } from "@/repositories/wordstat-repository";
import { YandexWordstatRepository } from "@/repositories/yandex-wordstat-repository";
import { decrypt } from "@/utils/crypto";
import { sleep } from "@/utils/sleep";

export class WordstatService {
  constructor(
    private wordstatRepository: WordstatRepository,
    private yandexWordstatRepository: YandexWordstatRepository,
    private authRepository: AuthRepository,
  ) {}
  public async getUserTasks(yandexId: string) {
    return this.wordstatRepository.getTasks(yandexId);
  }
  public async processTask(phrases: string[], yandexId: string) {
    // if (this.wordstatRepository.checkActiveToken(tokens[0])) {
    //   throw new CustomError("Токен уже используется", 409);
    // }
    // if (this.wordstatRepository.get().status === "pending") {
    //   throw new CustomError("Предыдущая заявка еще не обработана", 409);
    // }
    // this.this.wordstatRepository.clearStatus();
    // this.wordstatRepository.clearData();
    // this.wordstatRepository.changeStatus("pending");

    const user = await this.authRepository.getUser(yandexId);
    if (!user?.yandexToken) {
      throw new CustomError("Не найден yandex токен", 404);
    }
    const token = decrypt(user?.yandexToken);

    const yandexLoginInfo =
      await this.yandexWordstatRepository.getLoginInfo(token);

    let quota;
    try {
      quota = await this.yandexWordstatRepository.getUserInfo(token);
    } catch {
      throw new CustomError("Неверный токен", 403);
    }

    const uniquePhrases = Array.from(new Set(phrases.filter(Boolean))).map(
      (phrase) => {
        if (phrase.startsWith('"') && phrase.endsWith('"')) {
          return phrase.slice(1, -1);
        }
        return phrase;
      },
    );
    const task = await this.wordstatRepository.createTask(
      yandexLoginInfo.id,
      uniquePhrases,
    );

    const countPhrasesByQuota = quota.userInfo.dailyLimitRemaining;
    const phrasesByQuota = uniquePhrases.slice(0, countPhrasesByQuota);
    const remainingPhrases = uniquePhrases.slice(countPhrasesByQuota);

    void this.generateDynamics(
      phrasesByQuota,
      token,
      quota.userInfo.limitPerSecond,
      task.id,
    );

    return {
      phrasesByQuota,
      remainingPhrases,
      taskid: task.id,
    };
  }

  private async generateDynamics(
    phrasesByQuota: string[],
    token: string,
    tokensPerSecond: number,
    taskId: number,
  ) {
    const batchSize = tokensPerSecond;

    let phrasesStack = [...phrasesByQuota];
    const MAX_RETRIES = 10;
    let retryAmount = 0;

    while (phrasesStack.length) {
      if (retryAmount >= MAX_RETRIES) {
        // this.wordstatRepository.changeStatus("many-retries");
        return;
      }

      let batch = phrasesStack.splice(0, batchSize);
      let phrase;

      try {
        while (batch.length) {
          phrase = batch.shift()!;

          const data = await this.yandexWordstatRepository.getDynamics(
            getDynamicsPayload(phrase),
            token,
          );
          const findedPhrase = await this.wordstatRepository.getPhrase(taskId, phrase);

          if (findedPhrase) {
            await this.wordstatRepository.addStatsForPhrase(
              findedPhrase.id,
              mapDynamicsResponse(data),
            );
          }
        }
      } catch {
        retryAmount++;
        phrasesStack = [
          ...(!!phrase ? [phrase] : []),
          ...batch,
          ...phrasesStack,
        ];
        break;
      }

      await sleep(1500);
    }

    this.wordstatRepository.changeTaskStatus(taskId, "COMPLETED");
  }

  public async getCsv(taskId: number, yandexId: string): Promise<string> {
    const wordstat = await this.wordstatRepository.getTaskById(taskId);

    console.log(yandexId, wordstat?.userId);

    if (!wordstat) {
      throw new CustomError("Задача не найдена", 404);
    }
    if (wordstat?.userId !== yandexId) {
      throw new CustomError("Недостаточно прав", 403);
    }

    const data = wordstat.phrases.reduce(
      (acc, phrase) => {
        return {
          ...acc,
          [phrase.title]: phrase.phaseStats.map((stat) => ({
            date: stat.date,
            count: stat.count,
          })),
        };
      },
      {} as { [key: string]: { date: string; count: number }[] },
    );
    return this.toCSV(data);
  }

  private toCSV(data: {
    [key: string]: {
      date: string;
      count: number;
    }[];
  }): string {
    const rows: string[] = [];

    if (Object.keys(data).length) {
      rows.push(
        [
          `key\\date`,
          ...data[Object.keys(data)[0]].map((item) => item.date),
        ].join(";"),
      );
    }
    for (const key in data) {
      rows.push([key, ...data[key].map((item) => item.count)].join(";"));
    }

    return rows.join("\n");
  }
}



const getDynamicsPayload = (phrase: string) => {
  const folderId = process.env.YANDEX_FOLDER_ID;

  if (!folderId) {
    throw new CustomError("Не задан YANDEX_FOLDER_ID", 500);
  }

  const from = new Date();
  from.setMonth(from.getMonth() - 12);

  return {
    phrase,
    period: "PERIOD_WEEKLY" as const,
    fromDate: from.toISOString(),
    toDate: new Date().toISOString(),
    devices: ["DEVICE_ALL"] as const,
    folderId,
  };
};

const mapDynamicsResponse = (data: unknown): { date: string; count: number }[] => {
  if (!data || typeof data !== "object") return [];
  const dynamicItems = (data as { dynamics?: unknown[]; data?: unknown[] }).dynamics
    ?? (data as { data?: unknown[] }).data
    ?? [];

  if (!Array.isArray(dynamicItems)) return [];

  return dynamicItems
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const row = item as Record<string, unknown>;

      const dateRaw = (row.date ?? row.fromDate ?? row.time ?? row.timestamp) as string | undefined;
      const countRaw = (row.count ?? row.value ?? row.searches) as number | string | undefined;

      if (!dateRaw || countRaw === undefined || countRaw === null) return null;

      const count = Number(countRaw);
      if (!Number.isFinite(count)) return null;

      return { date: dateRaw.slice(0, 10), count };
    })
    .filter((item): item is { date: string; count: number } => Boolean(item));
};
