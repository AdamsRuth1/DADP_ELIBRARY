-- Migration: Add book_categories table and link to books
-- Run this SQL in Supabase SQL Editor

-- Step 1: Create book_categories table
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

-- Step 3: Add category_id column to books table
ALTER TABLE books ADD COLUMN IF NOT EXISTS category_id INTEGER REFERENCES book_categories(id);

-- Step 4: Update books with category_id based on existing category names
UPDATE books
SET category_id = book_categories.id
FROM book_categories
WHERE books.category = book_categories.name
  AND books.category_id IS NULL;

-- Step 5: Create index for better performance
CREATE INDEX IF NOT EXISTS idx_books_category_id ON books(category_id);

-- Step 6: (Optional) Drop the old category column after verifying the migration
-- Uncomment the line below after verifying everything works:
-- ALTER TABLE books DROP COLUMN category;

-- Verify the migration
SELECT 'Categories created:' AS info, COUNT(*) FROM book_categories
UNION ALL
SELECT 'Books with category_id:' AS info, COUNT(*) FROM books WHERE category_id IS NOT NULL
UNION ALL
SELECT 'Books without category_id:' AS info, COUNT(*) FROM books WHERE category_id IS NULL;
