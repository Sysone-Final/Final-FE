import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { LoginResponse } from "../types/login";
import { setAccessToken } from "@api/client";
import { refreshTokenApi } from "../api/refreshApi";

type User = Omit<LoginResponse, "accessToken">;

interface AuthStore {
  accessToken: string | null;
  user: User | null;
  authenticated: boolean;
  login: (response: LoginResponse) => void;
  logout: () => void;
  restoreAuth: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
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

      restoreAuth: async () => {
        const state = get();
        // localStorage에 인증 상태가 있으면 refresh token으로 새 access token 발급
        if (state.authenticated && state.user) {
          try {
            const newAccessToken = await refreshTokenApi();
            setAccessToken(newAccessToken);
            set({ accessToken: newAccessToken });
          } catch (error) {
            console.error("Failed to restore auth:", error);
            // refresh token도 만료된 경우 로그아웃
            set({
              accessToken: null,
              user: null,
              authenticated: false,
            });
          }
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        // 보안을 위해 토큰은 localStorage에 저장하지 않음
        // accessToken: state.accessToken,
        user: state.user,
        authenticated: state.authenticated,
      }),
    }
  )
);
