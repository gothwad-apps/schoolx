
import React, { useState, useEffect } from 'react';
// Added UserPlus to the imports to fix the "Cannot find name 'UserPlus'" error
import { User, IdCard, Calendar, Hash, BookOpen, LayoutDashboard, X, CheckCircle2, ShieldCheck, AlertCircle, UserPlus } from 'lucide-react';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialClass?: string | null;
  initialSection?: string | null;
}

const AddStudentModal: React.FC<AddStudentModalProps> = ({ isOpen, onClose, onSuccess, initialClass, initialSection }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    aadhaar: '',
    dob: '',
    rollNo: '',
    class: '1',
    section: 'A'
  });

  useEffect(() => {
    if (initialClass) setForm(prev => ({ ...prev, class: initialClass }));
    if (initialSection) setForm(prev => ({ ...prev, section: initialSection }));
  }, [initialClass, initialSection, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    try {
      // Check for duplicate Aadhaar
      const q = query(collection(db, 'students'), where('aadhaar', '==', form.aadhaar));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        setError("SECURE BLOCK: This Aadhaar ID is already registered.");
        setIsSaving(false);
        return;
      }

      await addDoc(collection(db, 'students'), {
        ...form,
        isBlocked: false,
        createdAt: new Date().toISOString(),
        role: 'STUDENT'
      });
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        onSuccess();
        onClose();
        setForm({ name: '', aadhaar: '', dob: '', rollNo: '', class: '1', section: 'A' });
      }, 1500);
    } catch (err) {
      setError("Cloud connection lost. Failed to register.");
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
    <div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => !isSaving && onClose()} />
      <div className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl animate-in slide-in-from-bottom duration-300 overflow-hidden">
        {saveSuccess ? (
          <div className="p-16 text-center flex flex-col items-center justify-center animate-in zoom-in">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <CheckCircle2 className="w-12 h-12 text-emerald-500" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">Student Enrolled!</h3>
            <p className="text-[10px] font-black text-slate-400 mt-2 uppercase tracking-[0.3em]">Central Database Synced</p>
          </div>
        ) : (
          <>
            <div className="p-7 border-b border-slate-50 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg"><UserPlus className="w-5 h-5 text-white" /></div>
                <h3 className="text-xl font-black text-slate-900">Enroll Student</h3>
              </div>
              <button onClick={onClose} className="p-2.5 bg-slate-50 rounded-2xl text-slate-400 active:scale-90 transition-transform">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-7 space-y-5 max-h-[75vh] overflow-y-auto scrollbar-hide pb-10">
              {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center space-x-3 text-red-600">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <p className="text-[10px] font-bold uppercase tracking-tight leading-tight">{error}</p>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Student Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" name="name" required
                    placeholder="Enter full name"
                    className={inputStyle}
                    value={form.name}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Aadhaar Card Number</label>
                <div className="relative">
                  <IdCard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" name="aadhaar" required
                    placeholder="0000 0000 0000"
                    inputMode="numeric"
                    className={inputStyle}
                    value={form.aadhaar}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Date of Birth</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="date" name="dob" required
                      className={inputStyle}
                      value={form.dob}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Roll Number</label>
                  <div className="relative">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" name="rollNo" required
                      placeholder="Ex: 101"
                      className={inputStyle}
                      value={form.rollNo}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Assigned Class</label>
                  <div className="relative">
                    <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <select 
                      name="class"
                      className={inputStyle + " appearance-none"}
                      value={form.class}
                      onChange={handleChange}
                    >
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
                    <select 
                      name="section"
                      className={inputStyle + " appearance-none"}
                      value={form.section}
                      onChange={handleChange}
                    >
                      {['A', 'B', 'C', 'D', 'E'].map(s => (
                        <option key={s} value={s}>Section {s}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <button 
                disabled={isSaving}
                className="w-full py-5 bg-indigo-600 text-white font-black rounded-3xl shadow-2xl shadow-indigo-100 flex items-center justify-center space-x-2 mt-4 active:scale-95 transition-all"
              >
                {isSaving ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5" />
                    <span>Confirm Admission</span>
                  </>
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default AddStudentModal;
