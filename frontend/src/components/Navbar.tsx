import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, LogOut, Menu, X, Sparkles } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { NavItem } from '../types';
import { useAuth } from '../context/AuthContext.jsx';
import { toast } from 'react-toastify';

const navItems: NavItem[] = [
  { label: 'Home', href: '/home' },
  { label: 'Profile', href: '/profile' },
  { label: 'Image Search', href: '/image-search' },
];

const adminNavItems: NavItem[] = [
  { label: 'Admin', href: '/admin' },
];

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();
  
  const displayNavItems = isAdmin && isAdmin() ? [...navItems, ...adminNavItems] : navItems;

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-slate-950/60 backdrop-blur-xl border-b border-white/5 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.1)]'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link to="/">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-3 cursor-pointer group"
          >
          <div className="relative w-10 h-10">
             <div className="absolute inset-0 bg-gradient-to-tr from-violet-600 to-fuchsia-600 rounded-xl blur opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
             <div className="relative w-full h-full bg-slate-900 rounded-xl flex items-center justify-center border border-white/10">
                <Sparkles className="w-5 h-5 text-violet-300 group-hover:text-white transition-colors" />
             </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold font-heading tracking-tight text-white leading-none">
              CAMPUS<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">FOUND</span>
            </span>
            <span className="text-[10px] text-slate-500 font-medium tracking-wide">University Lost & Found</span>
          </div>
          </motion.div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          <div className="flex items-center bg-white/5 rounded-full px-2 py-1 border border-white/5 backdrop-blur-sm mr-6">
            {displayNavItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.label}
                  to={item.href}
                  className={`relative px-4 py-2 text-sm font-medium transition-all rounded-full ${
                    isActive ? 'text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-gradient-to-r from-violet-600/80 to-fuchsia-600/80 rounded-full -z-10 shadow-lg shadow-violet-900/20"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-4">
            <Link to="/chat">
              <motion.button
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                className="p-2.5 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors border border-white/5"
              >
                <MessageCircle size={18} />
              </motion.button>
            </Link>

            <div className="h-8 w-[1px] bg-white/10" />

            <div className="flex items-center gap-3 pl-1">
              <div className="text-right hidden lg:block">
                <div className="text-xs text-slate-400">Welcome back</div>
                <div className="text-sm font-bold text-white">{user?.user?.name || user?.name || 'User'}</div>
              </div>
              <motion.button
                onClick={handleLogout}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full bg-gradient-to-r from-rose-500/20 to-orange-500/20 border border-rose-500/20 text-rose-400 hover:text-white hover:border-rose-500/50 transition-all"
              >
                <LogOut size={18} />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-white bg-white/10 rounded-lg"
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, overflow: "hidden" }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-slate-950/95 backdrop-blur-2xl border-b border-white/10 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-2">
              {displayNavItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.label}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-4 py-3 rounded-xl font-medium ${
                      isActive
                        ? 'bg-violet-500/20 text-violet-300 border border-violet-500/20'
                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <hr className="border-white/10 my-4" />
              <Link
                to="/chat"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl font-medium ${
                  location.pathname === '/chat'
                    ? 'bg-violet-500/20 text-violet-300 border border-violet-500/20'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white bg-white/5'
                }`}
              >
                <span>Chat</span>
                <MessageCircle size={18} />
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 text-white bg-rose-600/80 py-3 rounded-xl font-medium mt-4"
              >
                <LogOut size={18} /> Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
