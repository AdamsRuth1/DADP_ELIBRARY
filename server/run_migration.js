require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
  console.log('Starting migration...\n');

  // Step 1: Create book_categories table
  console.log('1. Creating book_categories table...');
  const { error: createError } = await supabase.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS public.book_categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `
  });

  if (createError) {
    console.log('Note: Table creation via RPC failed (this is normal if exec_sql doesn\'t exist)');
    console.log('Please run the SQL manually in Supabase SQL Editor\n');
  }

  // Step 2: Try to insert categories (this will fail if table doesn't exist)
  console.log('2. Inserting default categories...');
  const defaultCategories = [
    'Computer Security', 'Data management', 'Windows Management',
    'Computer Hardware', 'Drone', 'Computer Network',
    'Forensics', 'Artificial Intelligence', 'Training', 'Leadership'
  ];

  // Try inserting one by one to handle if table exists
  for (const name of defaultCategories) {
    const { error } = await supabase
      .from('book_categories')
      .upsert([{ name }], { onConflict: 'name', ignoreDuplicates: true });

    if (error) {
      console.log(`  - "${name}": Table may not exist yet`);
    } else {
      console.log(`  + "${name}": Inserted/exists`);
    }
  }

  console.log('\n========================================');
  console.log('MIGRATION INSTRUCTIONS:');
  console.log('========================================');
  console.log('Since direct SQL execution may not be available,');
  console.log('please run the following SQL in your Supabase SQL Editor:');
  console.log('\n--- Copy and paste this SQL ---\n');
  console.log(`
-- Create book_categories table
CREATE TABLE IF NOT EXISTS public.book_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (optional)
ALTER TABLE public.book_categories ENABLE ROW LEVEL SECURITY;

-- Allow public read
DROP POLICY IF EXISTS "Allow public read" ON public.book_categories;
CREATE POLICY "Allow public read" ON public.book_categories FOR SELECT USING (true);

-- Allow authenticated insert
DROP POLICY IF EXISTS "Allow authenticated insert" ON public.book_categories;
CREATE POLICY "Allow authenticated insert" ON public.book_categories
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Insert default categories
INSERT INTO public.book_categories (name) VALUES
  ('Computer Security'), ('Data management'), ('Windows Management'),
  ('Computer Hardware'), ('Drone'), ('Computer Network'),
  ('Forensics'), ('Artificial Intelligence'), ('Training'), ('Leadership')
ON CONFLICT (name) DO NOTHING;

-- Verify
SELECT * FROM public.book_categories ORDER BY name;
  `);
  console.log('\n--- End of SQL ---\n');
  console.log('After running the SQL, restart your backend server.');
}

runMigration();
