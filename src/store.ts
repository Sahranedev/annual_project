import { create } from "zustand";

interface AppState {
  email: string;
  updateEmail: (email: string) => void;
  timer: number;
}

export const useAppStore = create<AppState>((set) => ({
  email: "toto@example.fr",
  timer: 0,
  updateEmail(email: string) {
    set({ email });
  },
}));

const globalupdateEmail = (email: string) => {
  useAppStore.setState({ email: email });
};
