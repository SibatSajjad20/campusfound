import React from 'react';
import { motion } from 'framer-motion';
import { Home, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-2xl"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="text-9xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent mb-8"
        >
          404
        </motion.div>
        
        <h1 className="text-4xl font-bold text-white mb-4">Page Not Found</h1>
        <p className="text-slate-400 text-lg mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            onClick={() => navigate('/home')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white rounded-xl font-bold shadow-lg shadow-violet-900/40 transition-all min-h-[44px]"
          >
            <Home size={20} />
            Go Home
          </motion.button>
          
          <motion.button
            onClick={() => navigate('/search')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-all min-h-[44px]"
          >
            <Search size={20} />
            Search Items
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
