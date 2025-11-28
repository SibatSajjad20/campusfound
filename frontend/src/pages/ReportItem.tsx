import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/config';

const ReportItem: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type') || 'lost';

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    image: null as File | null
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const categories = [
    'Electronics', 'Clothing', 'Books', 'IDs/Wallets', 'Keys', 'Jewelry',
    'Bags/Backpacks', 'Sports Equipment', 'Supplies', 'Other'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }
      setFormData(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.category || !formData.location) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('category', formData.category);
      submitData.append('location', formData.location);
      submitData.append('date', new Date().toISOString());
      submitData.append('type', type);
      if (formData.image) submitData.append('image', formData.image);

      await api.post('/items/report', submitData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60000
      });

      toast.success(`✓ ${type === 'lost' ? 'Lost' : 'Found'} item reported successfully! Waiting for admin approval.`);
      navigate('/home');
    } catch (error: any) {
      const errorMsg = error.response?.data?.msg || 'Failed to report item';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative z-10 pt-24 px-4 pb-20"
    >
      <div className="max-w-2xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden"
        >
          {/* Header */}
          <div className={`p-8 ${type === 'lost' ? 'bg-gradient-to-r from-rose-600/20 to-orange-600/20' : 'bg-gradient-to-r from-emerald-600/20 to-green-600/20'} border-b border-white/10`}>
            <div className="flex items-center gap-4 mb-2">
              {type === 'lost' ? (
                <AlertTriangle className="w-8 h-8 text-rose-400" />
              ) : (
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              )}
              <h1 className="text-3xl font-bold text-white">
                Report {type === 'lost' ? 'Lost' : 'Found'} Item
              </h1>
            </div>
            <p className="text-slate-300">
              {type === 'lost' ? 'Help us find your missing item' : 'Help reunite someone with their item'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Item Name *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Blue Water Bottle, iPhone 13"
                className="w-full p-4 bg-slate-950/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none transition-colors"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-4 bg-slate-950/50 border border-white/10 rounded-xl text-white focus:border-violet-500 focus:outline-none transition-colors"
                required
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide detailed description including color, size, brand..."
                rows={4}
                className="w-full p-4 bg-slate-950/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none transition-colors resize-none"
                required
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                {type === 'lost' ? 'Last Seen Location *' : 'Found Location *'}
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Main Library, Chemistry Lab"
                className="w-full p-4 bg-slate-950/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none transition-colors"
                required
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Upload Photo (Optional)</label>
              {imagePreview ? (
                <div className="relative">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-64 object-cover rounded-xl border border-white/10"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      setFormData(prev => ({ ...prev, image: null }));
                    }}
                    className="absolute top-2 right-2 p-2 bg-rose-500 hover:bg-rose-600 text-white rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <label className="block border-2 border-dashed border-white/10 hover:border-violet-500/50 rounded-xl p-12 text-center cursor-pointer transition-colors bg-slate-950/30">
                  <input
                    type="file"
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <Upload className="w-12 h-12 mx-auto mb-4 text-slate-500" />
                  <p className="text-slate-400 font-medium mb-1">Click to upload image</p>
                  <p className="text-slate-500 text-sm">PNG, JPG up to 5MB</p>
                </label>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <motion.button
                type="button"
                onClick={() => navigate('/home')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-4 min-h-[44px] border-2 border-white/10 text-white rounded-xl font-semibold hover:bg-white/5 transition-colors"
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex-1 py-4 min-h-[44px] text-white rounded-xl font-semibold transition-all flex items-center justify-center ${
                  type === 'lost'
                    ? 'bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-500 hover:to-orange-500'
                    : 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Reporting...
                  </>
                ) : (
                  `Report ${type === 'lost' ? 'Lost' : 'Found'} Item`
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ReportItem;
