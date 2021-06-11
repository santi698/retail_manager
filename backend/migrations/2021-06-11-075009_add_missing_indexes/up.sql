CREATE INDEX customer_orders_list_filters
          ON customer_orders (
            account_id,
            order_status,
            order_city_id
          );

CREATE INDEX customer_orders_by_customer
          ON customer_orders (
            account_id,
            customer_id,
            ordered_at
          );

CREATE INDEX customer_order_items_by_customer_order
          ON customer_order_items (
            account_id,
            customer_order_id
          );

CREATE INDEX email_and_password_identities_by_email
          ON email_and_password_identities (
            email
          );

CREATE INDEX customers_by_account_city
          ON customers (
            account_id,
            residence_city_id
          );

CREATE INDEX cities_by_account
          ON cities (
            account_id
          );

CREATE INDEX products_by_account
          ON products (
            account_id
          );
