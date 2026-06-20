const API = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:4000' : '');

async function login(serviceID, password) {
  const res = await fetch(`${API}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ serviceID, password }),
  });
  if (!res.ok) {
    const text = await res.text();
    try { return JSON.parse(text); } catch { return { ok: false, error: text || 'Login failed' }; }
  }
  return res.json();
}

async function verifyToken(token) {
  if (!token) return null;
  const res = await fetch(`${API}/api/me`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) return null;
  return res.json();
}

export default { login, verifyToken };
