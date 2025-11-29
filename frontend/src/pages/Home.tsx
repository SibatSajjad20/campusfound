import React, { useState, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import { Search, MapPin, Calendar, ArrowRight, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/config';
import toast from 'react-hot-toast';
import { getDefaultImage } from '../utils/defaultImages';
import { getImageUrl } from '../utils/imageUtils';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 50 } 
  }
};

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [localSearch, setLocalSearch] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await api.get('/items/all', { timeout: 90000 });
      setItems(response.data.items || []);
    } catch (error: any) {
      console.error('Fetch items error:', error);
      if (error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK') {
        toast.error('Slow connection. Please wait...');
        setTimeout(() => fetchItems(), 3000);
      } else {
        toast.error('Failed to load items. Pull to refresh.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  const filteredItems = items.filter(item => {
    if (!localSearch.trim()) return true;
    const search = localSearch.toLowerCase();
    return (
      item.title?.toLowerCase().includes(search) ||
      item.description?.toLowerCase().includes(search) ||
      item.location?.toLowerCase().includes(search) ||
      item.category?.toLowerCase().includes(search)
    );
  });

  return (
    <div className="relative z-10 pt-24 px-4">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-violet-600/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none animate-pulse" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-fuchsia-600/10 rounded-full blur-[100px] mix-blend-screen pointer-events-none" />

      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center py-20">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-5xl mx-auto text-center w-full relative z-10"
        >
          <motion.div 
            variants={itemVariants}
            className="flex justify-center mb-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-lg shadow-violet-900/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-medium text-violet-200 tracking-wide uppercase">AI-Powered Recovery</span>
            </div>
          </motion.div>

          <motion.h1 
            variants={itemVariants}
            className="text-5xl md:text-7xl lg:text-8xl font-heading font-extrabold text-white mb-8 leading-tight tracking-tight"
          >
            Reunite with <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 drop-shadow-2xl">
              What's Yours
            </span>
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed font-light"
          >
            The smart campus network that sees what you lost. Upload a photo, match with AI, and connect instantly.
          </motion.p>

          {/* Search Bar */}
          <motion.form 
            variants={itemVariants}
            onSubmit={handleSearch}
            className="max-w-3xl mx-auto mb-16 relative z-20"
          >
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 rounded-2xl blur opacity-40 group-hover:opacity-70 transition duration-500 animate-tilt"></div>
              <div className="relative flex items-center bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl ring-1 ring-white/10 focus-within:ring-violet-500/50 transition-all">
                <div className="pl-4 text-slate-400">
                  <Search className="w-6 h-6" />
                </div>
                <input 
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search for 'Airpods', 'Blue ID card'..."
                  className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-white placeholder-slate-500 px-4 py-4 text-lg"
                />
                <motion.button 
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-br from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white p-4 rounded-xl shadow-lg shadow-violet-900/40 transition-all"
                >
                  <MapPin className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </motion.form>

          {/* CTA Buttons */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <motion.button
              onClick={() => navigate('/report?type=lost')}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="group relative px-8 py-4 bg-slate-800 hover:bg-slate-700 rounded-2xl font-bold text-white shadow-xl overflow-hidden w-full sm:w-auto border border-white/5"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-rose-500/20 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative flex items-center justify-center gap-3 text-rose-400 group-hover:text-rose-300">
                <AlertTriangle className="w-5 h-5" />
                Report Lost Item
              </span>
            </motion.button>

            <motion.button
              onClick={() => navigate('/report?type=found')}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="group relative px-8 py-4 bg-white text-slate-950 rounded-2xl font-bold shadow-[0_0_20px_rgba(255,255,255,0.3)] overflow-hidden w-full sm:w-auto"
            >
              <span className="relative flex items-center justify-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                Report Found Item
              </span>
            </motion.button>
          </motion.div>
        </motion.div>
      </section>

      {/* Recent Items */}
      <section className="relative py-32">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <motion.h2 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-4xl md:text-5xl font-heading font-bold text-white mb-2"
              >
                Recent <span className="text-violet-400">Activity</span>
              </motion.h2>
              <p className="text-slate-400 text-lg">Latest reports from the community</p>
            </div>
            <motion.button 
              whileHover={{ x: 5 }}
              onClick={() => navigate('/search')}
              className="flex items-center gap-2 text-violet-400 font-medium hover:text-violet-300 transition-colors"
            >
              View All <ArrowRight size={20} />
            </motion.button>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Filter by title, description, location..."
              className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all"
            />
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {filteredItems.slice(0, 6).map((item, index) => (
                <ItemCard key={item._id} item={item} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-slate-400">
              {localSearch ? 'No items match your search' : 'No items found'}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

const ItemCard = ({ item, index }: { item: any; index: number }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.1, type: "spring", stiffness: 50 }}
      whileHover={{ y: -10 }}
      onClick={() => navigate(`/item/${item._id}`)}
      className="group cursor-pointer relative bg-slate-900/40 backdrop-blur-md rounded-3xl overflow-hidden border border-white/5 hover:border-violet-500/30 transition-all duration-300 shadow-2xl"
    >
      <div className="relative h-64 overflow-hidden bg-slate-800/50">
        <div className={`absolute top-4 left-4 z-10 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider backdrop-blur-md border shadow-lg ${
          item.type === 'lost' 
            ? 'bg-rose-500/20 text-rose-200 border-rose-500/30' 
            : 'bg-emerald-500/20 text-emerald-200 border-emerald-500/30'
        }`}>
          {item.type}
        </div>
        {/* Status Badge */}
        <div className={`absolute top-4 right-4 z-10 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider backdrop-blur-md border shadow-lg ${
          item.status === 'pending' ? 'bg-orange-500/20 text-orange-200 border-orange-500/30' :
          item.status === 'active' ? 'bg-emerald-500/20 text-emerald-200 border-emerald-500/30' :
          item.status === 'rejected' ? 'bg-rose-500/20 text-rose-200 border-rose-500/30' :
          'bg-gray-500/20 text-gray-200 border-gray-500/30'
        }`}>
          {item.status}
        </div>
        
        {item.imageUrl ? (
          <img 
            src={getImageUrl(item.imageUrl) || ''}
            alt={`${item.type} item: ${item.title}`}
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                parent.innerHTML = `<div class="w-full h-full bg-gradient-to-br from-violet-600/40 to-fuchsia-600/40 flex items-center justify-center"><div class="text-6xl sm:text-7xl lg:text-8xl font-bold text-white/90">${item.title.charAt(0).toUpperCase()}</div></div>`;
              }
            }}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-violet-600/30 to-fuchsia-600/30 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 via-purple-500/20 to-fuchsia-500/20" />
            <img 
              src={getDefaultImage(item.category)}
              alt={item.title}
              loading="lazy"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = `<div class="text-5xl sm:text-6xl lg:text-7xl font-bold text-white/90 z-20">${item.title.charAt(0).toUpperCase()}</div>`;
                }
              }}
              className="w-24 h-24 sm:w-32 sm:h-32 lg:w-36 lg:h-36 object-contain z-10 opacity-95 transform group-hover:scale-110 transition-transform duration-700"
              style={{ filter: 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.4)) drop-shadow(0 0 8px rgba(139, 92, 246, 0.3))' }}
            />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
      </div>
      
      <div className="p-6 relative">
        <div className="absolute -top-10 right-6 w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center border border-white/10 shadow-xl group-hover:bg-violet-600 transition-colors duration-300">
          <ArrowRight className="w-5 h-5 text-white -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
        </div>

        <h3 className="text-xl font-bold text-white mb-4 pr-8 group-hover:text-violet-300 transition-colors">{item.title}</h3>
        
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
            <div className="p-1.5 rounded-full bg-white/5">
              <MapPin size={14} className="text-violet-400" />
            </div>
            {item.location}
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
            <div className="p-1.5 rounded-full bg-white/5">
              <Calendar size={14} className="text-violet-400" />
            </div>
            {new Date(item.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const SkeletonCard = () => (
  <div className="bg-slate-900/40 backdrop-blur-md rounded-3xl overflow-hidden border border-white/5 animate-pulse">
    <div className="h-64 bg-slate-800/50" />
    <div className="p-6 space-y-4">
      <div className="h-6 bg-slate-800/50 rounded w-3/4" />
      <div className="space-y-2">
        <div className="h-4 bg-slate-800/50 rounded w-full" />
        <div className="h-4 bg-slate-800/50 rounded w-2/3" />
      </div>
    </div>
  </div>
);

export default Home;
