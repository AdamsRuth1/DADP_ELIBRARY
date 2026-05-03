require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateCategories() {
  try {
    console.log('Starting category migration...');

    // Step 1: Create book_categories table (run this SQL in Supabase dashboard first)
    console.log('\nPlease run the following SQL in your Supabase SQL Editor:\n');
    console.log(`
-- Create book_categories table
CREATE TABLE IF NOT EXISTS book_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add category_id column to books table
ALTER TABLE books ADD COLUMN IF NOT EXISTS category_id INTEGER REFERENCES book_categories(id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_books_category_id ON books(category_id);
`);

    console.log('\nAfter running the SQL above, press Enter to continue with data migration...');
    await waitForEnter();

    // Step 2: Fetch all distinct categories from books table
    console.log('\nFetching distinct categories from books...');
    const { data: books, error: fetchError } = await supabase
      .from('books')
      .select('id, category')
      .not('category', 'is', null);

    if (fetchError) {
      console.error('Error fetching books:', fetchError);
      return;
    }

    // Get unique categories
    const uniqueCategories = [...new Set(books.map(b => b.category).filter(c => c && c.trim() !== ''))];
    console.log(`Found ${uniqueCategories.length} unique categories:`, uniqueCategories);

    if (uniqueCategories.length === 0) {
      console.log('No categories to migrate.');
      return;
    }

    // Step 3: Insert categories into book_categories table
    console.log('\nInserting categories into book_categories table...');
    const { data: insertedCategories, error: insertError } = await supabase
      .from('book_categories')
      .upsert(
        uniqueCategories.map(name => ({ name: name.trim() })),
        { onConflict: 'name', ignoreDuplicates: true }
      )
      .select();

    if (insertError) {
      console.error('Error inserting categories:', insertError);
      return;
    }

    console.log(`Inserted ${insertedCategories?.length || 0} categories`);

    // Step 4: Fetch all categories with their IDs
    const { data: allCategories, error: catError } = await supabase
      .from('book_categories')
      .select('id, name');

    if (catError) {
      console.error('Error fetching categories:', catError);
      return;
    }

    // Create a map of category name to ID
    const categoryMap = {};
    allCategories.forEach(cat => {
      categoryMap[cat.name] = cat.id;
    });

    // Step 5: Update books with category_id
    console.log('\nUpdating books with category_id...');
    let updatedCount = 0;

    for (const book of books) {
      if (book.category && categoryMap[book.category]) {
        const { error: updateError } = await supabase
          .from('books')
          .update({ category_id: categoryMap[book.category] })
          .eq('id', book.id);

        if (updateError) {
          console.error(`Error updating book ${book.id}:`, updateError);
        } else {
          updatedCount++;
        }
      }
    }

    console.log(`Updated ${updatedCount} books with category_id`);

    // Step 6: Update backend to use category_id
    console.log('\nMigration complete!');
    console.log('Next steps:');
    console.log('1. The backend and frontend have been updated to use category_id');
    console.log('2. Optionally, you can drop the old "category" column after verifying everything works:');
    console.log('   ALTER TABLE books DROP COLUMN category;');

  } catch (err) {
    console.error('Migration failed:', err);
  }
}

function waitForEnter() {
  return new Promise(resolve => {
    process.stdin.once('data', () => resolve());
  });
}

migrateCategories();
