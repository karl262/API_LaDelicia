create table if not exists payment_method (
  id bigint primary key generated always as identity,
  name_method text,
  amount numeric,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  delete_at TIMESTAMP WITHOUT TIME ZONE
);

create table if not exists sale (
  id bigint primary key generated always as identity,
  total numeric,
  discount numeric,
  payment_methodid bigint,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  delete_at TIMESTAMP WITHOUT TIME ZONE,
  foreign key (payment_methodid) references payment_method (id)

);

create table if not exists detail_sale (
  id bigint primary key generated always as identity,
  quantity int,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  delete_at TIMESTAMP WITHOUT TIME ZONE
);