require('dotenv').config();
const appModule = require('./app');

const app = appModule.app;

const PORT = process.env.PORT || 4000;

if (!app) {
  console.error("App is undefined - check app.js export");
  process.exit(1);
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});