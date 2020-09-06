ALTER TABLE clients
  DROP CONSTRAINT phone_number_is_valid_number;

ALTER TABLE clients
  ADD CONSTRAINT phone_number_is_valid_number
      CHECK (phone_number ~ '\d{8,10}');
