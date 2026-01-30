
import React, { useEffect, useState } from 'react';
import { School, ShieldCheck } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
  schoolName: string;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish, schoolName }) => {
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    setOpacity(1);
    const timer = setTimeout(() => {
      onFinish();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div 
      className="fixed inset-0 bg-white flex flex-col items-center justify-between py-12 px-6 overflow-hidden transition-opacity duration-700 z-50 h-[100dvh]" 
      style={{ opacity }}
    >
      <div className="absolute top-[-10%] left-[-20%] w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-80 animate-pulse"></div>
      <div className="absolute bottom-[10%] right-[-10%] w-72 h-72 bg-blue-50 rounded-full blur-3xl opacity-80"></div>

      <div className="flex-1 flex flex-col items-center justify-center space-y-8 z-10 w-full px-4">
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-br from-indigo-600 to-indigo-900 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-indigo-200 transform rotate-2 animate-in zoom-in duration-500">
            <School className="w-12 h-12 text-white -rotate-2" />
          </div>
          <div className="absolute -top-1 -right-1 bg-white p-1 rounded-full shadow-md border border-slate-50">
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
          </div>
        </div>

        <div className="text-center space-y-1 animate-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase leading-tight min-h-[1.5em] px-4">
            {schoolName ? schoolName : 'SCHOOL NAME LOADING..'}
          </h1>
          <h2 className="text-[10px] font-bold text-indigo-600 tracking-[0.4em] uppercase opacity-80">
            {schoolName ? 'SMART CAMPUS' : 'CONNECTING TO CLOUD'}
          </h2>
          <div className="flex items-center justify-center space-x-2 mt-4 opacity-50">
            <div className="h-[1px] w-6 bg-slate-300"></div>
            <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Digital Education System</span>
            <div className="h-[1px] w-6 bg-slate-300"></div>
          </div>
        </div>

        <div className="w-16 h-1 bg-slate-100 rounded-full overflow-hidden mt-6">
          <div className="h-full bg-indigo-600 rounded-full animate-progress"></div>
        </div>
      </div>

      <div className="text-center z-10 w-full animate-in fade-in duration-1000 delay-500">
        <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.3em] block mb-2">
          ENGINEERED BY
        </span>
        <div className="inline-block px-4 py-2 bg-slate-900 rounded-xl shadow-lg">
          <p className="text-[10px] font-black text-white tracking-widest uppercase">
            GOTHWAD TECHNOLOGIES
          </p>
        </div>
      </div>

      <style>{`
        @keyframes progress {
          0% { width: 0%; transform: translateX(-100%); }
          100% { width: 100%; transform: translateX(0%); }
        }
        .animate-progress {
          animation: progress 2.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;
