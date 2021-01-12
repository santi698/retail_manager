import React from "react";
import { makeLoadableContext } from "./LoadableContext";
import { City } from "../model";
import { Route, Routes } from "react-router-dom";
import { LoginView } from "../views/LoginView";
import { API_URL, APP_DOMAIN } from "../config";

const {
  Provider: CurrentUserProvider,
  useData: useCurrentUser,
} = makeLoadableContext<City[]>({
  fetchUrl: `${API_URL}/auth/me`,
});

export { useCurrentUser };

export interface RequireAuthProps {
  children: React.ReactNode;
}

function RequireAuth({ children }: RequireAuthProps) {
  const user = useCurrentUser();

  if (user.state === "error") {
    window.location.href = `${APP_DOMAIN}/login`;
    return null;
  }

  if (!["loaded", "reloading"].includes(user.state)) return null;
  return <>{children}</>;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  return (
    <CurrentUserProvider>
      <Routes>
        <Route path="/login" element={<LoginView />} />
        <Route path="*" element={<RequireAuth>{children}</RequireAuth>} />
      </Routes>
    </CurrentUserProvider>
  );
}
