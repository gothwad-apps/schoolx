
import React from 'react';
import { Landmark, School, Database, Save, Award, MapPin, Phone, Mail, Globe } from 'lucide-react';

interface SettingsManagerProps {
  tempSchoolName: string;
  setTempSchoolName: (name: string) => void;
  tempVision: string;
  setTempVision: (v: string) => void;
  tempLocation: string;
  setTempLocation: (l: string) => void;
  tempContact: string;
  setTempContact: (c: string) => void;
  tempEmail: string;
  setTempEmail: (e: string) => void;
  tempWebsite: string;
  setTempWebsite: (w: string) => void;
  tempJuniorMax: number;
  setTempJuniorMax: (max: number) => void;
  classConfigs: Record<string, number>;
  setClassConfigs: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  onSave: () => void;
  isSaving: boolean;
}

const SettingsManager: React.FC<SettingsManagerProps> = ({
  tempSchoolName, setTempSchoolName, 
  tempVision, setTempVision,
  tempLocation, setTempLocation,
  tempContact, setTempContact,
  tempEmail, setTempEmail,
  tempWebsite, setTempWebsite,
  tempJuniorMax, setTempJuniorMax, classConfigs, setClassConfigs, onSave, isSaving
}) => {
  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300 pb-32">
      <h2 className="text-lg font-black text-slate-900">System Setup</h2>
      <div className="bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-7">
         
         <div className="space-y-4">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center space-x-2">
              <Landmark className="w-3 h-3 text-indigo-500" /> <span>Basic Information</span>
            </h3>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Official Institution Name</label>
              <div className="relative">
                <Landmark className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-500" />
                <input type="text" className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-500 rounded-2xl py-4 pl-11 pr-4 text-sm font-bold outline-none text-slate-900" value={tempSchoolName} onChange={(e) => setTempSchoolName(e.target.value)} placeholder="Oxford Model Sr. Sec. School" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Vision Statement</label>
              <div className="relative">
                <Award className="absolute left-4 top-4 w-4 h-4 text-amber-500" />
                <textarea 
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-500 rounded-2xl py-4 pl-11 pr-4 text-sm font-bold outline-none text-slate-900 min-h-[100px] resize-none" 
                  value={tempVision} 
                  onChange={(e) => setTempVision(e.target.value)} 
                  placeholder="Enter school vision..." 
                />
              </div>
            </div>
         </div>

         <div className="space-y-4 pt-2">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center space-x-2">
              <Globe className="w-3 h-3 text-emerald-500" /> <span>Public Profile & Contact</span>
            </h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Location Address</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-500" />
                  <input type="text" className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-500 rounded-2xl py-4 pl-11 pr-4 text-sm font-bold outline-none text-slate-900" value={tempLocation} onChange={(e) => setTempLocation(e.target.value)} placeholder="Main Campus, Digital City" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Official Contact No.</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                  <input type="text" className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-500 rounded-2xl py-4 pl-11 pr-4 text-sm font-bold outline-none text-slate-900" value={tempContact} onChange={(e) => setTempContact(e.target.value)} placeholder="+91 999 888 7777" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Institutional Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500" />
                  <input type="email" className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-500 rounded-2xl py-4 pl-11 pr-4 text-sm font-bold outline-none text-slate-900" value={tempEmail} onChange={(e) => setTempEmail(e.target.value)} placeholder="info@campus.edu" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Website URL</label>
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-500" />
                  <input type="text" className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-500 rounded-2xl py-4 pl-11 pr-4 text-sm font-bold outline-none text-slate-900" value={tempWebsite} onChange={(e) => setTempWebsite(e.target.value)} placeholder="www.campus.edu" />
                </div>
              </div>
            </div>
         </div>

         <div className="space-y-4 pt-2">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center space-x-2">
              <Database className="w-3 h-3 text-purple-500" /> <span>Structural Configuration</span>
            </h3>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Junior Section Boundary</label>
              <div className="relative">
                <School className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                <select 
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-500 rounded-2xl py-4 pl-11 pr-4 text-sm font-bold outline-none appearance-none text-slate-900"
                  value={tempJuniorMax}
                  onChange={(e) => setTempJuniorMax(Number(e.target.value))}
                >
                  {[...Array(12)].map((_, i) => (
                    <option key={i+1} value={i+1}>Junior Section ends at Class {i+1}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Structural Mapping (Sections)</h3>
              <div className="grid grid-cols-2 gap-3">
                {[...Array(12)].map((_, i) => {
                  const cls = String(i + 1);
                  return (
                    <div key={cls} className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                      <span className="text-[11px] font-black text-slate-600">Class {cls}</span>
                      <select className="bg-white border-none text-[12px] font-black text-indigo-600 rounded-lg outline-none" value={classConfigs[cls] || 1} onChange={(e) => setClassConfigs(prev => ({ ...prev, [cls]: Number(e.target.value) }))}>
                        {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} Sec</option>)}
                      </select>
                    </div>
                  );
                })}
              </div>
            </div>
         </div>

         <button onClick={onSave} disabled={isSaving} className="w-full py-5 bg-slate-900 text-white font-black rounded-3xl flex items-center justify-center space-x-2 active:scale-95 transition-all shadow-2xl">
           {isSaving ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Save className="w-5 h-5" /><span>Sync Cloud Configuration</span></>}
         </button>
      </div>
    </div>
  );
};

export default SettingsManager;
