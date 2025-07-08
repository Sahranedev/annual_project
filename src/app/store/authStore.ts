import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserProfile, UserAddress } from "@/types/user";

interface AuthState {
  token: string | null;
  user: UserProfile | null;
  isAuthenticated: boolean;
  setToken: (token: string) => void;
  setUser: (user: UserProfile) => void;
  updateUserProfile: (profileData: Partial<UserProfile>) => void;
  addAddress: (address: UserAddress) => void;
  updateAddress: (id: number, address: Partial<UserAddress>) => void;
  removeAddress: (id: number) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      setToken: (token) => set({ token, isAuthenticated: !!token }),
      setUser: (user) => set({ user }),
      updateUserProfile: (profileData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...profileData } : null,
        })),
      addAddress: (address) =>
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                addresses: [...(state.user.addresses || []), address],
              }
            : null,
        })),
      updateAddress: (id, addressData) =>
        set((state) => {
          if (!state.user) return { user: null };
          return {
            user: {
              ...state.user,
              addresses: state.user.addresses.map((addr) =>
                addr.id === id ? { ...addr, ...addressData } : addr
              ),
            },
          };
        }),
      removeAddress: (id) =>
        set((state) => {
          if (!state.user) return { user: null };
          return {
            user: {
              ...state.user,
              addresses: state.user.addresses.filter((addr) => addr.id !== id),
            },
          };
        }),
      logout: () => set({ token: null, user: null, isAuthenticated: false }),
    }),
    {
      name: "auth-storage",
    }
  )
);
