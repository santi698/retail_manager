import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Currency } from "../../common/components/Currency";
import { Customer } from "../../domain/Customer";
import { CustomerOrder } from "../CustomerOrder";
import { StatusBadge } from "../../common/components/StatusBadge";
import { DateTime } from "../../common/components/DateTime";
import { useCustomerOrderItems } from "../hooks/useCustomerOrderItems";
import { OrderItemsTable } from "./OrderItemsTable";
import { useCity } from "../../cities/useCity";
import { BsCaretUpFill, BsCaretDownFill } from "react-icons/bs";
import { InvisibleButton } from "../../common/components/InvisibleButton";
import { orderStatusToColorVariant } from "../orderStatusToColorVariant";
import { paymentStatusToColorVariant } from "../paymentStatusToColorVariant";
import { Button, Stack } from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";
import { PaymentStatus } from "../PaymentStatus";
import { OrderStatus } from "../OrderStatus";

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
  const [expanded, setExpanded] = useState(false);
  const toggleExpanded = () => {
    setExpanded((p) => !p);
  };
  const loadingItems = useCustomerOrderItems(order.order_id);

  return (
    <>
      <tr>
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
          {customer && (
            <>
              {customer.first_name} {customer.last_name}
            </>
          )}
        </td>
        <td>
          <StatusBadge
            colorVariant={order.payment_status.colorVariant()}
            options={order.payment_status.validTransitions().map((status) => ({
              value: status.value,
              label: status.label(),
            }))}
            onChange={(e) =>
              onChange({
                ...order,
                payment_status: PaymentStatus.from(e.currentTarget.value),
              })
            }
            value={order.payment_status.label()}
          />
        </td>
        <td>
          <StatusBadge
            colorVariant={order.order_status.colorVariant()}
            options={order.order_status.validTransitions().map((status) => ({
              value: status.value,
              label: status.label(),
            }))}
            onChange={(e) => {
              onChange({
                ...order,
                order_status: OrderStatus.from(e.currentTarget.value),
              });
            }}
            value={order.order_status.label()}
          />
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
