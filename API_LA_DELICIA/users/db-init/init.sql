create table if not exists client (
  id bigint primary key generated always as identity,
  city text,
  date_of_birth date,
  postal_code int,
  id_preferred_payment_method bigint default 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  delete_at TIMESTAMP WITHOUT TIME ZONE
);

create table if not exists users (
  id bigint primary key generated always as identity,
  name text not null,
  first_surname text not null,
  last_surname text not null,
  phone_number text,
  auth_user_id bigint,
  client_id bigint,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  delete_at TIMESTAMP WITHOUT TIME ZONE,
  foreign key (client_id) references client (id) on delete set null
);