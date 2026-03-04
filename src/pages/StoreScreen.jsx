import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Star, ShoppingCart, Check, Search, Filter, Zap, Package } from 'lucide-react';

const PRODUCTS = [
  {
    id: 1,
    name: 'Whey Premium SC',
    category: 'Suplementos',
    price: 49.99,
    originalPrice: 64.99,
    rating: 4.9,
    reviews: 1240,
    badge: 'Más vendido',
    image: 'https://images.pexels.com/photos/3490348/pexels-photo-3490348.jpeg?auto=compress&cs=tinysrgb&w=400',
    flavors: ['Chocolate', 'Vainilla', 'Fresa'],
    inCart: false,
  },
  {
    id: 2,
    name: 'Pre-Entreno BOOST',
    category: 'Suplementos',
    price: 34.99,
    originalPrice: null,
    rating: 4.8,
    reviews: 890,
    badge: 'Nuevo',
    image: 'https://images.pexels.com/photos/4397840/pexels-photo-4397840.jpeg?auto=compress&cs=tinysrgb&w=400',
    flavors: ['Sandía', 'Limón'],
    inCart: false,
  },
  {
    id: 3,
    name: 'Creatina Monohidrato',
    category: 'Suplementos',
    price: 19.99,
    originalPrice: 24.99,
    rating: 4.7,
    reviews: 2100,
    badge: null,
    image: 'https://images.pexels.com/photos/3766111/pexels-photo-3766111.jpeg?auto=compress&cs=tinysrgb&w=400',
    flavors: ['Neutro'],
    inCart: false,
  },
  {
    id: 4,
    name: 'Camiseta SC Oversized',
    category: 'Ropa',
    price: 39.99,
    originalPrice: 49.99,
    rating: 4.9,
    reviews: 560,
    badge: 'Edición limitada',
    image: 'https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=400',
    flavors: ['Negro', 'Blanco', 'Gris'],
    inCart: false,
  },
  {
    id: 5,
    name: 'Shaker Pro 800ml',
    category: 'Accesorios',
    price: 14.99,
    originalPrice: null,
    rating: 4.6,
    reviews: 310,
    badge: null,
    image: 'https://images.pexels.com/photos/3764538/pexels-photo-3764538.jpeg?auto=compress&cs=tinysrgb&w=400',
    flavors: ['Negro', 'Amarillo'],
    inCart: false,
  },
  {
    id: 6,
    name: 'Guantes Gym SC',
    category: 'Accesorios',
    price: 22.99,
    originalPrice: null,
    rating: 4.7,
    reviews: 445,
    badge: null,
    image: 'https://images.pexels.com/photos/3823207/pexels-photo-3823207.jpeg?auto=compress&cs=tinysrgb&w=400',
    flavors: ['Negro/Dorado'],
    inCart: false,
  },
];

const CATEGORIES = ['Todos', 'Suplementos', 'Ropa', 'Accesorios'];

