require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  try {
    await client.connect();
    console.log('Connected to Supabase PostgreSQL');

    await client.query(`
      CREATE TABLE IF NOT EXISTS books (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        category TEXT,
        file TEXT NOT NULL,
        thumbnail TEXT
      );
    `);
    console.log('Books table verified.');

    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        "serviceID" TEXT UNIQUE NOT NULL,
        name TEXT,
        "passwordHash" TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'User'
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
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Activities table verified.');

    await client.query(`
      CREATE TABLE IF NOT EXISTS ratings (
        id SERIAL PRIMARY KEY,
        "userId" INTEGER NOT NULL,
        "bookId" INTEGER NOT NULL,
        rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
        review TEXT,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Ratings table verified.');

    await client.query(`
      CREATE TABLE IF NOT EXISTS instructor_materials (
        id SERIAL PRIMARY KEY,
        instructor_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        type TEXT NOT NULL,
        content TEXT,
        "fileUrl" TEXT,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Instructor materials table verified.');

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_ratings_user_book ON ratings("userId", "bookId");
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_ratings_book ON ratings("bookId");
    `);
    console.log('Indexes created.');

    await client.end();
    console.log('Schema migration complete.');
  } catch (err) {
    console.error('Migration error:', err);
  }
}
run();
