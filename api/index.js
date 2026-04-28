try {
  const { app, loadDB } = require('../server/app');

  if (typeof loadDB === 'function') {
    loadDB();
  }

  module.exports = app;
} catch (err) {
  const express = require('express');
  const app = express();
  app.all('*', (req, res) => {
    res.status(500).json({ 
      error: 'Backend Bridge Crash', 
      details: err.message,
      stack: err.stack 
    });
  });
  module.exports = app;
}
