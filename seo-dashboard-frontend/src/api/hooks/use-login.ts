import { authService } from "@/api/services/auth-service";
import { useAuthStore } from "@/store/auth-store";
import { useMutation } from "@tanstack/react-query";
import type { LoginParams } from "@/api/types/auth";

export const useLogin = () => {
  const setAccessToken = useAuthStore((s) => s.setAccessToken);

  return useMutation({
    mutationKey: ["auth-login"],
    mutationFn: (params: LoginParams) => authService.login(params),
    onSuccess: ({ accessToken }) => setAccessToken(accessToken),
  });
};
