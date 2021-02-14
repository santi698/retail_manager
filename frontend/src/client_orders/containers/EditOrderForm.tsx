import React from "react";
import { Formik } from "formik";
import {
  Stack,
  FormLabel,
  FormErrorMessage,
  Button,
  Select,
  FormControl,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  IconButton,
  Text,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import { useCities } from "../../cities/useCities";
import { ClientOrder } from "../../domain/ClientOrder";
import { useClientOrder } from "../hooks/useClientOrder";
import { useClients } from "../../clients/useClients";
import { Table } from "../../common/components/Table";
import { useClientOrderItems } from "../hooks/useClientOrderItems";
import {
  ClientOrderItemForm,
  CreateClientOrderItemForm,
} from "./CreateClientOrderItemForm";
import {
  createClientOrderItem,
  CreateClientOrderItemRequest,
  deleteClientOrderItem,
} from "../services/ClientOrdersService";
import { Currency } from "../../common/components/Currency";
import { useProducts } from "../../products/hooks/useProducts";

export interface EditOrderRequest {
  client_id: string;
  order_city_id: string;
  order_status: string;
  payment_status: string;
  total_price: string;
  address: string;
}

function clientOrderToForm(order: ClientOrder): EditOrderRequest {
  return {
    client_id: order.client_id.toString(),
    order_city_id: order.order_city_id.toString(),
    order_status: order.order_status,
    payment_status: order.payment_status,
    total_price: order.total_price.toString(),
    address: order.address || "",
  };
}

function createClientOrderItemRequestFromForm(
  form: ClientOrderItemForm,
  client_order_id: number
): CreateClientOrderItemRequest {
  return {
    client_order_id,
    product_id: parseInt(form.product_id),
    quantity: parseFloat(form.quantity),
    selling_price: parseFloat(form.selling_price),
  };
}

export interface EditOrderFormProps {
  onSubmit: (values: EditOrderRequest) => void;
  clientOrderId: number;
}

export function EditOrderForm({ clientOrderId, onSubmit }: EditOrderFormProps) {
  const cities = useCities();
  const clients = useClients();
  const order = useClientOrder(clientOrderId);
  const products = useProducts();
  const orderItems = useClientOrderItems(clientOrderId);
  const { isOpen, onOpen, onClose } = useDisclosure();
  if (
    cities.status !== "success" ||
    order.status !== "success" ||
    clients.status !== "success" ||
    products.status !== "success" ||
    orderItems.status !== "success"
  ) {
    return null;
  }
  const initialValues = clientOrderToForm(order.data);
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values, { setSubmitting }) => {
        onSubmit(values);
        setSubmitting(false);
      }}
      validate={(values) => {
        const errors: Record<string, string> = {};
        if (values.order_city_id === "") {
          errors.order_city_id = "Debe elegir una ciudad";
        }
        if (values.client_id === "") {
          errors.client_id = "Debe elegir un cliente";
        }
        return errors;
      }}
    >
      {({
        handleChange,
        handleBlur,
        values,
        handleSubmit,
        isSubmitting,
        errors,
        touched,
        setFieldValue,
      }) => (
        <form onSubmit={handleSubmit} noValidate>
          <Stack spacing="4">
            <FormControl
              id="order_city_id"
              isInvalid={
                errors.order_city_id !== undefined &&
                touched.order_city_id === true
              }
              isRequired
            >
              <FormLabel>Ciudad</FormLabel>
              <Select
                name="order_city_id"
                placeholder="Selecciona la ciudad del pedido"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.order_city_id}
              >
                {cities.data.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>{errors.order_city_id}</FormErrorMessage>
            </FormControl>
            <FormControl
              id="client_id"
              isDisabled={values.order_city_id === ""}
              isInvalid={
                errors.client_id !== undefined && touched.client_id === true
              }
              isRequired
            >
              <FormLabel>Cliente</FormLabel>
              <Select
                name="client_id"
                placeholder="Selecciona el cliente"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.client_id}
              >
                {values.order_city_id !== "" &&
                  clients.data
                    .filter(
                      (client) =>
                        client.residence_city_id ===
                        parseInt(values.order_city_id)
                    )
                    .map((client) => (
                      <option key={client.client_id} value={client.client_id}>
                        {client.first_name} {client.last_name}
                      </option>
                    ))}
              </Select>
              <FormErrorMessage>{errors.client_id}</FormErrorMessage>
            </FormControl>
            <Table>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio de venta</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {orderItems.data.map((item) => {
                  const product = products.data.find(
                    (product) => product.product_code === item.product_id
                  )!;
                  const removeLabel = `Eliminar ${product.product_name} del pedido`;
                  return (
                    <tr key={product.product_code}>
                      <td>{product.product_name}</td>
                      <td>{item.quantity}</td>
                      <td>
                        <Currency>{item.selling_price}</Currency>
                      </td>
                      <td>
                        <IconButton
                          aria-label={removeLabel}
                          colorScheme="red"
                          onClick={() => {
                            deleteClientOrderItem({
                              client_order_id: item.client_order_id,
                              client_order_item_id: item.client_order_item_id,
                            }).then(() => orderItems.refetch());
                          }}
                          size="sm"
                          title={removeLabel}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </td>
                    </tr>
                  );
                })}
                <tr>
                  <td>
                    <Text fontWeight="bold">Total</Text>
                  </td>
                  <td />
                  <td>
                    <Text fontWeight="bold">
                      <Currency>
                        {orderItems.data.reduce(
                          (sum, item) => sum + item.selling_price,
                          0
                        ) || 0}
                      </Currency>
                    </Text>
                  </td>
                  <td />
                </tr>
                <tr>
                  <td colSpan={3}>
                    <Button onClick={onOpen} leftIcon={<AddIcon />}>
                      Agregar otro producto al pedido
                    </Button>

                    <Modal isOpen={isOpen} onClose={onClose}>
                      <ModalOverlay>
                        <ModalContent>
                          <ModalHeader>Agregar producto al pedido</ModalHeader>
                          <ModalCloseButton />
                          <ModalBody>
                            <CreateClientOrderItemForm
                              onSubmit={(values) => {
                                createClientOrderItem(
                                  createClientOrderItemRequestFromForm(
                                    values,
                                    order.data.order_id
                                  )
                                ).then(() => {
                                  onClose();
                                  orderItems.refetch();
                                });
                              }}
                            />
                          </ModalBody>
                        </ModalContent>
                      </ModalOverlay>
                    </Modal>
                  </td>
                </tr>
              </tbody>
            </Table>
            <Stack direction="row">
              <Button
                type="submit"
                colorScheme="purple"
                isLoading={isSubmitting}
                onClick={() => setFieldValue("order_status", "confirmed")}
              >
                Guardar y terminar pedido
              </Button>
              <Button
                type="submit"
                colorScheme="purple"
                variant="ghost"
                isLoading={isSubmitting}
                onClick={() => setFieldValue("order_status", "confirmed")}
              >
                Guardar
              </Button>
            </Stack>
          </Stack>
        </form>
      )}
    </Formik>
  );
}
