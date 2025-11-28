import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Rocket, Shield, Zap, Code2 } from 'lucide-react';

const AboutSection: React.FC = () => {
  return (
    <section className="py-32 relative">
       {/* Decorative background */}
       <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950 pointer-events-none" />
       
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-heading font-bold text-white mb-4">Meet the Developer</h2>
          <div className="w-20 h-1 bg-violet-600 mx-auto rounded-full"></div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* About Me Card */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-slate-900/50 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/10 shadow-2xl hover:border-violet-500/30 transition-colors"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
              <div className="w-20 h-20 bg-gradient-to-tr from-violet-600 to-fuchsia-600 rounded-2xl flex items-center justify-center text-white shadow-lg rotate-3 hover:rotate-0 transition-transform duration-300">
                <Code2 className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-white">Sibat Sajjad</h3>
                <p className="text-violet-400 font-medium mt-1">Full Stack Web Developer</p>
              </div>
            </div>
            
            <p className="text-slate-300 leading-relaxed mb-8 text-lg font-light">
              Passionate about building digital experiences that matter. I specialize in creating scalable, modern web applications with a focus on intuitive UI/UX and robust backend architecture.
            </p>

            <div className="flex flex-wrap gap-4">
              <SocialButton href="#" icon={Linkedin} label="LinkedIn" />
              <SocialButton href="#" icon={Github} label="GitHub" />
              <SocialButton href="mailto:sajjadsibat33@gmail.com" icon={Mail} label="Email Me" />
            </div>
          </motion.div>

          {/* About Project Card */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-slate-900 to-violet-950/30 p-10 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden group"
          >
             <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl group-hover:bg-violet-500/20 transition-colors duration-700"></div>

            <div className="flex items-center gap-4 mb-8 relative z-10">
              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <Rocket className="w-8 h-8 text-white" />
              </div>
              <div>
                 <h3 className="text-2xl font-bold text-white">CampusFound</h3>
                 <span className="text-xs font-mono text-slate-400">V 1.0.0</span>
              </div>
            </div>

            <p className="text-slate-300 leading-relaxed mb-8 relative z-10">
              An AI-powered platform revolutionizing how campuses handle lost and found items. Built with modern tech for speed and security.
            </p>

            <div className="space-y-5 mb-10 relative z-10">
              <ProjectFeature icon={Zap} title="Real-time Matching" desc="Instant notifications via perceptual hashing" color="text-yellow-400" />
              <ProjectFeature icon={Shield} title="Secure Architecture" desc="Enterprise-grade JWT authentication" color="text-emerald-400" />
            </div>

            <div className="flex flex-wrap gap-2 relative z-10">
              {['React', 'Node.js', 'Express', 'MongoDB', 'Framer Motion', 'Tailwind'].map((tech) => (
                <span key={tech} className="px-3 py-1.5 rounded-lg bg-white/5 text-xs font-medium text-slate-300 border border-white/5 hover:bg-white/10 transition-colors cursor-default">
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const SocialButton = ({ href, icon: Icon, label }: { href: string, icon: React.ComponentType<any>, label: string }) => (
  <a 
    href={href}
    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/5 hover:border-violet-500/50 transition-all group"
  >
    <Icon className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
    <span className="font-medium">{label}</span>
  </a>
);

const ProjectFeature = ({ icon: Icon, title, desc, color }: { icon: React.ComponentType<any>, title: string, desc: string, color: string }) => (
  <div className="flex items-start gap-4">
    <Icon className={`w-5 h-5 ${color} mt-1 shrink-0`} />
    <div>
      <h4 className="font-bold text-white text-sm">{title}</h4>
      <p className="text-xs text-slate-400">{desc}</p>
    </div>
  </div>
);

export default AboutSection;