require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function showRecords() {
  try {
    console.log("Fetching records from Supabase via REST API...\n");

    console.log("--- BOOKS ---");
    const { data: books, error: booksErr } = await supabase.from('books').select('*').limit(5);
    if (booksErr) console.error("Error fetching books:", booksErr.message);
    else console.table(books);

    console.log("\n--- USERS ---");
    const { data: users, error: usersErr } = await supabase.from('users').select('id, serviceID, name, role').limit(5);
    if (usersErr) console.error("Error fetching users:", usersErr.message);
    else console.table(users);

    console.log("\n--- ACTIVITIES ---");
    const { data: activities, error: actErr } = await supabase.from('activities').select('*').limit(5);
    if (actErr) console.error("Error fetching activities:", actErr.message);
    else console.table(activities);

  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

showRecords();
