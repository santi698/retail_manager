import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Currency } from "../../common/components/Currency";
import { Client } from "../../domain/Client";
import { ClientOrder } from "../../domain/ClientOrder";
import { StatusBadge } from "../../common/components/StatusBadge";
import { DateTime } from "../../common/components/DateTime";
import { translatePaymentStatus } from "../translatePaymentStatus";
import { translateOrderStatus } from "../translateOrderStatus";
import { useClientOrderItems } from "../hooks/useClientOrderItems";
import { OrderItemsTable } from "./OrderItemsTable";
import { useCity } from "../../cities/useCity";
import { BsCaretUpFill, BsCaretDownFill } from "react-icons/bs";
import { InvisibleButton } from "../../common/components/InvisibleButton";
import { orderStatusToColorVariant } from "../orderStatusToColorVariant";
import { paymentStatusToColorVariant } from "../paymentStatusToColorVariant";
import { Button, Stack } from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";

export function OrderRow({
  order,
  client,
}: {
  order: ClientOrder;
  client: Client;
}) {
  const city = useCity(order.order_city_id);
  const [expanded, setExpanded] = useState(false);
  const toggleExpanded = () => {
    setExpanded((p) => !p);
  };
  const loadingItems = useClientOrderItems(order.order_id);
  return (
    <>
      <tr>
        <td />
        <td>{order.order_id}</td>
        <td style={{ width: "10em" }}>
          {city.status === "success" && city.data.name}
        </td>
        <td>
          {order.ordered_at && (
            <DateTime>{new Date(order.ordered_at)}</DateTime>
          )}
        </td>
        <td>
          {client && (
            <>
              {client.first_name} {client.last_name}
            </>
          )}
        </td>
        <td>
          <StatusBadge
            colorVariant={paymentStatusToColorVariant(order.payment_status)}
          >
            {translatePaymentStatus(order.payment_status)}
          </StatusBadge>
        </td>
        <td>
          <StatusBadge
            colorVariant={orderStatusToColorVariant(order.order_status)}
          >
            {translateOrderStatus(order.order_status)}
          </StatusBadge>
        </td>
        <td className="currency">{<Currency>{order.total_price}</Currency>}</td>
        <td>
          <Stack direction="row">
            <Button
              as={Link}
              leftIcon={<EditIcon />}
              size="xs"
              to={`/orders/${order.order_id}/edit`}
            >
              Editar
            </Button>
            <InvisibleButton onClick={toggleExpanded} size="xs">
              {expanded ? (
                <BsCaretUpFill
                  size="1.25em"
                  style={{ verticalAlign: "middle" }}
                />
              ) : (
                <BsCaretDownFill
                  size="1.25em"
                  style={{ verticalAlign: "middle" }}
                />
              )}
            </InvisibleButton>
          </Stack>
        </td>
      </tr>
      {loadingItems.status === "success" && (
        <tr style={expanded ? {} : { display: "none" }}>
          <td colSpan={8}>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <OrderItemsTable items={loadingItems.data} />
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
