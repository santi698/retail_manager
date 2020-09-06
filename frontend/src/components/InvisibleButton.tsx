import React from "react";
import { Button } from "@chakra-ui/core";

export function InvisibleButton({
  children,
  ...rest
}: typeof Button.arguments) {
  return (
    <Button {...rest} variant="ghost">
      {children}
    </Button>
  );
}
