import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap, Fingerprint, Lock, ScanFace } from 'lucide-react';

const AiFeature: React.FC = () => {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span className="text-sm font-medium text-violet-200">Next Gen Technology</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-heading font-bold text-white leading-tight">
              It's not Magic.<br />
              It's <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Visual Intelligence.</span>
            </h2>
            
            <p className="text-lg text-slate-400 leading-relaxed max-w-xl">
              Our proprietary perceptual hashing algorithm breaks down images into mathematical fingerprints. It matches items even if the lighting, angle, or background is completely different.
            </p>

            <div className="space-y-4">
               <FeatureRow icon={Zap} title="Instant Analysis" desc="Process thousands of matches in milliseconds" color="text-yellow-400" />
               <FeatureRow icon={Fingerprint} title="Visual Hashing" desc="Matches structure, not just pixels" color="text-violet-400" />
               <FeatureRow icon={Lock} title="Privacy First" desc="Images are converted to hashes, not stored raw" color="text-emerald-400" />
            </div>

            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-8 px-8 py-4 bg-white text-slate-900 rounded-full font-bold text-lg shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-shadow"
            >
              Try Image Search
            </motion.button>
          </motion.div>

          <motion.div 
             initial={{ opacity: 0, scale: 0.8 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/30 to-fuchsia-600/30 rounded-3xl blur-3xl transform rotate-6"></div>
            <div className="relative bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden">
              
              {/* Simulated AI Interface */}
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                   <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                   </div>
                   <div className="text-xs font-mono text-slate-500">AI_PROCESSOR_V2.0</div>
                </div>

                <div className="relative aspect-video bg-slate-950 rounded-xl overflow-hidden border border-white/5 group">
                   <div className="absolute inset-0 flex items-center justify-center">
                      <ScanFace className="w-16 h-16 text-violet-500/50 animate-pulse" />
                   </div>
                   
                   {/* Scanning Line */}
                   <motion.div 
                    animate={{ top: ['0%', '100%', '0%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute left-0 right-0 h-[2px] bg-violet-500 shadow-[0_0_20px_rgba(139,92,246,1)] z-10"
                   />
                   
                   {/* Data Overlay */}
                   <div className="absolute top-4 right-4 font-mono text-xs text-violet-400 space-y-1">
                      <div>CONFIDENCE: 98.4%</div>
                      <div>HASH: 0x4F92...</div>
                      <div>MATCH: FOUND</div>
                   </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                   {[1, 2, 3].map(i => (
                      <div key={i} className="h-20 bg-slate-800/50 rounded-lg border border-white/5 animate-pulse"></div>
                   ))}
                </div>
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

const FeatureRow = ({ icon: Icon, title, desc, color }: { icon: React.ComponentType<any>, title: string, desc: string, color: string }) => (
  <motion.div 
    whileHover={{ x: 10 }}
    className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors cursor-default"
  >
    <div className={`w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center border border-white/10 ${color}`}>
      <Icon size={24} />
    </div>
    <div>
      <h4 className="font-bold text-white text-lg">{title}</h4>
      <p className="text-slate-400 text-sm">{desc}</p>
    </div>
  </motion.div>
)

export default AiFeature;