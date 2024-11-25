create table if not exists category (
  id bigint primary key generated always as identity,
  name_category text unique not null,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  delete_at TIMESTAMP WITHOUT TIME ZONE
);

create table if not exists products (
  id bigint primary key generated always as identity,
  name_product text,
  price_product numeric(10, 2),
  categoryid bigint,
  stock int null,
  ingredients text,
  baking_time interval,
  image text,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  delete_at TIMESTAMP WITHOUT TIME ZONE,
  foreign key (categoryid) references category (id)
);

create table if not exists suppliers (
  id bigint primary key generated always as identity,
  name text unique not null,
  contact_info text,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  delete_at TIMESTAMP WITHOUT TIME ZONE
);

create table if not exists ingredients (
  id bigint primary key generated always as identity,
  name text unique not null,
  quantity numeric not null,
  supplierid bigint,
  unit text not null,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  delete_at TIMESTAMP WITHOUT TIME ZONE,
  foreign key (supplierid) references suppliers (id)
);

INSERT INTO category (name_category) VALUES ('Panaderia');
INSERT INTO category (name_category) VALUES ('Reposteria');
