CREATE TABLE client_orders (
  PRIMARY KEY (order_id),
  order_id      SERIAL  NOT NULL,
  client_id     INTEGER NOT NULL REFERENCES clients(client_id),
  order_city_id INTEGER NOT NULL REFERENCES cities(id)
)
