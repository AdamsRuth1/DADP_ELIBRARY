const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const db = new sqlite3.Database(path.join(__dirname, 'data.sqlite'));

db.serialize(() => {
  db.all('SELECT * FROM users', (err, users) => console.log('Users:', users));
  db.all('SELECT * FROM activities LIMIT 5', (err, activities) => console.log('Activities:', activities));
  db.all('SELECT * FROM ratings LIMIT 5', (err, ratings) => console.log('Ratings:', ratings));
  db.all('SELECT * FROM instructor_materials LIMIT 5', (err, materials) => console.log('Materials:', materials));
});
