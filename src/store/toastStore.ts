import { create } from 'zustand';

type ToastState = {
  message: string | null;
  setMessage: (msg: string) => void;
  clearMessage: () => void;
};

export const useToastStore = create<ToastState>((set) => ({
  message: null,
  setMessage: (msg) => set({ message: msg }),
  clearMessage: () => set({ message: null }),
}));