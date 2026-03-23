import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Search, Shield, ChevronRight, GraduationCap, Award, BookOpen } from 'lucide-react';
import api from '../api/axios';

export default function Home() {
  const [stats, setStats] = useState({ principals: 0, hods: 0, teachers: 0 });

  useEffect(() => {
    Promise.all([
      api.get('/principals'),
      api.get('/hods'),
      api.get('/teachers'),
    ]).then(([p, h, t]) => {
      setStats({ principals: p.data.length, hods: h.data.length, teachers: t.data.length });
    });
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-sm mb-6">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
          School Management Portal
        </div>
        <h1 className="text-5xl font-extrabold mb-4 leading-tight">
          School <span className="text-blue-400">Hierarchy</span>
          <br />Portal
        </h1>
        <p className="text-white/50 text-lg max-w-xl mx-auto mb-8">
          Explore the complete faculty structure. Browse profiles, documents, and department details.
        </p>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link to="/hierarchy">
            <button className="btn-primary flex items-center gap-2">
              <Users size={18} /> View Hierarchy
            </button>
          </Link>
          <Link to="/search">
            <button className="px-6 py-2.5 rounded-xl border border-white/15 hover:border-blue-500/40 hover:bg-white/5 transition font-medium flex items-center gap-2">
              <Search size={18} /> Search Faculty
            </button>
          </Link>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="grid grid-cols-3 gap-4 mb-16">
        {[
          { label: 'Principal', value: stats.principals, icon: Award, color: 'text-indigo-400', bg: 'rgba(99,102,241,0.1)', border: 'rgba(99,102,241,0.2)' },
          { label: 'HODs', value: stats.hods, icon: GraduationCap, color: 'text-blue-400', bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.2)' },
          { label: 'Teachers', value: stats.teachers, icon: BookOpen, color: 'text-sky-400', bg: 'rgba(14,165,233,0.1)', border: 'rgba(14,165,233,0.2)' },
        ].map(({ label, value, icon: Icon, color, bg, border }) => (
          <div key={label} className="rounded-xl p-5 text-center"
            style={{ background: bg, border: `1px solid ${border}` }}>
            <Icon size={24} className={`${color} mx-auto mb-2`} />
            <div className={`text-3xl font-bold ${color}`}>{value}</div>
            <div className="text-white/50 text-sm">{label}</div>
          </div>
        ))}
      </motion.div>

      {/* Feature Cards */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="grid md:grid-cols-3 gap-4">
        {[
          { title: 'Hierarchy View', desc: 'Browse the full school structure from Principal to Teachers', icon: Users, path: '/hierarchy', color: 'text-indigo-400' },
          { title: 'Search Faculty', desc: 'Find any faculty member instantly by name, subject or department', icon: Search, path: '/search', color: 'text-blue-400' },
          { title: 'Admin Panel', desc: 'Securely add and manage all faculty data with PIN access', icon: Shield, path: '/admin', color: 'text-sky-400' },
        ].map(({ title, desc, icon: Icon, path, color }) => (
          <Link key={title} to={path}>
            <div className="glass rounded-xl p-5 card-hover cursor-pointer h-full">
              <Icon size={24} className={`${color} mb-3`} />
              <h3 className="font-semibold mb-1">{title}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{desc}</p>
              <div className={`flex items-center gap-1 mt-3 text-sm ${color}`}>
                Explore <ChevronRight size={14} />
              </div>
            </div>
          </Link>
        ))}
      </motion.div>
    </div>
  );
}