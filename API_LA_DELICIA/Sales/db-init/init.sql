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
  clientid bigint,
  employeeid bigint,
  payment_methodid bigint,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  delete_at TIMESTAMP WITHOUT TIME ZONE,
  foreign key (payment_methodid) references payment_method (id)
);

create table if not exists detail_sale (
  id bigint primary key generated always as identity,
  quantity int,
  saleid bigint,
  productsid bigint,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  delete_at TIMESTAMP WITHOUT TIME ZONE,
  foreign key (saleid) references sale (id)
);

INSERT INTO payment_method (name_method, amount) VALUES ('Tarjeta de Crédito', 0);
