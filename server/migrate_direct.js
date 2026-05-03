require('dotenv').config();
const fetch = require('node-fetch');

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

async function runSQL(sql) {
  const response = await fetch(`${supabaseUrl}/rest/v1/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${serviceKey}`,
      'Prefer': 'params=single-object'
    },
    body: JSON.stringify({
      query: sql
    })
  });

  return response;
}

async function runMigration() {
  console.log('Starting direct migration to Supabase...\n');

  const sqlCommands = [
    {
      name: 'Create book_categories table',
      sql: `
        CREATE TABLE IF NOT EXISTS public.book_categories (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) UNIQUE NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    },
    {
      name: 'Enable RLS',
      sql: `ALTER TABLE public.book_categories ENABLE ROW LEVEL SECURITY;`
    },
    {
      name: 'Create read policy',
      sql: `
        DO $$ BEGIN
          DROP POLICY IF EXISTS "Allow public read" ON public.book_categories;
          CREATE POLICY "Allow public read" ON public.book_categories
            FOR SELECT USING (true);
        END $$;
      `
    },
    {
      name: 'Create insert policy',
      sql: `
        DO $$ BEGIN
          DROP POLICY IF EXISTS "Allow authenticated insert" ON public.book_categories;
          CREATE POLICY "Allow authenticated insert" ON public.book_categories
            FOR INSERT WITH CHECK (auth.role() = 'authenticated');
        END $$;
      `
    },
    {
      name: 'Insert default categories',
      sql: `
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
      `
    },
    {
      name: 'Add category_id to books (optional)',
      sql: `
        DO $$ BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_name = 'books' AND column_name = 'category_id'
          ) THEN
            ALTER TABLE public.books ADD COLUMN category_id INTEGER;
            ALTER TABLE public.books
            ADD CONSTRAINT fk_books_category_id
            FOREIGN KEY (category_id) REFERENCES public.book_categories(id);
          END IF;
        END $$;
      `
    }
  ];

  for (const cmd of sqlCommands) {
    console.log(`Running: ${cmd.name}...`);
    try {
      // Supabase doesn't expose SQL API directly via JS client
      // We need to use the management API or pg connection
      console.log(`  -> SQL: ${cmd.sql.substring(0, 60)}...`);
      console.log(`  -> Note: Run this manually in Supabase SQL Editor\n`);
    } catch (err) {
      console.error(`  -> Error: ${err.message}\n`);
    }
  }

  console.log('===========================================');
  console.log('INSTRUCTIONS: Since direct SQL execution is not available via JS client,');
  console.log('please run the SQL below in Supabase SQL Editor:\n');
  console.log(`-- Copy and paste this into Supabase SQL Editor:
-- Go to: Supabase Dashboard -> SQL Editor -> New Query

${sqlCommands.map(c => c.sql).join('\n\n')}

-- Verify:
SELECT * FROM public.book_categories ORDER BY name;
`);
}

runMigration();
