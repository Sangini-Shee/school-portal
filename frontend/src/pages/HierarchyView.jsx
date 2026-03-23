import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, Users } from 'lucide-react';
import api from '../api/axios';
import HierarchyCard from '../components/HierarchyCard';

export default function HierarchyView() {
  const [principals, setPrincipals] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [hods, setHods] = useState({});
  const [teachers, setTeachers] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/principals').then(r => { setPrincipals(r.data); setLoading(false); });
  }, []);

  const togglePrincipal = async (id) => {
    const key = `p_${id}`;
    setExpanded(prev => ({ ...prev, [key]: !prev[key] }));
    if (!hods[id]) {
      const { data } = await api.get(`/principals/${id}`);
      setHods(prev => ({ ...prev, [id]: data.hods }));
    }
  };

  const toggleHOD = async (id) => {
    const key = `h_${id}`;
    setExpanded(prev => ({ ...prev, [key]: !prev[key] }));
    if (!teachers[id]) {
      const { data } = await api.get(`/hods/${id}`);
      setTeachers(prev => ({ ...prev, [id]: data.teachers }));
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold mb-1 flex items-center gap-2">
          <Users className="text-blue-400" size={28} /> Faculty Hierarchy
        </h1>
        <p className="text-white/40">Click on any person to explore their team and details</p>
      </motion.div>

      <div className="space-y-3">
        {principals.map((p, pi) => (
          <motion.div key={p._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: pi * 0.05 }}>

            {/* Principal Row */}
            <div className="flex items-center gap-2">
              <button onClick={() => togglePrincipal(p._id)}
                className="p-1 rounded text-white/40 hover:text-blue-400 transition">
                {expanded[`p_${p._id}`] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
              <div className="flex-1">
                <HierarchyCard person={p} role="principal" />
              </div>
            </div>

            {/* HODs under Principal */}
            <AnimatePresence>
              {expanded[`p_${p._id}`] && hods[p._id] && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }} className="ml-8 mt-2 space-y-2">
                  {hods[p._id].length === 0
                    ? <p className="text-white/30 text-sm px-4 py-2">No HODs added yet</p>
                    : hods[p._id].map((h, hi) => (
                      <div key={h._id}>
                        <div className="flex items-center gap-2">
                          <button onClick={() => toggleHOD(h._id)}
                            className="p-1 rounded text-white/40 hover:text-blue-400 transition">
                            {expanded[`h_${h._id}`] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                          </button>
                          <div className="flex-1">
                            <HierarchyCard person={h} role="hod" index={hi} />
                          </div>
                        </div>

                        {/* Teachers under HOD */}
                        <AnimatePresence>
                          {expanded[`h_${h._id}`] && teachers[h._id] && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }} className="ml-8 mt-2 space-y-2">
                              {teachers[h._id].length === 0
                                ? <p className="text-white/30 text-sm px-4 py-2">No teachers added yet</p>
                                : teachers[h._id].map((t, ti) => (
                                  <HierarchyCard key={t._id} person={t} role="teacher" index={ti} />
                                ))
                              }
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))
                  }
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}

        {principals.length === 0 && (
          <div className="text-center text-white/30 py-16">
            <Users size={48} className="mx-auto mb-3 opacity-30" />
            <p>No faculty data yet. Admin can add from the Admin Panel.</p>
          </div>
        )}
      </div>
    </div>
  );
}