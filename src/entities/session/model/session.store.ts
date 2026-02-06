import { create } from 'zustand';

interface SessionState {
  isAuthenticated: boolean;
  setAuthenticated: (value: boolean) => void;
}

export const useSessionStore = create<SessionState>(set => ({
  isAuthenticated: false,
  setAuthenticated: (value: boolean) => set({ isAuthenticated: value }),
}));
