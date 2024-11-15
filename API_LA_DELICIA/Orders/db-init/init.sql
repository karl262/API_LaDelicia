create table if not exists orders (
  id bigint primary key generated always as identity,
  total numeric not null default 0,
  status text not null check(status in ('pendiente', 'en preparación', 'listo para recoger', 'recogido', 'cancelado')),
  clientid bigint not null,
  employeeid bigint,
  payment_methodid bigint,
  discount numeric default 0,
  converted_to_sale boolean default false,
  saleid bigint,  
  order_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  estimated_completion_time TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  delete_at TIMESTAMP WITHOUT TIME ZONE
);
