-- Populate book_categories with specified values
-- Run this SQL in Supabase SQL Editor

INSERT INTO book_categories (name) VALUES
  ('Computer Security'),
  ('Data management'),
  ('Windows Management'),
  ('Computer Hardware'),
  ('Drone'),
  ('Computer Network'),
  ('Forensics'),
  ('Artificial Intelligence'),
  ('Training'),
  ('Leadership')
ON CONFLICT (name) DO NOTHING;

-- Verify the insertion
SELECT * FROM book_categories ORDER BY name;
