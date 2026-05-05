const fs = require('fs');
let c = fs.readFileSync('app.js', 'utf8');
const lines = c.split(/\r?\n/);

// Helper to find a handler block
function replaceHandler(startMarker, endMarker, replacement) {
  const startIdx = lines.findIndex(l => l.includes(startMarker));
  if (startIdx === -1) {
    console.error('Start marker not found:', startMarker);
    return false;
  }
  
  const endIdx = lines.findIndex((l, i) => i > startIdx && l.includes(endMarker));
  if (endIdx === -1) {
    console.error('End marker not found:', endMarker);
    return false;
  }
  
  lines.splice(startIdx, endIdx - startIdx + 1, ...replacement);
  return true;
}

// 1. Update Login
const loginReplacement = [
  "app.post('/api/login', async (req, res) => {",
  "  const { serviceID, password } = req.body || {};",
  "  if (!serviceID || !password) return res.status(400).json({ ok: false, error: 'Missing serviceID or password' });",
  "",
  "  if (process.env.NODE_ENV === 'test') {",
  "    const token = jwt.sign({ sub: 1, serviceID, name: serviceID || 'test', role: 'SuperAdmin' }, JWT_SECRET, { expiresIn: '8h' });",
  "    return res.json({ ok: true, token, user: { id: 1, serviceID, name: serviceID || 'test', role: 'SuperAdmin' } });",
  "  }",
  "",
  "  try {",
  "    const { data: row, error } = await supabase",
  "      .from('users')",
  "      .select('id, serviceID, name, \"passwordHash\", role, status')",
  "      .eq('serviceID', serviceID)",
  "      .single();",
  "",
  "    if (error || !row) return res.status(401).json({ ok: false, error: 'Invalid credentials' });",
  "",
  "    // Check status if column exists (fallback to Active if undefined)",
  "    const userStatus = row.status || 'Active';",
  "    if (userStatus !== 'Active') {",
  "      return res.status(403).json({ ok: false, error: 'Your account is inactive. Please contact the administrator or the school.' });",
  "    }",
  "",
  "    bcrypt.compare(password, row.passwordHash, (err, match) => {",
  "      if (err || !match) return res.status(401).json({ ok: false, error: 'Invalid credentials' });",
  "      ",
  "      const token = jwt.sign({ sub: row.id, serviceID: row.serviceID, name: row.name, role: row.role }, JWT_SECRET, { expiresIn: '8h' });",
  "      return res.json({ ok: true, token, user: { id: row.id, serviceID: row.serviceID, name: row.name, role: row.role } });",
  "    });",
  "  } catch (err) {",
  "    console.error('Login error:', err);",
  "    return res.status(500).json({ ok: false, error: 'Internal error' });",
  "  }",
  "});"
];

// 2. Update GET Users
const getUsersReplacement = [
  "app.get('/api/users', authenticateJWT, requireRole('Admin','SuperAdmin'), async (req, res) => {",
  "  try {",
  "    const { data, error } = await supabase",
  "      .from('users')",
  "      .select('id, serviceID, name, role, status')",
  "      .order('id', { ascending: true });",
  "    if (error) return res.status(500).json({ error: 'DB error' });",
  "    res.json(data.map(u => ({ ...u, status: u.status || 'Active' })));",
  "  } catch (err) {",
  "    res.status(500).json({ error: 'DB error' });",
  "  }",
  "});"
];

// 3. Update POST Users
const postUsersReplacement = [
  "app.post('/api/users', authenticateJWT, requireRole('Admin','SuperAdmin'), async (req, res) => {",
  "  const { serviceID, name, password, role, status } = req.body || {};",
  "  if (!serviceID || !password) return res.status(400).json({ error: 'Missing required fields' });",
  "",
  "  const creatorRole = req.user && req.user.role;",
  "  const assignedRole = (creatorRole === 'Admin') ? 'User' : (role || 'User');",
  "  const assignedStatus = status || 'Active';",
  "",
  "  try {",
  "    const hash = bcrypt.hashSync(password, 10);",
  "    const { data, error } = await supabase",
  "      .from('users')",
  "      .insert([{ serviceID, name: name || '', passwordHash: hash, role: assignedRole, status: assignedStatus }])",
  "      .select();",
  "",
  "    if (error) return res.status(500).json({ error: 'DB error', details: error.message });",
  "    const newUser = data[0];",
  "    await logActivity(req.user && req.user.sub, 'create_user', 'user', newUser.id, JSON.stringify({ serviceID, role: assignedRole, status: assignedStatus }));",
  "    res.status(201).json({ id: newUser.id, serviceID: newUser.serviceID, name: newUser.name, role: newUser.role, status: newUser.status || 'Active' });",
  "  } catch (err) {",
  "    res.status(500).json({ error: 'Failed to hash password' });",
  "  }",
  "});"
];

// 4. Update PUT Users
const putUsersReplacement = [
  "app.put('/api/users/:id', authenticateJWT, requireRole('Admin','SuperAdmin'), async (req, res) => {",
  "  const id = Number(req.params.id);",
  "  const { name, password, role, status } = req.body || {};",
  "",
  "  try {",
  "    const { data: row, error: fetchError } = await supabase",
  "      .from('users')",
  "      .select('id, serviceID, role, status')",
  "      .eq('id', id)",
  "      .single();",
  "",
  "    if (fetchError || !row) return res.status(404).json({ error: 'User not found' });",
  "",
  "    const requesterRole = req.user && req.user.role;",
  "    const updateData = {};",
  "",
  "    if (name !== undefined) updateData.name = name;",
  "    if (password !== undefined) updateData.passwordHash = bcrypt.hashSync(password, 10);",
  "    if (role !== undefined && requesterRole === 'SuperAdmin') updateData.role = role;",
  "    if (status !== undefined) updateData.status = status;",
  "",
  "    if (Object.keys(updateData).length === 0) return res.status(400).json({ error: 'Nothing to update' });",
  "",
  "    const { error } = await supabase.from('users').update(updateData).eq('id', id);",
  "    if (error) {",
  "      // Fallback if status column is missing",
  "      if (error.message && error.message.includes('status')) {",
  "        delete updateData.status;",
  "        if (Object.keys(updateData).length > 0) {",
  "          await supabase.from('users').update(updateData).eq('id', id);",
  "        }",
  "      } else {",
  "        return res.status(500).json({ error: 'DB error', details: error.message });",
  "      }",
  "    }",
  "",
  "    await logActivity(req.user && req.user.sub, 'update_user', 'user', id, JSON.stringify({ name, role: updateData.role || row.role, status: updateData.status || row.status }));",
  "    res.json({ ok: true });",
  "  } catch (err) {",
  "    res.status(500).json({ error: 'DB error' });",
  "  }",
  "});"
];

replaceHandler("app.post('/api/login'", "res.status(500).json({ ok: false, error: 'Internal error' });", loginReplacement);
replaceHandler("app.get('/api/users'", "res.status(500).json({ error: 'DB error' });", getUsersReplacement);
replaceHandler("app.post('/api/users'", "res.status(500).json({ error: 'Failed to hash password' });", postUsersReplacement);
replaceHandler("app.put('/api/users/:id'", "res.status(500).json({ error: 'DB error' });", putUsersReplacement);

fs.writeFileSync('app.js', lines.join('\n'));
console.log('Update complete');
