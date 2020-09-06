import React from "react";
import { Container } from "@chakra-ui/core";

export function ViewContainer({ children }: React.PropsWithChildren<{}>) {
  return <Container maxW="lg">{children}</Container>;
}
