require('dotenv').config();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const SQLITE_PATH = path.join(__dirname, 'data.sqlite');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

function promiseDb(db) {
  return {
    all(sql, params = []) {
      return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => err ? reject(err) : resolve(rows));
      });
    },
    get(sql, params = []) {
      return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => err ? reject(err) : resolve(row));
      });
    }
  };
}

async function migrate() {
  const db = new sqlite3.Database(SQLITE_PATH);
  const pdb = promiseDb(db);

  try {
    // Migrate users
    console.log('Migrating users...');
    const users = await pdb.all('SELECT id, serviceID, name, passwordHash, role FROM users ORDER BY id');
    console.log(`Found ${users.length} users in SQLite`);

    for (const user of users) {
      const { data: existing } = await supabase
        .from('users')
        .select('id')
        .eq('serviceID', user.serviceID)
        .single();

      if (existing) {
        const { error } = await supabase
          .from('users')
          .update({ name: user.name, passwordHash: user.passwordHash, role: user.role })
          .eq('serviceID', user.serviceID);
        if (error) console.error(`  Update failed for ${user.serviceID}:`, error.message);
        else console.log(`  Updated: ${user.serviceID} (${user.role})`);
      } else {
        const { data, error } = await supabase
          .from('users')
          .insert([{
            id: user.id,
            serviceID: user.serviceID,
            name: user.name,
            passwordHash: user.passwordHash,
            role: user.role
          }])
          .select();
        if (error) console.error(`  Insert failed for ${user.serviceID}:`, error.message);
        else console.log(`  Inserted: ${user.serviceID} (${user.role})`);
      }
    }

    // Verify migration
    const { data: migratedUsers } = await supabase.from('users').select('id, serviceID, name, role').order('id', { ascending: true });
    console.log('\nMigrated users in Supabase:');
    console.table(migratedUsers);

    console.log('\nMigration complete!');
  } catch (err) {
    console.error('Migration error:', err);
  } finally {
    db.close();
  }
}

migrate();
