import client from "@api/client";
import type { LoginRequest, LoginResponse } from "../types/login";

export const loginApi = async (data: LoginRequest): Promise<LoginResponse> => {
  console.log("Using client:", client.defaults.withCredentials);
  const response = await client.post("/auth/login", data);
  return response.data.result;
};
