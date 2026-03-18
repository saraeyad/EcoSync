import { Suspense, useEffect, useRef } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useAppStore } from "../hooks/store.ts";
import { Preloader } from "../layout/Preloader.tsx";
import { ProtectedRoute } from "./ProtectedRoute.tsx";
import {
  ROUTES,
  LandingPage,
  DashboardPage,
  AuthPage,
  NotFoundPage,
} from "./routes.tsx";

function AnimatedRoutes() {
  const location = useLocation();
  const loadedOnce = useRef(false);
  useEffect(() => {
    if (loadedOnce.current) return;
    loadedOnce.current = true;
    const { loadFactories, loadAlerts, loadCompliance } = useAppStore.getState();
    loadFactories();
    loadAlerts();
    loadCompliance();
  }, []);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path={ROUTES.home} element={<LandingPage />} />
        <Route path={ROUTES.login} element={<AuthPage />} />
        <Route path={ROUTES.register} element={<AuthPage />} />
        <Route
          path={ROUTES.dashboard}
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AnimatePresence>
  );
}

export function AppRouter() {
  return (
    <Suspense fallback={<Preloader />}>
      <AnimatedRoutes />
    </Suspense>
  );
}
