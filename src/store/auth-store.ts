import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthStore {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  isAuthenticated: boolean;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      accessToken: null,
      setAccessToken: (token) =>
        set({ accessToken: token, isAuthenticated: !!token }),
      isAuthenticated: false,
    }),
    {
      name: "github-auth",
    },
  ),
);
