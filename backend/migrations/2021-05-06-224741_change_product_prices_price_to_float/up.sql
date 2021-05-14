DROP VIEW current_product_prices;

ALTER TABLE product_prices
ALTER COLUMN price TYPE FLOAT;

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
