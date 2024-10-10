create table if not exists employee (
  id bigint primary key generated always as identity,
  name_employee text,
  middle_name text,
  last_name text null,
  street_address text,
  city_address text,
  postal_code int,
  cellphone_number text,
  userid bigint,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  delete_at TIMESTAMP WITHOUT TIME ZONE
);