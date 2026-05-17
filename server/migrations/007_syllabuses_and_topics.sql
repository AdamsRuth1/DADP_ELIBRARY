-- ============================================
-- RUN THIS SQL IN YOUR SUPABASE SQL EDITOR
-- ============================================

-- 1. Create Syllabuses table
CREATE TABLE IF NOT EXISTS public.syllabuses (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  author_id INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Topics table
CREATE TABLE IF NOT EXISTS public.topics (
  id SERIAL PRIMARY KEY,
  syllabus_id INTEGER REFERENCES public.syllabuses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  author_id INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Update Books table to link to Topics
ALTER TABLE public.books ADD COLUMN IF NOT EXISTS topic_id INTEGER REFERENCES public.topics(id) ON DELETE SET NULL;

-- 4. Enable RLS
ALTER TABLE public.syllabuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;

-- 5. Policies
DROP POLICY IF EXISTS "Allow public read" ON public.syllabuses;
CREATE POLICY "Allow public read" ON public.syllabuses FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow all management" ON public.syllabuses;
CREATE POLICY "Allow all management" ON public.syllabuses FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read" ON public.topics;
CREATE POLICY "Allow public read" ON public.topics FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow all management" ON public.topics;
CREATE POLICY "Allow all management" ON public.topics FOR ALL USING (true) WITH CHECK (true);

-- Verify
SELECT 'Syllabuses, Topics created and Books linked' AS info;
