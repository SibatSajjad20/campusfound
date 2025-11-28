import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Sparkles, MapPin, Calendar, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/config';
import { toast } from 'react-toastify';
import { getImageUrl } from '../utils/imageUtils';

const ImageSearch: React.FC = () => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreview(URL.createObjectURL(file));
      setResults([]);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedImage) {
      toast.error('Please select an image');
      return;
    }

    setLoading(true);
    setScanning(true);

    try {
      const formData = new FormData();
      formData.append('image', selectedImage);

      // Simulate scanning animation
      await new Promise(resolve => setTimeout(resolve, 2000));

      const response = await api.post('/items/search-by-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setResults(response.data.items || []);
      if (response.data.items.length === 0) {
        toast.info('No similar items found');
      } else {
        toast.success(`Found ${response.data.items.length} similar items`);
      }
    } catch (error) {
      toast.error('Image search failed');
    } finally {
      setLoading(false);
      setScanning(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative z-10 pt-24 px-4 pb-20"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6"
          >
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span className="text-sm font-medium text-violet-200 uppercase tracking-wide">AI-Powered Search</span>
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Search by <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Image</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Upload a photo and let our AI find visually similar items across the database
          </p>
        </div>

        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 mb-12"
        >
          <form onSubmit={handleSearch} className="space-y-6">
            {preview ? (
              <div className="relative">
                <div className="relative rounded-2xl overflow-hidden border border-white/10">
                  <img src={preview} alt="Preview" className="w-full max-h-96 object-contain bg-slate-950/50" />

                  {/* Scanning Animation */}
                  <AnimatePresence>
                    {scanning && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center"
                      >
                        <div className="text-center">
                          <motion.div
                            animate={{
                              scale: [1, 1.2, 1],
                              rotate: [0, 180, 360]
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "linear"
                            }}
                            className="w-16 h-16 mx-auto mb-4"
                          >
                            <Sparkles className="w-full h-full text-violet-400" />
                          </motion.div>
                          <p className="text-white font-semibold mb-2">Analyzing Image...</p>
                          <p className="text-slate-400 text-sm">Scanning for visual matches</p>

                          {/* Scanning Line */}
                          <motion.div
                            animate={{ y: [0, 300, 0] }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "linear"
                            }}
                            className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-violet-500 to-transparent"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedImage(null);
                    setPreview(null);
                    setResults([]);
                  }}
                  className="absolute -top-3 -right-3 p-2 bg-rose-500 hover:bg-rose-600 text-white rounded-full transition-colors shadow-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <label className="block border-2 border-dashed border-white/10 hover:border-violet-500/50 rounded-2xl p-16 text-center cursor-pointer transition-all bg-slate-950/30 group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="inline-block"
                >
                  <Upload className="w-16 h-16 mx-auto mb-4 text-slate-500 group-hover:text-violet-400 transition-colors" />
                </motion.div>
                <p className="text-white font-semibold text-lg mb-2">Click to upload or drag and drop</p>
                <p className="text-slate-400">PNG, JPG, GIF up to 5MB</p>
              </label>
            )}

            <motion.button
              type="submit"
              disabled={!selectedImage || loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Searching...' : 'Search Similar Items'}
            </motion.button>
          </form>
        </motion.div>

        {/* Results */}
        {results.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-3xl font-bold text-white mb-8">
              Search Results <span className="text-violet-400">({results.length} items)</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {results.map((item, index) => (
                <ResultCard key={item._id} item={item} index={index} />
              ))}
            </div>
          </motion.div>
        ) : (
          selectedImage && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-12 max-w-md mx-auto">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-slate-700 to-slate-800 rounded-full flex items-center justify-center"
                >
                  <Sparkles className="w-10 h-10 text-slate-400" />
                </motion.div>
                <h3 className="text-2xl font-bold text-white mb-3">No Matching Items Found</h3>
                <p className="text-slate-400 mb-6">
                  We couldn't find any visually similar items in our database. Try uploading a different image or check back later.
                </p>
                <div className="space-y-3">
                  <p className="text-sm text-slate-500">Suggestions:</p>
                  <ul className="text-sm text-slate-400 space-y-1">
                    <li>• Make sure the image is clear and well-lit</li>
                    <li>• Try different angles of the same item</li>
                    <li>• Check if similar items have been reported recently</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )
        )}
      </div>
    </motion.div>
  );
};

const ResultCard = ({ item, index }: { item: any; index: number }) => {
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

        <div className="absolute top-3 right-3 z-10 px-3 py-1.5 rounded-lg text-xs font-bold backdrop-blur-md bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 text-violet-200 border border-violet-500/30 flex items-center gap-1.5">
          <Sparkles className="w-3 h-3" />
          AI: {item.similarity}%
        </div>

        {item.imageUrl ? (
          <img
            src={getImageUrl(item.imageUrl) || ''}
            alt={item.title}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 flex items-center justify-center">
            <span className="text-5xl">{item.title.charAt(0)}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
      </div>

      <div className="p-5">
        <h3 className="text-lg font-bold text-white mb-3 group-hover:text-violet-300 transition-colors line-clamp-1">{item.title}</h3>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <MapPin size={14} className="text-violet-400" />
            <span className="line-clamp-1">{item.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Calendar size={14} className="text-violet-400" />
            {new Date(item.createdAt).toLocaleDateString()}
          </div>
        </div>

        <motion.button
          whileHover={{ x: 5 }}
          className="flex items-center gap-2 text-violet-400 font-medium text-sm"
        >
          View Details <ArrowRight size={16} />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ImageSearch;
