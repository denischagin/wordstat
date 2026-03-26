import { wordstatService } from "@/api/services";
import { useQuery } from "@tanstack/react-query";

export const useGetWordstat = () => {
  return useQuery({
    queryKey: ["wordstat"],
    queryFn: () => {
      return wordstatService.getTasks();
    },
    refetchInterval: (query) => {
      if (!query) return 2000;
      return query.state?.data?.status === "pending" ? 2000 : false;
    },
  });
};
