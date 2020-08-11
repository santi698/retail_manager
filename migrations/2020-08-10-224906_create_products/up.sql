CREATE TABLE measurement_units (
  PRIMARY KEY (id),
  id SERIAL NOT NULL,
  unit_name VARCHAR(20),
  symbol VARCHAR(5)
);

INSERT INTO measurement_units (unit_name, symbol)
VALUES ('kilogramos', 'kg'),
       ('gramos', 'g'),
       ('unidades', '');

CREATE TABLE products (
    PRIMARY KEY (product_code),
    product_code        SERIAL       NOT NULL,
    product_name        VARCHAR(100) NOT NULL,
    measurement_unit_id INTEGER      NOT NULL REFERENCES measurement_units(id)
);
