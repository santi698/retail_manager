CREATE TABLE product_prices (
  PRIMARY KEY (product_code, valid_since),
  product_code SERIAL    NOT NULL REFERENCES products(product_code),
  valid_since  TIMESTAMP NOT NULL,
  price        DECIMAL   NOT NULL
)
