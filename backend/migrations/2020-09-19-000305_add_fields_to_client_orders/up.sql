ALTER TABLE client_orders
  ADD COLUMN delivered_at TIMESTAMP,
  ADD COLUMN comments     TEXT;
