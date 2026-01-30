
import React from 'react';
import { ChevronLeft, UserPlus, Plus, School, Award, Star, ChevronRight, GraduationCap as StaffIcon, Briefcase } from 'lucide-react';
import { UserRole } from '../types';

interface StaffManagerProps {
  juniorMaxClass: number;
  currentUser: any;
  teachers: any[];
  selStaffCategory: 'JUNIOR' | 'SENIOR' | 'BOTH' | null;
  setSelStaffCategory: (cat: 'JUNIOR' | 'SENIOR' | 'BOTH' | null) => void;
  onAddTeacher: () => void;
}

const StaffManager: React.FC<StaffManagerProps> = ({ 
  juniorMaxClass, currentUser, teachers, selStaffCategory, setSelStaffCategory, onAddTeacher 
}) => {
  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
      <div className="flex items-center space-x-2 px-2">
        <button 
          onClick={() => setSelStaffCategory(null)}
          disabled={!selStaffCategory}
          className={`p-2 rounded-xl transition-all ${selStaffCategory ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-300'}`}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-lg font-black text-slate-900 leading-none">
            {!selStaffCategory ? 'Staff Directory' : `${selStaffCategory} Faculty`}
          </h2>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Cloud Personnel Hub</p>
        </div>
      </div>

      {!selStaffCategory && (
        <div className="space-y-4">
          {currentUser?.role === UserRole.ADMIN && (
             <button onClick={onAddTeacher} className="w-full p-6 bg-gradient-to-br from-rose-600 to-rose-800 rounded-3xl flex items-center justify-between shadow-xl shadow-rose-100 active:scale-95 transition-all">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md"><UserPlus className="w-6 h-6 text-white" /></div>
                  <div className="text-left"><p className="text-sm font-black text-white leading-none">Enroll Faculty</p><p className="text-[10px] font-bold text-rose-100 opacity-60 uppercase mt-1">Institutional Database</p></div>
                </div>
                <Plus className="w-5 h-5 text-white" />
             </button>
          )}
          <div className="grid grid-cols-1 gap-3">
            {[
              { id: 'JUNIOR', label: 'Junior Faculty (1-'+juniorMaxClass+')', icon: School, grad: 'from-emerald-500 to-emerald-700' },
              { id: 'SENIOR', label: 'Senior Faculty ('+(juniorMaxClass+1)+'-12)', icon: Award, grad: 'from-orange-500 to-orange-700' },
              { id: 'BOTH', label: 'Administration & Support', icon: Star, grad: 'from-indigo-500 to-indigo-700' }
            ].map(cat => (
              <button 
                key={cat.id}
                onClick={() => setSelStaffCategory(cat.id as any)}
                className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between active:scale-95 transition-all group"
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${cat.grad} text-white rounded-2xl flex items-center justify-center shadow-md`}><cat.icon className="w-6 h-6" /></div>
                  <span className="text-sm font-black text-slate-800">{cat.label}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-200" />
              </button>
            ))}
          </div>
        </div>
      )}

      {selStaffCategory && (
        <div className="space-y-3 pb-20">
          {teachers.filter(t => t.sectionCategory === selStaffCategory).map((t, idx) => (
            <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center"><StaffIcon className="w-6 h-6" /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-black text-slate-800 leading-none">{t.name}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">
                    {t.teacherRole === 'CLASS_TEACHER' ? 'Class Master' : 'Assisting Teacher'} • Class {t.assignedClass}-{t.section}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[8px] font-black text-slate-400 uppercase">Staff ID</p>
                <p className="text-[10px] font-black text-slate-900">{t.teacherId}</p>
              </div>
            </div>
          ))}
          {teachers.filter(t => t.sectionCategory === selStaffCategory).length === 0 && (
            <div className="text-center py-20 text-slate-300"><Briefcase className="w-12 h-12 mx-auto mb-4 opacity-10" /><p className="text-[10px] font-black uppercase tracking-widest">No staff listed in this category</p></div>
          )}
        </div>
      )}
    </div>
  );
};

export default StaffManager;
