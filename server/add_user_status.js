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

    // Add status column to users table if not exists
    console.log('Checking for status column in users table...');
    const colCheck = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'status';
    `);

    if (colCheck.rowCount === 0) {
      console.log('Adding status column to users...');
      await client.query(`
        ALTER TABLE public.users 
        ADD COLUMN status TEXT DEFAULT 'Active';
      `);
      console.log('Column added successfully.');
    } else {
      console.log('status column already exists.');
    }

    console.log('Migration complete!');
  } catch (err) {
    console.error('Error updating schema:', err);
  } finally {
    await client.end();
  }
}

run();
