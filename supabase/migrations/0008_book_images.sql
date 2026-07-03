-- ============================================================================
--  Migration 0008 — Additional book images (gallery)
--  Run AFTER 0007_book_delivery_charge.sql. Idempotent.
--
--  books.cover_image stays the single "primary" image used everywhere the
--  storefront shows one cover (catalog cards, cart thumbnails, sitemap, JSON-LD).
--  This adds a child table for EXTRA photos (e.g. back cover) shown only as a
--  swipeable gallery on the book's own detail page.
-- ============================================================================

create table if not exists book_images (
  id         uuid primary key default gen_random_uuid(),
  book_id    uuid not null references books (id) on delete cascade,
  url        text not null,
  position   int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists book_images_book_idx on book_images (book_id);

-- Public catalog data — world-readable, same convention as books/categories/authors.
alter table book_images enable row level security;

drop policy if exists "public read book_images" on book_images;
create policy "public read book_images" on book_images for select using (true);
