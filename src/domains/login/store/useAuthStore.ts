import { create } from "zustand";
import type { LoginResponse } from "../types/login";

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
    set({
      accessToken,
      user,
      authenticated: true,
    });
  },

  logout: () => {
    set({
      accessToken: null,
      user: null,
      authenticated: false,
    });
  },
}));
