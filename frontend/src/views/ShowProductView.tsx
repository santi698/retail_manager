import React from "react";
import { ViewContainer } from "../components/ViewContainer";
import { Link, useMatch } from "react-router-dom";
import { Box, Button, Heading, Stack, Text } from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";
import { useProduct } from "../contexts/ProductsContext";
import { useMeasurementUnits } from "../contexts/MeasurementUnitsContext";

export function ShowProductView() {
  const match = useMatch("/products/:product_code");
  const productCode = match?.params.product_code;
  const product = useProduct(parseInt(productCode!));
  const measurementUnits = useMeasurementUnits();

  if (product.state !== "loaded" || measurementUnits.state !== "loaded") {
    return null;
  }
  const measurementUnit = measurementUnits.data.find(
    (mu) => mu.id === product.data.measurement_unit_id
  );
  if (measurementUnit === undefined) return null;

  return (
    <ViewContainer>
      <Box
        border="1px solid"
        padding={2}
        borderColor="gray.300"
        borderRadius="9px"
      >
        <Heading as="h2" fontSize="2xl" mb={2}>
          #{product.data.product_code} {product.data.product_name}
        </Heading>
        <Stack direction="row" marginY={2}>
          <Button
            as={Link}
            leftIcon={<EditIcon />}
            size="sm"
            to={`/products/${product.data.product_code}/edit`}
          >
            Editar
          </Button>
        </Stack>
        <Text fontSize="lg" lineHeight="1.5">
          <strong>Unidad de medida:</strong> {measurementUnit.unit_name}
        </Text>
        <Text fontSize="lg" lineHeight="1.5">
          <strong>Precio de lista por unidad de medida actual:</strong>{" "}
          {product.data.list_unit_price}
        </Text>
      </Box>
    </ViewContainer>
  );
}
