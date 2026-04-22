require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // Required for Supabase
});

async function run() {
  try {
    await client.connect();
    console.log('Connected to Supabase PostgreSQL');

    // Create Books Table
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

    // Create Users Table
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

    // Create Activities Table
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

    await client.end();
    console.log('Schema migration complete.');
  } catch (err) {
    console.error('Migration error:', err);
  }
}
run();
