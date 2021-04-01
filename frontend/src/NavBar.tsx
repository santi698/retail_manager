import React from "react";
import {
  BsFillBarChartFill,
  BsBagFill,
  BsFillTagFill,
  BsFillPeopleFill,
} from "react-icons/bs";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { IconButton } from "@chakra-ui/react";

const Wrapper = styled.ul`
  height: 100%;
  box-shadow: 0 0 16px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  list-style: none;
  padding: 16px 0;
  align-items: center;
  margin: 0;

  li {
    margin: 8px;
  }
`;

export function NavBar() {
  return (
    <Wrapper>
      <li>
        <NavLink to="/" end title="Vista General">
          <IconButton
            aria-label="Vista General"
            icon={<BsFillBarChartFill />}
            size="lg"
            variant="ghost"
            colorScheme="purple"
          />
        </NavLink>
      </li>
      <li>
        <NavLink to="/orders" title="Pedidos">
          <IconButton
            aria-label="Pedidos"
            icon={<BsBagFill />}
            size="lg"
            variant="ghost"
            colorScheme="purple"
          />
        </NavLink>
      </li>
      <li>
        <NavLink aria-label="Productos" to="/products" title="Productos">
          <IconButton
            aria-label="Productos"
            icon={<BsFillTagFill />}
            size="lg"
            variant="ghost"
            colorScheme="purple"
          />
        </NavLink>
      </li>
      <li>
        <NavLink to="/customers" title="Clientes">
          <IconButton
            aria-label="Clientes"
            icon={<BsFillPeopleFill />}
            size="lg"
            variant="ghost"
            colorScheme="purple"
          />
        </NavLink>
      </li>
    </Wrapper>
  );
}
