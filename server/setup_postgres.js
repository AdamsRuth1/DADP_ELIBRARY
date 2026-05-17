const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  try {
    await client.connect();
    console.log('Connected to Supabase PostgreSQL');

    // 1. Syllabuses table
    await client.query(`
      CREATE TABLE IF NOT EXISTS syllabuses (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        author_id INTEGER,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    console.log('Syllabuses table verified.');

    // 2. Topics table
    await client.query(`
      CREATE TABLE IF NOT EXISTS topics (
        id SERIAL PRIMARY KEY,
        syllabus_id INTEGER REFERENCES syllabuses(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        description TEXT,
        author_id INTEGER,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    console.log('Topics table verified.');

    // 3. Books table (add topic_id)
    await client.query(`
      CREATE TABLE IF NOT EXISTS books (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        category TEXT,
        file TEXT NOT NULL,
        thumbnail TEXT,
        topic_id INTEGER REFERENCES topics(id) ON DELETE SET NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    
    // Check if topic_id column exists, if not add it
    await client.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'books' AND column_name = 'topic_id') THEN
          ALTER TABLE books ADD COLUMN topic_id INTEGER REFERENCES topics(id) ON DELETE SET NULL;
        END IF;
      END $$;
    `);
    console.log('Books table verified with topic_id.');

    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        "serviceID" TEXT UNIQUE NOT NULL,
        name TEXT,
        "passwordHash" TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'User',
        status TEXT DEFAULT 'Active'
      );
    `);
    console.log('Users table verified.');

    await client.query(`
      CREATE TABLE IF NOT EXISTS activities (
        id SERIAL PRIMARY KEY,
        "actorId" INTEGER,
        action TEXT,
        "targetType" TEXT,
        "targetId" INTEGER,
        details TEXT,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    console.log('Activities table verified.');

    await client.end();
    console.log('Schema migration complete.');
  } catch (err) {
    console.error('Migration error:', err);
  } finally {
    // client might not be defined if connection failed
  }
}
run();
