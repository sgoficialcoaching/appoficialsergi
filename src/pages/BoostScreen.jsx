import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Play, Lock, CheckCircle, Clock, ChevronRight, Dumbbell, Target, Star, ArrowRight } from 'lucide-react';

const PROGRAMS = [
  {
    id: 1,
    name: 'Boost Principiante',
    weeks: 8,
    sessions: 3,
    level: 'Principiante',
    color: '#22d3ee',
    description: 'Bases sólidas de fuerza e hipertrofia para iniciarte con el método Sergi Constance.',
    image: 'https://images.pexels.com/photos/4162487/pexels-photo-4162487.jpeg?auto=compress&cs=tinysrgb&w=600',
    locked: false,
    active: false,
  },
  {
    id: 2,
    name: 'Boost Intermedio',
    weeks: 10,
    sessions: 4,
    level: 'Intermedio',
    color: '#FFD600',
    description: 'Progresión avanzada con técnicas de intensidad y periodización para maximizar resultados.',
    image: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=600',
    locked: false,
    active: true,
  },
  {
    id: 3,
    name: 'Boost Avanzado',
    weeks: 12,
    sessions: 5,
    level: 'Avanzado',
    color: '#f97316',
    description: 'El programa elite de Sergi para atletas con experiencia real buscando el siguiente nivel.',
    image: 'https://images.pexels.com/photos/3837757/pexels-photo-3837757.jpeg?auto=compress&cs=tinysrgb&w=600',
    locked: true,
    active: false,
  },
];

const WEEK_PLAN = [
  { day: 'Lun', name: 'Push A', muscles: 'Pecho · Tríceps · Hombros', sets: 18, done: true },
  { day: 'Mar', name: 'Pull A', muscles: 'Espalda · Bíceps · Rear Delt', sets: 16, done: true },
  { day: 'Mié', name: 'Descanso', muscles: 'Recuperación activa', sets: 0, done: false, rest: true },
  { day: 'Jue', name: 'Legs A', muscles: 'Cuádriceps · Isquios · Gemelos', sets: 20, done: false },
  { day: 'Vie', name: 'Push B', muscles: 'Pecho · Tríceps · Hombros', sets: 16, done: false },
  { day: 'Sáb', name: 'Pull B', muscles: 'Espalda · Bíceps', sets: 14, done: false },
  { day: 'Dom', name: 'Descanso', muscles: 'Recuperación total', sets: 0, done: false, rest: true },
];

const EXERCISES = [
  { name: 'Press Banca Plano', sets: '4x8-10', rest: '2min', pr: '100kg', icon: '🏋️' },
  { name: 'Press Inclinado DB', sets: '3x10-12', rest: '90s', pr: '36kg', icon: '💪' },
  { name: 'Fondos Paralelas', sets: '3x12-15', rest: '60s', pr: 'Peso corporal', icon: '⬇️' },
  { name: 'Press Militar', sets: '4x8-10', rest: '2min', pr: '60kg', icon: '🎯' },
  { name: 'Elevaciones Laterales', sets: '4x15-20', rest: '45s', pr: '14kg', icon: '↔️' },
];

