import { useAppStore } from "./store.ts";

export function useAuth() {
  const currentUser = useAppStore((s) => s.currentUser);
  const setCurrentUser = useAppStore((s) => s.setCurrentUser);
  return { currentUser, setCurrentUser };
}
