import React from "react";
import {
  BsFillBarChartFill,
  BsBagFill,
  BsFillTagFill,
  BsFillPeopleFill,
} from "react-icons/bs";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

const Wrapper = styled.ul`
  height: 100%;
  box-shadow: 0 0 16px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  list-style: none;
  a {
    color: #787878;
  }
  a.active {
    color: #6a64d9;
  }
  padding: 16px 0;
  font-size: 20px;
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
        <NavLink aria-label="Vista General" to="/" title="Vista General" end>
          <BsFillBarChartFill />
        </NavLink>
      </li>
      <li>
        <NavLink aria-label="Pedidos" to="/orders" title="Pedidos">
          <BsBagFill />
        </NavLink>
      </li>
      <li>
        <NavLink aria-label="Productos" to="/products" title="Productos">
          <BsFillTagFill />
        </NavLink>
      </li>
      <li>
        <NavLink aria-label="Clientes" to="/clients" title="Clientes">
          <BsFillPeopleFill />
        </NavLink>
      </li>
    </Wrapper>
  );
}
