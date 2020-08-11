CREATE TABLE client_order_items (
  PRIMARY KEY (client_order_item_id),
  client_order_item_id SERIAL    NOT NULL,
  order_timestamp      TIMESTAMP NOT NULL,
  product_id           INTEGER   NOT NULL REFERENCES products(product_code),
  client_order_id      INTEGER   NOT NULL REFERENCES client_orders(order_id),
  quantity             DECIMAL   NOT NULL,
  selling_price        DECIMAL   NOT NULL
)
