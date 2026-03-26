export type GetYandexDynamicsParams = {
  phrase: string;
  period: string;
  fromDate: string;
  toDate?: string;
  regions?: string;
  devices?: string;
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
