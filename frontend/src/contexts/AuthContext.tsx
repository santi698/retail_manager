import React from "react";
import { makeLoadableContext } from "./LoadableContext";
import { City } from "../model";
import { Route, Routes } from "react-router-dom";
import { LoginView } from "../views/LoginView";

const {
  Provider: CurrentUserProvider,
  useData: useCurrentUser,
} = makeLoadableContext<City[]>({
  fetchUrl: "http://192.168.1.104:5000/auth/me",
});

export { useCurrentUser };

export interface RequireAuthProps {
  children: React.ReactNode;
}

function RequireAuth({ children }: RequireAuthProps) {
  const user = useCurrentUser();

  if (user.state === "error") {
    window.location.href = "http://192.168.1.104:3000/login";
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
