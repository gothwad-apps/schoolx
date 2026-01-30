
import React, { useState } from 'react';
import { User, Hash, Lock, BookOpen, LayoutDashboard, X, CheckCircle2, ShieldCheck, AlertCircle, Layers, UserPlus, Sparkles } from 'lucide-react';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

interface AddTeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddTeacherModal: React.FC<AddTeacherModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    teacherId: '',
    password: '',
    assignedClass: '1',
    section: 'A',
    sectionCategory: 'JUNIOR', // JUNIOR, SENIOR, BOTH
    teacherRole: 'CLASS_TEACHER' // CLASS_TEACHER, CO_CLASS_TEACHER
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    
    try {
      const teachersRef = collection(db, 'teachers');
      const normalizedID = form.teacherId.trim().toUpperCase();
      const q = query(teachersRef, where('teacherId', '==', normalizedID));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        setError("SECURITY ALERT: This Teacher ID is already registered. Duplicate IDs are strictly blocked.");
        setIsSaving(false);
        return;
      }

      await addDoc(collection(db, 'teachers'), {
        ...form,
        teacherId: normalizedID,
        createdAt: new Date().toISOString(),
        role: 'TEACHER'
      });
      
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        onSuccess();
        onClose();
        setForm({ name: '', teacherId: '', password: '', assignedClass: '1', section: 'A', sectionCategory: 'JUNIOR', teacherRole: 'CLASS_TEACHER' });
      }, 1500);
    } catch (err) {
      setError("Failed to sync with cloud database. Try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const inputStyle = "w-full bg-slate-50 border-2 border-transparent focus:border-indigo-500 rounded-2xl py-3.5 pl-11 pr-4 text-sm font-bold text-slate-900 outline-none transition-all placeholder:text-slate-300 shadow-sm";

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-md" onClick={() => !isSaving && onClose()} />
      <div className="relative w-full max-w-md bg-white rounded-[3rem] shadow-2xl animate-in slide-in-from-bottom duration-400 overflow-hidden">
        {saveSuccess ? (
          <div className="p-16 text-center flex flex-col items-center justify-center animate-in zoom-in">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-12 h-12 text-emerald-500" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">Faculty Enrolled</h3>
            <p className="text-[11px] font-black text-slate-400 mt-2 uppercase tracking-widest">Database Sync Successful</p>
          </div>
        ) : (
          <>
            <div className="p-7 border-b border-slate-50 flex items-center justify-between bg-white sticky top-0 z-10">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
                   <UserPlus className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Enroll Staff</h3>
              </div>
              <button onClick={onClose} className="p-2.5 bg-slate-50 rounded-2xl text-slate-400 active:scale-90 transition-transform">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-7 space-y-5 max-h-[75vh] overflow-y-auto scrollbar-hide pb-10">
              {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start space-x-3 text-red-600 animate-in fade-in zoom-in">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <p className="text-[11px] font-bold uppercase tracking-tight leading-tight">{error}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Category</label>
                  <div className="relative">
                    <Layers className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <select name="sectionCategory" className={inputStyle + " appearance-none"} value={form.sectionCategory} onChange={handleChange}>
                      <option value="JUNIOR">Junior Section</option>
                      <option value="SENIOR">Senior Section</option>
                      <option value="BOTH">Universal (Both)</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Class Role</label>
                  <div className="relative">
                    <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <select name="teacherRole" className={inputStyle + " appearance-none"} value={form.teacherRole} onChange={handleChange}>
                      <option value="CLASS_TEACHER">Class Teacher</option>
                      <option value="CO_CLASS_TEACHER">Co-Teacher</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Staff Member Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="text" name="name" required placeholder="Enter full name" className={inputStyle} value={form.name} onChange={handleChange} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Official ID</label>
                  <div className="relative">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" name="teacherId" required placeholder="OX-TEA-XXX" className={inputStyle} value={form.teacherId} onChange={handleChange} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Security Pin</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" name="password" required placeholder="Login Pin" className={inputStyle} value={form.password} onChange={handleChange} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Primary Class</label>
                  <div className="relative">
                    <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <select name="assignedClass" className={inputStyle + " appearance-none"} value={form.assignedClass} onChange={handleChange}>
                      {[...Array(12)].map((_, i) => (
                        <option key={i+1} value={String(i+1)}>Class {i+1}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Section</label>
                  <div className="relative">
                    <LayoutDashboard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <select name="section" className={inputStyle + " appearance-none"} value={form.section} onChange={handleChange}>
                      {['A', 'B', 'C', 'D', 'E'].map(s => <option key={s} value={s}>Section {s}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <button disabled={isSaving} className="w-full py-5 bg-indigo-600 text-white font-black rounded-[1.75rem] shadow-2xl shadow-indigo-100 flex items-center justify-center space-x-2 mt-6 active:scale-95 transition-all">
                {isSaving ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><ShieldCheck className="w-5 h-5" /><span>Finalize Enrollment</span></>}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default AddTeacherModal;
