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

const postReplacement = [
  "app.post('/api/books', maybeAuthenticate, maybeRequireRole('Admin','SuperAdmin'), async (req, res) => {",
  "  const body = req.body || {};",
  "  const { title, author, category_id, pdf_url, thumbnail_url } = body;",
  "",
  "  const missing = [];",
  "  if (!title) missing.push('title');",
  "  if (!author) missing.push('author');",
  "  if (!pdf_url) missing.push('pdf_url');",
  "",
  "  if (missing.length > 0) {",
  "    return res.status(400).json({ error: `[fixed-backend] Missing required fields: ${missing.join(', ')}` });",
  "  }",
  "",
  "  let categoryName = 'Uncategorized';",
  "  if (category_id) {",
  "    try {",
  "      const { data: catData } = await supabase.from('book_categories').select('name').eq('id', category_id).single();",
  "      if (catData) categoryName = catData.name;",
  "      else if (typeof category_id === 'number' && category_id <= 10) {",
  "        categoryName = ['Computer Security', 'Data management', 'Windows Management', 'Computer Hardware', 'Drone', 'Computer Network', 'Forensics', 'Artificial Intelligence', 'Training', 'Leadership'][category_id - 1];",
  "      }",
  "    } catch (e) {",
  "      if (typeof category_id === 'number' && category_id <= 10) {",
  "        categoryName = ['Computer Security', 'Data management', 'Windows Management', 'Computer Hardware', 'Drone', 'Computer Network', 'Forensics', 'Artificial Intelligence', 'Training', 'Leadership'][category_id - 1];",
  "      }",
  "    }",
  "  }",
  "",
  "  const insertData = { title, author, file: pdf_url, thumbnail: thumbnail_url, category: categoryName };",
  "  let { data, error } = await supabase.from('books').insert([{ ...insertData, category_id }]).select();",
  "",
  "  if (error && (error.code === 'PGRST204' || error.message?.includes('category_id'))) {",
  "    console.warn(\"category_id column missing, falling back to category string\");",
  "    const retry = await supabase.from('books').insert([insertData]).select();",
  "    data = retry.data; error = retry.error;",
  "  }",
  "",
  "  if (error || !data || data.length === 0) {",
  "    console.error(\"Failed to insert book to supabase:\", error);",
  "    return res.status(500).json({ error: 'Failed to save book permanently to Postgres', details: error?.message });",
  "  }",
  "",
  "  const response = { ...data[0], category: categoryName };",
  "  try { logActivity(req.user && req.user.sub, 'create_book', 'book', data[0].id, JSON.stringify({ title: data[0].title })); } catch (e) {}",
  "  res.status(201).json(response);",
  "});"
];

const putReplacement = [
  "app.put('/api/books/:id', maybeAuthenticate, maybeRequireRole('Admin','SuperAdmin'), async (req, res) => {",
  "  const id = Number(req.params.id);",
  "  const body = req.body || {};",
  "  const updateData = {};",
  "  if (body.title) updateData.title = body.title;",
  "  if (body.author) updateData.author = body.author;",
  "  if (body.pdf_url) updateData.file = body.pdf_url;",
  "  if (body.thumbnail_url !== undefined) updateData.thumbnail = body.thumbnail_url;",
  "",
  "  if (body.category_id !== undefined && body.category_id !== null) {",
  "    updateData.category_id = body.category_id;",
  "    try {",
  "      const { data: catData } = await supabase.from('book_categories').select('name').eq('id', body.category_id).single();",
  "      if (catData) updateData.category = catData.name;",
  "      else if (typeof body.category_id === 'number' && body.category_id <= 10) {",
  "        updateData.category = ['Computer Security', 'Data management', 'Windows Management', 'Computer Hardware', 'Drone', 'Computer Network', 'Forensics', 'Artificial Intelligence', 'Training', 'Leadership'][body.category_id - 1];",
  "      }",
  "    } catch (e) {",
  "      if (typeof body.category_id === 'number' && body.category_id <= 10) {",
  "        updateData.category = ['Computer Security', 'Data management', 'Windows Management', 'Computer Hardware', 'Drone', 'Computer Network', 'Forensics', 'Artificial Intelligence', 'Training', 'Leadership'][body.category_id - 1];",
  "      }",
  "    }",
  "  }",
  "",
  "  if (Object.keys(updateData).length === 0) return res.status(400).json({ error: 'Nothing to update' });",
  "",
  "  let { data, error } = await supabase.from('books').update(updateData).eq('id', id).select();",
  "  if (error && (error.code === 'PGRST204' || error.message?.includes('category_id'))) {",
  "    console.warn(\"category_id column missing, falling back to category string for update\");",
  "    const cleanUpdate = { ...updateData }; delete cleanUpdate.category_id;",
  "    const retry = await supabase.from('books').update(cleanUpdate).eq('id', id).select();",
  "    data = retry.data; error = retry.error;",
  "  }",
  "",
  "  if (error || !data || data.length === 0) {",
  "    console.error(\"Failed to update book in supabase:\", error);",
  "    return res.status(404).json({ error: 'Book not found or failed to update', details: error?.message });",
  "  }",
  "",
  "  const response = { ...data[0], category: data[0].category || 'Uncategorized' };",
  "  try { logActivity(req.user.sub, 'update_book', 'book', id, JSON.stringify({ title: updateData.title || '' })); } catch (e) {}",
  "  res.json(response);",
  "});"
];

replaceHandler("app.post('/api/books'", "res.status(201).json(response);", postReplacement);
replaceHandler("app.put('/api/books/:id'", "res.json(response);", putReplacement);

fs.writeFileSync('app.js', lines.join('\n'));
console.log('Update complete');
