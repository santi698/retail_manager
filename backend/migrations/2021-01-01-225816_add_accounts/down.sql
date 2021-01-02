ALTER TABLE cities DROP account_id;
ALTER TABLE client_orders DROP account_id;
ALTER TABLE client_order_items DROP account_id;
ALTER TABLE clients DROP account_id;
ALTER TABLE product_prices DROP account_id;
ALTER TABLE products DROP account_id;
ALTER TABLE users DROP account_id;

DROP VIEW current_product_prices;
CREATE VIEW current_product_prices
AS (
  SELECT product_code, price
    FROM product_prices AS prices_1
   WHERE valid_since < CURRENT_TIMESTAMP
     AND valid_since = (
       SELECT MAX(valid_since)
         FROM product_prices AS prices_2
        WHERE prices_1.product_code = prices_2.product_code
          AND valid_since < CURRENT_TIMESTAMP
     )
);

DROP TABLE accounts;
