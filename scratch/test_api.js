
const fetch = require('node-fetch');

const API_BASE = 'http://localhost:4000';
const token = 'YOUR_TOKEN_HERE'; // I need a token to test

async function testCreateBook() {
    const payload = {
        title: 'Test Book',
        author: 'Test Author',
        category: 'Test Category',
        pdf_url: 'https://example.com/test.pdf',
        thumbnail_url: 'https://example.com/test.jpg'
    };

    const res = await fetch(`${API_BASE}/api/books`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
    });

    const data = await res.json();
    console.log('Response:', data);
}

// testCreateBook();
