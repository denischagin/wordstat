import { wordstatService } from "@/api/services";
import { useQuery } from "@tanstack/react-query";

export const useGetWordstat = () => {
  return useQuery({
    queryKey: ["wordstat"],
    queryFn: () => {
      return wordstatService.getTasks();
    },
    refetchInterval: (query) => {
      const tasks = query.state?.data;
      if (!tasks || tasks.some((task) => task.status === "PENDING")) {
        return 2000;
      }

      return false;
    },
  });
};
