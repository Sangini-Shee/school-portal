import { Link, useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { Search, Home, Users, Shield, LogOut, GraduationCap } from 'lucide-react';

export default function Navbar() {
  const { isAdmin, logout } = useAdmin();
  const navigate = useNavigate();

  return (
    <nav className="glass sticky top-0 z-50 px-6 py-4 flex items-center justify-between"
      style={{ borderBottom: '1px solid rgba(59,130,246,0.2)' }}>
      <Link to="/" className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
          <GraduationCap size={20} />
        </div>
        <span className="font-bold text-lg tracking-tight">EduPortal</span>
      </Link>

      <div className="flex items-center gap-2">
        <Link to="/" className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-white/5 text-sm transition">
          <Home size={16} /> Home
        </Link>
        <Link to="/hierarchy" className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-white/5 text-sm transition">
          <Users size={16} /> Hierarchy
        </Link>
        <Link to="/search" className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-white/5 text-sm transition">
          <Search size={16} /> Search
        </Link>

        {isAdmin ? (
          <div className="flex items-center gap-2 ml-2">
            <Link to="/admin" className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600/20 text-blue-400 text-sm border border-blue-500/30 transition hover:bg-blue-600/30">
              <Shield size={16} /> Admin
            </Link>
            <button onClick={() => { logout(); navigate('/'); }}
              className="p-2 rounded-lg hover:bg-red-500/10 text-red-400 transition">
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <Link to="/admin" className="flex items-center gap-1.5 px-3 py-2 ml-2 rounded-lg bg-blue-600 text-white text-sm font-medium transition hover:bg-blue-700">
            <Shield size={16} /> Admin
          </Link>
        )}
      </div>
    </nav>
  );
}