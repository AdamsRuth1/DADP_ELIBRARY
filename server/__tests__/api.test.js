const fs = require('fs');
const path = require('path');
const os = require('os');
const request = require('supertest');

// create a temporary DB file for test isolation
const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'dadp-elibrary-'));
const DB_PATH = path.join(tmpDir, 'db.json');

const initial = {
  books: [
    { id: 1, title: 'History of CCTV', author: 'J. Smith', category: 'CCTV', file: '/books/history-of-cctv.pdf' },
    { id: 2, title: 'Engineering Field Manual', author: 'A. Musa', category: 'Engineering', file: '/books/tce.pdf' },
    { id: 3, title: 'Leadership in Operations', author: 'K. Ade', category: 'Leadership', file: '/books/na-doctrine.pdf' },
    { id: 4, title: 'AI', author: 'J. Smith', category: 'AI', file: '/books/ai.docx' },
    { id: 5, title: 'Computer Forensics', author: 'A. Musa', category: 'Computer Forensics', file: '/books/forensics.docx' },
    { id: 6, title: 'Ethical Hacking', author: 'Ade', category: 'Ethical Hacking', file: '/books/ethicalHacking.docx' },
  ]
  };

fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2), 'utf8');

// point app to the temp DB before requiring it
process.env.DB_PATH = DB_PATH;

const { app } = require('../app');

describe('API endpoints', () => {
  test('GET /api/books returns initial books', async () => {
    const res = await request(app).get('/api/books');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(6);
    expect(res.body[0].title).toBe('History of CCTV');
  });

  test('POST /api/books creates a book', async () => {
    const payload = { title: 'New Book', author: 'Tester', category: 'Test', file: '/books/history-of-cctv.pdf' };
    const res = await request(app).post('/api/books').send(payload);
    expect(res.status).toBe(201);
    expect(res.body.id).toBeGreaterThan(3);

    const list = await request(app).get('/api/books');
    expect(list.body.length).toBe(7);
  });

  test('PUT /api/books/:id updates a book', async () => {
    const update = { title: 'Updated Title' };
    const res = await request(app).put('/api/books/4').send(update);
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Updated Title');
  });

  test('DELETE /api/books/:id removes the book', async () => {
    const res = await request(app).delete('/api/books/4');
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);

    const getRes = await request(app).get('/api/books/4');
    expect(getRes.status).toBe(404);
  });

  test('POST /api/login validation', async () => {
    const bad = await request(app).post('/api/login').send({ serviceID: 'a' });
    expect(bad.status).toBe(400);

    const ok = await request(app).post('/api/login').send({ serviceID: 'a', password: 'b' });
    expect(ok.status).toBe(200);
    expect(ok.body.ok).toBe(true);
  });
});
