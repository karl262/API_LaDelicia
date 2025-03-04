create table if not exists auth_user (
  id bigint primary key generated always as identity,
  email text unique not null,
  password text not null,
  username text unique not null,
  role text not null default 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  delete_at TIMESTAMP WITHOUT TIME ZONE
);


CREATE TABLE password_reset_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES auth_user(id),
  verification_code VARCHAR(6) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Actualizamos la inserción para que coincida con los datos proporcionados
insert into auth_user (email, password, username, role) values ('josemanueltenchipe@gmail.com', 'pepe2005', 'tenchipe23', 'admin');
insert into auth_user (email, password, username, role) values ('josem@gmail.com', 'pepe12345', 'pepe205', 'user');