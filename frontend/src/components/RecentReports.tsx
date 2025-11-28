import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, ArrowRight } from 'lucide-react';

// Mock data for visual demonstration - TODO: Replace with actual API data
const items = [
  {
    id: '1',
    title: 'Sony WH-1000XM4',
    location: 'Library, 2nd Floor',
    date: '2 hours ago',
    type: 'lost' as const,
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: '2',
    title: 'Hydroflask Blue 32oz',
    location: 'Gym Locker Room',
    date: '5 hours ago',
    type: 'found' as const,
    image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: '3',
    title: 'Advanced Calculus',
    location: 'Science Block A',
    date: '1 day ago',
    type: 'lost' as const,
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=500&q=80'
  }
];

const RecentReports: React.FC = () => {
  return (
    <section className="py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
             <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-heading font-bold text-white mb-2"
            >
              Recent <span className="text-violet-400">Activity</span>
            </motion.h2>
            <p className="text-slate-400 text-lg">Latest lost and found reports from the community.</p>
          </div>
          <motion.button 
            whileHover={{ x: 5 }}
            className="flex items-center gap-2 text-violet-400 font-medium hover:text-violet-300 transition-colors"
          >
            View All Items <ArrowRight size={20} />
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, index) => (
            <Card key={item.id} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

const Card = ({ item, index }: { item: typeof items[0], index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.1, type: "spring", stiffness: 50 }}
      whileHover={{ y: -10 }}
      className="group relative bg-slate-900/40 backdrop-blur-md rounded-3xl overflow-hidden border border-white/5 hover:border-violet-500/30 transition-all duration-300 shadow-2xl"
    >
      <div className="relative h-64 overflow-hidden">
        <div className={`absolute top-4 left-4 z-10 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider backdrop-blur-md border shadow-lg ${
          item.type === 'lost' 
            ? 'bg-rose-500/20 text-rose-200 border-rose-500/30' 
            : 'bg-emerald-500/20 text-emerald-200 border-emerald-500/30'
        }`}>
          {item.type}
        </div>
        
        <img 
          src={item.image} 
          alt={item.title} 
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
      </div>
      
      <div className="p-6 relative">
        <div className="absolute -top-10 right-6 w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center border border-white/10 shadow-xl group-hover:bg-violet-600 transition-colors duration-300">
           <ArrowRight className="w-5 h-5 text-white -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
        </div>

        <h3 className="text-xl font-bold text-white mb-4 pr-8 group-hover:text-violet-300 transition-colors">{item.title}</h3>
        
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
            <div className="p-1.5 rounded-full bg-white/5">
              <MapPin size={14} className="text-violet-400" />
            </div>
            {item.location}
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
            <div className="p-1.5 rounded-full bg-white/5">
              <Calendar size={14} className="text-violet-400" />
            </div>
            {item.date}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default RecentReports;