const { app, loadDB } = require('./server/app');

if (typeof loadDB === 'function') {
  loadDB();
}

module.exports = app;
