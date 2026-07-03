-- Bakezilla initial schema: products, orders, order_items, cake_requests, contact_enquiries.
-- All writes go through the server (service role); anon clients can only read active products.

-- ---------- products ----------
create table public.products (
  id text primary key,
  name text not null,
  price integer not null check (price >= 0),
  category text not null check (category in ('Breads', 'Cakes', 'Donuts', 'Waffles', 'Savory')),
  tag text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- orders ----------
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique default ('BZ-' || upper(substring(md5(gen_random_uuid()::text) from 1 for 6))),
  customer_name text not null,
  phone text not null,
  address text not null,
  total integer not null check (total >= 0),
  status text not null default 'received'
    check (status in ('received', 'baking', 'out_for_delivery', 'delivered', 'cancelled')),
  created_at timestamptz not null default now()
);

create index orders_created_at_idx on public.orders (created_at desc);

-- ---------- order_items ----------
create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id text references public.products (id),
  name text not null,
  unit_price integer not null check (unit_price >= 0),
  qty integer not null check (qty > 0 and qty <= 100),
  line_total integer not null check (line_total >= 0),
  is_custom_cake boolean not null default false,
  cake_config jsonb
);

create index order_items_order_id_idx on public.order_items (order_id);

-- ---------- cake_requests ----------
create table public.cake_requests (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders (id) on delete set null,
  size text not null,
  base text not null,
  frosting text not null,
  topping text not null,
  message text,
  price integer not null check (price >= 0),
  status text not null default 'received'
    check (status in ('received', 'accepted', 'baking', 'delivered', 'cancelled')),
  created_at timestamptz not null default now()
);

create index cake_requests_order_id_idx on public.cake_requests (order_id);

-- ---------- contact_enquiries ----------
create table public.contact_enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text,
  message text not null,
  created_at timestamptz not null default now()
);

-- ---------- row level security ----------
-- Deny-by-default: enable RLS everywhere and only open what the public needs.
-- The server uses the service role key, which bypasses RLS.
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.cake_requests enable row level security;
alter table public.contact_enquiries enable row level security;

create policy "Public can read active products"
  on public.products for select
  to anon, authenticated
  using (active);

-- No policies on orders / order_items / cake_requests / contact_enquiries:
-- they are readable and writable only via the service role on the server.

-- ---------- seed products ----------
insert into public.products (id, name, price, category, tag) values
  ('b1', 'Multigrain Loaf', 190, 'Breads', 'Fresh daily'),
  ('b2', 'Flaxseed Bread', 180, 'Breads', 'Omega-3'),
  ('b3', 'Whole Wheat Sourdough', 200, 'Breads', '48hr fermented'),
  ('c1', 'Belgian Chocolate', 220, 'Cakes', 'Bestseller'),
  ('c2', 'Blueberry Yogurt', 210, 'Cakes', null),
  ('c3', 'Carrot Walnut', 210, 'Cakes', null),
  ('c4', 'Matcha Green Tea', 220, 'Cakes', 'New'),
  ('c5', 'Lemon Poppy', 200, 'Cakes', null),
  ('d1', 'Chocolate Fudge', 120, 'Donuts', null),
  ('d2', 'Berry Bliss', 120, 'Donuts', null),
  ('d3', 'Cinnamon Spice', 110, 'Donuts', null),
  ('d4', 'Matcha Glaze', 120, 'Donuts', null),
  ('d5', 'Peanut Butter Bliss', 120, 'Donuts', null),
  ('w1', 'Banana Nut', 180, 'Waffles', null),
  ('w2', 'Berry Compote', 190, 'Waffles', null),
  ('w3', 'Dark Chocolate', 190, 'Waffles', null),
  ('w4', 'Nutty Maple', 190, 'Waffles', null),
  ('s1', 'Herb & Cheese Bread Sticks', 150, 'Savory', null),
  ('s2', 'Methi Matar Puff', 150, 'Savory', null),
  ('s3', 'Spinach & Corn Muffin', 130, 'Savory', null),
  ('s4', 'Masala Oats Cookies', 120, 'Savory', null);
