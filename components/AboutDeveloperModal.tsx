
import React from 'react';
import { X, Code, Globe, Zap, Mail, User, ShieldCheck, Cpu, ArrowUpRight } from 'lucide-react';

interface AboutDeveloperModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AboutDeveloperModal: React.FC<AboutDeveloperModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md cursor-pointer" 
        onClick={onClose} 
      />
      <div className="relative w-full max-w-lg bg-white rounded-[3rem] shadow-2xl animate-in zoom-in duration-300 overflow-hidden border border-slate-100 flex flex-col">
        
        {/* Header Section */}
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 p-8 text-white relative overflow-hidden flex-shrink-0">
          <div className="absolute top-[-20%] right-[-10%] w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl"></div>
          
          {/* Close Button - Enhanced hit area and z-index */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }} 
            className="absolute top-4 right-4 p-4 bg-white/10 rounded-2xl hover:bg-white/20 active:scale-90 transition-all z-[120] cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          
          <div className="flex items-center space-x-4 mb-4 relative z-10">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20">
              <Cpu className="w-8 h-8 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight uppercase">Gothwad Technologies</h2>
              <p className="text-indigo-300 text-[10px] font-bold uppercase tracking-[0.2em]">Next-Gen Software Solutions</p>
            </div>
          </div>
          <p className="text-slate-300 text-xs font-medium leading-relaxed max-w-[80%]">
            Transforming educational landscapes with high-performance, cloud-native infrastructure and premium user experiences.
          </p>
        </div>

        <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
          
          {/* Executive Leadership Cards */}
          <div className="grid grid-cols-1 gap-4">
            {/* Founder Card */}
            <div className="p-5 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-center justify-between group transition-all hover:bg-white hover:shadow-xl hover:shadow-indigo-50">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100">
                  <User className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">The Founder</p>
                  <h3 className="text-sm font-black text-slate-900">Pawan Gothwad</h3>
                  <a href="mailto:pawangothwad@gmail.com" className="text-[10px] font-bold text-indigo-600">pawangothwad@gmail.com</a>
                </div>
              </div>
            </div>

            {/* Main Developer Card */}
            <div className="p-5 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-center justify-between group transition-all hover:bg-white hover:shadow-xl hover:shadow-indigo-50">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100">
                  <Code className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Main Developer</p>
                  <h3 className="text-sm font-black text-slate-900">Pawan Kumar Meena</h3>
                  <a href="mailto:gothwadtechnologies@gmail.com" className="text-[10px] font-bold text-indigo-600">gothwadtechnologies@gmail.com</a>
                </div>
              </div>
            </div>
          </div>

          {/* Direct Support CTA */}
          <div className="bg-indigo-600 rounded-[2.5rem] p-6 text-white shadow-xl shadow-indigo-100 flex flex-col items-center text-center space-y-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
              <Zap className="w-6 h-6 fill-white" />
            </div>
            <div>
              <h3 className="text-lg font-black leading-tight">Need Expert Support?</h3>
              <p className="text-[10px] font-bold text-indigo-100 uppercase tracking-widest mt-1">Connect with our Dev Squad</p>
            </div>
            <div className="w-full bg-white/10 rounded-2xl p-3 border border-white/10 flex items-center justify-between">
              <span className="text-[11px] font-bold truncate px-2">gothwaddevelopers@gmail.com</span>
              <a 
                href="mailto:gothwaddevelopers@gmail.com"
                className="bg-white text-indigo-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center space-x-2 active:scale-95 transition-all"
              >
                <span>Contact</span>
                <Mail className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Footer Links */}
          <div className="flex flex-col space-y-3">
            <a 
              href="https://gothwadtechnologies.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full py-4 bg-slate-50 text-slate-900 font-black rounded-2xl border border-slate-100 hover:bg-slate-100 transition-colors flex items-center justify-between px-6"
            >
              <div className="flex items-center space-x-3">
                <Globe className="w-5 h-5 text-indigo-600" />
                <span className="text-sm">gothwadtechnologies.com</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-300" />
            </a>
            
            <div className="flex items-center justify-center space-x-2 pt-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Verified Secure Partner</span>
            </div>
          </div>
        </div>
        
        {/* Modal Footer */}
        <div className="p-5 bg-slate-50 text-center border-t border-slate-100 flex-shrink-0">
           <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.3em]">Engineered with Excellence by Gothwad Technologies</p>
        </div>
      </div>
    </div>
  );
};

export default AboutDeveloperModal;
