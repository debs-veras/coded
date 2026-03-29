import type { LoginPayload, LoginData } from "../types/auth";
import { getRequest, postRequest, type ApiResponse } from "../utils/axiosRequest";

export async function login(payload: LoginPayload): Promise<ApiResponse<LoginData>> {
  return postRequest<LoginData>("/auth/login", payload);
}

export async function validateToken(): Promise<ApiResponse<{ valid: boolean }>> {
  return getRequest("/auth/verify");
}

export async function logout(refresh: string): Promise<ApiResponse<null>> {
  return postRequest("/auth/logout", { refresh });
}