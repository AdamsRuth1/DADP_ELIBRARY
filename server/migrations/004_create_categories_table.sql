-- Create book_categories table and populate with values
-- Run this SQL in Supabase SQL Editor

-- Step 1: Create the table
CREATE TABLE IF NOT EXISTS public.book_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 2: Enable RLS (Row Level Security) - optional but recommended
ALTER TABLE public.book_categories ENABLE ROW LEVEL SECURITY;

-- Step 3: Create policy to allow all users to read categories
DROP POLICY IF EXISTS "Allow public read access on book_categories" ON public.book_categories;
CREATE POLICY "Allow public read access on book_categories"
  ON public.book_categories
  FOR SELECT
  USING (true);

-- Step 4: Create policy to allow authenticated users to insert (for Admin/SuperAdmin)
DROP POLICY IF EXISTS "Allow authenticated insert on book_categories" ON public.book_categories;
CREATE POLICY "Allow authenticated insert on book_categories"
  ON public.book_categories
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Step 5: Insert the specified categories
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

-- Step 6: Verify the insertion
SELECT * FROM public.book_categories ORDER BY name;

-- Step 7: Important! After running this, go to Supabase Dashboard:
-- 1. Go to Database -> Tables -> book_categories
-- 2. Click "Set up" or "Add foreign key" to create relationship with books table
-- OR run this to add foreign key to books table (if category_id column exists):
-- ALTER TABLE public.books 
-- ADD CONSTRAINT fk_books_category_id 
-- FOREIGN KEY (category_id) REFERENCES public.book_categories(id);
