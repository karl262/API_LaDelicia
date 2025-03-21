create table if not exists users (
  id bigint primary key generated always as identity,
  name text not null,
  first_surname text not null,
  last_surname text not null,
  phone_number text,
  auth_user_id bigint,
  profile_image text,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  delete_at TIMESTAMP WITHOUT TIME ZONE
);

CREATE TABLE IF NOT EXISTS client (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  city TEXT,
  date_of_birth DATE,
  postal_code INT,
  id_preferred_payment_method BIGINT DEFAULT 1,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE, -- Relación con users
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  delete_at TIMESTAMP WITHOUT TIME ZONE
);



-- Insertar usuarios
INSERT INTO users (name, first_surname, last_surname, auth_user_id)
VALUES ('admin', 'admin', 'admin', 1);

INSERT INTO users (name, first_surname, last_surname, auth_user_id)
VALUES ('jose', 'pepe', 'lopez', 2);

-- Insertar clientes asociados a usuarios
INSERT INTO client (city, date_of_birth, postal_code, id_preferred_payment_method, user_id)
VALUES ('Veracruz', '1990-05-20', 12345, 2, 1); -- user_id = 1 (asociado al usuario 'admin')

INSERT INTO client (city, date_of_birth, postal_code, id_preferred_payment_method, user_id)
VALUES ('Ciudad de México', '1985-10-15', 54321, 1, 2); -- user_id = 2 (asociado al usuario 'jose')
