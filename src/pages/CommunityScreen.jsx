import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Share2, Bookmark, Search, Plus, Trophy, Flame, Users, TrendingUp, X, Send, Check } from 'lucide-react';

const POSTS = [
  {
    id: 1,
    user: 'Carlos M.',
    avatar: 'CM',
    time: 'hace 2h',
    tag: 'Push Day',
    content: 'Sesión brutal hoy. Nuevo PR en press banca 100kg x 3. El programa de Sergi está funcionando increíble 🔥',
    image: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=600',
    likes: 142,
    comments: 18,
    liked: false,
  },
  {
    id: 2,
    user: 'Marta G.',
    avatar: 'MG',
    time: 'hace 4h',
    tag: 'Nutrición',
    content: 'Macro breakdown del día: 2100kcal, 170g proteína. El tracking de la app es súper intuitivo. ¿Alguien más ya lo usa?',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600',
    likes: 87,
    comments: 24,
    liked: true,
  },
  {
    id: 3,
    user: 'David R.',
    avatar: 'DR',
    time: 'hace 6h',
    tag: 'Semana 8',
    content: 'Completé las 8 semanas del plan Boost Avanzado. Resultados: +8kg masa muscular, -4% grasa corporal. Los datos no mienten.',
    image: null,
    likes: 311,
    comments: 47,
    liked: false,
  },
  {
    id: 4,
    user: 'Laura V.',
    avatar: 'LV',
    time: 'hace 1d',
    tag: 'Legs Day',
    content: 'Día de piernas completado. Sentadilla 120kg, peso muerto rumano 90kg. Cada semana un poco más fuerte.',
    image: 'https://images.pexels.com/photos/931321/pexels-photo-931321.jpeg?auto=compress&cs=tinysrgb&w=600',
    likes: 199,
    comments: 31,
    liked: false,
  },
];

const INITIAL_CHALLENGES = [
  { id: 1, title: '30 Días Proteína', progress: 18, total: 30, participants: 1240, icon: '💪', joined: false },
  { id: 2, title: 'Racha Semanal', progress: 5, total: 7, participants: 870, icon: '🔥', joined: true },
  { id: 3, title: 'Volumen 100k kg', progress: 67000, total: 100000, participants: 430, icon: '🏆', joined: false },
];

const COMMENTS_DATA = {
  1: [
    { user: 'Ana P.', avatar: 'AP', text: '¡Brutal! Yo también noté mejoras en semana 4.', time: 'hace 30m' },
    { user: 'Javi L.', avatar: 'JL', text: 'Ese press está de lujo, sigue así 💪', time: 'hace 1h' },
  ],
  2: [
    { user: 'Carlos M.', avatar: 'CM', text: '¡Sí! Llevo 3 semanas usándola, muy completa.', time: 'hace 2h' },
  ],
  3: [],
  4: [
    { user: 'David R.', avatar: 'DR', text: 'Eso es constancia pura. Respeto.', time: 'hace 20h' },
  ],
};

