const { app, loadDB } = require('../server/app');

// Ensure DB is loaded if needed (though we use Supabase now, so loadDB might be for local legacy)
if (typeof loadDB === 'function') {
  loadDB();
}

module.exports = app;
