import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Bot, Search, Handshake } from 'lucide-react';

const steps = [
  {
    icon: FileText,
    title: "Report",
    desc: "Snap a photo. Our AI extracts colors, types, and brand details automatically.",
    color: "from-blue-500 to-cyan-500",
    shadow: "shadow-cyan-500/20"
  },
  {
    icon: Bot,
    title: "AI Match",
    desc: "Perceptual hashing creates a visual fingerprint to find matches instantly.",
    color: "from-violet-500 to-fuchsia-500",
    shadow: "shadow-violet-500/20"
  },
  {
    icon: Search,
    title: "Verify",
    desc: "Smart text and image matching helps you confirm ownership securely.",
    color: "from-pink-500 to-rose-500",
    shadow: "shadow-pink-500/20"
  },
  {
    icon: Handshake,
    title: "Reunite",
    desc: "Connect anonymously and arrange a safe pickup spot on campus.",
    color: "from-amber-500 to-orange-500",
    shadow: "shadow-amber-500/20"
  }
];

const HowItWorks: React.FC = () => {
  return (
    <section className="py-32 bg-slate-950/50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-24">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="inline-block py-1 px-3 rounded-full bg-violet-900/30 border border-violet-500/30 text-violet-300 text-sm font-semibold tracking-wide uppercase mb-4"
          >
            Workflow
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-heading font-bold text-white"
          >
            Simple, Fast, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">Smart.</span>
          </motion.h2>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-16 left-[12%] right-[12%] h-0.5 bg-slate-800 -z-10">
            <motion.div 
              initial={{ width: "0%" }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, delay: 0.5 }}
              className="h-full bg-gradient-to-r from-blue-500 via-violet-500 to-orange-500"
            />
          </div>

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative group"
            >
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-8">
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 180 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className={`w-32 h-32 rounded-[2rem] bg-gradient-to-br ${step.color} p-[2px] ${step.shadow} shadow-2xl`}
                  >
                    <div className="w-full h-full bg-slate-900 rounded-[calc(2rem-2px)] flex items-center justify-center relative overflow-hidden group-hover:bg-transparent transition-colors duration-500">
                      <step.icon className="w-12 h-12 text-white relative z-10" strokeWidth={1.5} />
                    </div>
                  </motion.div>
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-800 px-3 py-1 rounded-full text-sm font-bold text-slate-400">
                    0{index + 1}
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-violet-300 transition-colors">{step.title}</h3>
                <p className="text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;