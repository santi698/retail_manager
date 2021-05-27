import React from "react";
import { Route, Routes } from "react-router-dom";
import { useQuery } from "react-query";
import { Spinner } from "@chakra-ui/spinner";
import { Center } from "@chakra-ui/layout";
import { APP_DOMAIN } from "../config";
import { LoginView } from "./LoginView";
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

  if (user.status !== "success")
    return (
      <Center h="100vh" w="100vw">
        <Spinner color="brand.500" size="xl" />
      </Center>
    );
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
