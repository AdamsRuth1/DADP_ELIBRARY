const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function run() {
  try {
    await client.connect();
    console.log('Connected to Supabase Postgres');

    // 1. Create book_categories table if not exists
    console.log('Creating book_categories table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.book_categories (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        "createdAt" TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 2. Add category_id column to books table if not exists
    console.log('Checking for category_id column in books table...');
    const colCheck = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'books' AND column_name = 'category_id';
    `);

    if (colCheck.rowCount === 0) {
      console.log('Adding category_id column to books...');
      await client.query(`
        ALTER TABLE public.books 
        ADD COLUMN category_id INTEGER REFERENCES public.book_categories(id);
      `);
    } else {
      console.log('category_id column already exists.');
    }

    // 3. Seed default categories
    console.log('Seeding default categories...');
    const DEFAULT_CATEGORIES = [
      'Computer Security', 'Data management', 'Windows Management',
      'Computer Hardware', 'Drone', 'Computer Network',
      'Forensics', 'Artificial Intelligence', 'Training', 'Leadership'
    ];

    for (const name of DEFAULT_CATEGORIES) {
      await client.query(`
        INSERT INTO public.book_categories (name) 
        VALUES ($1) 
        ON CONFLICT (name) DO NOTHING;
      `, [name]);
    }

    console.log('Schema update complete!');
  } catch (err) {
    console.error('Error updating schema:', err);
  } finally {
    await client.end();
  }
}

run();
