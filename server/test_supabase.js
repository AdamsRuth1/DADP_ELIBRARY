require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function testSupabase() {
  console.log("Testing tables...");
  // Test if books table exists or if we can fetch
  let { data, error } = await supabase.from('books').select('*').limit(1);
  if (error) {
    console.log("Error querying books table ->", error.message);
  } else {
    console.log("Books table exists and returned:", data);
  }
}
testSupabase();
