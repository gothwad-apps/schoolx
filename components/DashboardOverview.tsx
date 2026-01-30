
import React from 'react';
import { ShieldCheck, Cloud, Briefcase, School, Users } from 'lucide-react';

interface DashboardOverviewProps {
  schoolName: string;
  teachersCount: number;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ schoolName, teachersCount }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-[2.5rem] p-7 text-white shadow-2xl shadow-indigo-100 relative overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        <div className="flex justify-between items-start mb-4 relative z-10">
          <div>
            <h3 className="text-lg font-black tracking-tight truncate max-w-[200px]">{schoolName || 'CAMPUS HUB'}</h3>
            <p className="text-indigo-100 text-[10px] font-bold uppercase tracking-widest opacity-80 mt-1">Institutional Cloud Online</p>
          </div>
          <div className="p-2.5 bg-white/20 rounded-2xl backdrop-blur-md border border-white/20"><ShieldCheck className="w-5 h-5 text-white" /></div>
        </div>
        <p className="text-4xl font-black mb-1 leading-none">Smart Campus</p>
        <p className="text-[10px] font-bold text-indigo-100/60 uppercase tracking-widest">Powered by Gothwad Tech</p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
         {[
           { label: 'Network', value: 'Cloud', icon: Cloud, color: 'text-indigo-600', bg: 'bg-indigo-50' },
           { label: 'Staff Records', value: teachersCount, icon: Briefcase, color: 'text-rose-600', bg: 'bg-rose-50' },
           { label: 'School Map', value: '12 Classes', icon: School, color: 'text-emerald-600', bg: 'bg-emerald-50' },
           { label: 'Access Control', value: 'Secure', icon: ShieldCheck, color: 'text-blue-600', bg: 'bg-blue-50' }
         ].map((stat, i) => (
           <div key={i} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col space-y-3">
              <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center`}><stat.icon className="w-5 h-5" /></div>
              <div><p className="text-xl font-black text-slate-900 leading-none">{stat.value}</p><p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mt-1">{stat.label}</p></div>
           </div>
         ))}
      </div>
    </div>
  );
};

export default DashboardOverview;
