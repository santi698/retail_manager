ALTER TABLE clients RENAME TO customers;
ALTER TABLE client_orders RENAME TO customer_orders;
ALTER TABLE client_order_items RENAME TO customer_order_items;
ALTER TABLE customers RENAME COLUMN client_id TO customer_id;
ALTER TABLE customer_orders RENAME COLUMN client_id TO customer_id;
ALTER TABLE customer_order_items RENAME COLUMN client_order_id TO customer_order_id;
ALTER TABLE customer_order_items RENAME COLUMN client_order_item_id TO customer_order_item_id;
