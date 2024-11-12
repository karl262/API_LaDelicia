create table if not exists auth_user (
  id bigint primary key generated always as identity,
  email text unique not null,
  password text not null,
  username text unique not null,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  delete_at TIMESTAMP WITHOUT TIME ZONE
);

-- Actualizamos la inserción para que coincida con los datos proporcionados
insert into auth_user (email, password, username) values ('josemanueltenchipe@gmail.com', 'pepe2005', 'tenchipe23');