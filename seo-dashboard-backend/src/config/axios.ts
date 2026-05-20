import axios from "axios";

export const yandexApi = axios.create({
  baseURL: "https://searchapi.api.cloud.yandex.net/v2/wordstat",
});

export const yandexLoginApi = axios.create({
  baseURL: "https://login.yandex.ru",
});
