import React from "react";
import { useProducts } from "../contexts/ProductsContext";
import { Table } from "../components/Table";
import { Currency } from "../components/Currency";
import { ViewTitle } from "../components/ViewTitle";
import { ViewContainer } from "../components/ViewContainer";
import { Flex, Box, Button } from "@chakra-ui/react";
import { BsPlus } from "react-icons/bs";
import { InvisibleButton } from "../components/InvisibleButton";
import { Link } from "react-router-dom";
import { EditIcon } from "@chakra-ui/icons";

export function ProductsView() {
  const products = useProducts();
  return (
    <ViewContainer>
      <ViewTitle>Productos</ViewTitle>
      <Flex justifyContent="flex-end">
        <Box>
          <InvisibleButton
            as={Link}
            colorScheme="purple"
            leftIcon={<BsPlus size="1.5em" />}
            to="/products/create"
          >
            Nuevo producto
          </InvisibleButton>
        </Box>
      </Flex>
      <Table>
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Precio de lista</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {products.state === "loaded" &&
            products.data.map((product) => (
              <tr key={product.product_code}>
                <td />
                <td>{product.product_name}</td>
                <td>
                  <Currency>{product.list_unit_price}</Currency>
                </td>
                <td>
                  <Button
                    as={Link}
                    leftIcon={<EditIcon />}
                    size="xs"
                    to={`/products/${product.product_code}/edit`}
                  >
                    Editar
                  </Button>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
    </ViewContainer>
  );
}
