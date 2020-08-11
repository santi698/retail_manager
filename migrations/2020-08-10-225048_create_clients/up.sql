CREATE TABLE clients (
  PRIMARY KEY (client_id),
  client_id         SERIAL       NOT NULL,
  first_name        VARCHAR(50),
  last_name         VARCHAR(50),
  email             VARCHAR(80),
  phone_number      VARCHAR(10),
                    CONSTRAINT phone_number_is_valid_number
                    CHECK (phone_number LIKE '[[:DIGIT:]]{8,10}'),
  residence_city_id INTEGER      NOT NULL REFERENCES cities(id)
);
