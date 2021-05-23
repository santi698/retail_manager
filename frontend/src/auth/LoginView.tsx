import {
  Button,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Stack,
} from "@chakra-ui/react";
import { API_URL } from "../config";
import { Logo } from "../icons/Logo";

export function LoginView() {
  return (
    <Flex
      bg="brand.50"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      width="100vw"
    >
      <Stack
        action={`${API_URL}/auth/login`}
        as="form"
        bg="white"
        method="post"
        padding="10"
        spacing="8"
        w="md"
        boxShadow="sm"
      >
        <Center>
          <HStack>
            <Logo size={60} />
            <Heading as="h1" color="black" fontSize="3.5rem">
              Kauu
            </Heading>
          </HStack>
        </Center>
        <FormControl id="email">
          <FormLabel>Dirección de Email</FormLabel>
          <Input type="email" name="email" />
        </FormControl>
        <FormControl id="password">
          <FormLabel>Contraseña</FormLabel>
          <Input type="password" name="password" />
        </FormControl>
        <Button type="submit">Iniciar sesión</Button>
      </Stack>
    </Flex>
  );
}
