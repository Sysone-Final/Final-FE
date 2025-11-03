import { create } from "zustand";
import type { LoginResponse } from "../types/login";
import { setAccessToken } from "@api/client";

type User = Omit<LoginResponse, "accessToken">;

interface AuthStore {
  accessToken: string | null;
  user: User | null;
  authenticated: boolean;
  login: (response: LoginResponse) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  accessToken: null,
  user: null,
  authenticated: false,

  login: (response) => {
    const { accessToken, ...user } = response;
    // 메모리에 Access Token 저장 (client.ts)
    setAccessToken(accessToken);
    set({
      accessToken,
      user,
      authenticated: true,
    });
  },

  logout: () => {
    // 메모리에서 Access Token 제거
    setAccessToken(null);
    set({
      accessToken: null,
      user: null,
      authenticated: false,
    });
  },
}));
