import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.ts";
import { ROUTES } from "./routes.tsx";

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * Protects dashboard (and other auth-required) routes.
 * Currently allows all; replace with real auth check when needed.
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  const { currentUser } = useAuth();
  const isAuthenticated = Boolean(currentUser?.email);

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.login} state={{ from: location }} replace />;
  }
  return <>{children}</>;
}
