require('dotenv').config();
const { Client } = require('pg');

// Get password from env or use a placeholder
const password = process.env.DB_PASSWORD || process.env.SUPABASE_DB_PASSWORD || 'YOUR_PASSWORD_HERE';

async function runMigration() {
  const connectionString = `postgresql://postgres:${password}@db.sjefadlcadncghkjewvw.supabase.co:5432/postgres`;
  const client = new Client({ connectionString });

  const commands = [
    {
      sql: `CREATE TABLE IF NOT EXISTS public.book_categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );`,
      desc: 'Create book_categories table'
    },
    {
      sql: `ALTER TABLE public.book_categories ENABLE ROW LEVEL SECURITY;`,
      desc: 'Enable RLS'
    },
    {
      sql: `DO $$ BEGIN
        DROP POLICY IF EXISTS "Allow public read" ON public.book_categories;
        CREATE POLICY "Allow public read" ON public.book_categories
          FOR SELECT USING (true);
      END $$;`,
      desc: 'Create read policy'
    },
    {
      sql: `DO $$ BEGIN
        DROP POLICY IF EXISTS "Allow authenticated insert" ON public.book_categories;
        CREATE POLICY "Allow authenticated insert" ON public.book_categories
          FOR INSERT WITH CHECK (auth.role() = 'authenticated');
      END $$;`,
      desc: 'Create insert policy'
    },
    {
      sql: `INSERT INTO public.book_categories (name) VALUES
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
      ON CONFLICT (name) DO NOTHING;`,
      desc: 'Insert default categories'
    },
    {
      sql: `DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'books' AND column_name = 'category_id'
        ) THEN
          ALTER TABLE public.books ADD COLUMN category_id INTEGER;
          ALTER TABLE public.books
          ADD CONSTRAINT fk_books_category_id
          FOREIGN KEY (category_id) REFERENCES public.book_categories(id);
        END IF;
      END $$;`,
      desc: 'Add category_id to books (optional)'
    }
  ];

  try {
    await client.connect();
    console.log('Connected to Supabase database\n');

    for (const cmd of commands) {
      console.log(`Running: ${cmd.desc}...`);
      try {
        await client.query(cmd.sql);
        console.log('  ✓ Success\n');
      } catch (err) {
        console.log(`  ✗ Error: ${err.message}\n`);
      }
    }

    // Verify
    console.log('Verifying...');
    const result = await client.query('SELECT * FROM public.book_categories ORDER BY name');
    console.log('\nCategories in database:');
    console.table(result.rows);

    await client.end();
    console.log('\n✓ Migration complete! Restart your backend server.');

  } catch (err) {
    console.error('Connection failed:', err.message);
    console.log('\nTo get your database password:');
    console.log('1. Go to Supabase Dashboard -> Project Settings -> Database');
    console.log('2. Look for "Connection string" under "URI"');
    console.log('3. The password is the one you set when creating the project\n');
  }
}

runMigration();
