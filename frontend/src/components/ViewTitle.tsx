import React from "react";
import { Heading } from "@chakra-ui/core";

export function ViewTitle({ children }: { children: React.ReactNode }) {
  return (
    <Heading as="h1" fontSize="4xl" fontWeight="bold" mb={4}>
      {children}
    </Heading>
  );
}
