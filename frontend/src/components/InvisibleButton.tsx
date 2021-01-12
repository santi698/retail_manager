import React from "react";
import { Button } from "@chakra-ui/react";

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
