import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Users, UserCheck, BookOpen, Trash2, Edit } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import AdminPinModal from '../components/AdminPinModal';
import api from '../api/axios';

const emptyPrincipal = { name: '', email: '', phone: '', department: 'Administration', bio: '' };
const emptyHOD = { name: '', email: '', phone: '', department: '', subject: '', bio: '', principal: '' };
const emptyTeacher = { name: '', email: '', phone: '', department: '', subject: '', bio: '', hod: '' };

export default function AdminPanel() {
  const { isAdmin } = useAdmin();
  const [tab, setTab] = useState('principal');
  const [principals, setPrincipals] = useState([]);
  const [hods, setHods] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [form, setForm] = useState(emptyPrincipal);
  const [photo, setPhoto] = useState(null);
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const fetchAll = async () => {
    const [p, h, t] = await Promise.all([api.get('/principals'), api.get('/hods'), api.get('/teachers')]);
    setPrincipals(p.data); setHods(h.data); setTeachers(t.data);
  };

  useEffect(() => { fetchAll(); }, []);
  useEffect(() => {
    setForm(tab === 'principal' ? emptyPrincipal : tab === 'hod' ? emptyHOD : emptyTeacher);
    setPhoto(null); setDocs([]);
  }, [tab]);

  //if (!isAdmin) return <AdminPinModal />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (photo) fd.append('photo', photo);
    docs.forEach(d => fd.append('documents', d));

    try {
      if (tab === 'principal') await api.post('/principals', fd);
      else if (tab === 'hod') await api.post('/hods', fd);
      else await api.post('/teachers', fd);
      setMsg('✅ Added successfully!');
      fetchAll();
      setForm(tab === 'principal' ? emptyPrincipal : tab === 'hod' ? emptyHOD : emptyTeacher);
      setPhoto(null); setDocs([]);
    } catch (err) {
      setMsg('❌ Error: ' + (err.response?.data?.message || 'Something went wrong'));
    }
    setLoading(false);
    setTimeout(() => setMsg(''), 3000);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this person?')) return;
    if (tab === 'principal') await api.delete(`/principals/${id}`);
    else if (tab === 'hod') await api.delete(`/hods/${id}`);
    else await api.delete(`/teachers/${id}`);
    fetchAll();
  };

  const tabs = [
    { key: 'principal', label: 'Principal', icon: UserCheck },
    { key: 'hod', label: 'HODs', icon: Users },
    { key: 'teacher', label: 'Teachers', icon: BookOpen },
  ];

  const list = tab === 'principal' ? principals : tab === 'hod' ? hods : teachers;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold mb-1">Admin Panel</h1>
        <p className="text-white/40">Manage all faculty data</p>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 p-1 glass rounded-xl w-fit">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => setTab(key)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition ${
              tab === key ? 'bg-blue-600 text-white' : 'text-white/50 hover:text-white hover:bg-white/5'
            }`}>
            <Icon size={16} /> {label}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="glass rounded-2xl p-6">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <Plus size={18} className="text-blue-400" />
            Add New {tab === 'hod' ? 'HOD' : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-3">
            {[
              { name: 'name', placeholder: 'Full Name *', required: true },
              { name: 'email', placeholder: 'Email', type: 'email' },
              { name: 'phone', placeholder: 'Phone Number' },
              { name: 'department', placeholder: 'Department' },
              ...(tab !== 'principal' ? [{ name: 'subject', placeholder: tab === 'hod' ? 'Subject / Specialization' : 'Subject *', required: tab === 'teacher' }] : []),
            ].map(({ name, placeholder, type = 'text', required }) => (
              <input key={name} type={type} placeholder={placeholder} required={required}
                value={form[name] || ''} onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))} />
            ))}

            {/* Parent selector */}
            {tab === 'hod' && (
              <select value={form.principal} onChange={e => setForm(f => ({ ...f, principal: e.target.value }))} required>
                <option value="">Select Principal *</option>
                {principals.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
              </select>
            )}
            {tab === 'teacher' && (
              <select value={form.hod} onChange={e => setForm(f => ({ ...f, hod: e.target.value }))} required>
                <option value="">Select HOD *</option>
                {hods.map(h => <option key={h._id} value={h._id}>{h.name} – {h.department}</option>)}
              </select>
            )}

            <textarea placeholder="Bio / Description" rows={3}
              value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} />

            {/* Photo Upload */}
            <div>
              <label className="text-white/50 text-sm block mb-1">Profile Photo</label>
              <input type="file" accept="image/*" onChange={e => setPhoto(e.target.files[0])}
                className="text-sm text-white/60" />
            </div>

            {/* Documents Upload */}
            <div>
              <label className="text-white/50 text-sm block mb-1">Documents (PDF)</label>
              <input type="file" accept=".pdf,image/*" multiple onChange={e => setDocs([...e.target.files])}
                className="text-sm text-white/60" />
            </div>

            {msg && <p className={`text-sm ${msg.startsWith('✅') ? 'text-green-400' : 'text-red-400'}`}>{msg}</p>}

            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? 'Saving...' : `Add ${tab === 'hod' ? 'HOD' : tab}`}
            </button>
          </form>
        </div>

        {/* Existing Records */}
        <div className="glass rounded-2xl p-6">
          <h2 className="font-semibold mb-4">Existing {tab === 'hod' ? 'HODs' : tab + 's'} ({list.length})</h2>
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {list.map(item => (
              <div key={item._id} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10">
                <div className="w-9 h-9 rounded-full bg-blue-600/20 overflow-hidden flex-shrink-0">
                  {item.photo
                    ? <img src={item.photo} alt={item.name} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-sm font-bold text-blue-400">
                        {item.name?.[0]}
                      </div>
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{item.name}</p>
                  <p className="text-white/40 text-xs truncate">{item.department || item.subject || '—'}</p>
                </div>
                <button onClick={() => handleDelete(item._id)}
                  className="p-2 rounded-lg hover:bg-red-500/10 text-white/30 hover:text-red-400 transition flex-shrink-0">
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
            {list.length === 0 && <p className="text-white/30 text-sm text-center py-8">Nothing added yet</p>}
          </div>
        </div>
      </div>
    </div>
  );
}