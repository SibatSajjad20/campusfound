import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/config';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.post('/auth/login', credentials);
      login(response.data.data, response.data.token);
      toast.success('✓ Welcome back!');
      navigate('/home');
    } catch (error: any) {
      toast.error(error.response?.data?.msg || error.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-violet-500/30 selection:text-violet-200 overflow-x-hidden">
      {/* Background */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/20 via-slate-950/50 to-slate-950 pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Ambient Lights */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-violet-600/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none animate-pulse" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 min-h-screen flex items-center justify-center p-4"
      >
        <div className="w-full max-w-md">
          {/* Logo */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 bg-gradient-to-tr from-violet-600 to-fuchsia-600 rounded-xl blur opacity-70" />
                <div className="relative w-full h-full bg-slate-900 rounded-xl flex items-center justify-center border border-white/10">
                  <Sparkles className="w-6 h-6 text-violet-300" />
                </div>
              </div>
              <span className="text-2xl font-bold font-heading tracking-tight text-white">
                CAMPUS<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">FOUND</span>
              </span>
            </div>
            <p className="text-slate-400">Welcome back to the future of lost & found</p>
          </motion.div>

          {/* Login Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-slate-400 group-focus-within:text-violet-400 transition-colors" />
                  </div>
                  <input
                    type="email"
                    value={credentials.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full bg-slate-950/50 border border-white/10 focus:border-violet-500 rounded-xl pl-12 pr-4 py-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-slate-400 group-focus-within:text-violet-400 transition-colors" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={credentials.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="w-full bg-slate-950/50 border border-white/10 focus:border-violet-500 rounded-xl pl-12 pr-12 py-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold py-4 min-h-[44px] rounded-xl shadow-lg shadow-violet-900/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"
                    />
                  ) : (
                    <motion.div
                      key="content"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      Sign In
                      <ArrowRight className="w-5 h-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </form>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-slate-400">
                Don't have an account?{' '}
                <Link 
                  to="/register" 
                  className="text-violet-400 hover:text-violet-300 font-medium transition-colors"
                >
                  Create one
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;