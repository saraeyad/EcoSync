import { useAppStore } from "./store.ts";

export function useAuth() {
  return useAppStore((s) => ({
    currentUser: s.currentUser,
    setCurrentUser: s.setCurrentUser,
  }));
}
