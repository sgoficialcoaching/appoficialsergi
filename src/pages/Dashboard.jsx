import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { Hop as Home, Users, Zap, ChartBar as BarChart2, ShoppingBag, Activity, Dumbbell, Apple, ArrowRight, Trophy, Calendar, Star, LogOut, User, Flame, ChevronRight, ArrowLeft, Rocket, Clock } from 'lucide-react';

function StarField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let stars = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    class Star {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random() * 0.3 + 0.1;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
      }
      draw() {
        ctx.fillStyle = `rgba(255,214,0,${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const init = () => {
      stars = [];
      const count = Math.min(window.innerWidth * 0.05, 50);
      for (let i = 0; i < count; i++) stars.push(new Star());
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(s => { s.update(); s.draw(); });
      animId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    resize();
    init();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.6
      }}
    />
  );
}

const NAV_ITEMS = [
  { id: 'home', label: 'Inicio', Icon: Home },
  { id: 'community', label: 'Comunidad', Icon: Users },
  { id: 'boost', label: 'Boost', Icon: Zap },
  { id: 'analytics', label: 'Analíticas', Icon: BarChart2 },
  { id: 'store', label: 'Tienda', Icon: ShoppingBag },
];

function NavButton({ id, label, Icon, active, onClick }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05, x: 5 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onClick(id)}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '4px',
        padding: '12px',
        borderRadius: '16px',
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        width: '100%',
        height: '80px',
        color: active ? 'var(--neon-yellow)' : 'var(--text-muted)',
        transition: 'color 0.3s',
        boxShadow: active ? 'var(--shadow-active)' : 'none'
      }}
    >
      <div style={{
        position: 'relative',
        zIndex: 1,
        filter: active ? 'drop-shadow(0 0 8px rgba(255,214,0,0.6))' : 'none'
      }}>
        <Icon style={{ width: '24px', height: '24px' }} />
      </div>
      {active && (
        <motion.div
          layoutId="active-pill"
          style={{
            position: 'absolute',
            right: 0,
            height: '32px',
            width: '4px',
            background: 'var(--neon-yellow)',
            borderRadius: '4px 0 0 4px',
            boxShadow: '0 0 10px rgba(255,214,0,0.5)'
          }}
        />
      )}
      <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.03em' }}>{label}</span>
    </motion.button>
  );
}

function PerformanceWidget({ userName }) {
  const score = 72;
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="glass-effect" style={{ borderRadius: '16px', padding: '24px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <h3 style={{ fontSize: '22px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity style={{ color: 'var(--neon-yellow)', width: '20px', height: '20px' }} />
          Rendimiento
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>Tu estado diario.</p>
      </div>
      <div style={{ position: 'relative', width: '160px', height: '160px', margin: '24px auto' }}>
        <svg style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
          <circle cx="80" cy="80" r={radius} stroke="rgba(255,255,255,0.05)" strokeWidth="10" fill="transparent" />
          <circle
            cx="80" cy="80" r={radius}
            stroke="var(--neon-yellow)"
            strokeWidth="10"
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1s ease' }}
          />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ fontSize: '42px', fontWeight: 900, color: 'var(--text-main)', lineHeight: 1 }}>{score}</p>
          <p style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>PUNTOS</p>
        </div>
      </div>
      <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>Combina energía, racha y último entreno.</p>
    </div>
  );
}

function MuscleFocusWidget() {
  const muscles = [
    { name: 'Pecho', intensity: 0.8 },
    { name: 'Espalda', intensity: 0.65 },
    { name: 'Hombros', intensity: 0.4 },
    { name: 'Bíceps', intensity: 0.55 },
    { name: 'Tríceps', intensity: 0.3 },
    { name: 'Piernas', intensity: 0.7 },
  ];

  return (
    <div className="glass-effect" style={{ borderRadius: '16px', padding: '24px' }}>
      <h3 style={{ fontSize: '22px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
        <Activity style={{ color: 'var(--neon-yellow)', width: '20px', height: '20px' }} />
        Foco Muscular
      </h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '24px' }}>Últimos 14 días.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {muscles.map(m => (
          <div key={m.name}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>
              <span style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>{m.name}</span>
              <span style={{ color: 'var(--neon-yellow)' }}>{Math.round(m.intensity * 100)}%</span>
            </div>
            <div style={{ width: '100%', background: 'rgba(255,255,255,0.05)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
              <motion.div
                style={{ height: '8px', background: 'var(--neon-yellow)', borderRadius: '4px' }}
                initial={{ width: 0 }}
                animate={{ width: `${m.intensity * 100}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MilestoneWidget() {
  const prs = [
    { name: 'Press Banca', value: '100kg', date: '01/03/2026' },
    { name: 'Sentadilla', value: '140kg', date: '28/02/2026' },
    { name: 'Peso Muerto', value: '160kg', date: '25/02/2026' },
  ];

  return (
    <div className="glass-effect" style={{ borderRadius: '16px', padding: '24px' }}>
      <h3 style={{ fontSize: '20px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', color: 'var(--neon-yellow)' }}>
        <Trophy style={{ width: '20px', height: '20px' }} />
        Historial de Hitos
      </h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '24px' }}>Tus mejores marcas y días legendarios.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ background: 'var(--bg-surface)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,214,0,0.2)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--neon-yellow)', color: '#000', fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '0 0 0 8px' }}>MEJOR SESIÓN</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '8px', background: 'rgba(255,214,0,0.1)', borderRadius: '8px' }}>
              <Calendar style={{ width: '20px', height: '20px', color: 'var(--neon-yellow)' }} />
            </div>
            <div>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Mayor Volumen</p>
              <p style={{ fontSize: '14px', fontWeight: 700, color: 'white' }}>12.5k kg totales</p>
              <p style={{ fontSize: '10px', color: 'var(--text-muted)' }}>03/03/2026</p>
            </div>
          </div>
        </div>
        <p style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.08em', marginTop: '8px', marginBottom: '4px' }}>Récords Personales (PRs)</p>
        {prs.map(pr => (
          <div key={pr.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', borderRadius: '8px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-surface)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <div>
              <p style={{ fontSize: '14px', fontWeight: 700 }}>{pr.name}</p>
              <p style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{pr.date}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'var(--bg-surface)', padding: '4px 8px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <Star style={{ width: '12px', height: '12px', color: 'var(--neon-yellow)' }} />
              <span style={{ fontSize: '12px', fontWeight: 900 }}>{pr.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function QuickActionsWidget() {
  const actions = [
    { label: 'Entrenar', Icon: Dumbbell },
    { label: 'Comida', Icon: Apple },
  ];
  return (
    <div className="glass-effect" style={{ padding: '24px', borderRadius: '16px' }}>
      <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--neon-yellow)' }}>
        <Zap style={{ width: '20px', height: '20px' }} />
        Acciones Rápidas
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {actions.map(a => (
          <motion.button
            key={a.label}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: '16px',
              borderRadius: '12px',
              background: 'var(--bg-surface)',
              boxShadow: 'var(--shadow-light), var(--shadow-dark)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              color: 'var(--text-main)',
              transition: 'color 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--neon-yellow)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-main)'}
          >
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-inset)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-active)' }}>
              <a.Icon style={{ width: '20px', height: '20px' }} />
            </div>
            <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{a.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function NutritionCard() {
  const macros = [
    { label: 'Proteínas', value: 142, target: 200, unit: 'g', color: '#22d3ee', bg: 'rgba(34,211,238,0.1)' },
    { label: 'Carbos', value: 210, target: 300, unit: 'g', color: '#d946ef', bg: 'rgba(217,70,239,0.1)' },
    { label: 'Grasas', value: 55, target: 80, unit: 'g', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  ];
  const kcal = 1840;
  const kcalTarget = 2500;
  const kcalPct = (kcal / kcalTarget) * 100;
  const r = 28;
  const circ = 2 * Math.PI * r;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{
        borderRadius: '24px',
        background: 'linear-gradient(180deg, #1E1F22 0%, #121315 100%)',
        border: '1px solid rgba(255,255,255,0.05)',
        padding: '24px',
        boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{ position: 'absolute', top: '-32px', right: '-32px', width: '256px', height: '256px', background: 'rgba(255,214,0,0.05)', filter: 'blur(80px)', borderRadius: '50%', pointerEvents: 'none' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', position: 'relative', zIndex: 1 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <div style={{ padding: '6px', borderRadius: '6px', background: 'linear-gradient(135deg, #ef4444, #f59e0b)', boxShadow: '0 4px 8px rgba(245,158,11,0.2)' }}>
              <Flame style={{ width: '16px', height: '16px', color: 'white' }} />
            </div>
            <h3 style={{ fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9ca3af' }}>Energía Diaria</h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginTop: '8px' }}>
            <span style={{ fontSize: '48px', fontWeight: 900, color: 'white', lineHeight: 1 }}>{kcal}</span>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#6b7280' }}>/ {kcalTarget} kcal</span>
          </div>
        </div>
        <div style={{ width: '64px', height: '64px', position: 'relative' }}>
          <svg style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
            <circle cx="32" cy="32" r={r} stroke="rgba(255,255,255,0.05)" strokeWidth="6" fill="transparent" />
            <circle cx="32" cy="32" r={r}
              stroke="url(#kcal-grad)" strokeWidth="6" fill="transparent"
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={circ - (Math.min(kcalPct, 100) / 100) * circ}
              style={{ transition: 'stroke-dashoffset 1s ease', filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.3))' }}
            />
            <defs>
              <linearGradient id="kcal-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
            </defs>
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '10px', fontWeight: 700, color: 'white' }}>{Math.round(kcalPct)}%</span>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', zIndex: 1 }}>
        {macros.map((m, i) => {
          const pct = Math.min((m.value / m.target) * 100, 100);
          return (
            <motion.div
              key={m.label}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              style={{ borderRadius: '12px', padding: '12px', border: '1px solid rgba(255,255,255,0.05)', background: m.bg }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: m.color, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.9 }}>
                    <span style={{ fontSize: '11px', fontWeight: 900, color: 'white' }}>{m.label[0]}</span>
                  </div>
                  <div>
                    <p style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{m.label}</p>
                    <p style={{ fontSize: '18px', fontWeight: 900, color: 'white', lineHeight: 1, marginTop: '2px' }}>
                      {Math.round(m.value)} <span style={{ fontSize: '11px', color: '#6b7280', fontWeight: 700 }}>/ {m.target}g</span>
                    </p>
                  </div>
                </div>
                <span style={{ fontSize: '12px', fontWeight: 700, color: m.color }}>{Math.round(pct)}%</span>
              </div>
              <div style={{ width: '100%', height: '6px', background: 'rgba(0,0,0,0.4)', borderRadius: '3px', overflow: 'hidden' }}>
                <motion.div
                  style={{ height: '6px', background: m.color, borderRadius: '3px', boxShadow: `0 0 10px ${m.color}40` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 1, ease: 'easeOut', delay: 0.2 + i * 0.1 }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

function ProgramBanner({ name }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        position: 'relative',
        width: '100%',
        height: '256px',
        borderRadius: '32px',
        overflow: 'hidden',
        cursor: 'pointer',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        marginBottom: '32px'
      }}
    >
      <img
        src="https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=800"
        alt="Program"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.7s' }}
        onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
        onMouseLeave={e => e.target.style.transform = 'scale(1)'}
      />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 50%, transparent 100%)' }} />
      <div style={{ position: 'absolute', inset: 0, padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', zIndex: 10 }}>
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{
            background: 'var(--neon-yellow)',
            color: '#000',
            fontSize: '11px',
            fontWeight: 900,
            padding: '4px 12px',
            borderRadius: '9999px',
            marginBottom: '16px',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            boxShadow: '0 0 15px rgba(255,214,0,0.6)'
          }}
        >
          Programa Activo
        </motion.div>
        <h2 style={{ fontSize: '40px', fontWeight: 900, color: 'white', textTransform: 'uppercase', lineHeight: 1, marginBottom: '8px', fontStyle: 'italic', textShadow: '0 4px 4px rgba(0,0,0,0.8)' }}>
          {name}
        </h2>
        <p style={{ color: '#d1d5db', maxWidth: '380px', fontSize: '14px', marginBottom: '24px', fontWeight: 500 }}>
          Supera tus límites con el plan definitivo de hipertrofia y fuerza.
        </p>
        <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '8px', fontSize: '13px' }}>
          Continuar Entrenamiento
          <ArrowRight style={{ width: '16px', height: '16px' }} />
        </button>
      </div>
    </motion.div>
  );
}

function WeeklyCalendar({ selectedLevel }) {
  const days = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'];
  const plan = ['Push', 'Pull', 'Legs', 'Hombros', 'Full Body', 'Cardio', 'Rest'];
  const today = new Date().getDay();
  const todayIdx = today === 0 ? 6 : today - 1;

  return (
    <motion.div
      className="glass-effect"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ borderRadius: '16px', padding: '24px', position: 'relative', marginTop: '24px' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h3 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--neon-yellow)', textTransform: 'capitalize' }}>
            {selectedLevel || 'Intermedio'}
          </h3>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Plan Semanal</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg-surface)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-main)' }}>
            <ArrowLeft style={{ width: '16px', height: '16px' }} />
          </button>
          <button style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg-surface)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-main)' }}>
            <ArrowRight style={{ width: '16px', height: '16px' }} />
          </button>
        </div>
      </div>
      <div style={{ display: 'flex', overflowX: 'auto', gap: '16px', paddingBottom: '8px' }} className="scrollbar-hide">
        {days.map((day, i) => {
          const isToday = i === todayIdx;
          const isRest = plan[i] === 'Rest';
          return (
            <motion.div
              key={day}
              whileTap={{ scale: 0.95 }}
              style={{
                flexShrink: 0,
                width: '80px',
                height: '112px',
                borderRadius: '12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                background: isToday ? 'var(--neon-yellow)' : 'var(--bg-surface)',
                color: isToday ? '#000' : (isRest ? 'rgba(255,255,255,0.3)' : 'var(--text-main)'),
                boxShadow: isToday ? '0 0 15px rgba(255,214,0,0.4)' : 'var(--shadow-light), var(--shadow-dark)',
                transform: isToday ? 'scale(1.05)' : 'scale(1)',
                transition: 'all 0.3s',
                opacity: isRest ? 0.5 : 1,
              }}
            >
              <p style={{ fontSize: '10px', fontWeight: 900, letterSpacing: '0.1em', marginBottom: '4px', opacity: 0.7 }}>{day}</p>
              <p style={{ fontSize: '24px', fontWeight: 900, marginBottom: '8px' }}>{i + 3}</p>
              {isRest ? (
                <Clock style={{ width: '16px', height: '16px' }} />
              ) : (
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: `2px solid ${isToday ? '#000' : 'rgba(255,255,255,0.3)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: isToday ? '#000' : 'currentColor' }} />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeNav, setActiveNav] = useState('home');

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 'Campeón';

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-base)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px', height: '48px',
            border: '4px solid rgba(255,255,255,0.1)',
            borderTopColor: 'var(--neon-yellow)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }} />
          <p style={{ marginTop: '16px', color: 'var(--text-muted)', fontSize: '14px' }}>Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-base)', color: 'var(--text-main)', overflow: 'hidden', position: 'relative' }}>
      <StarField />

      <aside style={{
        display: 'none',
        flexDirection: 'column',
        alignItems: 'center',
        width: '96px',
        paddingTop: '24px',
        paddingBottom: '24px',
        background: 'var(--bg-base)',
        borderRight: '0',
        boxShadow: '5px 0 25px rgba(0,0,0,0.1)',
        zIndex: 20,
        position: 'relative'
      }} className="md:flex">
        <a href="#" style={{ width: '64px', height: '64px', marginBottom: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src="https://horizons-cdn.hostinger.com/44a945b0-0776-414c-b558-451207c76649/fb087dd1803a43139c7109f55ed3d3a5.png" alt="Logo" style={{ maxWidth: '100%', maxHeight: '100%', filter: 'drop-shadow(0 0 15px rgba(255,214,0,0.3))' }} />
        </a>
        <nav style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', flex: 1, width: '100%', padding: '0 12px' }}>
          {NAV_ITEMS.map(item => (
            <NavButton key={item.id} {...item} active={activeNav === item.id} onClick={setActiveNav} />
          ))}
        </nav>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', width: '100%', padding: '0 12px 16px' }}>
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={handleSignOut}
            style={{
              padding: '12px', borderRadius: '50%',
              background: 'var(--bg-surface)',
              boxShadow: 'var(--shadow-light), var(--shadow-dark)',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            <LogOut style={{ width: '24px', height: '24px' }} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            style={{ position: 'relative', padding: '4px', borderRadius: '50%', boxShadow: 'var(--shadow-light), var(--shadow-dark)', border: '1px solid rgba(255,255,255,0.1)', background: 'none', cursor: 'pointer' }}
          >
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--neon-yellow), #FFA500)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#000', fontWeight: 900, fontSize: '18px' }}>
                {firstName.charAt(0)}
              </span>
            </div>
          </motion.button>
        </div>
      </aside>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, position: 'relative', zIndex: 10 }}>
        <header style={{
          background: 'rgba(9,9,11,0.9)',
          backdropFilter: 'blur(20px)',
          position: 'sticky',
          top: 0,
          zIndex: 40,
          padding: '12px 16px',
          boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          paddingTop: 'calc(12px + env(safe-area-inset-top, 0px))'
        }} className="md:hidden">
          <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
            <div style={{ width: '40px', height: '40px' }}>
              <img src="https://horizons-cdn.hostinger.com/44a945b0-0776-414c-b558-451207c76649/fb087dd1803a43139c7109f55ed3d3a5.png" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 0 10px rgba(255,214,0,0.4))' }} />
            </div>
          </a>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleSignOut}
              style={{
                padding: '8px 16px',
                background: 'rgba(239,68,68,0.15)',
                border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: '8px',
                color: '#f87171',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Salir
            </motion.button>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--neon-yellow), #FFA500)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#000', fontWeight: 900, fontSize: '14px' }}>{firstName.charAt(0)}</span>
            </div>
          </div>
        </header>

        <main style={{ flex: 1, padding: '16px', overflowY: 'auto' }} className="sm:p-6 lg:p-8 scrollbar-hide pb-nav-safe md:pb-8">
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <div>
              <h2 style={{ fontSize: '36px', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>Hola, {firstName}</h2>
              <p style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Vamos a por todas hoy.</p>
            </div>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--bg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-dark), var(--shadow-light)' }}>
              <img
                src={`https://ui-avatars.com/api/?name=${firstName}&background=FFD600&color=000000`}
                alt="Avatar"
                style={{ width: '40px', height: '40px', borderRadius: '50%' }}
              />
            </div>
          </header>

          <ProgramBanner name="Boost Intermedio" />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px' }} className="lg:grid-cols-3">
            <div style={{ gridColumn: 'span 1' }} className="lg:col-span-2">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <WeeklyCalendar selectedLevel="Intermedio" />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px' }} className="md:grid-cols-2">
                  <PerformanceWidget userName={firstName} />
                  <MuscleFocusWidget />
                  <MilestoneWidget />
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <QuickActionsWidget />
              <NutritionCard />
            </div>
          </div>
        </main>
      </div>

      <motion.nav
        className="md:hidden"
        style={{
          position: 'fixed',
          bottom: '16px',
          left: '16px',
          right: '16px',
          background: 'rgba(9,9,11,0.95)',
          backdropFilter: 'blur(20px)',
          zIndex: 50,
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          borderRadius: '24px',
          border: '1px solid rgba(255,255,255,0.1)',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '8px' }}>
          {NAV_ITEMS.map(item => {
            const active = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                style={{
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '48px',
                  height: '48px',
                  borderRadius: '16px',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  color: active ? 'var(--neon-yellow)' : 'var(--text-muted)',
                  transform: active ? 'translateY(-12px)' : 'none',
                  transition: 'all 0.3s',
                  boxShadow: active ? '0 10px 20px rgba(0,0,0,0.15)' : 'none'
                }}
              >
                <item.Icon style={{
                  width: '24px', height: '24px', zIndex: 1,
                  filter: active ? 'drop-shadow(0 0 5px rgba(255,214,0,0.8))' : 'none'
                }} />
                {active && (
                  <span style={{ position: 'absolute', bottom: '-20px', fontSize: '10px', fontWeight: 700, color: 'var(--neon-yellow)', letterSpacing: '0.05em' }}>
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </motion.nav>
    </div>
  );
}
