-- Migration: Properly set up book_categories table with foreign key
-- Run this SQL in Supabase SQL Editor

-- Step 1: Create book_categories table if not exists
CREATE TABLE IF NOT EXISTS book_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 2: Insert existing distinct categories from books table
INSERT INTO book_categories (name)
SELECT DISTINCT category
FROM books
WHERE category IS NOT NULL AND category != ''
ON CONFLICT (name) DO NOTHING;

-- Step 3: Add category_id column to books table if not exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'books' AND column_name = 'category_id') THEN
    ALTER TABLE books ADD COLUMN category_id INTEGER;
  END IF;
END $$;

-- Step 4: Update books with category_id based on existing category names
UPDATE books
SET category_id = book_categories.id
FROM book_categories
WHERE books.category = book_categories.name
  AND books.category_id IS NULL;

-- Step 5: Add foreign key constraint (this creates the relationship Supabase needs)
ALTER TABLE books
DROP CONSTRAINT IF EXISTS books_category_id_fkey;

ALTER TABLE books
ADD CONSTRAINT books_category_id_fkey
FOREIGN KEY (category_id) REFERENCES book_categories(id);

-- Step 6: Create index for better performance
CREATE INDEX IF NOT EXISTS idx_books_category_id ON books(category_id);

-- Step 7: Enable realtime for the new table (optional)
ALTER PUBLICATION supabase_realtime ADD TABLE book_categories;

-- Verify the migration
SELECT 'Categories created:' AS info, COUNT(*) FROM book_categories
UNION ALL
SELECT 'Books with category_id:' AS info, COUNT(*) FROM books WHERE category_id IS NOT NULL
UNION ALL
SELECT 'Books without category_id:' AS info, COUNT(*) FROM books WHERE category_id IS NULL
UNION ALL
SELECT 'Foreign key exists:' AS info, 
       CASE WHEN EXISTS (SELECT 1 FROM information_schema.table_constraints 
                      WHERE constraint_name = 'books_category_id_fkey') 
            THEN 1 ELSE 0 END;
