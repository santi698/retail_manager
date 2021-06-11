CREATE TABLE inventory_levels (
  PRIMARY KEY (id),
  id            SERIAL      NOT NULL,
  account_id    INTEGER     NOT NULL REFERENCES accounts(account_id),
  product_code  INTEGER     NOT NULL REFERENCES products(product_code),
  timestamp     TIMESTAMP   NOT NULL,
  current_level FLOAT       NOT NULL,
  level_change  FLOAT       NOT NULL,
  reason        VARCHAR(50)
);
