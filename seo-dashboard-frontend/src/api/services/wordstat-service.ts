import { baseQuery } from "@/api/base-query";
import type {
  GetUserInfoResponse,
  GetWordstatResponse,
  PostWordstatParams,
} from "@/api/types/wordstat";

class WordstatService {
  async sendTask(params: PostWordstatParams) {
    const response = await baseQuery.post("/tasks", { ...params });
    return response.data;
  }
  async getTasks(): Promise<GetWordstatResponse> {
    const response = await baseQuery.get("/tasks");
    return response.data;
  }

  async getUserInfo(token: string): Promise<GetUserInfoResponse> {
    const response = await baseQuery.get("/user-info", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }
}

export const wordstatService = new WordstatService();
