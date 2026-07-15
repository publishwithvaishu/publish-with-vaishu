-- ============================================================================
--  0010 — Many-to-many books <-> authors, plus author profile fields
--  Adds book_authors (junction table) so a book can have 1..N authors and
--  an author can appear on multiple books. Adds website/linkedin to authors
--  to complete the individual-profile fields (email/phone/photo/bio/
--  designation/college/display_order/active already exist from 0009).
--
--  Non-destructive: books.author_id and every existing authors row are left
--  exactly as-is — this migration only ADDS columns/a table. The actual data
--  backfill (splitting combined-name author rows into individuals and
--  populating book_authors) is done separately via the app's service-role
--  API, not in this SQL file.
-- ============================================================================

alter table authors add column if not exists website text;
alter table authors add column if not exists linkedin text;

create table if not exists book_authors (
  book_id    uuid not null references books (id) on delete cascade,
  author_id  uuid not null references authors (id) on delete cascade,
  position   int  not null default 0,
  primary key (book_id, author_id)
);

create index if not exists book_authors_author_idx on book_authors (author_id);

alter table book_authors enable row level security;

drop policy if exists "public read book_authors" on book_authors;
create policy "public read book_authors" on book_authors for select using (true);
