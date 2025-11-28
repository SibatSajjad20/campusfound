import React, { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { Search, CheckCircle2, AlertTriangle, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hero: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

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

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden perspective-1000">
      {/* Dynamic Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Ambient Lights */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-violet-600/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none animate-pulse" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-fuchsia-600/10 rounded-full blur-[100px] mix-blend-screen pointer-events-none" />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-5xl mx-auto px-4 z-10 text-center w-full relative"
      >
        {/* Pill Label */}
        <motion.div variants={itemVariants} className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-lg shadow-violet-900/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-medium text-violet-200 tracking-wide uppercase">AI-Powered Recovery System</span>
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

        {/* Interactive Search Bar */}
        <motion.div 
          variants={itemVariants}
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
                placeholder="Search for 'Airpods case', 'Blue ID card'..."
                className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-slate-500 px-4 py-4 text-lg"
              />
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-br from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white p-4 rounded-xl shadow-lg shadow-violet-900/40 transition-all"
              >
                <MapPin className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div 
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <motion.button
            onClick={() => navigate('/login')}
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
            onClick={() => navigate('/login')}
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

      {/* 3D Floating Elements */}
      <FloatingElement delay={0} x="10%" y="20%" rotate={12}>
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-3xl flex items-center justify-center shadow-2xl border border-white/20 backdrop-blur-md">
           <span className="text-4xl filter drop-shadow-lg">🎒</span>
        </div>
      </FloatingElement>
      
      <FloatingElement delay={1} x="85%" y="60%" rotate={-15}>
        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-400 rounded-2xl flex items-center justify-center shadow-2xl border border-white/20 backdrop-blur-md">
           <span className="text-3xl filter drop-shadow-lg">🔑</span>
        </div>
      </FloatingElement>

      <FloatingElement delay={2} x="15%" y="70%" rotate={8}>
        <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-400 rounded-2xl flex items-center justify-center shadow-2xl border border-white/20 backdrop-blur-md">
           <span className="text-2xl filter drop-shadow-lg">🎧</span>
        </div>
      </FloatingElement>

       <FloatingElement delay={1.5} x="80%" y="25%" rotate={-5}>
        <div className="w-18 h-18 bg-gradient-to-br from-emerald-500 to-green-400 rounded-3xl flex items-center justify-center shadow-2xl border border-white/20 backdrop-blur-md">
           <span className="text-3xl filter drop-shadow-lg">📱</span>
        </div>
      </FloatingElement>
    </section>
  );
};

const FloatingElement = ({ children, delay, x, y, rotate }: { children: React.ReactNode, delay: number, x: string, y: string, rotate: number }) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ 
      opacity: 1,
      y: [0, -25, 0], 
      rotate: [rotate, rotate + 10, rotate],
      filter: ["brightness(1)", "brightness(1.2)", "brightness(1)"]
    }} 
    transition={{ 
      opacity: { duration: 1, delay },
      y: { duration: 4 + delay, repeat: Infinity, ease: "easeInOut" },
      rotate: { duration: 6 + delay, repeat: Infinity, ease: "easeInOut" },
      filter: { duration: 3, repeat: Infinity, ease: "easeInOut" }
    }}
    className="absolute hidden lg:block z-0"
    style={{ top: y, left: x }}
  >
    {children}
  </motion.div>
);

export default Hero;