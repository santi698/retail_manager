import React from "react";
import { useClients } from "../hooks/useClients";
import { Table } from "../components/Table";

export function ClientsView() {
  const { data: clients } = useClients();
  return (
    <>
      <h1>Clientes</h1>
      <Table>
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Teléfono</th>
          </tr>
        </thead>
        <tbody>
          {clients.status === "loaded" &&
            clients.data.map((client) => (
              <tr key={client.client_id}>
                <td />
                <td>{`${client.first_name} ${client.last_name}`}</td>
                <td>{client.email}</td>
                <td>{client.phone_number}</td>
              </tr>
            ))}
        </tbody>
      </Table>
    </>
  );
}
