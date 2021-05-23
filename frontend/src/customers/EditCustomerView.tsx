import { useMatch, useNavigate } from "react-router-dom";
import { ViewTitle } from "../common/components/ViewTitle";
import { EditCustomerForm } from "./EditCustomerForm";
import { editCustomer } from "./CustomersService";
import { useRefetchCustomers } from "./useRefetchCustomers";

export function EditCustomerView() {
  const match = useMatch("/customers/:id/edit");
  const navigate = useNavigate();
  const refetchCustomers = useRefetchCustomers();
  if (!match) return null;
  const customerId = parseInt(match.params.id);
  return (
    <>
      <ViewTitle>Editar cliente</ViewTitle>
      <EditCustomerForm
        customerId={customerId}
        onSubmit={({
          first_name,
          last_name,
          email,
          phone_number,
          residence_city_id,
          address,
        }) => {
          editCustomer(customerId, {
            first_name,
            last_name,
            email,
            phone_number,
            residence_city_id: parseInt(residence_city_id),
            address,
          }).then(() => {
            refetchCustomers();
            navigate(`/customers/${customerId}`);
          });
        }}
      />
    </>
  );
}
