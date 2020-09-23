import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Stack,
} from "@chakra-ui/core";
import React from "react";

export function LoginView() {
  return (
    <Flex
      bg="gray.100"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      width="100vw"
    >
      <Stack
        action="http://192.168.1.104:5000/auth/login"
        as="form"
        bg="white"
        method="post"
        padding="10"
        spacing="8"
        w="md"
      >
        <FormControl colorScheme="purple" id="email">
          <FormLabel>Dirección de Email</FormLabel>
          <Input type="email" name="email" />
        </FormControl>
        <FormControl colorScheme="purple" id="password">
          <FormLabel>Contraseña</FormLabel>
          <Input type="password" name="password" />
        </FormControl>
        <Button colorScheme="purple" type="submit">
          Iniciar sesión
        </Button>
      </Stack>
    </Flex>
  );
}
