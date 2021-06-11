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
  HStack,
} from "@chakra-ui/react";
import { BsEyeFill, BsPlus } from "react-icons/bs";
import { Link } from "react-router-dom";
import { EditIcon } from "@chakra-ui/icons";
import { ViewTitle } from "../../common/components/ViewTitle";
import { Currency } from "../../common/components/Currency";
import { useProducts } from "../hooks/useProducts";
import { useMeasurementUnits } from "../hooks/useMeasurementUnits";
import { TableRowsSkeleton } from "../../common/components/TableRowsSkeleton";
import { MeasurementUnit, getDisplayName } from "../domain/MeasurementUnit";

export function ProductsView() {
  const products = useProducts();
  const measurementUnits = useMeasurementUnits();

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
              <Th>Unidad de medida</Th>
              <Th isNumeric>Precio de lista</Th>
              <Th isNumeric>Acciones</Th>
            </Tr>
          </Thead>
          <Tbody>
            {products.status === "success" &&
            measurementUnits.status === "success" ? (
              products.data.map((product) => (
                <Tr
                  _hover={{ background: "gray.50" }}
                  key={product.product_code}
                >
                  <Td>{product.product_code}</Td>
                  <Td>{product.product_name}</Td>
                  <Td>
                    {getDisplayName(
                      measurementUnits.data.find(
                        ({ id }) => id === product.measurement_unit_id
                      ) as MeasurementUnit
                    )}
                  </Td>
                  <Td isNumeric>
                    <Currency>{product.list_unit_price}</Currency>
                  </Td>
                  <Td isNumeric>
                    <HStack justify="flex-end">
                      <Button
                        as={Link}
                        leftIcon={<EditIcon />}
                        variant="ghost"
                        size="xs"
                        to={`/products/${product.product_code}/edit`}
                      >
                        Editar
                      </Button>
                      <Button
                        as={Link}
                        leftIcon={<BsEyeFill />}
                        size="xs"
                        to={`/products/${product.product_code}`}
                      >
                        Ver producto
                      </Button>
                    </HStack>
                  </Td>
                </Tr>
              ))
            ) : (
              <TableRowsSkeleton rows={3} columns={5} />
            )}
          </Tbody>
        </Table>
      </VStack>
    </>
  );
}
