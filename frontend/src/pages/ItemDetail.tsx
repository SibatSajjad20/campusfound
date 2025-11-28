import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, User, MessageCircle, CheckCircle2, ArrowLeft, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/config';
import { chatApi } from '../api/chatApi';
import { useAuth } from '../context/AuthContext';
import { getDefaultImage } from '../utils/defaultImages';
import { getImageUrl } from '../utils/imageUtils';


const ItemDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    fetchItemDetail();
  }, [id]);

  const fetchItemDetail = async () => {
    try {
      const response = await api.get(`/items/${id}`);
      setItem(response.data.item);
    } catch (error) {
      toast.error('Failed to load item details');
      navigate('/home');
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async () => {
    if (!window.confirm('Are you sure you want to mark this item as resolved? This action cannot be undone.')) {
      return;
    }
    try {
      await api.patch(`/items/${id}/resolve`);
      toast.success('✓ Item marked as resolved!');
      fetchItemDetail();
    } catch (error: any) {
      toast.error(error.response?.data?.msg || 'Failed to resolve item');
    }
  };

  const handleApprove = async () => {
    try {
      await api.patch(`/items/${id}/approve`);
      toast.success('Item approved');
      fetchItemDetail();
    } catch (error: any) {
      toast.error(error.response?.data?.msg || 'Failed to approve item');
    }
  };

  const handleReject = async () => {
    try {
      await api.patch(`/items/${id}/reject`);
      toast.success('Item rejected');
      fetchItemDetail();
    } catch (error: any) {
      toast.error(error.response?.data?.msg || 'Failed to reject item');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await api.delete(`/items/${id}`);
      toast.success('Item deleted');
      navigate('/admin');
    } catch (error: any) {
      toast.error(error.response?.data?.msg || 'Failed to delete item');
    }
  };

  const handleStartChat = async () => {
    try {
      const response = await chatApi.getOrCreateConversation(id!);
      const conversationId = response.data.data._id;
      navigate('/chat', { state: { conversationId } });
    } catch (error: any) {
      console.error('Chat error:', error);
      if (error.response?.status === 400) {
        toast.error('You cannot chat with yourself');
      } else {
        toast.error(error.response?.data?.message || 'Failed to start chat');
      }
    }
  };

  if (loading) {
    return (
      <div className="relative z-10 min-h-screen flex items-center justify-center pt-24">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="relative z-10 min-h-screen flex items-center justify-center pt-24">
        <p className="text-slate-400">Item not found</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative z-10 pt-24 px-4 pb-20"
    >
      <div className="max-w-5xl mx-auto">
        <motion.button
          onClick={() => navigate('/home')}
          whileHover={{ x: -5 }}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Home
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden"
          >
            {item.imageUrl ? (
              <div className="relative h-64 sm:h-80 lg:h-full">
                <img 
                  src={getImageUrl(item.imageUrl) || ''}
                  alt={`${item.type} item: ${item.title}`}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
                <div className={`absolute top-4 left-4 px-4 py-2 rounded-xl text-sm font-bold uppercase backdrop-blur-md border shadow-lg ${
                  item.type === 'lost' 
                    ? 'bg-rose-500/20 text-rose-200 border-rose-500/30' 
                    : 'bg-emerald-500/20 text-emerald-200 border-emerald-500/30'
                }`}>
                  {item.type}
                </div>
                <div className={`absolute top-4 right-4 px-4 py-2 rounded-xl text-sm font-bold backdrop-blur-md border shadow-lg ${
                  item.status === 'pending' ? 'bg-orange-500/20 text-orange-200 border-orange-500/30' :
                  item.status === 'active' ? 'bg-emerald-500/20 text-emerald-200 border-emerald-500/30' :
                  item.status === 'rejected' ? 'bg-rose-500/20 text-rose-200 border-rose-500/30' :
                  'bg-gray-500/20 text-gray-200 border-gray-500/30'
                }`}>
                  {item.status}
                </div>
              </div>
            ) : (
              <div className="h-64 sm:h-80 lg:h-full bg-gradient-to-br from-violet-600/30 to-fuchsia-600/30 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 via-purple-500/20 to-fuchsia-500/20" />
                <img 
                  src={getDefaultImage(item.category)}
                  alt={item.title}
                  className="w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80 object-contain z-10 opacity-95"
                  style={{ filter: 'drop-shadow(0 16px 32px rgba(0, 0, 0, 0.5)) drop-shadow(0 0 16px rgba(139, 92, 246, 0.4))' }}
                />
                <div className={`absolute top-4 left-4 px-4 py-2 rounded-xl text-sm font-bold uppercase backdrop-blur-md border shadow-lg ${
                  item.type === 'lost' 
                    ? 'bg-rose-500/20 text-rose-200 border-rose-500/30' 
                    : 'bg-emerald-500/20 text-emerald-200 border-emerald-500/30'
                }`}>
                  {item.type}
                </div>
                <div className={`absolute top-4 right-4 px-4 py-2 rounded-xl text-sm font-bold backdrop-blur-md border shadow-lg ${
                  item.status === 'pending' ? 'bg-orange-500/20 text-orange-200 border-orange-500/30' :
                  item.status === 'active' ? 'bg-emerald-500/20 text-emerald-200 border-emerald-500/30' :
                  item.status === 'rejected' ? 'bg-rose-500/20 text-rose-200 border-rose-500/30' :
                  'bg-gray-500/20 text-gray-200 border-gray-500/30'
                }`}>
                  {item.status}
                </div>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">{item.title}</h1>
              <p className="text-slate-400 text-base sm:text-lg leading-relaxed">{item.description}</p>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Category</h3>
                <span className="inline-block bg-violet-500/20 text-violet-200 border border-violet-500/30 px-4 py-2 rounded-xl text-sm font-bold">
                  {item.category}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Location</h3>
                <div className="flex items-center gap-3 text-white">
                  <div className="p-2 rounded-full bg-white/5">
                    <MapPin size={18} className="text-violet-400" />
                  </div>
                  <span className="text-lg">{item.location}</span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Date Reported</h3>
                <div className="flex items-center gap-3 text-white">
                  <div className="p-2 rounded-full bg-white/5">
                    <Calendar size={18} className="text-violet-400" />
                  </div>
                  <span className="text-lg">
                    {new Date(item.createdAt || item.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Reported By</h3>
                <div className="flex items-center gap-3 bg-slate-950/50 p-4 rounded-xl border border-white/5">
                  <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-full flex items-center justify-center">
                    <User size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">{item.reportedBy?.name}</p>
                    <p className="text-slate-400 text-sm">{item.reportedBy?.email}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {isAdmin && isAdmin() && (
                <div className="bg-slate-900/50 backdrop-blur-xl border border-violet-500/30 rounded-2xl p-6">
                  <h3 className="text-sm font-semibold text-violet-400 uppercase tracking-wider mb-4">Admin Actions</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {item.status === 'pending' && (
                      <>
                        <motion.button
                          onClick={handleApprove}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white py-3 min-h-[44px] rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                        >
                          <CheckCircle size={18} />
                          Approve
                        </motion.button>
                        <motion.button
                          onClick={handleReject}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="bg-rose-600 hover:bg-rose-500 text-white py-3 min-h-[44px] rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                        >
                          <XCircle size={18} />
                          Reject
                        </motion.button>
                      </>
                    )}
                    {(item.status === 'active' || item.status === 'pending') && (
                      <motion.button
                        onClick={handleResolve}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-violet-600 hover:bg-violet-500 text-white py-3 min-h-[44px] rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 size={18} />
                        Resolve
                      </motion.button>
                    )}
                    <motion.button
                      onClick={handleDelete}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-slate-700 hover:bg-slate-600 text-white py-3 min-h-[44px] rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                    >
                      <Trash2 size={18} />
                      Delete
                    </motion.button>
                  </div>
                </div>
              )}

              {user?.user?.id !== item.reportedBy?._id && user?.id !== item.reportedBy?._id && (
                <motion.button
                  onClick={handleStartChat}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white py-4 min-h-[44px] rounded-xl font-bold shadow-lg shadow-violet-900/40 transition-all flex items-center justify-center gap-3"
                >
                  <MessageCircle size={20} />
                  Chat with {item.reportedBy?.name}
                </motion.button>
              )}
              
              {(!isAdmin || !isAdmin()) && (user?.user?.id === item.reportedBy?._id || user?.id === item.reportedBy?._id) && (item.status === 'active' || item.status === 'pending') && (
                <motion.button
                  onClick={handleResolve}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-4 min-h-[44px] rounded-xl font-bold transition-all flex items-center justify-center gap-3"
                >
                  <CheckCircle2 size={20} />
                  Mark as Resolved
                </motion.button>
              )}
              
              {item.status === 'resolved' && (
                <div className="bg-emerald-500/20 border-2 border-emerald-500/30 text-emerald-200 p-4 rounded-xl text-center font-semibold">
                  ✓ This item has been resolved
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
      

    </motion.div>
  );
};

export default ItemDetail;
