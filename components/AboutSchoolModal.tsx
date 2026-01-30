
import React from 'react';
import { X, School, MapPin, Phone, Mail, Globe, Award, ShieldCheck, Heart } from 'lucide-react';

interface AboutSchoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  schoolName: string;
  vision: string;
  location: string;
  contact: string;
  email: string;
  website: string;
}

const AboutSchoolModal: React.FC<AboutSchoolModalProps> = ({ 
  isOpen, onClose, schoolName, vision, location, contact, email, website 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-[3rem] shadow-2xl animate-in zoom-in duration-300 overflow-hidden">
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-8 text-white relative overflow-hidden">
          <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
            <X className="w-5 h-5" />
          </button>
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md mb-4 border border-white/20">
            <School className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black tracking-tight">{schoolName || 'Institution Profile'}</h2>
          <p className="text-indigo-100 text-[10px] font-bold uppercase tracking-widest mt-1 opacity-80">Established & Verified Campus</p>
        </div>

        <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto">
          <section className="space-y-3">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center space-x-2">
              <Award className="w-3 h-3 text-indigo-500" /> <span>Our Vision</span>
            </h3>
            <p className="text-sm font-medium text-slate-600 leading-relaxed italic">
              "{vision || 'To empower every student with the tools of modernity while grounding them in values of integrity, fostering a community of lifelong learners and innovative leaders.'}"
            </p>
          </section>

          <section className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl space-y-1">
              <MapPin className="w-4 h-4 text-rose-500" />
              <p className="text-[10px] font-black text-slate-900 uppercase">Location</p>
              <p className="text-[10px] font-bold text-slate-500 truncate">{location || 'Main Campus'}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl space-y-1">
              <Phone className="w-4 h-4 text-emerald-500" />
              <p className="text-[10px] font-black text-slate-900 uppercase">Contact</p>
              <p className="text-[10px] font-bold text-slate-500">{contact || 'Not provided'}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl space-y-1">
              <Mail className="w-4 h-4 text-blue-500" />
              <p className="text-[10px] font-black text-slate-900 uppercase">Email</p>
              <p className="text-[10px] font-bold text-slate-500 truncate">{email || 'Not provided'}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl space-y-1">
              <Globe className="w-4 h-4 text-indigo-500" />
              <p className="text-[10px] font-black text-slate-900 uppercase">Website</p>
              <p className="text-[10px] font-bold text-slate-500 truncate">{website || 'Not provided'}</p>
            </div>
          </section>

          <div className="p-5 bg-indigo-50 rounded-3xl border border-indigo-100 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              <span className="text-[11px] font-black text-indigo-900 uppercase">Institutional Grade CMS</span>
            </div>
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse" />
          </div>
        </div>
        
        <div className="p-4 bg-slate-50 text-center">
           <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">© 2025 All Rights Reserved • {schoolName}</p>
        </div>
      </div>
    </div>
  );
};

export default AboutSchoolModal;
