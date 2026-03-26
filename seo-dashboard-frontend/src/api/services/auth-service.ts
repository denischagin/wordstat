import { baseQuery } from "@/api/base-query";
import type { AuthResponse, LoginParams } from "@/api/types/auth";

class AuthService {
  async login(params: LoginParams): Promise<AuthResponse> {
    const response = await baseQuery.post("/login", params);
    return response.data;
  }

  async refresh(): Promise<AuthResponse> {
    const response = await baseQuery.post("/refresh");
    return response.data;
  }
}

export const authService = new AuthService();
