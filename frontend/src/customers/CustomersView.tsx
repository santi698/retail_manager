import {
  Button,
  Flex,
  Box,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Table,
  VStack,
  HStack,
} from "@chakra-ui/react";
import { EditIcon, ViewIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import { BsPlus } from "react-icons/bs";
import { useCities } from "../cities/useCities";
import { ViewTitle } from "../common/components/ViewTitle";
import { TableRowsSkeleton } from "../common/components/TableRowsSkeleton";
import { useCustomers } from "./useCustomers";

export function CustomersView() {
  const customers = useCustomers();
  const cities = useCities();
  return (
    <>
      <ViewTitle>Clientes</ViewTitle>
      <VStack align="flex-start" spacing={6}>
        <Flex justify="space-between" width="100%">
          <Box />
          <Box>
            <Button
              as={Link}
              leftIcon={<BsPlus size="1.5em" />}
              to="/customers/create"
            >
              Nuevo cliente
            </Button>
          </Box>
        </Flex>
        <Table>
          <Thead>
            <Tr>
              <Th>Id</Th>
              <Th>Nombre</Th>
              <Th>Email</Th>
              <Th>Teléfono</Th>
              <Th>Ciudad</Th>
              <Th isNumeric>Acciones</Th>
            </Tr>
          </Thead>
          <Tbody>
            {customers.status === "success" && cities.status === "success" ? (
              customers.data.map((customer) => (
                <Tr
                  _hover={{ background: "gray.50" }}
                  key={customer.customer_id}
                >
                  <Td>{customer.customer_id}</Td>
                  <Td>{`${customer.first_name} ${customer.last_name}`}</Td>
                  <Td>{customer.email}</Td>
                  <Td>{customer.phone_number}</Td>
                  <Td>
                    {
                      cities.data.find(
                        (city) => city.id === customer.residence_city_id
                      )?.name
                    }
                  </Td>
                  <Td isNumeric>
                    <HStack justify="flex-end">
                      <Button
                        as={Link}
                        leftIcon={<EditIcon />}
                        variant="ghost"
                        size="xs"
                        to={`/customers/${customer.customer_id}/edit`}
                      >
                        Editar
                      </Button>
                      <Button
                        as={Link}
                        leftIcon={<ViewIcon />}
                        size="xs"
                        to={`/customers/${customer.customer_id}`}
                      >
                        Ver
                      </Button>
                    </HStack>
                  </Td>
                </Tr>
              ))
            ) : (
              <TableRowsSkeleton rows={3} columns={6} />
            )}
          </Tbody>
        </Table>
      </VStack>
    </>
  );
}
