import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Activity, Dumbbell, Flame, Calendar, ChevronUp, ChevronDown, BarChart2 } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const VOLUME_DATA = [
  { week: 'S1', volume: 6200 },
  { week: 'S2', volume: 7100 },
  { week: 'S3', volume: 6800 },
  { week: 'S4', volume: 8200 },
  { week: 'S5', volume: 9100 },
  { week: 'S6', volume: 8700 },
];

const STRENGTH_DATA = [
  { month: 'Ene', banca: 80, sentadilla: 110, deadlift: 130 },
  { month: 'Feb', banca: 85, sentadilla: 118, deadlift: 140 },
  { month: 'Mar', banca: 90, sentadilla: 125, deadlift: 148 },
  { month: 'Abr', banca: 92, sentadilla: 130, deadlift: 152 },
  { month: 'May', banca: 96, sentadilla: 136, deadlift: 158 },
  { month: 'Jun', banca: 100, sentadilla: 140, deadlift: 160 },
];

const BODY_DATA = [
  { month: 'Ene', weight: 78, fat: 18 },
  { month: 'Feb', weight: 79.5, fat: 17.2 },
  { month: 'Mar', weight: 80.8, fat: 16.5 },
  { month: 'Abr', weight: 81.5, fat: 15.8 },
  { month: 'May', weight: 82.1, fat: 15.2 },
  { month: 'Jun', weight: 83, fat: 14.5 },
];

const MUSCLE_DATA = [
  { group: 'Pecho', sets: 24 },
  { group: 'Espalda', sets: 22 },
  { group: 'Hombros', sets: 18 },
  { group: 'Bíceps', sets: 14 },
  { group: 'Tríceps', sets: 16 },
  { group: 'Piernas', sets: 28 },
];

const customTooltipStyle = {
  background: '#1A1A1C',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '10px',
  color: '#F4F4F5',
  fontSize: '12px',
  padding: '8px 12px',
  boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
};

