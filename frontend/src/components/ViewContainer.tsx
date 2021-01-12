import React from "react";
import { Container } from "@chakra-ui/react";

export function ViewContainer({ children }: React.PropsWithChildren<{}>) {
  return <Container maxW="lg">{children}</Container>;
}
