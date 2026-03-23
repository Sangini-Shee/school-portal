import { useState } from 'react';
import { Shield, Eye, EyeOff, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import { useAdmin } from '../context/AdminContext';

export default function AdminPinModal({ onSuccess }) {
  const [pin, setPin] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAdmin();

  const handleSubmit = async () => {
    if (pin.length !== 6) return setError('PIN must be 6 digits');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/verify-pin', { pin });
      login(data.token);
      onSuccess?.();
    } catch {
      setError('Invalid PIN. Try again.');
      setPin('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        className="glass rounded-2xl p-8 w-full max-w-md glow-blue text-center">

        <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center mx-auto mb-4">
          <Shield size={32} className="text-blue-400" />
        </div>

        <h2 className="text-2xl font-bold mb-1">Admin Access</h2>
        <p className="text-white/50 text-sm mb-6">Enter your 6-digit admin PIN</p>

        <div className="relative mb-4">
          <input
            type={show ? 'text' : 'password'}
            value={pin}
            onChange={e => { setPin(e.target.value.replace(/\D/g, '').slice(0, 6)); setError(''); }}
            placeholder="• • • • • •"
            className="text-center text-2xl tracking-widest pr-10"
            maxLength={6}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          />
          <button onClick={() => setShow(!show)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70">
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* PIN dots display */}
        <div className="flex justify-center gap-3 mb-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className={`w-3 h-3 rounded-full transition-all ${i < pin.length ? 'bg-blue-500' : 'bg-white/20'}`} />
          ))}
        </div>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        <button onClick={handleSubmit} disabled={loading || pin.length !== 6}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed">
          {loading ? 'Verifying...' : 'Enter Admin Panel'}
        </button>
      </motion.div>
    </div>
  );
}