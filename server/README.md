# DADP eLibrary backend

Minimal Express backend for the DADP eLibrary frontend.

Endpoints

- GET /api/books -> list of books
- GET /api/books/:id -> book by id
- POST /api/login -> simple mock login (accepts { serviceID, password })
- GET /books/\* -> serves PDF files from the repo `public/` folder

Authentication (demo)

- The server now uses SQLite for users and returns a signed JWT on login.
- Demo credentials (seeded): serviceID: `demo`, password: `demo123`
- Protected routes: PUT /api/books/:id and DELETE /api/books/:id require a Bearer token.
- JWT secret is read from `JWT_SECRET` (default `dev-secret`).

Run

1. cd server
2. npm install
3. npm start

Server runs on port 4000 by default.

-- Omega-- Books not currently stored in db, to be implemented on production
