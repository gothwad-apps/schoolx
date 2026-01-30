
import React from 'react';
import { UserRole } from '../types';
import { GraduationCap, Users, UserCog, BookOpen, ChevronRight, Shield, School } from 'lucide-react';

interface RoleSelectionProps {
  onSelectRole: (role: UserRole) => void;
  schoolName: string;
}

const RoleCard: React.FC<{
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  iconBg: string;
}> = ({ title, description, icon, onClick, iconBg }) => (
  <button
    onClick={onClick}
    className="group relative w-full bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center text-left transition-all active:scale-[0.97] active:bg-slate-50 mb-3"
  >
    <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center mr-4 shadow-sm`}>
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <h3 className="text-base font-bold text-slate-900 leading-none">{title}</h3>
      <p className="text-slate-500 text-[11px] truncate mt-1.5 font-medium">{description}</p>
    </div>
    <div className="flex-shrink-0 ml-2">
      <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
        <ChevronRight className="w-4 h-4" />
      </div>
    </div>
  </button>
);

const RoleSelection: React.FC<RoleSelectionProps> = ({ onSelectRole, schoolName }) => {
  return (
    <div className="min-h-[100dvh] bg-[#FDFDFF] flex flex-col px-6 py-8">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
            <School className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="block text-[9px] font-black text-indigo-600 uppercase tracking-tighter leading-none">{schoolName}</span>
            <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Smart Campus</span>
          </div>
        </div>
        <h1 className="text-2xl font-black text-slate-900 leading-tight">
          Welcome to Portal
        </h1>
        <p className="text-slate-500 text-xs mt-1.5 font-medium">
          Identify yourself to enter the campus.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto pb-4 scrollbar-hide">
        <RoleCard
          title="Student"
          description="View grades & homework"
          icon={<BookOpen className="w-6 h-6 text-blue-600" />}
          iconBg="bg-blue-50"
          onClick={() => onSelectRole(UserRole.STUDENT)}
        />
        <RoleCard
          title="Parent"
          description="Track child's performance"
          icon={<Users className="w-6 h-6 text-emerald-600" />}
          iconBg="bg-emerald-50"
          onClick={() => onSelectRole(UserRole.PARENT)}
        />
        <RoleCard
          title="Teacher"
          description="Manage marks & classes"
          icon={<GraduationCap className="w-6 h-6 text-orange-600" />}
          iconBg="bg-orange-50"
          onClick={() => onSelectRole(UserRole.TEACHER)}
        />
        <RoleCard
          title="Administrator"
          description="Full school controls"
          icon={<UserCog className="w-6 h-6 text-indigo-600" />}
          iconBg="bg-indigo-50"
          onClick={() => onSelectRole(UserRole.ADMIN)}
        />
      </div>

      <div className="mt-4 pt-4 border-t border-slate-50 text-center">
        <div className="flex items-center justify-center space-x-2 text-slate-300 mb-1">
           <Shield className="w-2.5 h-2.5" />
           <p className="text-[9px] font-bold uppercase tracking-[0.2em]">
            {schoolName} • 2024
          </p>
        </div>
        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
          Secured by <span className="text-indigo-600">Gothwad Tech</span>
        </p>
      </div>
    </div>
  );
};

export default RoleSelection;