function CommentModal({ post, onClose }) {
  const [comments, setComments] = useState(COMMENTS_DATA[post.id] || []);
  const [text, setText] = useState('');

  const send = () => {
    if (!text.trim()) return;
    setComments(c => [...c, { user: 'Tú', avatar: 'TÚ', text: text.trim(), time: 'ahora' }]);
    setText('');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        className="w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl flex flex-col"
        style={{ background: '#1A1A1C', border: '1px solid rgba(255,255,255,0.08)', maxHeight: '80vh' }}
      >
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <h3 className="font-black text-white">Comentarios</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-[#111113] flex items-center justify-center border-none cursor-pointer text-[#71717A] hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
          {comments.length === 0 && (
            <p className="text-center text-sm text-[#71717A] py-8">Sé el primero en comentar.</p>
          )}
          {comments.map((c, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-black text-[10px] font-black flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #FFD600, #FFA500)' }}>
                {c.avatar.slice(0, 2)}
              </div>
              <div className="flex-1 bg-[#111113] rounded-xl p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-[#F4F4F5]">{c.user}</span>
                  <span className="text-[10px] text-[#71717A]">{c.time}</span>
                </div>
                <p className="text-sm text-[#D4D4D8]">{c.text}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-white/5 flex gap-2">
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Escribe un comentario..."
            className="flex-1 bg-[#111113] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[#F4F4F5] placeholder:text-[#71717A] outline-none focus:border-[rgba(255,214,0,0.3)] transition-colors"
          />
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={send}
            disabled={!text.trim()}
            className="w-10 h-10 rounded-xl flex items-center justify-center border-none cursor-pointer transition-all flex-shrink-0"
            style={{ background: text.trim() ? '#FFD600' : '#111113', color: text.trim() ? '#000' : '#71717A' }}
          >
            <Send className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function CreatePostModal({ onClose, onPost }) {
  const [text, setText] = useState('');
  const [tag, setTag] = useState('');
  const TAGS = ['Push Day', 'Pull Day', 'Legs Day', 'Nutrición', 'PR', 'Progreso'];

  const submit = () => {
    if (!text.trim()) return;
    onPost({ text: text.trim(), tag: tag || 'General' });
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        className="w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl flex flex-col"
        style={{ background: '#1A1A1C', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <h3 className="font-black text-white">Nuevo post</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-[#111113] flex items-center justify-center border-none cursor-pointer text-[#71717A] hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5 flex flex-col gap-4">
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Comparte tu entreno, progreso o motivación..."
            rows={4}
            className="w-full bg-[#111113] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#F4F4F5] placeholder:text-[#71717A] outline-none focus:border-[rgba(255,214,0,0.3)] transition-colors resize-none"
          />
          <div>
            <p className="text-[10px] font-bold text-[#71717A] uppercase tracking-wide mb-2">Etiqueta</p>
            <div className="flex flex-wrap gap-2">
              {TAGS.map(t => (
                <button
                  key={t}
                  onClick={() => setTag(t === tag ? '' : t)}
                  className="px-3 py-1 rounded-full text-[11px] font-bold border-none cursor-pointer transition-all"
                  style={{
                    background: tag === t ? '#FFD600' : '#111113',
                    color: tag === t ? '#000' : '#71717A',
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={submit}
            disabled={!text.trim()}
            className="w-full py-3 rounded-xl text-sm font-black uppercase tracking-wide border-none cursor-pointer transition-all"
            style={{ background: text.trim() ? '#FFD600' : 'rgba(255,255,255,0.05)', color: text.trim() ? '#000' : '#71717A' }}
          >
            Publicar
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function PostCard({ post, onComment }) {
  const [liked, setLiked] = useState(post.liked);
  const [likes, setLikes] = useState(post.likes);
  const [saved, setSaved] = useState(false);
  const [shared, setShared] = useState(false);

  const toggleLike = () => {
    setLiked(!liked);
    setLikes(l => liked ? l - 1 : l + 1);
  };

  const handleShare = () => {
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-effect rounded-2xl overflow-hidden"
    >
      {post.image && (
        <div className="h-48 overflow-hidden">
          <img src={post.image} alt="" className="w-full h-full object-cover" />
        </div>
      )}
      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-black text-xs font-black flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #FFD600, #FFA500)' }}>
            {post.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm text-[#F4F4F5] truncate">{post.user}</p>
            <p className="text-xs text-[#71717A]">{post.time}</p>
          </div>
          <span className="text-[10px] font-black px-2 py-1 rounded-full bg-[rgba(255,214,0,0.1)] text-[#FFD600] border border-[rgba(255,214,0,0.2)] flex-shrink-0">
            {post.tag}
          </span>
        </div>
        <p className="text-sm text-[#D4D4D8] leading-relaxed mb-4">{post.content}</p>
        <div className="flex items-center gap-4 pt-3 border-t border-white/5">
          <button
            onClick={toggleLike}
            className="flex items-center gap-1.5 text-xs font-bold transition-colors cursor-pointer border-none bg-transparent"
            style={{ color: liked ? '#ef4444' : '#71717A' }}
          >
            <Heart className="w-4 h-4" fill={liked ? '#ef4444' : 'transparent'} />
            {likes}
          </button>
          <button
            onClick={() => onComment(post)}
            className="flex items-center gap-1.5 text-xs font-bold text-[#71717A] hover:text-[#F4F4F5] transition-colors cursor-pointer border-none bg-transparent"
          >
            <MessageCircle className="w-4 h-4" />
            {post.comments}
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 text-xs font-bold transition-colors cursor-pointer border-none bg-transparent"
            style={{ color: shared ? '#22c55e' : '#71717A' }}
          >
            {shared ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
            {shared && <span>Copiado</span>}
          </button>
          <button
            onClick={() => setSaved(!saved)}
            className="ml-auto flex items-center gap-1.5 text-xs font-bold transition-colors cursor-pointer border-none bg-transparent"
            style={{ color: saved ? '#FFD600' : '#71717A' }}
          >
            <Bookmark className="w-4 h-4" fill={saved ? '#FFD600' : 'transparent'} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function CommunityScreen() {
  const [activeTab, setActiveTab] = useState('feed');
  const [posts, setPosts] = useState(POSTS);
  const [challenges, setChallenges] = useState(INITIAL_CHALLENGES);
  const [commentPost, setCommentPost] = useState(null);
  const [showCreatePost, setShowCreatePost] = useState(false);

  const handleNewPost = ({ text, tag }) => {
    const newPost = {
      id: Date.now(),
      user: 'Tú',
      avatar: 'TÚ',
      time: 'ahora',
      tag,
      content: text,
      image: null,
      likes: 0,
      comments: 0,
      liked: false,
    };
    setPosts(p => [newPost, ...p]);
  };

  const toggleChallenge = (id) => {
    setChallenges(cs => cs.map(c => c.id === id
      ? { ...c, joined: !c.joined, participants: c.joined ? c.participants - 1 : c.participants + 1 }
      : c
    ));
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#F4F4F5]">Comunidad</h2>
          <p className="text-[#71717A] text-sm">Conecta, comparte y motívate.</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCreatePost(true)}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-black cursor-pointer border-none"
          style={{ background: '#FFD600' }}
        >
          <Plus className="w-5 h-5" />
        </motion.button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717A] pointer-events-none" />
        <input
          type="text"
          placeholder="Buscar en la comunidad..."
          className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#111113] border border-white/5 text-sm text-[#F4F4F5] placeholder:text-[#71717A] outline-none focus:border-[rgba(255,214,0,0.3)] transition-colors"
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Miembros', value: '12.4k', Icon: Users },
          { label: 'Posts hoy', value: '348', Icon: TrendingUp },
          { label: 'Retos activos', value: '7', Icon: Trophy },
        ].map(s => (
          <div key={s.label} className="glass-effect rounded-xl p-3 flex flex-col items-center gap-1 text-center">
            <s.Icon className="w-4 h-4 text-[#FFD600]" />
            <p className="text-base font-black text-[#F4F4F5]">{s.value}</p>
            <p className="text-[10px] text-[#71717A] font-bold uppercase tracking-wide">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 bg-[#111113] p-1 rounded-xl">
        {[
          { id: 'feed', label: 'Feed' },
          { id: 'challenges', label: 'Retos' },
          { id: 'ranking', label: 'Ranking' },
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
        {activeTab === 'feed' && (
          <motion.div key="feed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-4">
            {posts.map(p => <PostCard key={p.id} post={p} onComment={setCommentPost} />)}
          </motion.div>
        )}

        {activeTab === 'challenges' && (
          <motion.div key="challenges" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-4">
            {challenges.map((c) => {
              const pct = Math.min((c.progress / c.total) * 100, 100);
              return (
                <div key={c.id} className="glass-effect rounded-2xl p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-[#111113] flex items-center justify-center text-2xl">
                        {c.icon}
                      </div>
                      <div>
                        <p className="font-bold text-[#F4F4F5]">{c.title}</p>
                        <p className="text-xs text-[#71717A]">{c.participants.toLocaleString()} participantes</p>
                      </div>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleChallenge(c.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-black uppercase cursor-pointer border-none transition-all"
                      style={{
                        background: c.joined ? 'rgba(34,197,94,0.15)' : '#FFD600',
                        color: c.joined ? '#22c55e' : '#000',
                        border: c.joined ? '1px solid rgba(34,197,94,0.3)' : 'none',
                      }}
                    >
                      {c.joined ? '✓ Unido' : 'Unirse'}
                    </motion.button>
                  </div>
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-[#71717A]">Progreso</span>
                    <span className="text-[#FFD600]">{Math.round(pct)}%</span>
                  </div>
                  <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                    <motion.div
                      className="h-2 rounded-full bg-[#FFD600]"
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}

        {activeTab === 'ranking' && (
          <motion.div key="ranking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-3">
            {[
              { rank: 1, name: 'David R.', points: 9840, badge: '👑' },
              { rank: 2, name: 'Carlos M.', points: 8720, badge: '🥈' },
              { rank: 3, name: 'Laura V.', points: 7310, badge: '🥉' },
              { rank: 4, name: 'Marta G.', points: 6890, badge: null },
              { rank: 5, name: 'Tú', points: 5210, badge: null, isYou: true },
            ].map(u => (
              <div
                key={u.rank}
                className="glass-effect rounded-xl p-4 flex items-center gap-4"
                style={u.isYou ? { border: '1px solid rgba(255,214,0,0.3)', background: 'rgba(255,214,0,0.04)' } : {}}
              >
                <div className="w-8 flex-shrink-0 text-center">
                  {u.badge ? (
                    <span className="text-xl">{u.badge}</span>
                  ) : (
                    <span className="text-sm font-black text-[#71717A]">#{u.rank}</span>
                  )}
                </div>
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-black text-xs font-black flex-shrink-0"
                  style={{ background: u.isYou ? '#FFD600' : 'linear-gradient(135deg,#555,#333)' }}>
                  {u.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm text-[#F4F4F5]">{u.name} {u.isYou && <span className="text-[10px] text-[#FFD600]">(tú)</span>}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-[#FFD600]" />
                  <span className="text-sm font-black text-[#F4F4F5]">{u.points.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {commentPost && (
          <CommentModal post={commentPost} onClose={() => setCommentPost(null)} />
        )}
        {showCreatePost && (
          <CreatePostModal onClose={() => setShowCreatePost(false)} onPost={handleNewPost} />
        )}
      </AnimatePresence>
    </div>
  );
}
