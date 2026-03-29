import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { LoginData } from '../types/auth';

interface UserState {
  user: LoginData | null;
  isLoggedIn: boolean;
  setAuth: (user: LoginData) => void;
  clearAuth: () => void;
  updateUser: (user: Partial<LoginData>) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,

      setAuth: (user: LoginData) =>
        set({
          user,
          isLoggedIn: true,
        }),

      clearAuth: () =>
        set({
          user: null,
          isLoggedIn: false,
        }),

      updateUser: (userData: Partial<LoginData>) =>
        set((state: UserState) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
