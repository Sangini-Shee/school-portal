import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Mail, Phone, BookOpen } from 'lucide-react';

export default function HierarchyCard({ person, role, index = 0 }) {
  const navigate = useNavigate();

  const roleColors = {
    principal: { bg: 'rgba(99,102,241,0.1)', border: 'rgba(99,102,241,0.3)', badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' },
    hod: { bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.3)', badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
    teacher: { bg: 'rgba(14,165,233,0.1)', border: 'rgba(14,165,233,0.3)', badge: 'bg-sky-500/20 text-sky-300 border-sky-500/30' },
  };
  const colors = roleColors[role] || roleColors.teacher;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={() => navigate(`/person/${role}/${person._id}`)}
      className="card-hover cursor-pointer rounded-xl p-4 flex items-center gap-4"
      style={{ background: colors.bg, border: `1px solid ${colors.border}` }}>

      <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 bg-white/10 border-2"
        style={{ borderColor: colors.border }}>
        {person.photo
          ? <img src={person.photo} alt={person.name} className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center text-xl font-bold text-white/50">
              {person.name?.[0]}
            </div>
        }
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold text-white truncate">{person.name}</h3>
          <span className={`text-xs px-2 py-0.5 rounded-full border capitalize flex-shrink-0 ${colors.badge}`}>
            {role}
          </span>
        </div>
        {person.department && (
          <p className="text-white/50 text-sm truncate flex items-center gap-1">
            <BookOpen size={12} /> {person.department}
            {person.subject && ` • ${person.subject}`}
          </p>
        )}
        {person.email && (
          <p className="text-white/40 text-xs truncate flex items-center gap-1 mt-0.5">
            <Mail size={11} /> {person.email}
          </p>
        )}
      </div>

      <ChevronRight size={18} className="text-white/30 flex-shrink-0" />
    </motion.div>
  );
}