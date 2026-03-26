import { authService } from "@/api/services/auth-service";
import { useAuthStore } from "@/store/auth-store";
import { useQuery } from "@tanstack/react-query";

export const useInitAuth = () => {
  const setAccessToken = useAuthStore((s) => s.setAccessToken);

  return useQuery({
    queryKey: ["auth-init"],
    queryFn: async () => {
      const data = await authService.refresh();
      setAccessToken(data.accessToken);
      return data;
    },
    retry: false,
  });
};
