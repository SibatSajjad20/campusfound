import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Rocket, Shield, Zap, Code2, Brain, MessageSquare, Image } from 'lucide-react';

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
              <SocialButton href="https://www.linkedin.com/in/sibat-sajjad-a096731a9/" icon={Linkedin} label="LinkedIn" />
              <SocialButton href="https://github.com/SibatSajjad20" icon={Github} label="GitHub" />
              <SocialButton href="mailto:sajjadsibat33@gmail.com" icon={Mail} label="Email Me" />
            </div>
          </motion.div>

          {/* About Project Card */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-slate-900 to-violet-950/30 p-10 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden group hover:border-violet-500/30 transition-all"
          >
             <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl group-hover:bg-violet-500/30 transition-all duration-700"></div>

            <div className="flex items-center gap-4 mb-8 relative z-10">
              <div className="p-3 bg-white/5 rounded-xl border border-white/10 group-hover:bg-violet-500/20 transition-colors">
                <Rocket className="w-8 h-8 text-white" />
              </div>
              <div>
                 <h3 className="text-2xl font-bold text-white">CampusFound</h3>
                 <span className="text-xs font-mono text-violet-400">V 1.0.0</span>
              </div>
            </div>

            <p className="text-slate-200 leading-relaxed mb-8 relative z-10 text-base">
              An AI-powered platform revolutionizing how campuses handle lost and found items. Built with cutting-edge technology for speed, security, and seamless user experience.
            </p>

            <div className="space-y-4 mb-10 relative z-10">
              <ProjectFeature icon={Brain} title="AI Image Search" desc="CLIP embeddings & perceptual hashing for visual matching" color="text-violet-400" />
              <ProjectFeature icon={MessageSquare} title="Real-time Chat" desc="Socket.IO powered instant messaging system" color="text-blue-400" />
              <ProjectFeature icon={Shield} title="Enterprise Security" desc="JWT auth, bcrypt hashing, rate limiting & XSS protection" color="text-emerald-400" />
              <ProjectFeature icon={Zap} title="Admin Dashboard" desc="Comprehensive approval workflow & item management" color="text-yellow-400" />
              <ProjectFeature icon={Image} title="Cloud Storage" desc="Cloudinary integration for optimized image delivery" color="text-pink-400" />
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
  <div className="flex items-start gap-4 group/feature">
    <Icon className={`w-5 h-5 ${color} mt-1 shrink-0 group-hover/feature:scale-110 transition-transform`} />
    <div>
      <h4 className="font-bold text-white text-sm mb-0.5">{title}</h4>
      <p className="text-xs text-slate-300 leading-relaxed">{desc}</p>
    </div>
  </div>
);

export default AboutSection;