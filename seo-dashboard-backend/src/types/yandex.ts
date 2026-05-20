export type GetYandexDynamicsParams = {
  phrase: string;
  period: "PERIOD_DAILY" | "PERIOD_WEEKLY" | "PERIOD_MONTHLY";
  fromDate: string;
  toDate?: string;
  regions?: string[];
  devices?: ("DEVICE_ALL" | "DEVICE_DESKTOP" | "DEVICE_PHONE" | "DEVICE_TABLET")[];
  folderId: string;
};

export type GetYandexUserInfo = {
  userInfo: {
    login: string;
    limitPerSecond: number;
    dailyLimit: number;
    dailyLimitRemaining: number;
  };
};

export type GetYandexLoginInfo = {
  id: string;
  login: string;
  client_id: string;
  psuid: string;
};
