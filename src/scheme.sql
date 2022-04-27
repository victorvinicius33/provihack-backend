DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  password text NOT NULL
);