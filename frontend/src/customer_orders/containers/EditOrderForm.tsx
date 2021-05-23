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
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Table,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import { useCities } from "../../cities/useCities";
import { CustomerOrder } from "../CustomerOrder";
import { useCustomerOrder } from "../hooks/useCustomerOrder";
import { useCustomers } from "../../customers/useCustomers";
import { useCustomerOrderItems } from "../hooks/useCustomerOrderItems";
import {
  createCustomerOrderItem,
  CreateCustomerOrderItemRequest,
  deleteCustomerOrderItem,
} from "../services/CustomerOrdersService";
import { Currency } from "../../common/components/Currency";
import { useProducts } from "../../products/hooks/useProducts";
import { InvisibleButton } from "../../common/components/InvisibleButton";
import {
  CreateCustomerOrderItemForm,
  CustomerOrderItemValues,
} from "./CreateCustomerOrderItemForm";

export interface EditOrderRequest {
  customer_id: string;
  order_city_id: string;
  order_status: string;
  total_price: string;
  address: string;
}

function customerOrderToForm(order: CustomerOrder): EditOrderRequest {
  return {
    customer_id: order.customer_id.toString(),
    order_city_id: order.order_city_id.toString(),
    order_status: order.order_status.value,
    total_price: order.total_price.toString(),
    address: order.address || "",
  };
}

function createCustomerOrderItemRequestFromForm(
  form: CustomerOrderItemValues,
  customer_order_id: number
): CreateCustomerOrderItemRequest {
  return {
    customer_order_id,
    product_id: parseInt(form.product_id),
    quantity: form.quantity,
    selling_price: form.selling_price,
  };
}

export interface EditOrderFormProps {
  onSubmit: (values: EditOrderRequest) => void;
  customerOrderId: number;
}

export function EditOrderForm({
  customerOrderId,
  onSubmit,
}: EditOrderFormProps) {
  const cities = useCities();
  const customers = useCustomers();
  const order = useCustomerOrder(customerOrderId);
  const products = useProducts();
  const orderItems = useCustomerOrderItems(customerOrderId);
  const { isOpen, onOpen, onClose } = useDisclosure();
  if (
    cities.status !== "success" ||
    order.status !== "success" ||
    customers.status !== "success" ||
    products.status !== "success" ||
    orderItems.status !== "success"
  ) {
    return null;
  }
  const initialValues = customerOrderToForm(order.data);
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
        if (values.customer_id === "") {
          errors.customer_id = "Debe elegir un cliente";
        }

        if (parseInt(values.total_price) <= 0) {
          errors.total_price = "Debe agregar al menos un producto";
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
        isValid,
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
              id="customer_id"
              isDisabled={values.order_city_id === ""}
              isInvalid={
                errors.customer_id !== undefined && touched.customer_id === true
              }
              isRequired
            >
              <FormLabel>Cliente</FormLabel>
              <Select
                name="customer_id"
                placeholder="Selecciona el cliente"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.customer_id}
              >
                {values.order_city_id !== "" &&
                  customers.data
                    .filter(
                      (customer) =>
                        customer.residence_city_id ===
                        parseInt(values.order_city_id)
                    )
                    .map((customer) => (
                      <option
                        key={customer.customer_id}
                        value={customer.customer_id}
                      >
                        {customer.first_name} {customer.last_name}
                      </option>
                    ))}
              </Select>
              <FormErrorMessage>{errors.customer_id}</FormErrorMessage>
            </FormControl>
            <Table>
              <Thead>
                <Tr>
                  <Th>Producto</Th>
                  <Th>Cantidad</Th>
                  <Th>Precio de venta</Th>
                  <Th />
                </Tr>
              </Thead>
              <Tbody>
                {orderItems.data.map((item) => {
                  const product = products.data.find(
                    (product) => product.product_code === item.product_id
                  )!;
                  const removeLabel = `Eliminar ${product.product_name} del pedido`;
                  return (
                    <Tr key={product.product_code}>
                      <Td>{product.product_name}</Td>
                      <Td>{item.quantity}</Td>
                      <Td>
                        <Currency>{item.selling_price}</Currency>
                      </Td>
                      <Td>
                        <IconButton
                          aria-label={removeLabel}
                          colorScheme="red"
                          onClick={() => {
                            deleteCustomerOrderItem({
                              customer_order_id: item.customer_order_id,
                              customer_order_item_id:
                                item.customer_order_item_id,
                            }).then(() => orderItems.refetch());
                          }}
                          size="sm"
                          title={removeLabel}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Td>
                    </Tr>
                  );
                })}
                <Tr>
                  <Td>
                    <Text fontWeight="bold">Total</Text>
                  </Td>
                  <Td />
                  <Td>
                    <Text fontWeight="bold">
                      <Currency>
                        {orderItems.data.reduce(
                          (sum, item) => sum + item.selling_price,
                          0
                        ) || 0}
                      </Currency>
                    </Text>
                  </Td>
                  <Td />
                </Tr>
                <Tr>
                  <Td colSpan={3}>
                    <InvisibleButton onClick={onOpen} leftIcon={<AddIcon />}>
                      Agregar otro producto al pedido
                    </InvisibleButton>

                    <Modal isOpen={isOpen} onClose={onClose}>
                      <ModalOverlay>
                        <ModalContent>
                          <ModalHeader>Agregar producto al pedido</ModalHeader>
                          <ModalCloseButton />
                          <ModalBody>
                            <CreateCustomerOrderItemForm
                              onSubmit={(values) => {
                                createCustomerOrderItem(
                                  createCustomerOrderItemRequestFromForm(
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
                  </Td>
                </Tr>
              </Tbody>
            </Table>
            <Stack direction="row">
              <Button
                type="submit"
                isLoading={isSubmitting}
                isDisabled={!isValid}
                onClick={() => setFieldValue("order_status", "confirmed")}
              >
                Guardar y terminar pedido
              </Button>
              <Button
                type="submit"
                variant="ghost"
                isLoading={isSubmitting}
                isDisabled={!isValid}
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
