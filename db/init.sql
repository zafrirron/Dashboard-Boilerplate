-- Create the express user if it doesn't exist
DO
$$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles WHERE rolname = 'expressuser') THEN
      CREATE ROLE expressuser WITH LOGIN PASSWORD 'password';  -- Make sure this password matches your .env DB_PASSWORD
   END IF;
END
$$;

-- Create the expressdb database if it doesn't exist
SELECT 'CREATE DATABASE expressdb'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'expressdb')\gexec

-- Create the expressdb database if it doesn't exist
--DO
--$$
--BEGIN
--   IF NOT EXISTS (
--      SELECT FROM pg_database WHERE datname = 'expressdb') THEN
--      CREATE DATABASE expressdb;
--   END IF;
--END
--$$;

-- Grant all privileges to expressuser on the expressdb database
GRANT ALL PRIVILEGES ON DATABASE expressdb TO expressuser;

-- Create the strapi user if it doesn't exist
DO
$$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles WHERE rolname = 'strapiuser') THEN
      CREATE ROLE strapiuser WITH LOGIN PASSWORD 'strapipassword';  -- Make sure this password matches your .env DB_PASSWORD
   END IF;
END
$$;

-- Create the strapidb database if it doesn't exist
SELECT 'CREATE DATABASE strapidb'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'strapidb')\gexec

-- Create the strapidb database if it doesn't exist
--DO
--$$
--BEGIN
--   IF NOT EXISTS (
--      SELECT FROM pg_database WHERE datname = 'strapidb') THEN
--      CREATE DATABASE strapidb;
--   END IF;
--END
--$$;

-- Grant all privileges to strapiuser on the strapidb database
GRANT ALL PRIVILEGES ON DATABASE strapidb TO strapiuser;

-- Set context to exprssdb to create tables
\c expressdb

-- Create the table "items" if it doesn't exist
CREATE TABLE IF NOT EXISTS items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Optional: Insert some sample data
INSERT INTO items (name, description) VALUES
('Item 1', 'Description of Item 1'),
('Item 2', 'Description of Item 2');

-- Create the table "users" if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) DEFAULT '',
  password VARCHAR(255) NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Inser admin
INSERT INTO users (email, name, password, role) VALUES
('zafrir.ron@gmail.com', 'Zafi', '$2b$12$46tbSwC/cVal1q0JPsyDr.iZYud54200TEzItY1BeDfobwXYdYK/i', 'admin');

-- Create table for record form
CREATE TABLE IF NOT EXISTS record_models (
    id SERIAL PRIMARY KEY,
    table_name VARCHAR(255) UNIQUE NOT NULL,
    fields JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trigger to automatically update the `updated_at` column
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_record_models_updated_at
BEFORE UPDATE ON record_models
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();
