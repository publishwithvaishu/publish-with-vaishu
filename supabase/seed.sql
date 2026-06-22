-- ============================================================================
--  Publish With Vaishu — Seed data
--  Run this in the Supabase SQL editor AFTER schema.sql.
--  Idempotent: safe to re-run (uses fixed UUIDs + ON CONFLICT DO NOTHING).
-- ============================================================================

-- ----------------------------------------------------------------------------
--  Categories
-- ----------------------------------------------------------------------------
insert into categories (id, name, slug) values
  ('c1000000-0000-4000-8000-000000000001', 'B.Com', 'b-com'),
  ('c1000000-0000-4000-8000-000000000002', 'BBA',   'bba'),
  ('c1000000-0000-4000-8000-000000000003', 'BCA',   'bca'),
  ('c1000000-0000-4000-8000-000000000004', 'M.Sc',  'm-sc')
on conflict (id) do nothing;

-- ----------------------------------------------------------------------------
--  Authors  (admin-managed; no login)
-- ----------------------------------------------------------------------------
insert into authors (id, name, email, phone, photo, bio, designation, department, college) values
  ('a2000000-0000-4000-8000-000000000001', 'Dr. R. Lakshmanan',
   'r.lakshmanan@example.edu', '+91 90000 00001',
   'https://placehold.co/400x400/EFEADD/1D1D1F.png?text=RL',
   'Twenty years teaching financial accounting across University of Madras affiliated colleges.',
   'Associate Professor', 'Department of Commerce', 'Presidency College, Chennai'),
  ('a2000000-0000-4000-8000-000000000002', 'Dr. Meera Subramanian',
   'meera.s@example.edu', '+91 90000 00002',
   'https://placehold.co/400x400/EFEADD/1D1D1F.png?text=MS',
   'Researcher and author in management studies and organisational behaviour.',
   'Professor & Head', 'Department of Management Studies', 'Loyola College, Chennai'),
  ('a2000000-0000-4000-8000-000000000003', 'Prof. K. Anand',
   'k.anand@example.edu', '+91 90000 00003',
   'https://placehold.co/400x400/EFEADD/1D1D1F.png?text=KA',
   'Computer science educator focused on data structures and database systems.',
   'Assistant Professor', 'Department of Computer Science', 'MCC, Chennai'),
  ('a2000000-0000-4000-8000-000000000004', 'Dr. S. Priya',
   's.priya@example.edu', '+91 90000 00004',
   'https://placehold.co/400x400/EFEADD/1D1D1F.png?text=SP',
   'Specialises in statistics and applied mathematics for postgraduate science.',
   'Associate Professor', 'Department of Mathematics', 'Stella Maris College, Chennai')
on conflict (id) do nothing;

-- ----------------------------------------------------------------------------
--  Books  (physical, University of Madras syllabus titles)
--  Covers use placeholder images on brand colours; real covers come from
--  Cloudinary in a later milestone.
-- ----------------------------------------------------------------------------
insert into books
  (id, title, subtitle, isbn, edition, university, course, semester, language,
   pages, publication_date, price, stock, cover_image, description,
   is_featured, author_id, category_id)
