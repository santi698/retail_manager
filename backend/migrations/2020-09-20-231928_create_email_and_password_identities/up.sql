CREATE TABLE users (
  PRIMARY KEY (id),
  id         SERIAL      NOT NULL,
  first_name VARCHAR(50),
  last_name  VARCHAR(50)
);

CREATE TABLE email_and_password_identities (
  PRIMARY KEY (id),
  id                SERIAL       NOT NULL,
  email             VARCHAR(50)  NOT NULL,
  password_hash     VARCHAR      NOT NULL,
  user_id           INTEGER      NOT NULL REFERENCES users(id)
);
