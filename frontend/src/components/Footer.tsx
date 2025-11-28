import React from 'react';
import { Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 py-12 border-t border-white/5 relative z-10">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
           <span className="font-heading font-bold text-xl text-white">CAMPUS<span className="text-violet-500">FOUND</span></span>
        </div>
        
        <p className="text-slate-500 text-sm">
          © 2024 CampusFound. All rights reserved.
        </p>
        
        <div className="flex items-center gap-1.5 text-slate-400 text-sm bg-white/5 px-4 py-2 rounded-full border border-white/5 hover:bg-white/10 transition-colors">
          <span>Built with</span>
          <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse" />
          <span>by Sibat Sajjad</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;