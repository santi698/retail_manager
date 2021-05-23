import {
  Flex,
  Button,
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
  Table,
  VStack,
} from "@chakra-ui/react";
import { BsPlus } from "react-icons/bs";
import { Link } from "react-router-dom";
import { EditIcon } from "@chakra-ui/icons";
import { ViewTitle } from "../../common/components/ViewTitle";
import { Currency } from "../../common/components/Currency";
import { useProducts } from "../hooks/useProducts";

export function ProductsView() {
  const products = useProducts();
  return (
    <>
      <ViewTitle>Productos</ViewTitle>
      <VStack align="flex-start" spacing={6}>
        <Flex justifyContent="flex-end" width="100%">
          <Button
            as={Link}
            leftIcon={<BsPlus size="1.5em" />}
            to="/products/create"
          >
            Nuevo producto
          </Button>
        </Flex>
        <Table>
          <Thead>
            <Tr>
              <Th>Código</Th>
              <Th>Nombre</Th>
              <Th>Precio de lista</Th>
              <Th />
            </Tr>
          </Thead>
          <Tbody>
            {products.status === "success" &&
              products.data.map((product) => (
                <Tr key={product.product_code}>
                  <Td>{product.product_code}</Td>
                  <Td>{product.product_name}</Td>
                  <Td>
                    <Currency>{product.list_unit_price}</Currency>
                  </Td>
                  <Td>
                    <Button
                      as={Link}
                      leftIcon={<EditIcon />}
                      size="xs"
                      to={`/products/${product.product_code}/edit`}
                    >
                      Editar
                    </Button>
                  </Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </VStack>
    </>
  );
}
