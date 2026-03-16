import { useAppStore } from "./store.ts";

export function useUI() {
  return useAppStore((s) => ({
    activeNav: s.activeNav,
    setActiveNav: s.setActiveNav,
    sidebarCollapsed: s.sidebarCollapsed,
    sidebarMobileOpen: s.sidebarMobileOpen,
    toggleSidebar: s.toggleSidebar,
    toggleMobileSidebar: s.toggleMobileSidebar,
    closeMobileSidebar: s.closeMobileSidebar,
  }));
}
