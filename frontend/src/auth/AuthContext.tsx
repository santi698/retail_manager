import React from "react";
import { Route, Routes } from "react-router-dom";
import { LoginView } from "./LoginView";
import { APP_DOMAIN } from "../config";
import { useQuery } from "react-query";
import { getCurrentUser } from "./UserService";

export function useCurrentUser() {
  return useQuery("user", getCurrentUser, { retry: false });
}

export interface RequireAuthProps {
  children: React.ReactNode;
}

function RequireAuth({ children }: RequireAuthProps) {
  const user = useCurrentUser();

  if (user.status === "error") {
    window.location.href = `${APP_DOMAIN}/login`;
    return null;
  }

  if (user.status !== "success") return null;
  return <>{children}</>;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  return (
    <Routes>
      <Route path="/login" element={<LoginView />} />
      <Route path="*" element={<RequireAuth>{children}</RequireAuth>} />
    </Routes>
  );
}
