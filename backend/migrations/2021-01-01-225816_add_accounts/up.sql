CREATE TABLE accounts (
  PRIMARY KEY (account_id),
  account_id SERIAL      NOT NULL,
  name       VARCHAR(50)
);

ALTER TABLE cities ADD account_id INTEGER REFERENCES accounts(account_id) NOT NULL;
ALTER TABLE client_orders ADD account_id INTEGER REFERENCES accounts(account_id) NOT NULL;
ALTER TABLE client_order_items ADD account_id INTEGER REFERENCES accounts(account_id) NOT NULL;
ALTER TABLE clients ADD account_id INTEGER REFERENCES accounts(account_id) NOT NULL;
ALTER TABLE product_prices ADD account_id INTEGER REFERENCES accounts(account_id) NOT NULL;
ALTER TABLE products ADD account_id INTEGER REFERENCES accounts(account_id) NOT NULL;
ALTER TABLE users ADD account_id INTEGER REFERENCES accounts(account_id) NOT NULL;

DROP VIEW current_product_prices;
CREATE VIEW current_product_prices
AS (
  SELECT product_code, price, account_id
    FROM product_prices AS prices_1
   WHERE valid_since < CURRENT_TIMESTAMP
     AND valid_since = (
       SELECT MAX(valid_since)
         FROM product_prices AS prices_2
        WHERE prices_1.product_code = prices_2.product_code
          AND valid_since < CURRENT_TIMESTAMP
     )
);
