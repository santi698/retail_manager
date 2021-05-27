import { Link, useMatch } from "react-router-dom";
import { Button, Heading, HStack, Text } from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";
import { useProduct } from "../hooks/useProduct";
import { useMeasurementUnits } from "../hooks/useMeasurementUnits";
import { Currency } from "../../common/components/Currency";
import { getDisplayName } from "../domain/MeasurementUnit";

export function ShowProductView() {
  const match = useMatch("/products/:product_code");
  const productCode = match?.params.product_code;
  const product = useProduct(parseInt(productCode!));
  const measurementUnits = useMeasurementUnits();

  if (product.status !== "success" || measurementUnits.status !== "success") {
    return null;
  }
  const measurementUnit = measurementUnits.data.find(
    (mu) => mu.id === product.data.measurement_unit_id
  );
  if (measurementUnit === undefined) return null;

  return (
    <>
      <>
        <HStack marginY={2}>
          <Heading as="h2" fontSize="2xl" mb={2}>
            #{product.data.product_code} {product.data.product_name}
          </Heading>
          <Button
            as={Link}
            leftIcon={<EditIcon />}
            size="sm"
            to={`/products/${product.data.product_code}/edit`}
          >
            Editar
          </Button>
        </HStack>
        <Text fontSize="lg" lineHeight="1.5">
          <strong>Precio de lista actual:</strong>{" "}
          <Currency>{product.data.list_unit_price}</Currency> /{" "}
          {getDisplayName(measurementUnit)}
        </Text>
      </>
    </>
  );
}
