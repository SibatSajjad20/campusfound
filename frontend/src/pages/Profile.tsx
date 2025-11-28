import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, MapPin, Calendar, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/config';
import toast from 'react-hot-toast';
import { getDefaultImage } from '../utils/defaultImages';
import { getImageUrl } from '../utils/imageUtils';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserItems();
  }, []);

  const fetchUserItems = async () => {
    try {
      const response = await api.get('/items/my-items');
      setItems(response.data.items || []);
    } catch (error) {
      toast.error('Failed to fetch your items');
    } finally {
      setLoading(false);
    }
  };

  const lostItems = items.filter(item => item.type === 'lost');
  const foundItems = items.filter(item => item.type === 'found');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative z-10 pt-24 px-4 pb-20"
    >
      <div className="max-w-6xl mx-auto">
        {/* User Info Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 mb-12"
        >
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                {user?.user?.name || user?.name || 'User'}
              </h1>
              <p className="text-slate-400 mb-4 text-sm sm:text-base">{user?.user?.email || user?.email}</p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-3 sm:gap-4">
                <span className="px-4 py-2 bg-rose-500/20 text-rose-200 border border-rose-500/30 rounded-xl text-sm font-bold">
                  {lostItems.length} Lost
                </span>
                <span className="px-4 py-2 bg-emerald-500/20 text-emerald-200 border border-emerald-500/30 rounded-xl text-sm font-bold">
                  {foundItems.length} Found
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Lost Items */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8">
            Lost Items <span className="text-rose-400">Reported</span>
          </h2>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500 mx-auto"></div>
            </div>
          ) : lostItems.length === 0 ? (
            <div className="bg-slate-900/30 backdrop-blur-xl border border-white/5 rounded-2xl p-8 sm:p-12 text-center">
              <p className="text-slate-400">No lost items reported yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {lostItems.map((item, index) => (
                <ItemCard key={item._id} item={item} index={index} />
              ))}
            </div>
          )}
        </section>

        {/* Found Items */}
        <section>
          <h2 className="text-3xl font-bold text-white mb-8">
            Found Items <span className="text-emerald-400">Reported</span>
          </h2>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500 mx-auto"></div>
            </div>
          ) : foundItems.length === 0 ? (
            <div className="bg-slate-900/30 backdrop-blur-xl border border-white/5 rounded-2xl p-8 sm:p-12 text-center">
              <p className="text-slate-400">No found items reported yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {foundItems.map((item, index) => (
                <ItemCard key={item._id} item={item} index={index} />
              ))}
            </div>
          )}
        </section>
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
            {new Date(item.createdAt || item.date).toLocaleDateString()}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;
