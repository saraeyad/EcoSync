import { lazy } from "react";

export const ROUTES = {
  home: "/",
  login: "/login",
  register: "/register",
  dashboard: "/dashboard",
} as const;

// Lazy-loaded view components (used by AppRouter)
export const LandingPage = lazy(() =>
  import("../views/home/LandingPage.tsx").then((m) => ({ default: m.LandingPage })),
);
export const DashboardPage = lazy(() =>
  import("../views/dashboard/DashboardPage.tsx").then((m) => ({ default: m.DashboardPage })),
);
export const AuthPage = lazy(() =>
  import("../views/auth/AuthPage.tsx").then((m) => ({ default: m.AuthPage })),
);
export const NotFoundPage = lazy(() =>
  import("../views/error/NotFoundPage.tsx").then((m) => ({ default: m.NotFoundPage })),
);
