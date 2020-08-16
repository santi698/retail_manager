ALTER TABLE client_orders
ADD order_status VARCHAR(20) DEFAULT 'draft' NOT NULL;
