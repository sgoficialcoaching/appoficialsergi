import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) throw err;
      } else {
        if (!fullName.trim()) { setError('Por favor, completa todos los campos.'); setLoading(false); return; }
        const { error: err } = await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName, avatar_url: '' } } });
        if (err) throw err;
      }
    } catch (err) {
      setError(err.message || 'Error en la autenticación');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full pl-12 pr-4 py-3.5 bg-[#0A0A0C] border border-white/8 rounded-xl text-[#F4F4F5] text-sm outline-none transition-colors placeholder:text-[#71717A] focus:border-[#FFD600]";

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{ background: 'var(--bg-base)' }}>
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full opacity-10 pointer-events-none" style={{ background: '#FFD600', filter: 'blur(120px)' }} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass-effect rounded-3xl p-7 sm:p-8" style={{ boxShadow: '0 25px 60px rgba(0,0,0,0.6), 0 0 40px rgba(255,214,0,0.04)' }}>

          {/* Logo */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
              className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #FFD600 0%, #FFA500 100%)', boxShadow: '0 0 30px rgba(255,214,0,0.3)' }}
            >
              <span className="text-3xl font-black text-black">SC</span>
            </motion.div>
            <h1 className="gradient-text text-2xl sm:text-3xl font-black mb-1">Sergi Constance App</h1>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#71717A]">Conviértete en Leyenda</p>
          </div>

          {/* Social Buttons */}
          <div className="flex flex-col gap-3 mb-6">
            {[
              { label: 'Continuar con Google', icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              )},
              { label: 'Continuar con Apple', icon: (
                <svg width="18" height="18" viewBox="0 0 814 1000" fill="currentColor">
                  <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 376.8 0 277.6 0 183.7c0-104.9 76.7-214.3 158.3-290.5C228.2 42.6 304.3 0 381.2 0s118.3 58.1 155.4 58.1c35.9 0 116.6-62.4 197.4-62.4 30.5 0 116.6 14.4 177.1 81.7zM547.6 123.8c-11.3 40.4-33.2 61.6-33.2 61.6s-49.3-11.3-92-11.3c-52.3 0-123.1 35.9-148.4 120.8-20.2 66.9-11.3 156.6 35.9 236.2 47.2 79.6 113.6 131.7 162.5 131.7 35.9 0 55.7-18 105-18 40.4 0 58.1 18 100.5 18 60.5 0 108.9-43 141.9-99.5-64.2-31.8-120.2-103.7-120.2-211.7 0-95.8 46.3-167.9 107.2-215.8-46.3-62.1-117-92-183.2-92-31.8 0-76 13.6-76 79.8z"/>
                </svg>
              )},
            ].map(btn => (
              <button
                key={btn.label}
                onClick={() => setError('El inicio de sesión social está simulado. Usa email/contraseña.')}
                className="w-full py-3.5 px-4 rounded-xl flex items-center justify-center gap-3 text-sm font-semibold text-[#F4F4F5] transition-all border border-white/10 hover:border-white/20 hover:bg-white/5 cursor-pointer"
                style={{ background: 'transparent' }}
              >
                {btn.icon}
                {btn.label} <span className="text-[#71717A] text-xs">(Demo)</span>
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="flex items-center mb-6">
            <div className="flex-1 h-px bg-white/8" />
            <span className="mx-4 text-[11px] uppercase font-bold tracking-widest text-[#71717A]">O continúa con email</span>
            <div className="flex-1 h-px bg-white/8" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {!isLogin && (
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717A] pointer-events-none" />
                <input type="text" placeholder="Nombre Completo" value={fullName} onChange={e => setFullName(e.target.value)} className={inputClass} style={{ border: '1px solid rgba(255,255,255,0.08)' }} />
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717A] pointer-events-none" />
              <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className={inputClass} style={{ border: '1px solid rgba(255,255,255,0.08)' }} />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717A] pointer-events-none" />
              <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} required className={inputClass} style={{ border: '1px solid rgba(255,255,255,0.08)' }} />
            </div>

            {error && (
              <div className="p-3 rounded-xl text-red-400 text-xs font-medium border border-red-500/25" style={{ background: 'rgba(239,68,68,0.08)' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 rounded-xl text-base font-bold uppercase tracking-wide"
              style={{ opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              {loading ? 'Cargando...' : (isLogin ? 'Iniciar Sesión' : 'Crear Cuenta')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="text-sm text-[rgba(255,214,0,0.65)] hover:text-[#FFD600] transition-colors cursor-pointer border-none bg-transparent font-medium"
            >
              {isLogin ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
              <span className="font-bold underline underline-offset-2">
                {isLogin ? 'Regístrate gratis' : 'Inicia sesión'}
              </span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
