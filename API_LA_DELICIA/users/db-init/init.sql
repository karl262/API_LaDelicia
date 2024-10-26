create table if not exists users (
  id bigint primary key generated always as identity,
  first_name text not null,
  last_name text not null,
  date_of_birth date,
  phone_number text,
  preferred_payment_method text,
  auth_user_id bigint,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  delete_at TIMESTAMP WITHOUT TIME ZONE
);

create table if not exists client (
  id bigint primary key generated always as identity,
  name_client text,
  middle_name text,
  last_name text,
  street_address text,
  city_address text,
  postal_code int,
  cellphone_number text,
  userid bigint,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  delete_at TIMESTAMP WITHOUT TIME ZONE,
  foreign key (userid) references users (id) on delete set null
);