DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  cpf text UNIQUE,
  cnpj text UNIQUE,
  address text NOT NULL,
  password text NOT NULL,
  groupcategory text NOT NULL
);