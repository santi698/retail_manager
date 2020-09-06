import React, { ButtonHTMLAttributes } from "react";
import { Box } from "@chakra-ui/core";

export function CardButton({
  children,
  ...rest
}: React.PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>) {
  return (
    <Box
      {...rest}
      as="button"
      cursor="pointer"
      borderWidth="1px"
      borderRadius="md"
      boxShadow="md"
      borderColor="purple.400"
      background="purple.200"
      color="purple.800"
      _hover={{
        borderColor: "purple.900",
      }}
      _focus={{
        boxShadow: "outline",
      }}
      px={5}
      py={3}
    >
      {children}
    </Box>
  );
}
