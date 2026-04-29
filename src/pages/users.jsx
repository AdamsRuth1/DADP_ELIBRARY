import React, { useEffect, useState } from 'react';
import { Search, Plus, Edit, Trash2, ShieldAlert, BookOpen, AlertCircle, FileText, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../config/supabaseClient';
import { API_BASE } from "../config/apiBase";

function parseJwt(token) {
  try {
    const payload = token.split('.')[1];
    const json = decodeURIComponent(atob(payload).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(json);
  } catch (e) { return null; }
}

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ serviceID: '', name: '', password: '', role: 'User' });
  const token = localStorage.getItem('token');
  const jwt = token ? parseJwt(token) : null;
  const role = jwt ? jwt.role : null;

  const [books, setBooks] = useState([]);
  const [bookForm, setBookForm] = useState({ title: '', author: '', category: '', files: [], thumbnail: null });
  const [uploadQueue, setUploadQueue] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const [editingUserId, setEditingUserId] = useState(null);
  const [editUserForm, setEditUserForm] = useState({ name: '', password: '', role: 'User' });

  const [editingBookId, setEditingBookId] = useState(null);
  const [editBookForm, setEditBookForm] = useState({ title: '', author: '', category: '', file: null, thumbnail: null });

  const [viewHistory, setViewHistory] = useState({ open: false, bookId: null, rows: [] });
  const [bookModal, setBookModal] = useState({ open: false, mode: 'add', book: null }); // 'add' or 'edit'
  const [userModal, setUserModal] = useState({ open: false, mode: 'add', user: null }); // 'add' or 'edit'

  useEffect(() => {
    fetchUsers();
    fetchBooks();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    const res = await fetch(`${API_BASE}/api/users`, { headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) setUsers(await res.json());
    setLoading(false);
  }

  async function createUser(e) {
    e.preventDefault();
    // if editing, do update
    if (editingUserId) return updateUser(editingUserId);

    const res = await fetch(`${API_BASE}/api/users`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(form) });
    if (res.ok) {
      setForm({ serviceID: '', name: '', password: '', role: 'User' });
      setUserModal({ open: false, mode: 'add', user: null });
      fetchUsers();
    } else {
      const err = await res.json();
      alert(err.error || 'Failed');
    }
  }

  async function editUser(u) {
    setUserModal({ open: true, mode: 'edit', user: u });
    setEditUserForm({ name: u.name || '', password: '', role: u.role || 'User' });
  }

  function openAddUserModal() {
    setUserModal({ open: true, mode: 'add', user: null });
    setForm({ serviceID: '', name: '', password: '', role: 'User' });
  }

  async function updateUser(id) {
    const payload = {};
    if (editUserForm.name !== undefined) payload.name = editUserForm.name;
    if (editUserForm.password) payload.password = editUserForm.password;
    if (editUserForm.role && role === 'SuperAdmin') payload.role = editUserForm.role;

    const res = await fetch(`${API_BASE}/api/users/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) });
    if (res.ok) {
      setEditUserForm({ name: '', password: '', role: 'User' });
      setUserModal({ open: false, mode: 'add', user: null });
      fetchUsers();
    } else {
      const err = await res.json();
      alert(err.error || 'Failed to update');
    }
  }

  async function fetchBooks() {
    const res = await fetch(`${API_BASE}/api/books`);
    if (res.ok) {
      const data = await res.json();
      const fixUrl = (url) => {
        if (!url) return url;
        if (url.startsWith('http')) return url;
        return `${API_BASE}${url}`;
      };
      const mapped = data.map(b => ({
        ...b,
        file: fixUrl(b.file),
        thumbnail: fixUrl(b.thumbnail)
      }));
      setBooks(mapped);
    }
  }

  async function handleBookFileChange(e, setterName) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    if (setterName === 'book') setBookForm({...bookForm, files: Array.from(files)});
    else setEditBookForm({...editBookForm, file: files[0]});
  }

  async function handleThumbnailChange(e, setterName) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (setterName === 'book') setBookForm({...bookForm, thumbnail: file});
    else setEditBookForm({...editBookForm, thumbnail: file});
  }

  function queueBook(e) {
    e.preventDefault();
    if (!bookForm.files || bookForm.files.length === 0) return alert('No PDF selected');

    // Push into queue
    setUploadQueue([...uploadQueue, {
      title: bookForm.title,
      author: bookForm.author || 'Unknown',
      category: bookForm.category || '',
      file: bookForm.files[0],
      thumbnail: bookForm.thumbnail
    }]);

    // Clear form to allow entry of the next book immediately
    setBookForm({ title: '', author: '', category: '', files: [], thumbnail: null });
  }

  function removeQueuedBook(index) {
    setUploadQueue(uploadQueue.filter((_, i) => i !== index));
  }

  async function dispatchQueue() {
    if (uploadQueue.length === 0) return alert('No books in queue');
    setIsUploading(true);

    try {
        for (let i = 0; i < uploadQueue.length; i++) {
            const item = uploadQueue[i];
            
            const titleToUse = item.title || item.file.name.replace(/\.[^/.]+$/, "");
                
            // 1. Upload PDF to Supabase
            const pdfId = `${Date.now()}-${item.file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_')}`;
            const { error: pdfError } = await supabase.storage.from('books').upload(pdfId, item.file);
            
            if (pdfError) throw new Error(`PDF Upload Failed for ${titleToUse}: ${pdfError.message}`);
            
            const pdfUrl = supabase.storage.from('books').getPublicUrl(pdfId).data.publicUrl;

            // 2. Upload Thumbnail to Supabase Storage
            let thumbnailUrl = null;
            if (item.thumbnail) {
               const thumbId = `${Date.now()}-${item.thumbnail.name.replace(/[^a-zA-Z0-9.\-_]/g, '_')}`;
               const { error: thumbError } = await supabase.storage.from('thumbnails').upload(thumbId, item.thumbnail);
                 
               if (thumbError) throw new Error(`Thumbnail failed for ${titleToUse}: ${thumbError.message}`);
               thumbnailUrl = supabase.storage.from('thumbnails').getPublicUrl(thumbId).data.publicUrl;
            }

            // 3. Send metadata URLs to backend database
            const payload = {
                title: titleToUse,
                author: item.author,
                category: item.category,
                pdf_url: pdfUrl,
                thumbnail_url: thumbnailUrl
            };

            console.log('Hitting API:', `${API_BASE}/api/books`);
            const res = await fetch(`${API_BASE}/api/books`, { 
                method: 'POST', 
                headers: { 
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}` 
                }, 
                body: JSON.stringify(payload) 
            });
            if (!res.ok) {
                let errText;
                try {
                   const errJson = await res.json();
                   errText = errJson.error;
                } catch(parseErr) {
                   errText = `Server returned ${res.status} ${res.statusText}`;
                }
                throw new Error(errText || `Failed securely saving book: ${titleToUse}`);
            }
        }
        
        // Success
        setUploadQueue([]);
        setBookForm({ title: '', author: '', category: '', files: [], thumbnail: null });
        setBookModal({ open: false, mode: 'add', book: null });
        fetchBooks();
        alert(`Successfully deployed ${uploadQueue.length} books to the library!`);
    } catch(err) {
        console.error('Upload err:', err);
        alert(err.message || "An error occurred during bulk upload.");
    } finally {
        setIsUploading(false);
    }
  }

  async function editBook(b) {
    setBookModal({ open: true, mode: 'edit', book: b });
    setEditBookForm({ title: b.title || '', author: b.author || '', category: b.category || '', file: null, thumbnail: null });
  }

  function openAddBookModal() {
    setBookModal({ open: true, mode: 'add', book: null });
    setBookForm({ title: '', author: '', category: '', files: [], thumbnail: null });
  }

  async function updateBook(id) {
    setIsUploading(true);
    try {
      const payload = {
        title: editBookForm.title,
        author: editBookForm.author,
        category: editBookForm.category || ''
      };

      // 1. Upload new PDF if selected
      if (editBookForm.file) {
        const pdfId = `${Date.now()}-${editBookForm.file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_')}`;
        const { error: pdfError } = await supabase.storage.from('books').upload(pdfId, editBookForm.file);
        if (pdfError) throw new Error(`PDF Upload Failed: ${pdfError.message}`);
        payload.pdf_url = supabase.storage.from('books').getPublicUrl(pdfId).data.publicUrl;
      }

      // 2. Upload new Thumbnail if selected
      if (editBookForm.thumbnail) {
        const thumbId = `${Date.now()}-${editBookForm.thumbnail.name.replace(/[^a-zA-Z0-9.\-_]/g, '_')}`;
        const { error: thumbError } = await supabase.storage.from('thumbnails').upload(thumbId, editBookForm.thumbnail);
        if (thumbError) throw new Error(`Thumbnail Upload Failed: ${thumbError.message}`);
        payload.thumbnail_url = supabase.storage.from('thumbnails').getPublicUrl(thumbId).data.publicUrl;
      }

      // 3. Send metadata URLs to backend
      const res = await fetch(`${API_BASE}/api/books/${id}`, { 
        method: 'PUT', 
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        }, 
        body: JSON.stringify(payload) 
      });

      if (res.ok) {
        setEditBookForm({ title: '', author: '', category: '', file: null, thumbnail: null });
        setBookModal({ open: false, mode: 'add', book: null });
        fetchBooks();
        alert('Book updated successfully!');
      } else {
        const err = await res.json();
        throw new Error(err.error || 'Failed to update book');
      }
    } catch (err) {
      console.error('Update err:', err);
      alert(err.message || "An error occurred while updating the book.");
    } finally {
      setIsUploading(false);
    }
  }

  async function deleteBook(id) {
    if (!confirm('Delete book?')) return;
    const res = await fetch(`${API_BASE}/api/books/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) fetchBooks(); else alert('Failed to delete');
  }

  async function deleteUser(id) {
    if (!confirm('Delete user?')) return;
    const res = await fetch(`${API_BASE}/api/users/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) fetchUsers(); else alert('Failed to delete');
  }

  async function fetchViewHistory(bookId) {
    const res = await fetch(`${API_BASE}/api/books/${bookId}/views`, { headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) {
      const rows = await res.json();
      setViewHistory({ open: true, bookId, rows });
    } else {
      const err = await res.json();
      alert(err.error || 'Failed to fetch history');
    }
  }

//  async function fetchUsers() {
//   setLoading(true);
//   const res = await fetch(`${API}/users`, {
//     headers: { Authorization: `Bearer ${token}` }
//   });

//   if (res.ok) setUsers(await res.json());
//   setLoading(false);
// }

// async function createUser(e) {
//   e.preventDefault();

//   if (editingUserId) return updateUser(editingUserId);

//   const res = await fetch(`${API}/users`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: `Bearer ${token}`
//     },
//     body: JSON.stringify(form)
//   });

//   if (res.ok) {
//     setForm({ serviceID: '', name: '', password: '', role: 'User' });
//     setUserModal({ open: false, mode: 'add', user: null });
//     fetchUsers();
//   } else {
//     const err = await res.json();
//     alert(err.error || 'Failed');
//   }
// }

// async function updateUser(id) {
//   const payload = {};

//   if (editUserForm.name !== undefined) payload.name = editUserForm.name;
//   if (editUserForm.password) payload.password = editUserForm.password;
//   if (editUserForm.role && role === 'SuperAdmin') payload.role = editUserForm.role;

//   const res = await fetch(`${API}/users/${id}`, {
//     method: 'PUT',
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: `Bearer ${token}`
//     },
//     body: JSON.stringify(payload)
//   });

//   if (res.ok) {
//     setEditUserForm({ name: '', password: '', role: 'User' });
//     setUserModal({ open: false, mode: 'add', user: null });
//     fetchUsers();
//   } else {
//     const err = await res.json();
//     alert(err.error || 'Failed to update');
//   }
// }

// async function fetchBooks() {
//   const res = await fetch(`${API}/books`);
//   if (res.ok) setBooks(await res.json());
// }

// async function createBook(e) {
//   e.preventDefault();

//   const formData = new FormData();
//   formData.append('title', bookForm.title);
//   formData.append('author', bookForm.author);
//   formData.append('category', bookForm.category || '');

//   if (bookForm.file) formData.append('pdf', bookForm.file);
//   if (bookForm.thumbnail) formData.append('thumbnail', bookForm.thumbnail);

//   const res = await fetch(`${API}/books`, {
//     method: 'POST',
//     headers: { Authorization: `Bearer ${token}` },
//     body: formData
//   });

//   if (res.ok) {
//     setBookForm({ title: '', author: '', category: '', file: null, thumbnail: null });
//     setBookModal({ open: false, mode: 'add', book: null });
//     fetchBooks();
//   } else {
//     const err = await res.json();
//     alert(err.error || 'Failed to add book');
//   }
// }

// async function updateBook(id) {
//   const formData = new FormData();

//   if (editBookForm.title) formData.append('title', editBookForm.title);
//   if (editBookForm.author) formData.append('author', editBookForm.author);
//   if (editBookForm.category) formData.append('category', editBookForm.category || '');
//   if (editBookForm.file) formData.append('pdf', editBookForm.file);
//   if (editBookForm.thumbnail) formData.append('thumbnail', editBookForm.thumbnail);

//   const res = await fetch(`${API}/books/${id}`, {
//     method: 'PUT',
//     headers: { Authorization: `Bearer ${token}` },
//     body: formData
//   });

//   if (res.ok) {
//     setEditBookForm({ title: '', author: '', category: '', file: null, thumbnail: null });
//     setBookModal({ open: false, mode: 'add', book: null });
//     fetchBooks();
//   } else {
//     const err = await res.json();
//     alert(err.error || 'Failed to update book');
//   }
// }

// async function deleteBook(id) {
//   if (!confirm('Delete book?')) return;

//   const res = await fetch(`${API}/books/${id}`, {
//     method: 'DELETE',
//     headers: { Authorization: `Bearer ${token}` }
//   });

//   if (res.ok) fetchBooks();
//   else alert('Failed to delete');
// }

// async function deleteUser(id) {
//   if (!confirm('Delete user?')) return;

//   const res = await fetch(`${API}/users/${id}`, {
//     method: 'DELETE',
//     headers: { Authorization: `Bearer ${token}` }
//   });

//   if (res.ok) fetchUsers();
//   else alert('Failed to delete');
// }

// async function fetchViewHistory(bookId) {
//   const res = await fetch(`${API}/books/${bookId}/views`, {
//     headers: { Authorization: `Bearer ${token}` }
//   });

//   if (res.ok) {
//     const rows = await res.json();
//     setViewHistory({ open: true, bookId, rows });
//   } else {
//     const err = await res.json();
//     alert(err.error || 'Failed to fetch history');
//   }
// } 

  return (
    <section className="bg-slate-50 text-slate-900 p-4 md:p-6 min-h-screen md:ml-64">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <button
          className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800"
          onClick={openAddUserModal}
        >
          Add New User
        </button>
      </div>

      <div className="mb-6">
        {/* User form removed - now in modal */}
      </div>

      <div>
        {loading ? <p>Loading...</p> : (
          <table className="w-full text-left border-collapse">
            <thead><tr className="border-b"><th>ID</th><th>ServiceID</th><th>Name</th><th>Role</th><th>Actions</th></tr></thead>
            <tbody>
              {users.map(u=> (
                <tr key={u.id} className="border-b">
                  <td className="p-2">{u.id}</td>
                  <td className="p-2">{u.serviceID}</td>
                  <td className="p-2">{u.name}</td>
                  <td className="p-2">{u.role}</td>
                  <td className="p-2 flex gap-2">
                    <button className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600" onClick={()=>editUser(u)}>Edit</button>
                    <button className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700" onClick={()=>deleteUser(u.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      
      <hr className="my-6" />

      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Books (admin)</h2>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={openAddBookModal}
          >
            Add New Book
          </button>
        </div>

        <div>
          <table className="w-full text-left border-collapse">
            <thead><tr className="border-b"><th>ID</th><th>Title</th><th>Author</th><th>Category</th><th>Actions</th></tr></thead>
            <tbody>
              {books.map(b=> (
                <tr key={b.id} className="border-b">
                  <td className="p-2">{b.id}</td>
                  <td className="p-2">{b.title}</td>
                  <td className="p-2">{b.author}</td>
                  <td className="p-2">{b.category}</td>
                  <td className="p-2 flex gap-2">
                    <button className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600" onClick={()=>editBook(b)}>Edit</button>
                    <button className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700" onClick={()=>deleteBook(b.id)}>Delete</button>
                    <button className="px-2 py-1 bg-indigo-700 text-white rounded hover:bg-indigo-800" onClick={()=>fetchViewHistory(b.id)}>View History</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {viewHistory.open && (
          <div className="mt-4 p-4 bg-white border rounded">
            <h3 className="text-lg font-semibold">View history for book #{viewHistory.bookId}</h3>
            <button className="px-2 py-1 bg-gray-300 rounded mt-2" onClick={()=>setViewHistory({ open:false, bookId:null, rows:[] })}>Close</button>
            <div className="mt-2">
              {viewHistory.rows.length === 0 ? <p>No views recorded.</p> : (
                <table className="w-full text-left border-collapse mt-2">
                  <thead><tr className="border-b"><th>When</th><th>User</th><th>ServiceID</th></tr></thead>
                  <tbody>
                    {viewHistory.rows.map(r => (
                      <tr key={r.id} className="border-b">
                        <td className="p-2">{new Date(r.createdAt).toLocaleString()}</td>
                        <td className="p-2">{r.name || '—'}</td>
                        <td className="p-2">{r.serviceID || 'anonymous'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* User Modal */}
        {userModal.open && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold mb-4">
                {userModal.mode === 'add' ? 'Add New User' : 'Edit User'}
              </h3>

              <form onSubmit={userModal.mode === 'add' ? createUser : (e) => { e.preventDefault(); updateUser(userModal.user.id); }}>
                <div className="space-y-4">
                  {userModal.mode === 'add' && (
                    <div>
                      <label className="block text-sm font-medium mb-1">Service ID</label>
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                        value={form.serviceID}
                        onChange={(e) => setForm({...form, serviceID: e.target.value})}
                        required
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                      value={userModal.mode === 'add' ? form.name : editUserForm.name}
                      onChange={(e) => {
                        if (userModal.mode === 'add') {
                          setForm({...form, name: e.target.value});
                        } else {
                          setEditUserForm({...editUserForm, name: e.target.value});
                        }
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Password {userModal.mode === 'add' && '(required)'}
                    </label>
                    <input
                      type="password"
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                      value={userModal.mode === 'add' ? form.password : editUserForm.password}
                      onChange={(e) => {
                        if (userModal.mode === 'add') {
                          setForm({...form, password: e.target.value});
                        } else {
                          setEditUserForm({...editUserForm, password: e.target.value});
                        }
                      }}
                      required={userModal.mode === 'add'}
                      placeholder={userModal.mode === 'edit' ? 'Leave empty to keep current password' : ''}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Role</label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                      value={userModal.mode === 'add' ? form.role : editUserForm.role}
                      onChange={(e) => {
                        if (userModal.mode === 'add') {
                          setForm({...form, role: e.target.value});
                        } else {
                          setEditUserForm({...editUserForm, role: e.target.value});
                        }
                      }}
                      disabled={userModal.mode === 'edit' && role !== 'SuperAdmin'}
                    >
                      <option value="User">User</option>
                      <option value="Instructor">Instructor</option>
                      <option value="Admin">Admin</option>
                      {role === 'SuperAdmin' && <option value="SuperAdmin">SuperAdmin</option>}
                    </select>
                    {userModal.mode === 'edit' && role !== 'SuperAdmin' && (
                      <p className="text-xs text-gray-500 mt-1">Only SuperAdmins can change roles</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-6">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                    onClick={() => setUserModal({ open: false, mode: 'add', user: null })}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800"
                  >
                    {userModal.mode === 'add' ? 'Add User' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Book Modal */}
        {bookModal.open && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold mb-4">
                {bookModal.mode === 'add' ? 'Add New Book' : 'Edit Book'}
              </h3>

              <form key={uploadQueue.length} onSubmit={bookModal.mode === 'add' ? queueBook : (e) => { e.preventDefault(); updateBook(bookModal.book.id); }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={bookModal.mode === 'add' ? bookForm.title : editBookForm.title}
                      onChange={(e) => {
                        if (bookModal.mode === 'add') {
                          setBookForm({...bookForm, title: e.target.value});
                        } else {
                          setEditBookForm({...editBookForm, title: e.target.value});
                        }
                      }}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Author</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={bookModal.mode === 'add' ? bookForm.author : editBookForm.author}
                      onChange={(e) => {
                        if (bookModal.mode === 'add') {
                          setBookForm({...bookForm, author: e.target.value});
                        } else {
                          setEditBookForm({...editBookForm, author: e.target.value});
                        }
                      }}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={bookModal.mode === 'add' ? bookForm.category : editBookForm.category}
                      onChange={(e) => {
                        if (bookModal.mode === 'add') {
                          setBookForm({...bookForm, category: e.target.value});
                        } else {
                          setEditBookForm({...editBookForm, category: e.target.value});
                        }
                      }}
                    />
                  </div>

                  {bookModal.mode === 'add' && (
                  <div>
                    <p className="text-xs text-blue-600 mb-2 font-medium">Bulk Upload Wizard: Fill details below, click "Queue Next Book", and repeat. When finished, hit "Launch Batch".</p>
                  </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium mb-1">PDF File {bookModal.mode === 'add' && '(required)'}</label>
                    <input
                      type="file"
                      accept="application/pdf"
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={(e) => handleBookFileChange(e, bookModal.mode === 'add' ? 'book' : 'edit')}
                      required={bookModal.mode === 'add'}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Thumbnail (optional)</label>
                    <input
                      type="file"
                      accept="image/*"
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={(e) => handleThumbnailChange(e, bookModal.mode === 'add' ? 'book' : 'edit')}
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center mt-6">
                  <div>
                      {bookModal.mode === 'add' && uploadQueue.length > 0 && (
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-bold text-green-700 bg-green-100 px-3 py-1 rounded-md border border-green-300 shadow-sm">
                            {uploadQueue.length} in Queue
                          </span>
                        </div>
                      )}
                  </div>
                  <div className="flex gap-2">
                      <button
                        type="button"
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                        onClick={() => {
                          setBookModal({ open: false, mode: 'add', book: null });
                          setUploadQueue([]);
                        }}
                      >
                        Cancel
                      </button>
                      
                      {bookModal.mode === 'add' ? (
                        <>
                          <button
                            type="submit"
                            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                            disabled={isUploading}
                          >
                            Queue Next Book
                          </button>
                          
                          {uploadQueue.length > 0 && (
                              <button
                                type="button"
                                onClick={dispatchQueue}
                                disabled={isUploading}
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-bold"
                              >
                                {isUploading ? 'Deploying...' : `Launch Batch (${uploadQueue.length})`}
                              </button>
                          )}
                        </>
                      ) : (
                        <button
                          type="submit"
                          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                          disabled={isUploading}
                        >
                          {isUploading ? 'Saving...' : 'Save Changes'}
                        </button>
                      )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

      </section>
    </section>
  );
}

export default UsersPage;
