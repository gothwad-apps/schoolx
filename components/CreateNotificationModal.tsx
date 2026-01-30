
import React, { useState } from 'react';
import { X, Send, AlertCircle, CheckCircle2, UserCheck, Mail, Users, GraduationCap } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { UserRole } from '../types';

interface CreateNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  senderName: string;
}

const CreateNotificationModal: React.FC<CreateNotificationModalProps> = ({ isOpen, onClose, senderName }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    subject: '',
    content: '',
    targets: [] as UserRole[]
  });

  if (!isOpen) return null;

  const toggleTarget = (role: UserRole) => {
    setForm(prev => ({
      ...prev,
      targets: prev.targets.includes(role) 
        ? prev.targets.filter(r => r !== role) 
        : [...prev.targets, role]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.targets.length === 0) return setError("Please select at least one target audience.");
    
    setIsSaving(true);
    setError(null);
    try {
      await addDoc(collection(db, 'notifications'), {
        ...form,
        createdAt: new Date().toISOString(),
        senderName: senderName || 'Administrator'
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        setForm({ subject: '', content: '', targets: [] });
      }, 1500);
    } catch (err) {
      setError("Failed to broadcast notification.");
    } finally {
      setIsSaving(false);
    }
  };

  const inputClass = "w-full bg-slate-50 border-2 border-transparent focus:border-indigo-500 rounded-2xl py-3.5 pl-11 pr-4 text-sm font-bold text-slate-900 outline-none transition-all placeholder:text-slate-300";

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => !isSaving && onClose()} />
      <div className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl animate-in zoom-in duration-300 overflow-hidden">
        {success ? (
          <div className="p-16 text-center flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-12 h-12 text-emerald-500" />
            </div>
            <h3 className="text-xl font-black text-slate-900">Broadcast Success!</h3>
            <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">Notification is live</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">New Broadcast</h3>
              <button type="button" onClick={onClose} className="p-2 bg-slate-50 rounded-xl text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center space-x-3 text-red-600">
                <AlertCircle className="w-4 h-4" />
                <p className="text-[10px] font-bold uppercase tracking-tight">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Subject</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" required placeholder="Announcement title"
                    className={inputClass}
                    value={form.subject} onChange={e => setForm({...form, subject: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Content</label>
                <textarea 
                  required placeholder="Type your message here..." rows={4}
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-500 rounded-2xl p-4 text-sm font-bold text-slate-900 outline-none transition-all resize-none placeholder:text-slate-300"
                  value={form.content} onChange={e => setForm({...form, content: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Broadcast To</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { role: UserRole.STUDENT, icon: Users, label: 'Students' },
                    { role: UserRole.PARENT, icon: UserCheck, label: 'Parents' },
                    { role: UserRole.TEACHER, icon: GraduationCap, label: 'Teachers' }
                  ].map(target => {
                    const active = form.targets.includes(target.role);
                    const Icon = target.icon;
                    return (
                      <button
                        key={target.role} type="button" onClick={() => toggleTarget(target.role)}
                        className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl border-2 transition-all font-black text-[10px] uppercase tracking-tighter ${
                          active ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{target.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <button 
              disabled={isSaving}
              className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl shadow-xl flex items-center justify-center space-x-2 active:scale-95 transition-all"
            >
              {isSaving ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Send className="w-4 h-4" /><span>Send Announcement</span></>}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default CreateNotificationModal;
