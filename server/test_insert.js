const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log("Testing book insertion with fallback logic...");
  
  const testBook = {
    title: "Test Book " + Date.now(),
    author: "Test Author",
    file: "https://example.com/test.pdf",
    thumbnail: "https://example.com/test.jpg",
    category: "Computer Security",
    category_id: 1 // This will fail if column missing, but we want to see the error code
  };

  // Simulate what the backend does
  console.log("1. Attempting insert with category_id...");
  let { data, error } = await supabase.from('books').insert([testBook]).select();

  if (error) {
    console.log("Insert failed as expected (or due to real error):", error.code, error.message);
    
    if (error.code === 'PGRST204' || error.message.includes('category_id')) {
      console.log("Confirmed: category_id column missing. Retrying with fallback...");
      
      const fallbackData = { ...testBook };
      delete fallbackData.category_id;
      
      const retry = await supabase.from('books').insert([fallbackData]).select();
      if (retry.error) {
        console.error("Fallback insert failed:", retry.error);
      } else {
        console.log("Fallback insert SUCCESSFUL!", retry.data[0]);
      }
    } else {
      console.error("Unexpected error code:", error.code);
    }
  } else {
    console.log("Insert SUCCESSFUL (category_id exists!)", data[0]);
  }
}

test();
