import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search as SearchIcon, MapPin, Calendar, ArrowRight } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api/config';
import { getDefaultImage } from '../utils/defaultImages';
import { getImageUrl } from '../utils/imageUtils';

const Search: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    query: searchParams.get('q') || '',
    category: '',
    type: ''
  });

  const categories = [
    'Electronics', 'Clothing', 'Books', 'IDs/Wallets', 'Keys', 'Jewelry',
    'Bags/Backpacks', 'Sports Equipment', 'Supplies', 'Other'
  ];

  useEffect(() => {
    setFilters({
      query: searchParams.get('q') || '',
      category: searchParams.get('category') || '',
      type: searchParams.get('type') || ''
    });
    searchItems();
  }, [searchParams]);

  const searchItems = async () => {
    setLoading(true);
    try {
      const query = searchParams.get('q') || '';
      const category = searchParams.get('category') || '';
      const type = searchParams.get('type') || '';
      
      if (!query && !category && !type) {
        const response = await api.get('/items/all');
        setItems(response.data.items || []);
      } else {
        const params = new URLSearchParams();
        if (query.trim()) params.append('query', query.trim());
        if (category) params.append('category', category);
        if (type) params.append('type', type);
        
        const response = await api.get(`/items/search?${params}`);
        setItems(response.data.items || []);
      }
    } catch (error) {
      console.error('Search error:', error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (filters.query) params.append('q', filters.query);
    if (filters.category) params.append('category', filters.category);
    if (filters.type) params.append('type', filters.type);

    navigate(`/search?${params}`);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative z-10 pt-24 px-4 pb-20"
    >
      <div className="max-w-7xl mx-auto">
        {/* Search Header */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 mb-8">
          <h1 className="text-3xl font-bold text-white mb-6">Search Items</h1>

          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="text"
                name="query"
                value={filters.query}
                onChange={handleFilterChange}
                placeholder="Search items..."
                className="col-span-2 p-3 bg-slate-950/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none transition-colors"
              />

              <div className="relative">
                <select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className="w-full p-3 pr-10 bg-gradient-to-r from-violet-600/10 to-fuchsia-600/10 border border-white/10 rounded-xl text-white focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all cursor-pointer hover:border-violet-500/50 appearance-none"
                >
                  <option value="" className="bg-slate-900">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat} className="bg-slate-900">{cat}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              <div className="relative">
                <select
                  name="type"
                  value={filters.type}
                  onChange={handleFilterChange}
                  className="w-full p-3 pr-10 bg-gradient-to-r from-violet-600/10 to-fuchsia-600/10 border border-white/10 rounded-xl text-white focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all cursor-pointer hover:border-violet-500/50 appearance-none"
                >
                  <option value="" className="bg-slate-900">Lost & Found</option>
                  <option value="lost" className="bg-slate-900">Lost Only</option>
                  <option value="found" className="bg-slate-900">Found Only</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white px-8 py-3 rounded-xl font-semibold shadow-lg shadow-violet-900/40 transition-all"
            >
              Search
            </motion.button>
          </form>
        </div>

        {/* Results */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">
            Search Results ({items.length} items)
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500 mx-auto"></div>
            </div>
          ) : items.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {items.map((item, index) => (
                <ItemCard key={item._id} item={item} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-400 text-lg">No items found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const ItemCard = ({ item, index }: { item: any; index: number }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      onClick={() => navigate(`/item/${item._id}`)}
      className="group cursor-pointer bg-slate-900/40 backdrop-blur-md rounded-2xl overflow-hidden border border-white/5 hover:border-violet-500/30 transition-all"
    >
      <div className="relative h-48 overflow-hidden">
        <div className={`absolute top-3 left-3 z-10 px-3 py-1 rounded-lg text-xs font-bold uppercase backdrop-blur-md border ${
          item.type === 'lost' 
            ? 'bg-rose-500/20 text-rose-200 border-rose-500/30' 
            : 'bg-emerald-500/20 text-emerald-200 border-emerald-500/30'
        }`}>
          {item.type}
        </div>
        
        {item.imageUrl ? (
          <img 
            src={getImageUrl(item.imageUrl) || ''}
            alt={item.title} 
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-violet-600/30 to-fuchsia-600/30 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 via-purple-500/20 to-fuchsia-500/20" />
            <img 
              src={getDefaultImage(item.category)}
              alt={item.title}
              className="w-32 h-32 object-contain z-10 opacity-95 transform group-hover:scale-110 transition-transform duration-500"
              style={{ filter: 'drop-shadow(0 6px 12px rgba(0, 0, 0, 0.4)) drop-shadow(0 0 6px rgba(139, 92, 246, 0.3))' }}
            />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
      </div>
      
      <div className="p-5">
        <h3 className="text-lg font-bold text-white mb-3 group-hover:text-violet-300 transition-colors">{item.title}</h3>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <MapPin size={14} className="text-violet-400" />
            {item.location}
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Calendar size={14} className="text-violet-400" />
            {new Date(item.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Search;
