-- One rating per customer per book: lets a customer resubmit to update
-- their existing rating/comment (upsert on book_id + user_id) instead of
-- creating duplicate rows.
alter table reviews
  add constraint reviews_book_user_unique unique (book_id, user_id);