values
  ('b3000000-0000-4000-8000-000000000001',
   'Financial Accounting', 'For B.Com Semester I', '978-93-5000-101-1', 'Third Edition',
   'University of Madras', 'B.Com', 'Semester I', 'English',
   384, '2025-06-01', 320, 45,
   'https://placehold.co/600x800/F4EFE2/1D1D1F.png?text=Financial%20Accounting',
   'A complete syllabus-aligned introduction to financial accounting with solved problems and University of Madras model questions.',
   true,  'a2000000-0000-4000-8000-000000000001', 'c1000000-0000-4000-8000-000000000001'),

  ('b3000000-0000-4000-8000-000000000002',
   'Business Statistics', 'Concepts & Applications', '978-93-5000-102-8', 'Second Edition',
   'University of Madras', 'B.Com', 'Semester III', 'English',
   296, '2025-01-15', 295, 30,
   'https://placehold.co/600x800/EDEFE6/1D1D1F.png?text=Business%20Statistics',
   'Covers descriptive statistics, probability and index numbers with worked examples for commerce students.',
   true,  'a2000000-0000-4000-8000-000000000001', 'c1000000-0000-4000-8000-000000000001'),

  ('b3000000-0000-4000-8000-000000000003',
   'Principles of Management', 'An Introduction for BBA', '978-93-5000-103-5', 'Fourth Edition',
   'University of Madras', 'BBA', 'Semester I', 'English',
   352, '2024-12-10', 340, 0,
   'https://placehold.co/600x800/F1EAE2/1D1D1F.png?text=Principles%20of%20Management',
   'Foundational management theory — planning, organising, staffing, directing and controlling — for first-year BBA students.',
   true,  'a2000000-0000-4000-8000-000000000002', 'c1000000-0000-4000-8000-000000000002'),

  ('b3000000-0000-4000-8000-000000000004',
   'Marketing Management', 'Indian Cases & Practice', '978-93-5000-104-2', 'First Edition',
   'University of Madras', 'BBA', 'Semester IV', 'English',
   312, '2025-03-20', 360, 22,
   'https://placehold.co/600x800/E8EEF0/1D1D1F.png?text=Marketing%20Management',
   'Marketing fundamentals with contemporary Indian case studies, brand strategy and digital marketing primers.',
   false, 'a2000000-0000-4000-8000-000000000002', 'c1000000-0000-4000-8000-000000000002'),

  ('b3000000-0000-4000-8000-000000000005',
   'Data Structures Using C', 'For BCA Students', '978-93-5000-105-9', 'Second Edition',
   'University of Madras', 'BCA', 'Semester II', 'English',
   420, '2025-02-05', 410, 38,
   'https://placehold.co/600x800/E9ECF2/1D1D1F.png?text=Data%20Structures%20Using%20C',
   'Arrays, linked lists, stacks, queues, trees and graphs explained with C programs and lab exercises.',
   true,  'a2000000-0000-4000-8000-000000000003', 'c1000000-0000-4000-8000-000000000003'),

  ('b3000000-0000-4000-8000-000000000006',
   'Database Management Systems', 'Theory & SQL', '978-93-5000-106-6', 'Third Edition',
   'University of Madras', 'BCA', 'Semester IV', 'English',
   368, '2024-11-18', 395, 16,
   'https://placehold.co/600x800/EEEAF2/1D1D1F.png?text=DBMS',
   'Relational model, normalisation, transactions and a complete SQL workbook aligned to the BCA syllabus.',
   false, 'a2000000-0000-4000-8000-000000000003', 'c1000000-0000-4000-8000-000000000003'),

  ('b3000000-0000-4000-8000-000000000007',
   'Real Analysis', 'A First Course', '978-93-5000-107-3', 'First Edition',
   'University of Madras', 'M.Sc', 'Semester I', 'English',
   276, '2025-04-12', 460, 12,
   'https://placehold.co/600x800/F0ECE2/1D1D1F.png?text=Real%20Analysis',
   'Rigorous treatment of sequences, series, continuity and differentiation for postgraduate mathematics.',
   true,  'a2000000-0000-4000-8000-000000000004', 'c1000000-0000-4000-8000-000000000004'),

  ('b3000000-0000-4000-8000-000000000008',
   'Probability & Statistical Inference', 'M.Sc Statistics', '978-93-5000-108-0', 'Second Edition',
   'University of Madras', 'M.Sc', 'Semester II', 'English',
   340, '2025-05-08', 480, 9,
   'https://placehold.co/600x800/E7EFEA/1D1D1F.png?text=Probability%20%26%20Inference',
   'Distribution theory, estimation and hypothesis testing with applications for postgraduate statistics.',
   false, 'a2000000-0000-4000-8000-000000000004', 'c1000000-0000-4000-8000-000000000004'),

  ('b3000000-0000-4000-8000-000000000009',
   'Corporate Accounting', 'B.Com Semester IV', '978-93-5000-109-7', 'Second Edition',
   'University of Madras', 'B.Com', 'Semester IV', 'English',
   408, '2024-10-01', 350, 27,
   'https://placehold.co/600x800/F4EFE2/1D1D1F.png?text=Corporate%20Accounting',
   'Company accounts, shares, debentures and final accounts with University of Madras exam-pattern problems.',
   true,  'a2000000-0000-4000-8000-000000000001', 'c1000000-0000-4000-8000-000000000001')
on conflict (id) do nothing;

-- ----------------------------------------------------------------------------
--  Sample customers  (so the "Students served" statistic shows a live number)
--  password_hash is a placeholder; real accounts are created in the auth
--  milestone. These rows are never exposed to the client (RLS-locked).
-- ----------------------------------------------------------------------------
insert into users (id, name, email, password_hash, phone) values
  ('d4000000-0000-4000-8000-000000000001', 'Arun Kumar',     'arun@example.com',   'seed-placeholder', '+91 98400 00001'),
  ('d4000000-0000-4000-8000-000000000002', 'Divya Raman',    'divya@example.com',  'seed-placeholder', '+91 98400 00002'),
  ('d4000000-0000-4000-8000-000000000003', 'Karthik S',      'karthik@example.com','seed-placeholder', '+91 98400 00003'),
  ('d4000000-0000-4000-8000-000000000004', 'Nithya Mohan',   'nithya@example.com', 'seed-placeholder', '+91 98400 00004'),
  ('d4000000-0000-4000-8000-000000000005', 'Praveen Raj',    'praveen@example.com','seed-placeholder', '+91 98400 00005'),
  ('d4000000-0000-4000-8000-000000000006', 'Sandhya Devi',   'sandhya@example.com','seed-placeholder', '+91 98400 00006')
on conflict (id) do nothing;

-- ----------------------------------------------------------------------------
--  A few reviews (public-readable; used on book detail pages later)
-- ----------------------------------------------------------------------------
insert into reviews (id, book_id, user_id, rating, comment) values
  ('e5000000-0000-4000-8000-000000000001', 'b3000000-0000-4000-8000-000000000001',
   'd4000000-0000-4000-8000-000000000001', 5, 'Exactly matches the syllabus. The solved problems saved me before exams.'),
  ('e5000000-0000-4000-8000-000000000002', 'b3000000-0000-4000-8000-000000000005',
   'd4000000-0000-4000-8000-000000000003', 4, 'Clear C programs and good lab exercises.')
on conflict (id) do nothing;
