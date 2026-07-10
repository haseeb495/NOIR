-- Phase 6b: Storage bucket + policies for product image uploads. Run ONCE. Safe to re-run.

-- 1. A public bucket to hold product images
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- 2. Anyone can read images (so the storefront can display them)
drop policy if exists "Public read product images" on storage.objects;
create policy "Public read product images"
  on storage.objects for select
  using (bucket_id = 'product-images');

-- 3. Only admins can upload / change / remove images
drop policy if exists "Admins upload product images" on storage.objects;
create policy "Admins upload product images"
  on storage.objects for insert
  with check (bucket_id = 'product-images' and is_admin());

drop policy if exists "Admins update product images" on storage.objects;
create policy "Admins update product images"
  on storage.objects for update
  using (bucket_id = 'product-images' and is_admin());

drop policy if exists "Admins delete product images" on storage.objects;
create policy "Admins delete product images"
  on storage.objects for delete
  using (bucket_id = 'product-images' and is_admin());
