import axios from "axios";

export const yandexApi = axios.create({
  baseURL: "https://api.wordstat.yandex.net/v1",
});

export const yandexLoginApi = axios.create({
  baseURL: "https://login.yandex.ru",
});
