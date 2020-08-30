import React from "react";
import { Table } from "../components/Table";
import { useClients } from "../contexts/ClientsContext";
import { ViewTitle } from "../components/ViewTitle";

export function ClientsView() {
  const clients = useClients();
  return (
    <>
      <ViewTitle>Clientes</ViewTitle>
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
          {clients.state === "loaded" &&
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
