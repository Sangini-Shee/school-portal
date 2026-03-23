import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import api from '../api/axios';
import HierarchyCard from '../components/HierarchyCard';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ principals: [], hods: [], teachers: [] });
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    const q = query.trim();
    const regex = new RegExp(q, 'i');

    const [p, h, t] = await Promise.all([
      api.get('/principals'), api.get('/hods'), api.get('/teachers')
    ]);

    const match = (item) =>
      regex.test(item.name) || regex.test(item.department) || regex.test(item.subject) || regex.test(item.email);

    setResults({
      principals: p.data.filter(match),
      hods: h.data.filter(match),
      teachers: t.data.filter(match),
    });
    setSearched(true);
    setLoading(false);
  };

  const total = results.principals.length + results.hods.length + results.teachers.length;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
          <Search className="text-blue-400" /> Search Faculty
        </h1>
        <p className="text-white/40">Search by name, department, subject or email</p>
      </motion.div>

      {/* Search Box */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="flex gap-3 mb-8">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
          <input value={query} onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="Search for a teacher, HOD, or principal..."
            className="pl-10 pr-10" />
          {query && (
            <button onClick={() => { setQuery(''); setSearched(false); setResults({ principals: [], hods: [], teachers: [] }); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
              <X size={16} />
            </button>
          )}
        </div>
        <button onClick={handleSearch} className="btn-primary px-6" disabled={loading}>
          {loading ? '...' : 'Search'}
        </button>
      </motion.div>

      {/* Results */}
      <AnimatePresence>
        {searched && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <p className="text-white/40 text-sm mb-4">
              {total === 0 ? 'No results found.' : `${total} result${total > 1 ? 's' : ''} found`}
            </p>

            {results.principals.length > 0 && (
              <div className="mb-6">
                <h2 className="text-indigo-400 font-semibold mb-2 text-sm uppercase tracking-wider">Principal</h2>
                <div className="space-y-2">
                  {results.principals.map(p => <HierarchyCard key={p._id} person={p} role="principal" />)}
                </div>
              </div>
            )}
            {results.hods.length > 0 && (
              <div className="mb-6">
                <h2 className="text-blue-400 font-semibold mb-2 text-sm uppercase tracking-wider">HODs</h2>
                <div className="space-y-2">
                  {results.hods.map(h => <HierarchyCard key={h._id} person={h} role="hod" />)}
                </div>
              </div>
            )}
            {results.teachers.length > 0 && (
              <div className="mb-6">
                <h2 className="text-sky-400 font-semibold mb-2 text-sm uppercase tracking-wider">Teachers</h2>
                <div className="space-y-2">
                  {results.teachers.map(t => <HierarchyCard key={t._id} person={t} role="teacher" />)}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}