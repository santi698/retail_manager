import { Link } from "react-router-dom";
import { BsEyeFill } from "react-icons/bs";
import {
  Box,
  Button,
  Center,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Table,
  Tbody,
  Td,
  Th,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";
import { Currency } from "../../common/components/Currency";
import { Customer } from "../../domain/Customer";
import { CustomerOrder } from "../CustomerOrder";
import { StatusBadge } from "../../common/components/StatusBadge";
import { DateTime } from "../../common/components/DateTime";
import { useCustomerOrderItems } from "../hooks/useCustomerOrderItems";
import { useCity } from "../../cities/useCity";
import { OrderStatus } from "../OrderStatus";
import { OrderItemsTable } from "./OrderItemsTable";

export function OrderRow({
  order,
  customer,
  onChange,
}: {
  order: CustomerOrder;
  customer: Customer;
  onChange: (order: CustomerOrder) => void;
}) {
  const city = useCity(order.order_city_id);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const loadingItems = useCustomerOrderItems(order.order_id);

  return (
    <>
      <Tr _hover={{ background: "gray.50" }}>
        <Td>{order.order_id}</Td>
        <Td style={{ width: "10em" }}>
          {city.status === "success" && city.data.name}
        </Td>
        <Td>
          {order.ordered_at && (
            <DateTime>{new Date(order.ordered_at)}</DateTime>
          )}
        </Td>
        <Td>
          {customer && (
            <>
              {customer.first_name} {customer.last_name}
            </>
          )}
        </Td>
        <Td>
          <StatusBadge
            onChange={(e) => {
              onChange({
                ...order,
                order_status: OrderStatus.from(e.currentTarget.value),
              });
            }}
            value={order.order_status}
          />
        </Td>
        <Td className="currency">{<Currency>{order.total_price}</Currency>}</Td>
        <Td>
          <Stack direction="row" justify="flex-end">
            {order.order_status.isEditable() && (
              <Button
                as={Link}
                leftIcon={<EditIcon />}
                size="xs"
                variant="ghost"
                to={`/orders/${order.order_id}/edit`}
              >
                Editar
              </Button>
            )}
            <Button leftIcon={<BsEyeFill />} onClick={onOpen} size="xs">
              Ver pedido
            </Button>
          </Stack>
        </Td>
      </Tr>
      {loadingItems.status === "success" && (
        <Modal isOpen={isOpen} onClose={onClose} size="6xl">
          <ModalOverlay />
          <ModalContent padding={4}>
            <ModalHeader>Pedido #{order.order_id}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Box w="30rem">
                <Table size="sm" variant="unstyled">
                  <Tbody>
                    <Tr>
                      <Th>Id:</Th>
                      <Td>{order.order_id}</Td>
                    </Tr>
                    <Tr>
                      <Th>Cliente:</Th>
                      <Td>
                        {" "}
                        {customer.first_name} {customer.last_name}
                      </Td>
                    </Tr>
                    <Tr>
                      <Th>Ciudad:</Th>
                      <Td> {city.data?.name}</Td>
                    </Tr>
                    <Tr>
                      <Th>Fecha del pedido:</Th>
                      <Td>
                        <DateTime>{new Date(order.ordered_at)}</DateTime>
                      </Td>
                    </Tr>
                    <Tr>
                      <Th>Estado del pedido:</Th>
                      <Td>
                        <StatusBadge
                          onChange={(e) => {
                            onChange({
                              ...order,
                              order_status: OrderStatus.from(
                                e.currentTarget.value
                              ),
                            });
                          }}
                          value={order.order_status}
                        />
                      </Td>
                    </Tr>
                  </Tbody>
                </Table>
              </Box>
              <Center>
                <OrderItemsTable items={loadingItems.data} />
              </Center>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </>
  );
}
