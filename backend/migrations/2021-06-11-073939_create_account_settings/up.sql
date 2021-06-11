CREATE TABLE account_settings (
  PRIMARY KEY (account_id),
  account_id                       INTEGER REFERENCES accounts(account_id),
  has_stock_non_negative_invariant BOOLEAN NOT NULL DEFAULT false
)