function ProductCard({ product, onAddToCart }) {
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    setAdded(true);
    onAddToCart(product.id);
    setTimeout(() => setAdded(false), 2000);
  };

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-effect rounded-2xl overflow-hidden flex flex-col"
    >
      <div className="relative h-44 overflow-hidden bg-[#111113]">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.7) 100%)' }} />
        {product.badge && (
          <div className="absolute top-2 left-2">
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full text-black"
              style={{ background: '#FFD600' }}>
              {product.badge}
            </span>
          </div>
        )}
        {discount && (
          <div className="absolute top-2 right-2">
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-red-500 text-white">
              -{discount}%
            </span>
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#71717A] mb-1">{product.category}</p>
        <h4 className="font-bold text-sm text-[#F4F4F5] leading-tight mb-2">{product.name}</h4>
        <div className="flex items-center gap-1.5 mb-2">
          <Star className="w-3 h-3 text-[#FFD600]" fill="#FFD600" />
          <span className="text-xs font-bold text-[#F4F4F5]">{product.rating}</span>
          <span className="text-[10px] text-[#71717A]">({product.reviews.toLocaleString()})</span>
        </div>
        <div className="flex flex-wrap gap-1 mb-3">
          {product.flavors.slice(0, 2).map(f => (
            <span key={f} className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#111113] text-[#71717A] border border-white/5">
              {f}
            </span>
          ))}
          {product.flavors.length > 2 && (
            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#111113] text-[#71717A] border border-white/5">
              +{product.flavors.length - 2}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between mt-auto">
          <div>
            <span className="text-lg font-black text-[#F4F4F5]">{product.price}€</span>
            {product.originalPrice && (
              <span className="text-xs text-[#71717A] line-through ml-1">{product.originalPrice}€</span>
            )}
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleAdd}
            className="w-9 h-9 rounded-xl flex items-center justify-center border-none cursor-pointer transition-all"
            style={{
              background: added ? 'rgba(34,197,94,0.15)' : '#FFD600',
              color: added ? '#22c55e' : '#000',
            }}
          >
            {added ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export default function StoreScreen() {
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [search, setSearch] = useState('');
  const [cartCount, setCartCount] = useState(0);

  const handleAddToCart = () => setCartCount(c => c + 1);

  const filtered = PRODUCTS.filter(p => {
    const matchCat = activeCategory === 'Todos' || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#F4F4F5]">Tienda</h2>
          <p className="text-[#71717A] text-sm">Suplementos, ropa y accesorios.</p>
        </div>
        <motion.div whileTap={{ scale: 0.95 }} className="relative cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-[#111113] flex items-center justify-center">
            <ShoppingBag className="w-5 h-5 text-[#F4F4F5]" />
          </div>
          {cartCount > 0 && (
            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black text-black"
              style={{ background: '#FFD600' }}>
              {cartCount}
            </div>
          )}
        </motion.div>
      </div>

      {/* Promo banner */}
      <div className="relative rounded-2xl overflow-hidden h-28 flex items-center px-5"
        style={{ background: 'linear-gradient(135deg, #1A1800 0%, #2A2200 100%)', border: '1px solid rgba(255,214,0,0.2)' }}>
        <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full opacity-20" style={{ background: '#FFD600', filter: 'blur(40px)' }} />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-[#FFD600]" />
            <span className="text-[10px] font-black uppercase tracking-widest text-[#FFD600]">Oferta flash</span>
          </div>
          <p className="text-xl font-black text-white leading-tight">20% dto. en suplementos</p>
          <p className="text-xs text-[#71717A]">Solo esta semana · Código: <span className="text-[#FFD600] font-bold">BOOST20</span></p>
        </div>
        <div className="ml-auto relative z-10 flex-shrink-0">
          <button className="px-3 py-2 rounded-xl text-xs font-black uppercase text-black border-none cursor-pointer"
            style={{ background: '#FFD600' }}>
            Aplicar
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717A] pointer-events-none" />
        <input
          type="text"
          placeholder="Buscar productos..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#111113] border border-white/5 text-sm text-[#F4F4F5] placeholder:text-[#71717A] outline-none focus:border-[rgba(255,214,0,0.3)] transition-colors"
        />
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {CATEGORIES.map(c => (
          <button
            key={c}
            onClick={() => setActiveCategory(c)}
            className="flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wide transition-all cursor-pointer border-none"
            style={{
              background: activeCategory === c ? '#FFD600' : '#111113',
              color: activeCategory === c ? '#000' : '#71717A',
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Products grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory + search}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="grid grid-cols-2 sm:grid-cols-3 gap-4"
        >
          {filtered.map(p => (
            <ProductCard key={p.id} product={p} onAddToCart={handleAddToCart} />
          ))}
          {filtered.length === 0 && (
            <div className="col-span-2 sm:col-span-3 text-center py-12">
              <Package className="w-12 h-12 text-[#71717A] mx-auto mb-3" />
              <p className="text-[#71717A] font-bold">Sin resultados para "{search}"</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
