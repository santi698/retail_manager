CREATE INDEX inventory_levels_idx_account_product_timestamp
          ON inventory_levels(
            account_id,
            product_code,
            timestamp
          );
