import React, { useEffect, useState } from 'react';
import { Search, Plus, Edit, Trash2, FileText, BookOpen, Layers, Upload, Save, X } from 'lucide-react';
import { supabase } from '../config/supabaseClient';
import { API_BASE } from "../config/apiBase";
import useAuth from '../hooks/useAuth';

function InstructorMaterials() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Material'); // 'Material', 'Syllabus', 'Topic'
  const [modal, setModal] = useState({ open: false, mode: 'add', item: null });
  const [form, setForm] = useState({ title: '', type: 'Material', content: '', file: null, fileUrl: '', parentId: '' });
  const [isUploading, setIsUploading] = useState(false);

  const auth = useAuth();
  const token = auth?.token || localStorage.getItem('token');
  const user = auth?.user || (token ? JSON.parse(atob(token.split('.')[1])) : null);
  const role = user?.role;
  const isInstructor = role === 'Instructor' || role === 'Admin' || role === 'SuperAdmin';

  useEffect(() => {
    fetchMaterials();
  }, []);

  async function fetchMaterials() {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/instructor/materials`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setMaterials(await res.json());
    } catch (err) {
      console.error('Failed to fetch materials', err);
    }
    setLoading(false);
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setForm({ ...form, file });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setIsUploading(true);

    try {
      let currentFileUrl = form.fileUrl;

      // Upload file to Supabase if type is Material and a new file is selected
      if (form.type === 'Material' && form.file) {
        const fileId = `${Date.now()}-${form.file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_')}`;
        const { error: uploadError } = await supabase.storage.from('books').upload(fileId, form.file);
        if (uploadError) throw new Error(`Upload Failed: ${uploadError.message}`);
        currentFileUrl = supabase.storage.from('books').getPublicUrl(fileId).data.publicUrl;
      }

      const payload = {
        title: form.title,
        type: form.type,
        content: form.content,
        fileUrl: currentFileUrl,
        parentId: form.parentId || null
      };

      const url = modal.mode === 'add' 
        ? `${API_BASE}/api/instructor/materials` 
        : `${API_BASE}/api/instructor/materials/${modal.item.id}`;
      
      const method = modal.mode === 'add' ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setModal({ open: false, mode: 'add', item: null });
        setForm({ title: '', type: activeTab, content: '', file: null, fileUrl: '', parentId: '' });
        fetchMaterials();
        alert(`Successfully ${modal.mode === 'add' ? 'added' : 'updated'} ${form.type.toLowerCase()}!`);
      } else {
        const err = await res.json();
        throw new Error(err.error || 'Failed to save');
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setIsUploading(false);
    }
  }

  async function deleteItem(item) {
    if (!confirm(`Are you sure you want to delete this ${item.type.toLowerCase()}?`)) return;
    try {
      const res = await fetch(`${API_BASE}/api/instructor/materials/${item.id}?type=${item.type}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchMaterials();
      else alert('Failed to delete');
    } catch (err) {
      console.error(err);
    }
  }

  const openModal = (mode, item = null) => {
    setModal({ open: true, mode, item });
    if (mode === 'edit' && item) {
      setForm({
        title: item.title,
        type: item.type,
        content: item.content || '',
        file: null,
        fileUrl: item.fileUrl || '',
        parentId: item.parentId || ''
      });
    } else {
      setForm({ title: '', type: activeTab, content: '', file: null, fileUrl: '', parentId: '' });
    }
  };

  const filteredMaterials = materials.filter(m => m.type === activeTab);

  return (
    <section className="bg-slate-50 text-slate-900 p-4 md:p-6 min-h-screen md:ml-64">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1F3D2B]">
            {isInstructor ? 'Instructor Dashboard' : 'Course Materials'}
          </h1>
          <p className="text-sm text-gray-500">
            {isInstructor 
              ? 'Manage your course materials, syllabus, and topics.' 
              : 'Browse course materials, syllabi, and topics uploaded by instructors.'}
          </p>
        </div>
        {isInstructor && (
          <button
            onClick={() => openModal('add')}
            className="flex items-center gap-2 px-4 py-2 bg-[#1F3D2B] text-white rounded-xl hover:bg-[#2A4A3A] transition-colors shadow-sm"
          >
            <Plus size={20} />
            <span>Add New {activeTab}</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
        {['Material', 'Syllabus', 'Topic'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 font-semibold text-sm transition-all relative ${
              activeTab === tab ? 'text-[#1F3D2B]' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {tab}s
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#C5A64D] rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1F3D2B]"></div>
        </div>
      ) : filteredMaterials.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-gray-300">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            {activeTab === 'Material' && <FileText className="text-gray-400" />}
            {activeTab === 'Syllabus' && <BookOpen className="text-gray-400" />}
            {activeTab === 'Topic' && <Layers className="text-gray-400" />}
          </div>
          <h3 className="text-lg font-medium text-gray-900">No {activeTab.toLowerCase()}s found</h3>
          <p className="text-gray-500 mt-1">Get started by creating your first {activeTab.toLowerCase()}.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
          {filteredMaterials.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl p-3 md:p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-lg ${
                  item.type === 'Material' ? 'bg-blue-50 text-blue-600' :
                  item.type === 'Syllabus' ? 'bg-emerald-50 text-emerald-600' :
                  'bg-purple-50 text-purple-600'
                }`}>
                  {item.type === 'Material' && <FileText size={20} />}
                  {item.type === 'Syllabus' && <BookOpen size={20} />}
                  {item.type === 'Topic' && <Layers size={20} />}
                </div>
                {isInstructor && (
                  <div className="flex gap-1">
                    <button onClick={() => openModal('edit', item)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => deleteItem(item)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>
              <h3 className="font-bold text-gray-900 mb-2 line-clamp-1">{item.title}</h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-grow">
                {item.content || (item.fileUrl ? 'Document attached' : 'No description provided')}
              </p>
              {item.parentId && (
                <div className="mb-4 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-[10px] text-gray-400 uppercase font-bold">Part of {item.type === 'Topic' ? 'Syllabus' : 'Topic'}</p>
                  <p className="text-xs font-semibold text-[#1F3D2B] truncate">
                    {materials.find(m => m.id === item.parentId)?.title || 'Unknown Parent'}
                  </p>
                </div>
              )}
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                <span className="text-xs text-gray-400">{new Date(item.createdAt).toLocaleDateString()}</span>
                {item.fileUrl && (
                  <a href={item.fileUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-[#1F3D2B] hover:underline flex items-center gap-1">
                    <Upload size={12} /> View File
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal.open && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-[#1F3D2B] p-6 text-white flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">{modal.mode === 'add' ? 'Add' : 'Edit'} {form.type}</h3>
                <p className="text-xs text-emerald-100/70">Fill in the details for your course {form.type.toLowerCase()}.</p>
              </div>
              <button onClick={() => setModal({ open: false, mode: 'add', item: null })} className="text-white/70 hover:text-white">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C5A64D] transition-all"
                  placeholder={`Enter ${form.type.toLowerCase()} title...`}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Material', 'Syllabus', 'Topic'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setForm({ ...form, type: t })}
                      className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                        form.type === t 
                          ? 'bg-[#1F3D2B] text-white border-[#1F3D2B]' 
                          : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {(form.type === 'Topic' || form.type === 'Material') && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Connect to {form.type === 'Topic' ? 'Syllabus' : 'Topic'} (Optional)
                  </label>
                  <select
                    value={form.parentId}
                    onChange={(e) => setForm({ ...form, parentId: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C5A64D] transition-all"
                  >
                    <option value="">-- No Connection --</option>
                    {materials
                      .filter(m => m.type === (form.type === 'Topic' ? 'Syllabus' : 'Topic'))
                      .map(parent => (
                        <option key={parent.id} value={parent.id}>{parent.title}</option>
                      ))
                    }
                  </select>
                </div>
              )}

              {form.type === 'Material' ? (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Upload File (PDF)</label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={handleFileChange}
                      required={modal.mode === 'add' && !form.fileUrl}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C5A64D] transition-all file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#C5A64D]/10 file:text-[#1F3D2B] hover:file:bg-[#C5A64D]/20"
                    />
                  </div>
                  {form.fileUrl && <p className="text-[10px] text-green-600 mt-1">Existing file attached.</p>}
                </div>
              ) : null}

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  {form.type === 'Material' ? 'Description (optional)' : 'Content / Details'}
                </label>
                <textarea
                  rows={4}
                  required={form.type !== 'Material'}
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C5A64D] transition-all resize-none"
                  placeholder={form.type === 'Material' ? "Provide a brief description..." : `Enter ${form.type.toLowerCase()} details here...`}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setModal({ open: false, mode: 'add', item: null })}
                  className="flex-1 py-3 font-bold text-gray-500 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="flex-1 py-3 font-bold text-white bg-[#1F3D2B] rounded-xl hover:bg-[#2A4A3A] transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isUploading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Save size={18} />
                  )}
                  {modal.mode === 'add' ? 'Save' : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default InstructorMaterials;