function ProgramCard({ program, onStart }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl cursor-pointer group"
      style={{ boxShadow: program.active ? `0 0 25px ${program.color}25` : 'none' }}
      onClick={() => !program.locked && onStart(program)}
    >
      <div className="h-36 overflow-hidden">
        <img src={program.image} alt={program.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.85) 100%)' }} />
      </div>
      <div className="absolute inset-0 p-4 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <span className="text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest"
            style={{ background: `${program.color}20`, color: program.color, border: `1px solid ${program.color}40` }}>
            {program.level}
          </span>
          {program.active && (
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#FFD600] text-black uppercase tracking-wide">
              Activo
            </span>
          )}
          {program.locked && (
            <div className="w-7 h-7 rounded-full bg-black/50 flex items-center justify-center">
              <Lock className="w-3.5 h-3.5 text-[#71717A]" />
            </div>
          )}
        </div>
        <div>
          <h3 className="font-black text-lg text-white leading-tight mb-1">{program.name}</h3>
          <div className="flex items-center gap-3 text-xs text-[#D4D4D8]">
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{program.weeks} sem</span>
            <span className="flex items-center gap-1"><Dumbbell className="w-3 h-3" />{program.sessions}x/sem</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function BoostScreen() {
  const [activeTab, setActiveTab] = useState('program');
  const [selectedDay, setSelectedDay] = useState(3);

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#F4F4F5]">Boost</h2>
          <p className="text-[#71717A] text-sm">Tus programas de entrenamiento.</p>
        </div>
        <div className="px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wide text-black"
          style={{ background: '#FFD600' }}>
          Sem 6/10
        </div>
      </div>

      {/* Progress bar overall */}
      <div className="glass-effect rounded-2xl p-4">
        <div className="flex justify-between text-xs font-bold mb-2">
          <span className="text-[#71717A]">Progreso general</span>
          <span className="text-[#FFD600]">60%</span>
        </div>
        <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden">
          <motion.div
            className="h-2.5 rounded-full"
            style={{ background: 'linear-gradient(90deg, #FFD600, #FFA500)' }}
            initial={{ width: 0 }}
            animate={{ width: '60%' }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
        <div className="flex justify-between mt-3 text-xs text-[#71717A]">
          <span>24 sesiones completadas</span>
          <span>16 restantes</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-[#111113] p-1 rounded-xl">
        {[
          { id: 'program', label: 'Programa' },
          { id: 'today', label: 'Hoy' },
          { id: 'plans', label: 'Planes' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className="flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all cursor-pointer border-none"
            style={{
              background: activeTab === t.id ? '#FFD600' : 'transparent',
              color: activeTab === t.id ? '#000' : '#71717A',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'program' && (
          <motion.div key="program" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-4">
            {/* Week plan */}
            <div className="glass-effect rounded-2xl p-5">
              <h3 className="font-bold text-[#F4F4F5] mb-4 flex items-center gap-2">
                <Target className="w-4 h-4 text-[#FFD600]" /> Semana 6
              </h3>
              <div className="flex flex-col gap-2">
                {WEEK_PLAN.map((d, i) => (
                  <motion.div
                    key={d.day}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedDay(i)}
                    className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors"
                    style={{
                      background: selectedDay === i ? 'rgba(255,214,0,0.08)' : '#111113',
                      border: selectedDay === i ? '1px solid rgba(255,214,0,0.3)' : '1px solid transparent',
                    }}
                  >
                    <div className="w-10 flex-shrink-0 text-center">
                      <p className="text-[9px] font-black text-[#71717A] uppercase tracking-wider">{d.day}</p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-bold truncate ${d.rest ? 'text-[#71717A]' : 'text-[#F4F4F5]'}`}>{d.name}</p>
                      <p className="text-[10px] text-[#71717A] truncate">{d.muscles}</p>
                    </div>
                    {d.done ? (
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    ) : d.rest ? (
                      <Clock className="w-5 h-5 text-[#71717A] flex-shrink-0" />
                    ) : (
                      <div className="flex items-center gap-1 text-[10px] font-bold text-[#71717A] flex-shrink-0">
                        <span>{d.sets} series</span>
                        <ChevronRight className="w-3 h-3" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'today' && (
          <motion.div key="today" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-4">
            {/* Today session header */}
            <div className="relative rounded-2xl overflow-hidden h-40">
              <img src="https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=600" alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(0,0,0,0.9), rgba(0,0,0,0.5))' }} />
              <div className="absolute inset-0 p-5 flex flex-col justify-center">
                <span className="text-[10px] font-black text-[#FFD600] uppercase tracking-widest mb-1">Sesión de hoy</span>
                <h3 className="text-2xl font-black text-white">Push B</h3>
                <p className="text-sm text-gray-300">Pecho · Tríceps · Hombros</p>
              </div>
              <div className="absolute bottom-4 right-4 flex gap-2">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-black text-xs font-black uppercase cursor-pointer border-none"
                  style={{ background: '#FFD600' }}
                >
                  <Play className="w-3.5 h-3.5" fill="black" /> Iniciar
                </motion.button>
              </div>
            </div>
            {/* Exercises */}
            <div className="glass-effect rounded-2xl p-5">
              <h3 className="font-bold text-[#F4F4F5] mb-4">Ejercicios ({EXERCISES.length})</h3>
              <div className="flex flex-col gap-3">
                {EXERCISES.map((e, i) => (
                  <div key={e.name} className="flex items-center gap-3 p-3 rounded-xl bg-[#111113]">
                    <div className="w-10 h-10 rounded-xl bg-[#0A0A0C] flex items-center justify-center text-lg flex-shrink-0">
                      {e.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[#F4F4F5] truncate">{e.name}</p>
                      <div className="flex gap-3 text-[10px] text-[#71717A] mt-0.5">
                        <span className="flex items-center gap-1"><Dumbbell className="w-3 h-3" />{e.sets}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{e.rest}</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-[10px] text-[#71717A]">PR</p>
                      <p className="text-xs font-black text-[#FFD600]">{e.pr}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'plans' && (
          <motion.div key="plans" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-4">
            <p className="text-sm text-[#71717A]">Elige el programa que se adapte a tu nivel.</p>
            {PROGRAMS.map(p => (
              <ProgramCard key={p.id} program={p} onStart={() => {}} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
