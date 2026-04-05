const { app } = require('./app');

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`DADP eLibrary backend listening on http://localhost:${PORT}`);
});
