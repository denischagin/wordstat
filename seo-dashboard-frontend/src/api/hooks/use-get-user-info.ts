import { wordstatService } from "@/api/services";
import { useMutation } from "@tanstack/react-query";

export const useGetUserInfo = () => {
  return useMutation({
    mutationKey: ["user-info"],
    mutationFn: (token: string) => {
      return wordstatService.getUserInfo(token);
    },
  });
};
