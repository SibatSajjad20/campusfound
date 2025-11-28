import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, CheckCircle, XCircle, Trash2, MapPin, Calendar, User as UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/config';
import toast from 'react-hot-toast';
import { getImageUrl } from '../utils/imageUtils';

const AdminDashboard: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'active' | 'rejected' | 'resolved'>('all');

  useEffect(() => {
    if (!isAdmin()) {
      navigate('/home');
      toast.error('Admin access only');
      return;
    }
    fetchAllItems();
  }, []);

  const fetchAllItems = async () => {
    try {
      const response = await api.get('/items/all');
      setItems(response.data.items || []);
    } catch (error) {
      toast.error('Failed to load items');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await api.patch(`/items/${id}/approve`);
      toast.success('Item approved');
      fetchAllItems();
    } catch (error: any) {
      toast.error(error.response?.data?.msg || 'Failed to approve item');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await api.patch(`/items/${id}/reject`);
      toast.success('Item rejected');
      fetchAllItems();
    } catch (error: any) {
      toast.error(error.response?.data?.msg || 'Failed to reject item');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await api.delete(`/items/${id}`);
      toast.success('Item deleted');
      fetchAllItems();
    } catch (error: any) {
      toast.error(error.response?.data?.msg || 'Failed to delete item');
    }
  };

  const handleResolve = async (id: string) => {
    try {
      await api.patch(`/items/${id}/resolve`);
      toast.success('Item marked as resolved');
      fetchAllItems();
    } catch (error: any) {
      toast.error(error.response?.data?.msg || 'Failed to resolve item');
    }
  };

  const filteredItems = filter === 'all' 
    ? items 
    : items.filter(item => item.status === filter);

  const stats = {
    total: items.length,
    pending: items.filter(i => i.status === 'pending').length,
    active: items.filter(i => i.status === 'active').length,
    rejected: items.filter(i => i.status === 'rejected').length,
    resolved: items.filter(i => i.status === 'resolved').length,
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative z-10 pt-24 px-4 pb-20"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-2xl flex items-center justify-center">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-slate-400">Manage all reported items</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-8">
          <StatCard label="Total" value={stats.total} color="violet" active={filter === 'all'} onClick={() => setFilter('all')} />
          <StatCard label="Pending" value={stats.pending} color="orange" active={filter === 'pending'} onClick={() => setFilter('pending')} />
          <StatCard label="Active" value={stats.active} color="emerald" active={filter === 'active'} onClick={() => setFilter('active')} />
          <StatCard label="Rejected" value={stats.rejected} color="rose" active={filter === 'rejected'} onClick={() => setFilter('rejected')} />
          <StatCard label="Resolved" value={stats.resolved} color="gray" active={filter === 'resolved'} onClick={() => setFilter('resolved')} />
        </div>

        {/* Items List */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500 mx-auto"></div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="bg-slate-900/30 backdrop-blur-xl border border-white/5 rounded-2xl p-12 text-center">
            <p className="text-slate-400">No items found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredItems.map((item, index) => (
              <AdminItemCard 
                key={item._id} 
                item={item} 
                index={index}
                onApprove={handleApprove}
                onReject={handleReject}
                onDelete={handleDelete}
                onResolve={handleResolve}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

const StatCard = ({ label, value, color, active, onClick }: any) => {
  const colors = {
    violet: 'from-violet-600 to-indigo-600',
    orange: 'from-orange-600 to-amber-600',
    emerald: 'from-emerald-600 to-teal-600',
    rose: 'from-rose-600 to-pink-600',
    gray: 'from-gray-600 to-slate-600',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`cursor-pointer bg-slate-900/40 backdrop-blur-md rounded-2xl p-6 border transition-all ${
        active ? 'border-violet-500/50 shadow-lg shadow-violet-500/20' : 'border-white/5 hover:border-white/10'
      }`}
    >
      <div className={`text-3xl font-bold bg-gradient-to-r ${colors[color as keyof typeof colors]} bg-clip-text text-transparent mb-1`}>
        {value}
      </div>
      <div className="text-sm text-slate-400">{label}</div>
    </motion.div>
  );
};

const AdminItemCard = ({ item, index, onApprove, onReject, onDelete, onResolve }: any) => {
  const navigate = useNavigate();

  const statusColors = {
    pending: 'bg-orange-500/20 text-orange-200 border-orange-500/30',
    active: 'bg-emerald-500/20 text-emerald-200 border-emerald-500/30',
    rejected: 'bg-rose-500/20 text-rose-200 border-rose-500/30',
    resolved: 'bg-gray-500/20 text-gray-200 border-gray-500/30',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-slate-900/40 backdrop-blur-md rounded-2xl overflow-hidden border border-white/5 hover:border-violet-500/30 transition-all"
    >
      <div className="flex flex-col md:flex-row gap-6 p-6">
        {/* Image */}
        <div className="relative w-full md:w-48 h-48 rounded-xl overflow-hidden flex-shrink-0">
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
              alt={`${item.type} item: ${item.title}`}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 flex items-center justify-center">
              <span className="text-5xl">{item.title.charAt(0)}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1 min-w-0">
              <h3 
                onClick={() => navigate(`/item/${item._id}`)}
                className="text-xl font-bold text-white mb-2 hover:text-violet-300 transition-colors cursor-pointer truncate"
              >
                {item.title}
              </h3>
              <div className={`inline-flex px-3 py-1 rounded-lg text-xs font-bold uppercase backdrop-blur-md border ${statusColors[item.status as keyof typeof statusColors]}`}>
                {item.status}
              </div>
            </div>
          </div>

          <p className="text-slate-400 mb-4 line-clamp-2">{item.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <MapPin size={14} className="text-violet-400 flex-shrink-0" />
              <span className="truncate">{item.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Calendar size={14} className="text-violet-400 flex-shrink-0" />
              {new Date(item.createdAt).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <UserIcon size={14} className="text-violet-400 flex-shrink-0" />
              <span className="truncate">{item.reportedBy?.name || 'Unknown'}</span>
            </div>
          </div>

          {/* Admin Actions */}
          <div className="flex flex-wrap gap-2">
            {item.status === 'pending' && (
              <>
                <button
                  onClick={() => onApprove(item._id)}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  <CheckCircle size={16} />
                  Approve
                </button>
                <button
                  onClick={() => onReject(item._id)}
                  className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  <XCircle size={16} />
                  Reject
                </button>
              </>
            )}
            {(item.status === 'active' || item.status === 'pending') && (
              <button
                onClick={() => onResolve(item._id)}
                className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <CheckCircle size={16} />
                Mark Resolved
              </button>
            )}
            <button
              onClick={() => onDelete(item._id)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <Trash2 size={16} />
              Delete
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