function StatCard({ label, value, delta, unit, Icon, positive }) {
  return (
    <div className="glass-effect rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <Icon className="w-5 h-5 text-[#FFD600]" />
        <div className={`flex items-center gap-0.5 text-[10px] font-black ${positive ? 'text-green-400' : 'text-red-400'}`}>
          {positive ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          {delta}
        </div>
      </div>
      <p className="text-2xl font-black text-[#F4F4F5] leading-none">{value}<span className="text-sm text-[#71717A] font-bold ml-1">{unit}</span></p>
      <p className="text-[10px] text-[#71717A] font-bold uppercase tracking-wide mt-1">{label}</p>
    </div>
  );
}

export default function AnalyticsScreen() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#F4F4F5]">Analíticas</h2>
        <p className="text-[#71717A] text-sm">Tu progreso en datos reales.</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Peso Corporal" value="83.0" unit="kg" delta="+5kg" Icon={Activity} positive={true} />
        <StatCard label="Grasa Corporal" value="14.5" unit="%" delta="-3.5%" Icon={Flame} positive={true} />
        <StatCard label="Volumen Sem." value="8.7k" unit="kg" delta="+12%" Icon={Dumbbell} positive={true} />
        <StatCard label="Sesiones Mes" value="18" unit="/20" delta="-2" Icon={Calendar} positive={false} />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-[#111113] p-1 rounded-xl overflow-x-auto scrollbar-hide">
        {[
          { id: 'overview', label: 'General' },
          { id: 'strength', label: 'Fuerza' },
          { id: 'body', label: 'Cuerpo' },
          { id: 'volume', label: 'Volumen' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className="flex-shrink-0 flex-1 py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wide transition-all cursor-pointer border-none whitespace-nowrap"
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
        {activeTab === 'overview' && (
          <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-5">
            {/* Volume chart */}
            <div className="glass-effect rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <BarChart2 className="w-4 h-4 text-[#FFD600]" />
                <h3 className="font-bold text-[#F4F4F5] text-sm">Volumen semanal</h3>
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={VOLUME_DATA} barCategoryGap="30%">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis dataKey="week" tick={{ fill: '#71717A', fontSize: 11, fontWeight: 700 }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip contentStyle={customTooltipStyle} cursor={{ fill: 'rgba(255,214,0,0.05)' }} formatter={(v) => [`${(v/1000).toFixed(1)}k kg`, 'Volumen']} />
                  <Bar dataKey="volume" fill="#FFD600" radius={[6,6,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            {/* Muscle distribution */}
            <div className="glass-effect rounded-2xl p-5">
              <h3 className="font-bold text-[#F4F4F5] mb-4 text-sm flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#FFD600]" /> Series por grupo muscular (últimas 4 sem)
              </h3>
              <div className="flex flex-col gap-3">
                {MUSCLE_DATA.map(m => {
                  const max = Math.max(...MUSCLE_DATA.map(x => x.sets));
                  const pct = (m.sets / max) * 100;
                  return (
                    <div key={m.group}>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-[#F4F4F5] uppercase tracking-wide">{m.group}</span>
                        <span className="text-[#FFD600]">{m.sets} series</span>
                      </div>
                      <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                        <motion.div
                          className="h-2 rounded-full bg-[#FFD600]"
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.7, ease: 'easeOut' }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'strength' && (
          <motion.div key="strength" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-5">
            <div className="glass-effect rounded-2xl p-5">
              <h3 className="font-bold text-[#F4F4F5] mb-1 text-sm">Evolución de fuerza</h3>
              <p className="text-[#71717A] text-xs mb-4">Peso máximo (kg) en ejercicios principales.</p>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={STRENGTH_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis dataKey="month" tick={{ fill: '#71717A', fontSize: 11, fontWeight: 700 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#71717A', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={customTooltipStyle} formatter={(v, name) => [`${v}kg`, name === 'banca' ? 'Press Banca' : name === 'sentadilla' ? 'Sentadilla' : 'Peso Muerto']} />
                  <Line type="monotone" dataKey="banca" stroke="#FFD600" strokeWidth={2.5} dot={{ fill: '#FFD600', r: 4 }} />
                  <Line type="monotone" dataKey="sentadilla" stroke="#22d3ee" strokeWidth={2.5} dot={{ fill: '#22d3ee', r: 4 }} />
                  <Line type="monotone" dataKey="deadlift" stroke="#f97316" strokeWidth={2.5} dot={{ fill: '#f97316', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-3">
                {[
                  { label: 'Press Banca', color: '#FFD600' },
                  { label: 'Sentadilla', color: '#22d3ee' },
                  { label: 'Peso Muerto', color: '#f97316' },
                ].map(l => (
                  <div key={l.label} className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full" style={{ background: l.color }} />
                    <span className="text-[10px] font-bold text-[#71717A]">{l.label}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* PR cards */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { name: 'Press Banca', pr: '100kg', delta: '+20kg' },
                { name: 'Sentadilla', pr: '140kg', delta: '+30kg' },
                { name: 'Peso Muerto', pr: '160kg', delta: '+30kg' },
              ].map(p => (
                <div key={p.name} className="glass-effect rounded-xl p-3 text-center">
                  <p className="text-[9px] text-[#71717A] font-bold uppercase tracking-wide leading-tight mb-1">{p.name}</p>
                  <p className="text-xl font-black text-[#FFD600]">{p.pr}</p>
                  <p className="text-[10px] text-green-400 font-bold">{p.delta}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'body' && (
          <motion.div key="body" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-5">
            <div className="glass-effect rounded-2xl p-5">
              <h3 className="font-bold text-[#F4F4F5] mb-1 text-sm">Composición corporal</h3>
              <p className="text-[#71717A] text-xs mb-4">Peso total y % grasa corporal.</p>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={BODY_DATA}>
                  <defs>
                    <linearGradient id="weight-g" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FFD600" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#FFD600" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="fat-g" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis dataKey="month" tick={{ fill: '#71717A', fontSize: 11, fontWeight: 700 }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip contentStyle={customTooltipStyle} formatter={(v, name) => [name === 'weight' ? `${v}kg` : `${v}%`, name === 'weight' ? 'Peso' : '% Grasa']} />
                  <Area type="monotone" dataKey="weight" stroke="#FFD600" strokeWidth={2.5} fill="url(#weight-g)" />
                  <Area type="monotone" dataKey="fat" stroke="#ef4444" strokeWidth={2.5} fill="url(#fat-g)" />
                </AreaChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-6 mt-2">
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#FFD600]" /><span className="text-[10px] font-bold text-[#71717A]">Peso total</span></div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-red-500" /><span className="text-[10px] font-bold text-[#71717A]">% Grasa</span></div>
              </div>
            </div>
            {/* Body stats */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Masa Muscular', value: '71.1kg', delta: '+8.5kg', color: '#22d3ee' },
                { label: 'Masa Grasa', value: '11.9kg', delta: '-2.9kg', color: '#ef4444' },
                { label: 'IMC', value: '27.1', delta: '+1.7', color: '#FFD600' },
                { label: 'Peso Ideal', value: '79-85kg', delta: 'Rango', color: '#a3e635' },
              ].map(s => (
                <div key={s.label} className="glass-effect rounded-xl p-4">
                  <div className="w-2 h-2 rounded-full mb-2" style={{ background: s.color }} />
                  <p className="text-lg font-black text-[#F4F4F5]">{s.value}</p>
                  <p className="text-[10px] text-[#71717A] font-bold uppercase tracking-wide">{s.label}</p>
                  <p className="text-xs font-bold mt-1" style={{ color: s.color }}>{s.delta}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'volume' && (
          <motion.div key="volume" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-5">
            <div className="glass-effect rounded-2xl p-5">
              <h3 className="font-bold text-[#F4F4F5] mb-1 text-sm">Volumen acumulado semanal</h3>
              <p className="text-[#71717A] text-xs mb-4">Toneladas totales movidas por semana.</p>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={VOLUME_DATA}>
                  <defs>
                    <linearGradient id="vol-g" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FFD600" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#FFD600" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis dataKey="week" tick={{ fill: '#71717A', fontSize: 11, fontWeight: 700 }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip contentStyle={customTooltipStyle} formatter={(v) => [`${(v/1000).toFixed(1)}t`, 'Volumen']} />
                  <Area type="monotone" dataKey="volume" stroke="#FFD600" strokeWidth={2.5} fill="url(#vol-g)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            {/* Volume by muscle */}
            <div className="glass-effect rounded-2xl p-5">
              <h3 className="font-bold text-[#F4F4F5] mb-4 text-sm">Volumen por grupo muscular</h3>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={MUSCLE_DATA} layout="vertical" barCategoryGap="25%">
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="group" tick={{ fill: '#71717A', fontSize: 11, fontWeight: 700 }} axisLine={false} tickLine={false} width={64} />
                  <Tooltip contentStyle={customTooltipStyle} formatter={(v) => [`${v} series`, '']} />
                  <Bar dataKey="sets" fill="#FFD600" radius={[0,6,6,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
