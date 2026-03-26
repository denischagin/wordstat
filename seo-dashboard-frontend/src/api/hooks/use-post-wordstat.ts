import { wordstatService } from "@/api/services";
import type { PostWordstatParams } from "@/api/types/wordstat";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const usePostWordstat = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: PostWordstatParams) => {
      return wordstatService.sendTask(params);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["wordstat"] });
    },
  });
};
