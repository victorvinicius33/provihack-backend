DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  cpfOrCnpj text UNIQUE,
  password text NOT NULL,
  groupcategory text NOT NULL
);

DROP TABLE IF EXISTS users_addresses;

CREATE TABLE users_addresses (
  id SERIAL PRIMARY KEY,
  email text NOT NULL,
  zip_code varchar(8) NOT NULL,
  address varchar(100) NOT NULL,
  house_number varchar(20) NOT NULL,
  complement varchar(100)
);

DROP TABLE IF EXISTS profile_images;

CREATE TABLE profile_images (
  id SERIAL PRIMARY KEY,
  user_id integer NOT NULL,
  image_url text NOT NULL,
  foreign key (user_id) REFERENCES users (id)
);

DROP TABLE IF EXISTS profile_description;

CREATE TABLE profile_description (
  id SERIAL PRIMARY KEY,
  user_id integer NOT NULL,
  profile_image text NOT NULL,
  user_description text NOT NULL,
  telephone varchar(13) NOT NULL,
  foreign key (user_id) REFERENCES users (id)
);