require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function showRecords() {
  try {
    await client.connect();
    
    console.log("--- BOOKS ---");
    const books = await client.query('SELECT * FROM books LIMIT 5');
    console.table(books.rows);

    console.log("\n--- USERS ---");
    const users = await client.query('SELECT id, "serviceID", name, role FROM users LIMIT 5');
    console.table(users.rows);

    await client.end();
  } catch (err) {
    console.error('Error fetching records:', err);
    await client.end();
  }
}

showRecords();
