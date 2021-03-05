ALTER TABLE customer_order_items RENAME COLUMN customer_order_id TO client_order_id;
ALTER TABLE customer_order_items RENAME COLUMN customer_order_item_id TO client_order_item_id;
ALTER TABLE customers RENAME COLUMN customer_id TO client_id;
ALTER TABLE customer_orders RENAME COLUMN customer_id TO client_id;
ALTER TABLE customer_order_items RENAME TO client_order_items;
ALTER TABLE customer_orders RENAME TO client_orders;
ALTER TABLE customers RENAME TO clients;
