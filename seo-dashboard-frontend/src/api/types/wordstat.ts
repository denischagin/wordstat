export type GetWordstatResponse = {
  id: number;
  status: "PENDING" | "COMPLETED";
}[];

export type PostWordstatParams = {
  phrases: string[];
};

export type GetUserInfoResponse = {
  userInfo: {
    login: string;
    limitPerSecond: number;
    dailyLimit: number;
    dailyLimitRemaining: number;
  };
};
