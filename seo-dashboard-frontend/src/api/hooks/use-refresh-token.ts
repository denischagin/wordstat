import { authService } from "@/api/services/auth-service";
import { useAuthStore } from "@/store/auth-store";
import { useMutation } from "@tanstack/react-query";

export const useRefreshToken = () => {
  const setAccessToken = useAuthStore((s) => s.setAccessToken);

  return useMutation({
    mutationKey: ["auth-refresh"],
    mutationFn: () => authService.refresh(),
    onSuccess: ({ accessToken }) => setAccessToken(accessToken),
  });
};
