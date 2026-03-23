import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Phone, BookOpen, Building, FileText, Users, ExternalLink } from 'lucide-react';
import api from '../api/axios';
import HierarchyCard from '../components/HierarchyCard';

export default function PersonDetail() {
  const { role, id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (role === 'principal') {
        const { data: d } = await api.get(`/principals/${id}`);
        setData(d.principal); setSubs(d.hods);
      } else if (role === 'hod') {
        const { data: d } = await api.get(`/hods/${id}`);
        setData(d.hod); setSubs(d.teachers);
      } else {
        const { data: d } = await api.get(`/teachers/${id}`);
        setData(d);
      }
      setLoading(false);
    };
    fetchData();
  }, [role, id]);

  const roleLabels = { principal: 'Principal', hod: 'Head of Department', teacher: 'Teacher' };
  const subLabel = { principal: 'HODs', hod: 'Teachers' };
  const subRole = { principal: 'hod', hod: 'teacher' };
  const roleColors = {
    principal: 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10',
    hod: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
    teacher: 'text-sky-400 border-sky-500/30 bg-sky-500/10',
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!data) return <div className="text-center py-20 text-white/40">Person not found.</div>;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <button onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-white/50 hover:text-white mb-6 transition">
        <ArrowLeft size={18} /> Back
      </button>

      {/* Profile Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-6 mb-6">
        <div className="flex items-start gap-6">
          <div className="w-24 h-24 rounded-2xl overflow-hidden bg-white/10 border border-white/10 flex-shrink-0">
            {data.photo
              ? <img src={data.photo} alt={data.name} className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-white/30">
                  {data.name?.[0]}
                </div>
            }
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs px-2.5 py-1 rounded-full border ${roleColors[role]}`}>
                {roleLabels[role]}
              </span>
            </div>
            <h1 className="text-2xl font-bold mb-1">{data.name}</h1>
            <div className="flex flex-wrap gap-4 text-sm text-white/50">
              {data.department && <span className="flex items-center gap-1"><Building size={13} />{data.department}</span>}
              {data.subject && <span className="flex items-center gap-1"><BookOpen size={13} />{data.subject}</span>}
              {data.email && <span className="flex items-center gap-1"><Mail size={13} />{data.email}</span>}
              {data.phone && <span className="flex items-center gap-1"><Phone size={13} />{data.phone}</span>}
            </div>
            {data.bio && <p className="mt-3 text-white/60 text-sm leading-relaxed">{data.bio}</p>}
          </div>
        </div>
      </motion.div>

      {/* Documents */}
      {data.documents?.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-5 mb-6">
          <h2 className="font-semibold mb-3 flex items-center gap-2">
            <FileText size={18} className="text-blue-400" /> Documents
          </h2>
          <div className="space-y-2">
            {data.documents.map((doc, i) => (
              <a key={i} href={doc.url} target="_blank" rel="noreferrer"
                className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition group">
                <span className="text-sm text-white/70 group-hover:text-white">{doc.name}</span>
                <ExternalLink size={14} className="text-white/30 group-hover:text-blue-400" />
              </a>
            ))}
          </div>
        </motion.div>
      )}

      {/* Sub-staff */}
      {subs.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2 className="font-semibold mb-3 flex items-center gap-2">
            <Users size={18} className="text-blue-400" /> {subLabel[role]} ({subs.length})
          </h2>
          <div className="space-y-2">
            {subs.map((s, i) => <HierarchyCard key={s._id} person={s} role={subRole[role]} index={i} />)}
          </div>
        </motion.div>
      )}
    </div>
  );
}