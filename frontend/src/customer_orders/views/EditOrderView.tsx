import { useMatch, useNavigate } from "react-router-dom";
import { ViewTitle } from "../../common/components/ViewTitle";
import { EditOrderForm } from "../containers/EditOrderForm";
import { useRefetchCustomerOrders } from "../hooks/useRefetchCustomerOrders";
import { editCustomerOrder } from "../services/CustomerOrdersService";
import { OrderStatus } from "../OrderStatus";

export function EditOrderView() {
  const match = useMatch("/orders/:id/edit");
  const navigate = useNavigate();
  const refetchCustomerOrders = useRefetchCustomerOrders();
  if (!match) return null;
  const customerOrderId = parseInt(match.params.id);
  return (
    <>
      <ViewTitle>Completar Pedido</ViewTitle>
      <EditOrderForm
        customerOrderId={customerOrderId}
        onSubmit={({
          address,
          customer_id,
          order_city_id,
          order_status,
          total_price,
        }) => {
          editCustomerOrder(customerOrderId, {
            address,
            customer_id: parseInt(customer_id),
            order_city_id: parseInt(order_city_id),
            order_status: OrderStatus.from(order_status),
            total_price: parseFloat(total_price),
          }).then(() => {
            refetchCustomerOrders();
            navigate(`/orders`);
          });
        }}
      />
    </>
  );
}
