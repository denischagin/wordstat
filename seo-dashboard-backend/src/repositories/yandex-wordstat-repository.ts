import { yandexApi, yandexLoginApi } from "@/config/axios";
import {
  GetYandexDynamicsParams,
  GetYandexLoginInfo,
  GetYandexUserInfo,
} from "@/types/yandex";

export class YandexWordstatRepository {
  public async getUserInfo(token: string): Promise<GetYandexUserInfo> {
    const response = await yandexApi.post(
      "/userInfo",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  }

  public async getDynamics(params: GetYandexDynamicsParams, token: string) {
    const response = await yandexApi.post("/dynamics", params, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }

  public async getRegions(token: string) {
    const response = await yandexApi.post(
      "/getRegionsTree",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  }

  public async getLoginInfo(token: string): Promise<GetYandexLoginInfo> {
    console.log(token);
    const response = await yandexLoginApi.get("/info", {
      headers: {
        Authorization: `OAuth ${token}`,
      },
    });
    return response.data;
  }
}
