import { ReactNode } from "react";
import {
  BsBagFill,
  BsFillTagFill,
  BsFillPeopleFill,
  BsBoxArrowLeft,
} from "react-icons/bs";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Button,
  Center,
  Flex,
  HStack,
  List,
  ListItem,
  VStack,
} from "@chakra-ui/react";
import { SettingsIcon } from "@chakra-ui/icons";
import { Logo } from "./icons/Logo";
import { logOut } from "./auth/AuthService";

const NavBarItem = ({ children, to }: { children: ReactNode; to: string }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Button
      as={NavLink}
      variant={isActive ? "solid" : "ghost"}
      activeClassName="active"
      width="100%"
      to={to}
    >
      {children}
    </Button>
  );
};

export function NavBar() {
  const navigate = useNavigate();
  return (
    <Flex py={6} direction="column" justifyContent="space-between">
      <VStack
        spacing="3rem"
        bg="white"
        borderRight="1px solid var(--chakra-colors-brand-100)"
        position="relative"
      >
        <Center>
          <Logo size={64} />
        </Center>

        <List spacing={3} width="100%" px={4}>
          <ListItem>
            <NavBarItem to="/orders">
              <HStack justify="flex-start" width="100%">
                <BsBagFill />
                <div>Pedidos</div>
              </HStack>
            </NavBarItem>
          </ListItem>
          <ListItem>
            <NavBarItem to="/products">
              <HStack justify="flex-start" width="100%">
                <BsFillTagFill />
                <div>Productos</div>
              </HStack>
            </NavBarItem>
          </ListItem>
          <ListItem>
            <NavBarItem to="/customers">
              <HStack justify="flex-start" width="100%">
                <BsFillPeopleFill />
                <div>Clientes</div>
              </HStack>
            </NavBarItem>
          </ListItem>
          <ListItem>
            <NavBarItem to="/settings">
              <HStack justify="flex-start" width="100%">
                <SettingsIcon />
                <div>Configuración</div>
              </HStack>
            </NavBarItem>
          </ListItem>
        </List>
      </VStack>
      <List spacing={1} width="100%" px={4}>
        <ListItem>
          <Button
            onClick={() => {
              logOut().then(() => navigate("/login"));
            }}
            variant="ghost"
            width="100%"
          >
            <HStack justify="flex-start" width="100%">
              <BsBoxArrowLeft />
              <div>Cerrar sesión</div>
            </HStack>
          </Button>
        </ListItem>
      </List>
    </Flex>
  );
}
