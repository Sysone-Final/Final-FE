import client from "@api/client";
import type { LoginRequest, LoginResponse } from "../types/login";

interface LoginApiResponse {
  status_code: number;
  status_message: string;
  result: LoginResponse;
}

export const loginApi = async (data: LoginRequest): Promise<LoginResponse> => {
  console.log("Using client:", client.defaults.withCredentials);
  const response = await client.post<LoginApiResponse>("/auth/login", data);
  return response.data.result.result;
};
