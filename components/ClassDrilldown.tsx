
import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, ChevronRight, Layers, UserCheck, Sparkles, Wallet, 
  BookMarked, CheckCircle, Users, ShieldCheck, UserPlus, MoreVertical, 
  Edit3, Trash2, Ban, CheckCircle2, X, User, MapPin, Calendar, Heart, Shield, Hash, Fingerprint
} from 'lucide-react';
import { UserRole } from '../types';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import AddStudentModal from './AddStudentModal';

interface ClassDrilldownProps {
  module: string;
  icon: any;
  colorClass: string;
  bgClass: string;
  gradClass: string;
  selClass: string | null;
  selSec: string | null;
  setSelClass: (cls: string | null) => void;
  setSelSec: (sec: string | null) => void;
  classConfigs: Record<string, number>;
  classTeacher: any;
  coClassTeacher: any;
  students: any[];
  currentUser: any;
  onRefresh: () => void;
}

const StudentManagementModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  student: any;
  onRefresh: () => void;
  canManage: boolean;
}> = ({ isOpen, onClose, student, onRefresh, canManage }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    rollNo: '',
    dob: '',
    fatherName: '',
    motherName: '',
    address: '',
    admissionSince: '',
    admissionClass: ''
  });

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name || '',
        rollNo: student.rollNo || '',
        dob: student.dob || '',
        fatherName: student.fatherName || '',
        motherName: student.motherName || '',
        address: student.address || '',
        admissionSince: student.admissionSince || new Date().getFullYear().toString(),
        admissionClass: student.admissionClass || student.class || ''
      });
      setEditMode(false); // Reset to view mode whenever a new student is selected
    }
  }, [student]);

  if (!isOpen || !student) return null;

  const handleUpdate = async () => {
    if (!formData.name.trim()) return alert("Name is required");
    setIsSaving(true);
    try {
      await updateDoc(doc(db, 'students', student.id), {
        ...formData
      });
      onRefresh();
      setEditMode(false);
    } catch (err) {
      console.error(err);
      alert("Cloud Sync Error: Update failed.");
    } finally {
      setIsSaving(false);
    }
  };

  const toggleBlock = async () => {
    const action = student.isBlocked ? 'unblock' : 'block';
    if (!confirm(`Are you sure you want to ${action} this student's access?`)) return;
    setIsSaving(true);
    try {
      await updateDoc(doc(db, 'students', student.id), {
        isBlocked: !student.isBlocked
      });
      onRefresh();
      onClose();
    } catch (err) {
      alert("Action failed.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    // Ensuring ID is present
    if (!student.id) {
      alert("Error: Student ID missing. Cannot delete.");
      return;
    }
    
    if (!confirm("WARNING: This will permanently erase the student's entire academic and financial history. Proceed?")) return;
    
    setIsSaving(true);
    try {
      await deleteDoc(doc(db, 'students', student.id));
      onRefresh();
      onClose();
    } catch (err) {
      console.error("Delete Error:", err);
      alert("Delete failed. Please check your network connection.");
    } finally {
      setIsSaving(false);
    }
  };

  const InfoRow = ({ icon: Icon, label, value, color }: any) => (
    <div className="flex items-center space-x-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-100 transition-all hover:bg-white hover:shadow-sm">
      <div className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center shadow-sm flex-shrink-0`}>
        <Icon className="w-4.5 h-4.5 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
        <p className="text-xs font-bold text-slate-900 truncate">{value || 'Not Disclosed'}</p>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-white rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300 flex flex-col max-h-[92vh] border border-white/20">
        
        {/* Header Overlay */}
        <div className="p-6 bg-slate-900 text-white flex justify-between items-center flex-shrink-0 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
          <div className="flex items-center space-x-3 relative z-10">
             <div className="w-11 h-11 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10 shadow-inner">
                {editMode ? <Edit3 className="w-5 h-5 text-indigo-300" /> : <User className="w-5 h-5 text-white" />}
             </div>
             <div>
               <h3 className="text-sm font-black uppercase tracking-tight leading-none">{editMode ? 'Edit Registry' : 'Identity Profile'}</h3>
               <p className="text-[9px] font-bold text-slate-400 tracking-[0.2em] uppercase mt-1">Status: {student.isBlocked ? 'Suspended' : 'Verified'}</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-all active:scale-90 relative z-10 border border-white/5">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-white">
          {editMode ? (
            <div className="space-y-4">
              {[
                { label: 'Full Student Name', key: 'name', icon: User, type: 'text' },
                { label: 'Official Roll No', key: 'rollNo', icon: Hash, type: 'text' },
                { label: 'Date of Birth', key: 'dob', icon: Calendar, type: 'date' },
                { label: "Father's Legal Name", key: 'fatherName', icon: Heart, type: 'text' },
                { label: "Mother's Legal Name", key: 'motherName', icon: Sparkles, type: 'text' },
                { label: "Home Address", key: 'address', icon: MapPin, type: 'text' },
                { label: "Admission Year", key: 'admissionSince', icon: Calendar, type: 'text' },
                { label: "Admission Class", key: 'admissionClass', icon: Layers, type: 'text' },
              ].map((field) => (
                <div key={field.key} className="space-y-1.5 animate-in slide-in-from-bottom-2 duration-200">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">{field.label}</label>
                  <div className="relative">
                    <field.icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type={field.type}
                      className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-[1.25rem] py-3.5 pl-11 pr-4 text-sm font-bold text-slate-900 outline-none transition-all placeholder:text-slate-300 shadow-sm"
                      value={(formData as any)[field.key]}
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                      onChange={(e) => setFormData({...formData, [field.key]: e.target.value})}
                    />
                  </div>
                </div>
              ))}
              
              <div className="flex space-x-3 pt-6 pb-2">
                <button 
                  onClick={handleUpdate} 
                  disabled={isSaving} 
                  className="flex-1 py-4.5 bg-indigo-600 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest active:scale-95 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center space-x-2"
                >
                  {isSaving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <span>UPDATE DATABASE</span>}
                </button>
                <button 
                  onClick={() => setEditMode(false)} 
                  className="px-6 py-4.5 bg-slate-100 text-slate-500 font-black rounded-2xl text-[10px] uppercase tracking-widest active:bg-slate-200 transition-colors"
                >
                  CANCEL
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Profile Card Summary */}
              <div className="flex flex-col items-center text-center space-y-4 pb-6 border-b border-slate-50">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-[2.5rem] flex items-center justify-center text-indigo-600 shadow-inner border border-white">
                    <User className="w-12 h-12" />
                  </div>
                  {student.isBlocked && (
                    <div className="absolute -top-1 -right-1 bg-rose-500 p-2 rounded-xl shadow-lg border-2 border-white">
                      <Ban className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="text-xl font-black text-slate-900 tracking-tight lowercase first-letter:uppercase">{student.name}</h4>
                  <div className="flex items-center justify-center space-x-2 mt-1">
                    <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg uppercase tracking-widest">Class {student.class}-{student.section}</span>
                    <span className="text-[10px] font-bold text-slate-400">•</span>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Roll: {student.rollNo}</span>
                  </div>
                </div>
              </div>

              {/* Information Grid */}
              <div className="grid grid-cols-1 gap-3">
                <InfoRow icon={Calendar} label="Date of Birth" value={formData.dob} color="bg-blue-500" />
                <InfoRow icon={Fingerprint} label="Aadhaar Identity" value={student.aadhaar} color="bg-indigo-500" />
                <InfoRow icon={Heart} label="Father's Name" value={formData.fatherName} color="bg-emerald-500" />
                <InfoRow icon={Sparkles} label="Mother's Name" value={formData.motherName} color="bg-rose-500" />
                <InfoRow icon={MapPin} label="Home Address" value={formData.address} color="bg-amber-500" />
                <div className="grid grid-cols-2 gap-3">
                   <InfoRow icon={Layers} label="Joined Class" value={formData.admissionClass} color="bg-slate-700" />
                   <InfoRow icon={Calendar} label="Since Year" value={formData.admissionSince} color="bg-slate-700" />
                </div>
              </div>

              {/* Action Center - Only for Admins or Assigned Teachers */}
              {canManage && (
                <div className="space-y-2 pt-4">
                  <button onClick={() => setEditMode(true)} className="w-full p-4.5 bg-slate-900 text-white font-black rounded-2xl flex items-center justify-between group transition-all shadow-xl shadow-slate-100">
                    <div className="flex items-center space-x-3">
                      <Edit3 className="w-4.5 h-4.5 text-indigo-400" />
                      <span className="text-[11px] uppercase tracking-widest">Modify Registry</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </button>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={toggleBlock} 
                      className={`p-4 rounded-2xl font-black flex items-center justify-center space-x-2 transition-all active:scale-95 ${
                        student.isBlocked ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'
                      }`}
                    >
                      <Ban className="w-4 h-4" />
                      <span className="text-[10px] uppercase tracking-widest">{student.isBlocked ? 'Unblock' : 'Block'}</span>
                    </button>

                    <button 
                      onClick={handleDelete} 
                      disabled={isSaving}
                      className="p-4 bg-rose-50 text-rose-600 rounded-2xl font-black flex items-center justify-center space-x-2 transition-all active:scale-95 hover:bg-rose-100"
                    >
                      {isSaving ? <div className="w-4 h-4 border-2 border-rose-600 border-t-transparent rounded-full animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      <span className="text-[10px] uppercase tracking-widest">Delete</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="p-5 bg-slate-50 text-center border-t border-slate-100 flex-shrink-0">
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.4em]">Cloud Security Protocols Active • Oxford Model</p>
        </div>
      </div>
    </div>
  );
};

const ClassDrilldown: React.FC<ClassDrilldownProps> = ({
  module, icon, colorClass, bgClass, gradClass, selClass, selSec, setSelClass, setSelSec, classConfigs, classTeacher, coClassTeacher, students, currentUser, onRefresh
}) => {
  const Icon = icon;
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  const canManage = currentUser?.role === UserRole.ADMIN || 
    (currentUser?.role === UserRole.TEACHER && 
     currentUser?.assignedClass === selClass && 
     currentUser?.section === selSec);

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
      <div className="flex items-center space-x-2 px-2">
        <button 
          onClick={() => {
            if (selSec) setSelSec(null);
            else if (selClass) setSelClass(null);
          }}
          disabled={!selClass}
          className={`p-2 rounded-xl transition-all ${selClass ? `${bgClass} ${colorClass}` : 'bg-slate-100 text-slate-300'}`}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-lg font-black text-slate-900 leading-none">
            {!selClass ? `${module}` : !selSec ? `Class ${selClass}` : `Class ${selClass}-${selSec}`}
          </h2>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Academic Governance</p>
        </div>
      </div>

      {!selClass && (
        <div className="grid grid-cols-3 gap-4 pb-20">
          {[...Array(12)].map((_, i) => {
            const cls = String(i + 1);
            return (
              <button 
                key={cls}
                onClick={() => setSelClass(cls)}
                className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center justify-center space-y-3 active:scale-95 transition-all group relative overflow-hidden"
              >
                <div className={`w-14 h-14 ${gradClass} text-white rounded-[1.5rem] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-7 h-7" />
                </div>
                <span className="text-[13px] font-black text-slate-900">Class {cls}</span>
              </button>
            );
          })}
        </div>
      )}

      {selClass && !selSec && (
        <div className="grid grid-cols-2 gap-4">
          {['A', 'B', 'C', 'D', 'E'].slice(0, classConfigs[selClass] || 1).map(sec => (
            <button 
              key={sec}
              onClick={() => setSelSec(sec)}
              className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center justify-center space-y-3 active:scale-95 transition-all group"
            >
              <div className={`w-14 h-14 ${gradClass} text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform`}>
                <Layers className="w-7 h-7" />
              </div>
              <span className="text-[13px] font-black text-slate-900">Section {sec}</span>
            </button>
          ))}
        </div>
      )}

      {selClass && selSec && (
        <div className="space-y-4">
          <div className={`rounded-[2rem] p-6 text-white shadow-2xl flex flex-col space-y-5 relative overflow-hidden ${module === 'ATTENDANCE' ? 'bg-emerald-600 shadow-emerald-100' : module === 'HOMEWORK' ? 'bg-purple-600 shadow-purple-100' : module === 'FINANCE' ? 'bg-amber-600 shadow-amber-100' : 'bg-indigo-600 shadow-indigo-100'}`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
            
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center space-x-4">
                <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/20">
                  <UserCheck className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <p className="text-[9px] font-black uppercase tracking-widest opacity-80">Class In-charge</p>
                    {classTeacher && (
                      <span className="bg-white/20 px-2 py-0.5 rounded-full text-[7px] font-black uppercase tracking-tighter border border-white/10 flex items-center space-x-1">
                        <ShieldCheck className="w-2.5 h-2.5" />
                        <span>Master</span>
                      </span>
                    )}
                  </div>
                  <p className="text-base font-black truncate mt-0.5">{classTeacher ? classTeacher.name : 'Unassigned'}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4 border-t border-white/10 pt-4 relative z-10">
              <div className="w-11 h-11 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/20">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[9px] font-black uppercase tracking-widest opacity-80">Co-Incharge</p>
                <p className="text-base font-black truncate mt-0.5">{coClassTeacher ? coClassTeacher.name : 'Unassigned'}</p>
              </div>
            </div>
          </div>

          {module === 'STUDENTS' && (
            <div className="space-y-3 pb-24">
              <div className="px-2 flex justify-between items-center">
                 <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Enrolled Minds</h3>
                 <div className="flex items-center space-x-2">
                    {canManage && (
                      <button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-slate-900 text-white p-2.5 rounded-xl flex items-center space-x-2 active:scale-95 transition-all shadow-lg"
                      >
                        <UserPlus className="w-4 h-4" />
                        <span className="text-[9px] font-black uppercase tracking-tight">Enroll New</span>
                      </button>
                    )}
                    <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-100">{students.length} Total</span>
                 </div>
              </div>

              {students.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-[2.5rem] border border-dashed border-slate-200">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-slate-200" />
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">Registry Empty • Class {selClass}-{selSec}</p>
                </div>
              ) : (
                students.map((s, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setSelectedStudent(s)}
                    className={`w-full text-left bg-white p-4.5 rounded-[1.75rem] border ${s.isBlocked ? 'border-orange-200 bg-orange-50/20' : 'border-slate-100 shadow-sm'} flex items-center justify-between transition-all active:scale-[0.98] active:bg-slate-50 group`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-11 h-11 ${s.isBlocked ? 'bg-orange-100 text-orange-600' : 'bg-slate-50 text-indigo-600'} rounded-2xl flex items-center justify-center font-black text-sm shadow-inner group-hover:scale-105 transition-transform`}>
                        {s.rollNo}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="text-[14px] font-black text-slate-800 leading-none lowercase first-letter:uppercase">{s.name}</p>
                          {s.isBlocked && <Ban className="w-3.5 h-3.5 text-orange-500" />}
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 mt-1.5 uppercase tracking-tighter">Digital ID: ****{s.aadhaar.slice(-4)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      {canManage && <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-300 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors"><MoreVertical className="w-4 h-4" /></div>}
                      {!canManage && <ChevronRight className="w-5 h-5 text-slate-200 group-hover:translate-x-1 transition-transform" />}
                    </div>
                  </button>
                ))
              )}
            </div>
          )}

          {module === 'FINANCE' && (
            <div className="space-y-3 pb-24">
              <div className="px-2 flex justify-between items-center">
                 <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fee Ledger Summary</h3>
                 <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-100">Live Syncing</span>
              </div>
              {students.map((s, idx) => (
                <div key={idx} className="bg-white p-4.5 rounded-[1.75rem] border border-slate-100 shadow-sm flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-11 h-11 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center font-black text-sm">{s.rollNo}</div>
                    <div>
                      <p className="text-[14px] font-black text-slate-800 leading-none">{s.name}</p>
                      <p className="text-[10px] font-bold text-emerald-500 mt-1.5 uppercase tracking-widest">Financial Status: OK</p>
                    </div>
                  </div>
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-slate-300" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {(module === 'HOMEWORK' || module === 'ATTENDANCE') && (
            <div className="bg-white p-16 rounded-[3rem] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-center space-y-5">
              <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center shadow-lg ${module === 'HOMEWORK' ? 'bg-purple-50 text-purple-600 shadow-purple-50' : 'bg-emerald-50 text-emerald-600 shadow-emerald-50'}`}>
                 {module === 'HOMEWORK' ? <BookMarked className="w-9 h-9" /> : <CheckCircle className="w-9 h-9" />}
              </div>
              <div>
                 <h3 className="text-lg font-black text-slate-800">{module === 'HOMEWORK' ? 'No Assignments' : 'Roll Call Locked'}</h3>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">Connecting to Class Hub...</p>
              </div>
            </div>
          )}
        </div>
      )}

      <AddStudentModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSuccess={() => {
          onRefresh();
          setIsAddModalOpen(false);
        }}
        initialClass={selClass}
        initialSection={selSec}
      />

      <StudentManagementModal 
        isOpen={!!selectedStudent} 
        onClose={() => setSelectedStudent(null)} 
        student={selectedStudent} 
        onRefresh={onRefresh}
        canManage={canManage}
      />
    </div>
  );
};

export default ClassDrilldown;
