
import React, { useState } from 'react';
import { UserRole } from '../types';
import { ChevronLeft, Lock, User, IdCard, Calendar, Hash, Mail, AlertCircle, ShieldCheck, Ban } from 'lucide-react';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';

interface LoginScreenProps {
  role: UserRole;
  onBack: () => void;
  onLoginSuccess: (userData: any) => void;
  schoolName: string;
}

const InputWrapper = ({ label, icon: Icon, children }: any) => (
  <div className="mb-4">
    <label className="text-[10px] font-black text-slate-400 uppercase ml-2 mb-1.5 block tracking-widest">
      {label}
    </label>
    <div className="relative">
      <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
      {children}
    </div>
  </div>
);

const inputClass = "w-full bg-slate-50 border-2 border-transparent rounded-xl py-3.5 pl-12 pr-4 text-slate-900 font-bold focus:bg-white focus:border-indigo-500 transition-all outline-none text-sm placeholder:text-slate-300 placeholder:font-normal";

const LoginScreen: React.FC<LoginScreenProps> = ({ role, onBack, onLoginSuccess, schoolName }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    aadhaar: '',
    dob: '',
    rollNo: '',
    teacherId: '',
    email: '',
    password: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (role === UserRole.ADMIN) {
        const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
        onLoginSuccess({ 
          role: UserRole.ADMIN, 
          email: userCredential.user.email,
          uid: userCredential.user.uid 
        });
      } else if (role === UserRole.STUDENT || role === UserRole.PARENT) {
        const studentsRef = collection(db, 'students');
        const q = query(
          studentsRef, 
          where('aadhaar', '==', formData.aadhaar),
          where('dob', '==', formData.dob),
          where('rollNo', '==', formData.rollNo),
          limit(1)
        );
        
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const studentData = querySnapshot.docs[0].data();
          
          if (studentData.isBlocked) {
            setError("SECURITY ALERT: Your portal access has been restricted by the administration. Contact office.");
            setLoading(false);
            return;
          }

          onLoginSuccess({ role, ...studentData, id: querySnapshot.docs[0].id });
        } else {
          setError("Record not found. Double check your info.");
        }
      } else if (role === UserRole.TEACHER) {
        const teachersRef = collection(db, 'teachers');
        const q = query(
          teachersRef, 
          where('teacherId', '==', formData.teacherId.trim().toUpperCase()),
          where('password', '==', formData.password),
          limit(1)
        );
        
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const teacherData = querySnapshot.docs[0].data();
          onLoginSuccess({ role, ...teacherData, id: querySnapshot.docs[0].id });
        } else {
          setError("Invalid Staff ID or Security Pin.");
        }
      }
    } catch (err: any) {
      setError("Cloud Authentication Failed. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-white flex flex-col animate-in slide-in-from-bottom duration-500 overflow-hidden">
      <div className="px-6 pt-6 pb-4 flex items-center justify-between">
        <button onClick={onBack} className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-900 active:scale-90 transition-transform">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="text-center px-4 flex-1">
          <p className="text-[9px] font-black text-indigo-600 uppercase tracking-widest leading-none truncate max-w-[150px] mx-auto">
            {schoolName || 'SCHOOL NAME LOADING..'}
          </p>
          <p className="text-[8px] font-bold text-slate-400 uppercase mt-1">Authentication Gateway</p>
        </div>
        <div className="w-10"></div>
      </div>

      <div className="px-6 py-4">
        <h1 className="text-2xl font-black text-slate-900 lowercase first-letter:uppercase">
          {role.toLowerCase()} Login
        </h1>
        <p className="text-slate-500 text-xs font-medium mt-1">
          Secure identity verification required.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col px-6">
        <div className="flex-1 overflow-y-auto pt-2 scrollbar-hide">
          {error && (
            <div className={`mb-6 p-4 ${error.includes('restricted') ? 'bg-orange-50 border-orange-100 text-orange-600' : 'bg-red-50 border-red-100 text-red-600'} border rounded-2xl flex items-center space-x-3`}>
              {error.includes('restricted') ? <Ban className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
              <p className="text-[11px] font-bold uppercase tracking-tight">{error}</p>
            </div>
          )}

          {(role === UserRole.STUDENT || role === UserRole.PARENT) && (
            <>
              <InputWrapper label="Verified Aadhaar" icon={IdCard}>
                <input
                  type="text" name="aadhaar" inputMode="numeric"
                  placeholder="0000 0000 0000"
                  className={inputClass}
                  value={formData.aadhaar}
                  onChange={handleInputChange}
                  required
                />
              </InputWrapper>
              <InputWrapper label="Birth Date" icon={Calendar}>
                <input
                  type="date" name="dob"
                  className={inputClass}
                  value={formData.dob}
                  onChange={handleInputChange}
                  required
                />
              </InputWrapper>
              <InputWrapper label="Roll Number" icon={Hash}>
                <input
                  type="text" name="rollNo"
                  placeholder="Ex: 101"
                  className={inputClass}
                  value={formData.rollNo}
                  onChange={handleInputChange}
                  required
                />
              </InputWrapper>
            </>
          )}

          {role === UserRole.TEACHER && (
            <>
              <InputWrapper label="Staff ID" icon={User}>
                <input
                  type="text" name="teacherId"
                  placeholder="ID-XXX-001"
                  className={inputClass}
                  value={formData.teacherId}
                  onChange={handleInputChange}
                  required
                />
              </InputWrapper>
              <InputWrapper label="Security Pin" icon={Lock}>
                <input
                  type="password" name="password"
                  placeholder="••••••••"
                  className={inputClass}
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </InputWrapper>
            </>
          )}

          {role === UserRole.ADMIN && (
            <>
              <InputWrapper label="Admin Email" icon={Mail}>
                <input
                  type="email" name="email"
                  placeholder="admin@institution.com"
                  className={inputClass}
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </InputWrapper>
              <InputWrapper label="Root Password" icon={Lock}>
                <input
                  type="password" name="password"
                  placeholder="••••••••"
                  className={inputClass}
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </InputWrapper>
            </>
          )}
        </div>

        <div className="py-6 mt-auto">
          <button
            type="submit" disabled={loading}
            className={`w-full py-4 rounded-2xl font-black text-white shadow-xl transition-all active:scale-95 flex items-center justify-center space-x-2 ${
              loading ? 'bg-indigo-400' : 'bg-indigo-600 shadow-indigo-100'
            }`}
          >
            {loading ? (
              <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <ShieldCheck className="w-5 h-5" />
                <span>Verify & Enter</span>
              </>
            )}
          </button>
          
          <p className="text-[9px] text-slate-400 text-center font-black uppercase tracking-[0.2em] mt-6">
            Powered by Gothwad Technologies
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginScreen;
