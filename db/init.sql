-- db/init.sql
-- You can add any table creation, or other specific SQL logic here, but avoid hardcoded database/user creation.

-- Example of creating a simple table:
CREATE TABLE IF NOT EXISTS items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);
