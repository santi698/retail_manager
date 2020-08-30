import React from "react";
import { Button, ButtonProps } from "@chakra-ui/core";

export function InvisibleButton({ children, ...rest }: ButtonProps) {
  return (
    <Button {...rest} variant="ghost">
      {children}
    </Button>
  );
}
