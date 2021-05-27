import { ReactNode } from "react";
import { BsBagFill, BsFillTagFill, BsFillPeopleFill } from "react-icons/bs";
import { NavLink, useLocation } from "react-router-dom";
import {
  Button,
  Center,
  HStack,
  List,
  ListItem,
  VStack,
} from "@chakra-ui/react";
import { Logo } from "./icons/Logo";

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
  return (
    <VStack
      spacing="3rem"
      py={6}
      bg="white"
      borderRight="1px solid var(--chakra-colors-brand-100)"
      position="relative"
    >
      <Center>
        <Logo size={64} />
      </Center>

      <List spacing={3}>
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
      </List>
    </VStack>
  );
}
