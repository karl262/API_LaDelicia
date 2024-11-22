create table if not exists users (
  id bigint primary key generated always as identity,
  name text not null,
  first_surname text not null,
  last_surname text not null,
  auth_user_id bigint,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  delete_at TIMESTAMP WITHOUT TIME ZONE
);

create table if not exists client (
  id bigint primary key generated always as identity,
  city text,
  date_of_birth date,
  phone_number text,
  postal_code int,
  id_preferred_payment_method bigint,
  userid bigint,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  delete_at TIMESTAMP WITHOUT TIME ZONE,
  foreign key (userid) references users (id) on delete set null
);