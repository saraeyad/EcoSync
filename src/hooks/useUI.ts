import { useAppStore } from "./store.ts";

export function useUI() {
  const activeNav = useAppStore((s) => s.activeNav);
  const setActiveNav = useAppStore((s) => s.setActiveNav);
  const sidebarCollapsed = useAppStore((s) => s.sidebarCollapsed);
  const sidebarMobileOpen = useAppStore((s) => s.sidebarMobileOpen);
  const toggleSidebar = useAppStore((s) => s.toggleSidebar);
  const toggleMobileSidebar = useAppStore((s) => s.toggleMobileSidebar);
  const closeMobileSidebar = useAppStore((s) => s.closeMobileSidebar);
  return {
    activeNav,
    setActiveNav,
    sidebarCollapsed,
    sidebarMobileOpen,
    toggleSidebar,
    toggleMobileSidebar,
    closeMobileSidebar,
  };
}
