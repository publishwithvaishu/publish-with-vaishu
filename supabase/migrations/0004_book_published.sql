-- ============================================================================
--  Migration 0004 — Book publish status (Milestone 4, Module 2)
--  Run AFTER 0003_payments.sql. Idempotent.
-- ============================================================================

-- Default TRUE so every existing book stays visible on the storefront
-- (no behavior change). Admin can unpublish to hide a title.
alter table books add column if not exists published boolean not null default true;

create index if not exists books_published_idx on books (published);
