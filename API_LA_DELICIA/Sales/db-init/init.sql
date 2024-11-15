create table if not exists payment_method (
  id bigint primary key generated always as identity,
  name_method text,
  amount numeric,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  delete_at TIMESTAMP WITHOUT TIME ZONE
);

create table if not exists sales (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  orderid bigint not null unique,          -- Referencia al pedido original
  total numeric not null,
  discount numeric default 0,
  final_total numeric generated always as (total - discount) stored,  -- Calculated as total - discount
  clientid bigint not null,
  employeeid bigint not null,
  payment_methodid bigint not null,
  sale_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  delete_at TIMESTAMP WITHOUT TIME ZONE,
  FOREIGN KEY (payment_methodid) REFERENCES payment_method (id)
);

create table if not exists sale_details (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  saleid bigint not null,
  productid bigint not null,
  quantity int not null,
  price_at_sale numeric(10, 2) not null,   -- Precio al momento de la venta
  subtotal numeric(10, 2) generated always as (quantity * price_at_sale) stored,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  delete_at TIMESTAMP WITHOUT TIME ZONE,
  FOREIGN KEY (saleid) REFERENCES sales (id)
);

INSERT INTO payment_method (name_method, amount) VALUES ('Tarjeta de Crédito', 0);
