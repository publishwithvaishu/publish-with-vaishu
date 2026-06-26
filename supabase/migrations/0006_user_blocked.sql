-- ============================================================================
--  Migration 0006 — Customer block/unblock (Milestone 4, Module 5)
--  Run AFTER 0005_inventory.sql. Idempotent.
-- ============================================================================

-- Default false → all existing customers remain active. When true, the
-- account cannot sign in (enforced in the Auth.js credentials authorize step).
alter table users add column if not exists blocked boolean not null default false;
