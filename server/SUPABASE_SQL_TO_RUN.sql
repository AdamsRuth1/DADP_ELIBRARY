-- ===========================================
-- COPY AND PASTE THIS INTO SUPABASE SQL EDITOR
-- Go to: Supabase Dashboard -> SQL Editor -> New Query
-- Then click "Run"
-- ===========================================

-- Step 1: Create book_categories table
CREATE TABLE IF NOT EXISTS public.book_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 2: Enable Row Level Security
ALTER TABLE public.book_categories ENABLE ROW LEVEL SECURITY;

-- Step 3: Create policy to allow everyone to read categories
DROP POLICY IF EXISTS "Allow public read" ON public.book_categories;
CREATE POLICY "Allow public read" ON public.book_categories
  FOR SELECT USING (true);

-- Step 4: Create policy to allow authenticated users to insert
DROP POLICY IF EXISTS "Allow authenticated insert" ON public.book_categories;
CREATE POLICY "Allow authenticated insert" ON public.book_categories
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Step 5: Insert default categories
INSERT INTO public.book_categories (name) VALUES
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

-- Step 6: Add category_id column to books table (optional, run if needed)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'books' AND column_name = 'category_id'
  ) THEN
    ALTER TABLE public.books ADD COLUMN category_id INTEGER;
    ALTER TABLE public.books
    ADD CONSTRAINT fk_books_category_id
    FOREIGN KEY (category_id) REFERENCES public.book_categories(id);
    CREATE INDEX idx_books_category_id ON public.books(category_id);
  END IF;
END $$;

-- Step 7: Verify the migration
SELECT 'Categories created:' AS info, COUNT(*) FROM public.book_categories
UNION ALL
SELECT 'Books with category_id:' AS info, COUNT(*) FROM public.books WHERE category_id IS NOT NULL;

-- View all categories
SELECT * FROM public.book_categories ORDER BY name;

-- ===========================================
-- AFTER RUNNING THIS SQL:
-- 1. Restart your backend server (Ctrl+C, then: node server/index.js)
-- 2. Refresh your frontend
-- 3. Try adding/editing books - it should work now!
-- ===========================================
