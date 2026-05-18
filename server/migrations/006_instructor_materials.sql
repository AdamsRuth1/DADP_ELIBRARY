-- ============================================
-- RUN THIS SQL IN YOUR SUPABASE SQL EDITOR
-- ============================================

-- Step 1: Create instructor_materials table
CREATE TABLE IF NOT EXISTS public.instructor_materials (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('Material', 'Syllabus', 'Topic')),
  content TEXT,
  file_url TEXT,
  author_id INTEGER REFERENCES public.users(id) ON DELETE SET NULL,
  parent_id INTEGER REFERENCES public.instructor_materials(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 2: Enable Row Level Security
ALTER TABLE public.instructor_materials ENABLE ROW LEVEL SECURITY;

-- Step 3: Create policy to allow everyone to read materials
DROP POLICY IF EXISTS "Allow public read" ON public.instructor_materials;
CREATE POLICY "Allow public read" ON public.instructor_materials
  FOR SELECT USING (true);

-- Step 4: Create policy to allow authenticated users to manage materials
-- Note: Since our backend handles its own auth/role checks, we allow all authenticated 
-- or anon (if backend uses anon key) requests to these tables.
DROP POLICY IF EXISTS "Allow instructor management" ON public.instructor_materials;
CREATE POLICY "Allow all management" ON public.instructor_materials
  FOR ALL USING (true) WITH CHECK (true);

-- Step 5: Verify the table
SELECT 'Table instructor_materials created' AS info;
