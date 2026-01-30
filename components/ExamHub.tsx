
import React, { useState, useEffect } from 'react';
import { 
  X, Calendar, BookOpen, Clock, FileText, Plus, Trash2, 
  ChevronRight, Layers, Sparkles, Trophy, ChevronLeft, 
  LayoutGrid, ListChecks, Edit3, Save, ExternalLink, StickyNote, Image as ImageIcon,
  Settings2, AlertTriangle, CheckCircle2, RefreshCcw
} from 'lucide-react';
import { collection, query, orderBy, onSnapshot, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { UserRole } from '../types';

interface ExamEvent {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  targetClasses: string[];
  datesheetUrl: string;
  syllabusUrl: string;
  note: string;
  createdAt: string;
}

interface ExamHubProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: any;
  isAdmin: boolean;
}

const ExamForm: React.FC<{
  onClose: () => void;
  onSave: (data: Omit<ExamEvent, 'id' | 'createdAt'>) => void;
  isSaving: boolean;
  initialData?: ExamEvent | null;
}> = ({ onClose, onSave, isSaving, initialData }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    startDate: initialData?.startDate || '',
    endDate: initialData?.endDate || '',
    targetClasses: initialData?.targetClasses || [] as string[],
    datesheetUrl: initialData?.datesheetUrl || '',
    syllabusUrl: initialData?.syllabusUrl || '',
    note: initialData?.note || ''
  });

  const classesList = [...Array(12)].map((_, i) => String(i + 1));

  const toggleClass = (cls: string) => {
    setFormData(prev => ({
      ...prev,
      targetClasses: prev.targetClasses.includes(cls)
        ? prev.targetClasses.filter(c => c !== cls)
        : [...prev.targetClasses, cls]
    }));
  };

  const selectPreset = (type: 'ALL' | 'JUNIOR' | 'SENIOR') => {
    if (type === 'ALL') setFormData(prev => ({ ...prev, targetClasses: classesList }));
    if (type === 'JUNIOR') setFormData(prev => ({ ...prev, targetClasses: ['1', '2', '3', '4', '5'] }));
    if (type === 'SENIOR') setFormData(prev => ({ ...prev, targetClasses: ['6', '7', '8', '9', '10', '11', '12'] }));
  };

  const canPublish = formData.name && formData.startDate && formData.endDate && formData.targetClasses.length > 0;

  return (
    <div className="bg-white p-6 rounded-[3rem] border-4 border-black shadow-2xl space-y-6 animate-in zoom-in duration-300 max-h-[85vh] overflow-y-auto custom-scrollbar">
      <div className="flex items-center justify-between sticky top-0 bg-white z-10 pb-4 border-b-2 border-slate-100">
        <h3 className="text-[14px] font-black text-black uppercase tracking-widest flex items-center space-x-2">
           {initialData ? <Edit3 className="w-5 h-5 text-black" /> : <Plus className="w-5 h-5 text-black" />} 
           <span>{initialData ? 'Update Record' : 'Create Exam'}</span>
        </h3>
        <button onClick={onClose} className="p-2 bg-slate-100 rounded-xl text-black active:scale-90 transition-transform"><X className="w-5 h-5" /></button>
      </div>

      <div className="space-y-6">
        <div className="space-y-1.5">
          <label className="text-[12px] font-black text-black uppercase tracking-widest ml-1">Exam Title</label>
          <input 
            type="text" 
            placeholder="Ex: Half Yearly Exams"
            className="w-full bg-slate-50 p-5 rounded-2xl font-black text-base outline-none text-black border-2 border-transparent focus:border-black transition-all"
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[12px] font-black text-black uppercase tracking-widest ml-1">Starts On</label>
            <input type="date" className="w-full bg-slate-50 p-5 rounded-2xl font-black text-sm outline-none text-black border-2 border-transparent focus:border-black" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} />
          </div>
          <div className="space-y-1.5">
            <label className="text-[12px] font-black text-black uppercase tracking-widest ml-1">Ends On</label>
            <input type="date" className="w-full bg-slate-50 p-5 rounded-2xl font-black text-sm outline-none text-black border-2 border-transparent focus:border-black" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[12px] font-black text-black uppercase tracking-widest ml-1">Target Classes</label>
          <div className="flex flex-wrap gap-2 mb-3">
            <button onClick={() => selectPreset('ALL')} className="px-4 py-2 bg-black rounded-xl text-[10px] font-black uppercase text-white">All</button>
            <button onClick={() => selectPreset('JUNIOR')} className="px-4 py-2 bg-emerald-700 rounded-xl text-[10px] font-black uppercase text-white">1-5</button>
            <button onClick={() => selectPreset('SENIOR')} className="px-4 py-2 bg-indigo-700 rounded-xl text-[10px] font-black uppercase text-white">6-12</button>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {classesList.map(cls => (
              <button 
                key={cls} 
                type="button"
                onClick={() => toggleClass(cls)}
                className={`py-3.5 rounded-xl font-black text-sm transition-all border-2 ${formData.targetClasses.includes(cls) ? 'bg-black border-black text-white' : 'bg-slate-50 border-transparent text-black'}`}
              >
                {cls}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-[12px] font-black text-black uppercase tracking-widest ml-1 flex items-center space-x-2">
              <ImageIcon className="w-4 h-4 text-black" /> <span>Datesheet Link</span>
            </label>
            <input 
              type="text" 
              placeholder="Paste Image/PDF URL"
              className="w-full bg-slate-50 p-5 rounded-2xl font-black text-sm outline-none text-black border-2 border-transparent focus:border-black"
              value={formData.datesheetUrl}
              onChange={e => setFormData({...formData, datesheetUrl: e.target.value})}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[12px] font-black text-black uppercase tracking-widest ml-1 flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-black" /> <span>Syllabus Link</span>
            </label>
            <input 
              type="text" 
              placeholder="Paste Image/PDF URL"
              className="w-full bg-slate-50 p-5 rounded-2xl font-black text-sm outline-none text-black border-2 border-transparent focus:border-black"
              value={formData.syllabusUrl}
              onChange={e => setFormData({...formData, syllabusUrl: e.target.value})}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[12px] font-black text-black uppercase tracking-widest ml-1">Special Notes</label>
          <textarea 
            placeholder="Important instructions..." 
            rows={3}
            className="w-full bg-slate-50 p-5 rounded-2xl font-black text-sm outline-none text-black border-2 border-transparent focus:border-black resize-none"
            value={formData.note}
            onChange={e => setFormData({...formData, note: e.target.value})}
          />
        </div>

        <button 
          disabled={!canPublish || isSaving}
          onClick={() => onSave(formData)}
          className="w-full py-5.5 bg-black text-white font-black rounded-[2rem] shadow-2xl active:scale-95 transition-all text-[14px] uppercase tracking-widest flex items-center justify-center space-x-3 disabled:opacity-50"
        >
          {isSaving ? <RefreshCcw className="w-6 h-6 animate-spin" /> : <><span>{initialData ? 'Update Database' : 'Publish Now'}</span><Sparkles className="w-5 h-5 text-amber-400" /></>}
        </button>
      </div>
    </div>
  );
};

const DeleteConfirmationModal: React.FC<{
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
  examName: string;
}> = ({ isOpen, onCancel, onConfirm, isDeleting, examName }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onCancel} />
      <div className="relative w-full max-w-sm bg-white rounded-[3.5rem] p-10 border-4 border-black shadow-2xl text-center space-y-8 animate-in zoom-in duration-300">
        <div className="w-24 h-24 bg-rose-50 text-rose-600 rounded-[2.5rem] flex items-center justify-center mx-auto border-4 border-rose-100 animate-pulse">
           <AlertTriangle className="w-12 h-12" />
        </div>
        <div className="space-y-3">
          <h3 className="text-2xl font-black text-black leading-tight">Delete Exam?</h3>
          <p className="text-[12px] font-black text-slate-500 uppercase tracking-widest leading-relaxed">
            Removing <span className="text-black">"{examName}"</span> is irreversible. Cloud registry will be wiped.
          </p>
        </div>
        <div className="space-y-3">
           <button 
             onClick={onConfirm} 
             disabled={isDeleting}
             className="w-full py-5 bg-rose-600 text-white rounded-3xl font-black text-[13px] uppercase tracking-widest shadow-xl active:scale-95 transition-all flex items-center justify-center space-x-3"
           >
             {isDeleting ? <RefreshCcw className="w-5 h-5 animate-spin" /> : <span>Confirm Deletion</span>}
           </button>
           <button 
             onClick={onCancel}
             disabled={isDeleting}
             className="w-full py-4 text-[11px] font-black text-black uppercase tracking-[0.3em]"
           >
             Cancel Operation
           </button>
        </div>
      </div>
    </div>
  );
};

const ExamHub: React.FC<ExamHubProps> = ({ isOpen, onClose, currentUser, isAdmin }) => {
  const [examEvents, setExamEvents] = useState<ExamEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<ExamEvent | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showStatus, setShowStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const q = query(collection(db, 'exam_events'), orderBy('startDate', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allEvents = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ExamEvent));
      if (!isAdmin && currentUser?.role !== UserRole.TEACHER) {
        setExamEvents(allEvents.filter(ev => ev.targetClasses && ev.targetClasses.includes(currentUser?.class || '')));
      } else {
        setExamEvents(allEvents);
      }
      if (selectedEvent) {
        const updated = allEvents.find(e => e.id === selectedEvent.id);
        if (updated) setSelectedEvent(updated);
      }
    });
    return () => unsubscribe();
  }, [isOpen, isAdmin, currentUser, selectedEvent?.id]);

  if (!isOpen) return null;

  const triggerStatus = (msg: string) => {
    setShowStatus(msg);
    setTimeout(() => setShowStatus(null), 3000);
  };

  const handleSave = async (data: Omit<ExamEvent, 'id' | 'createdAt'>) => {
    setIsSaving(true);
    try {
      if (selectedEvent) {
        await updateDoc(doc(db, 'exam_events', selectedEvent.id), data);
        triggerStatus("Update Done!");
      } else {
        await addDoc(collection(db, 'exam_events'), {
          ...data,
          createdAt: new Date().toISOString()
        });
        triggerStatus("Published!");
      }
      setIsFormOpen(false);
    } catch (err) { alert("Cloud Sync Failed."); } finally { setIsSaving(false); }
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try { 
      await deleteDoc(doc(db, 'exam_events', deletingId)); 
      if (selectedEvent?.id === deletingId) setSelectedEvent(null);
      setDeletingId(null);
      triggerStatus("Deleted!");
    } catch (err) { alert("Failed to erase record."); } finally { setIsDeleting(false); }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#FDFDFF] flex flex-col animate-in slide-in-from-right duration-300">
      {/* Toast Status */}
      {showStatus && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] bg-black text-white px-8 py-4 rounded-3xl font-black text-[12px] uppercase tracking-widest shadow-2xl flex items-center space-x-3 animate-in slide-in-from-top duration-300">
           <CheckCircle2 className="w-5 h-5 text-emerald-400" />
           <span>{showStatus}</span>
        </div>
      )}

      <DeleteConfirmationModal 
        isOpen={!!deletingId} 
        examName={examEvents.find(e => e.id === deletingId)?.name || ''}
        onCancel={() => setDeletingId(null)}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
      />

      <header className="bg-white px-6 pt-10 pb-4 border-b-4 border-black flex flex-col space-y-4 sticky top-0 z-20 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {selectedEvent ? (
              <button onClick={() => setSelectedEvent(null)} className="p-2.5 bg-black text-white rounded-2xl active:scale-90 transition-transform">
                <ChevronLeft className="w-6 h-6" />
              </button>
            ) : (
              <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center shadow-xl">
                <Calendar className="w-6 h-6 text-white" />
              </div>
            )}
            <div>
              <h2 className="text-2xl font-black text-black leading-none tracking-tight lowercase first-letter:uppercase">
                {selectedEvent ? selectedEvent.name : 'Examination Hub'}
              </h2>
              <p className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.2em] mt-2">
                {selectedEvent ? 'Administrative Detail View' : 'Institution Academic Registry'}
              </p>
            </div>
          </div>
          {!selectedEvent && (
            <button onClick={onClose} className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-black active:scale-90 transition-transform border-2 border-slate-200">
              <X className="w-6 h-6" />
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6 pb-40 space-y-6">
        {!selectedEvent ? (
          <>
            {isAdmin && isFormOpen ? (
              <ExamForm onClose={() => setIsFormOpen(false)} onSave={handleSave} isSaving={isSaving} />
            ) : (
              <div className="space-y-6">
                {examEvents.length === 0 ? (
                  <div className="py-32 text-center flex flex-col items-center space-y-5">
                     <FileText className="w-20 h-20 text-slate-200" />
                     <p className="text-[14px] font-black uppercase tracking-widest text-slate-400">Registry Empty</p>
                  </div>
                ) : (
                  examEvents.map(event => (
                    <div 
                      key={event.id}
                      className="w-full bg-white p-8 rounded-[3rem] border-4 border-slate-100 shadow-xl relative overflow-hidden group text-left transition-all active:scale-[0.98] hover:border-black"
                      onClick={() => setSelectedEvent(event)}
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
                      <div className="flex justify-between items-start mb-6">
                         <div className="px-5 py-2 bg-emerald-600 text-white rounded-full text-[11px] font-black uppercase tracking-widest shadow-md">Date Announced</div>
                         {isAdmin && (
                           <button 
                             onClick={(e) => { e.stopPropagation(); setDeletingId(event.id); }}
                             className="p-3 bg-slate-50 rounded-2xl text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-all active:scale-90"
                           >
                             <Trash2 className="w-6 h-6" />
                           </button>
                         )}
                      </div>

                      <h3 className="text-3xl font-black text-black tracking-tight leading-tight mb-4 lowercase first-letter:uppercase">{event.name}</h3>
                      
                      <div className="flex flex-col space-y-3 mb-6">
                        <div className="flex items-center space-x-3 text-black">
                          <Clock className="w-5 h-5 text-slate-400" />
                          <p className="text-[16px] font-black">{event.startDate} — {event.endDate}</p>
                        </div>
                        <div className="flex items-center space-x-3 text-black">
                          <Layers className="w-5 h-5 text-slate-400" />
                          <p className="text-[14px] font-black uppercase text-indigo-600">Classes: {event.targetClasses?.join(', ')}</p>
                        </div>
                      </div>

                      <div className="pt-6 border-t-4 border-slate-50 flex items-center justify-between">
                         <div className="flex items-center space-x-3">
                            <Sparkles className="w-6 h-6 text-amber-500" />
                            <span className="text-[15px] font-black text-black uppercase tracking-tight">EXCELLENCE HUB</span>
                         </div>
                         <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center group-hover:translate-x-1 transition-transform shadow-xl">
                            <ChevronRight className="w-6 h-6 text-white" />
                         </div>
                      </div>
                    </div>
                  ))
                )}
                {isAdmin && (
                  <button 
                    onClick={() => { setSelectedEvent(null); setIsFormOpen(true); }}
                    className="w-full py-7 bg-black text-white rounded-[2rem] font-black text-[14px] uppercase tracking-[0.25em] shadow-2xl flex items-center justify-center space-x-4 active:scale-95 transition-all border-b-8 border-slate-900"
                  >
                    <Plus className="w-7 h-7" />
                    <span>Create New Exam</span>
                  </button>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="space-y-8 animate-in slide-in-from-bottom-6 duration-300 pb-20">
            {isAdmin && isFormOpen ? (
              <ExamForm onClose={() => setIsFormOpen(false)} onSave={handleSave} isSaving={isSaving} initialData={selectedEvent} />
            ) : (
              <>
                {/* Note Section */}
                <div className="bg-white p-8 rounded-[3rem] border-4 border-black shadow-xl space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 text-black">
                      <StickyNote className="w-6 h-6 text-indigo-600" />
                      <h4 className="text-xl font-black uppercase tracking-widest">Board Instructions</h4>
                    </div>
                    {isAdmin && (
                      <button onClick={() => setIsFormOpen(true)} className="p-3 bg-slate-900 text-white rounded-2xl active:scale-90 transition-transform shadow-lg">
                        <Edit3 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                  <p className="text-base font-black text-black leading-relaxed bg-slate-50 p-7 rounded-[2rem] border-2 border-slate-200">
                    {selectedEvent.note || 'Official instructions are being finalized. Please check back later.'}
                  </p>
                </div>

                {/* Main Content Links */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button 
                    onClick={() => selectedEvent.datesheetUrl ? window.open(selectedEvent.datesheetUrl, '_blank') : alert("URL Missing")}
                    className="w-full bg-black text-white p-8 rounded-[3rem] shadow-2xl flex items-center justify-between group active:scale-[0.98] transition-all border-b-8 border-slate-900"
                  >
                    <div className="flex items-center space-x-5">
                      <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                        <LayoutGrid className="w-7 h-7 text-white" />
                      </div>
                      <div className="text-left">
                        <p className="text-lg font-black uppercase tracking-wider">Datesheet</p>
                        <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Schedule</p>
                      </div>
                    </div>
                    <ExternalLink className="w-6 h-6 text-indigo-400" />
                  </button>

                  <button 
                    onClick={() => selectedEvent.syllabusUrl ? window.open(selectedEvent.syllabusUrl, '_blank') : alert("URL Missing")}
                    className="w-full bg-white text-black p-8 rounded-[3rem] shadow-xl flex items-center justify-between group active:scale-[0.98] transition-all border-4 border-black"
                  >
                    <div className="flex items-center space-x-5">
                      <div className="w-14 h-14 bg-black/5 rounded-2xl flex items-center justify-center">
                        <BookOpen className="w-7 h-7 text-black" />
                      </div>
                      <div className="text-left">
                        <p className="text-lg font-black uppercase tracking-wider">Syllabus</p>
                        <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Curriculum</p>
                      </div>
                    </div>
                    <ExternalLink className="w-6 h-6 text-black" />
                  </button>
                </div>

                {/* Admin Management Toolbar */}
                {isAdmin && (
                  <div className="p-8 bg-slate-50 rounded-[3rem] border-4 border-black space-y-6">
                    <div className="flex items-center space-x-3">
                       <Settings2 className="w-6 h-6 text-black" />
                       <h4 className="text-lg font-black text-black uppercase tracking-widest">Admin Control</h4>
                    </div>
                    <div className="flex flex-col space-y-3">
                       <button 
                         onClick={() => setIsFormOpen(true)}
                         className="w-full py-5 bg-indigo-600 text-white rounded-[1.75rem] font-black text-[12px] uppercase tracking-widest shadow-xl active:scale-95 transition-all flex items-center justify-center space-x-3"
                       >
                         <Edit3 className="w-5 h-5" />
                         <span>Modify Record</span>
                       </button>
                       <button 
                         onClick={() => setDeletingId(selectedEvent.id)}
                         className="w-full py-5 bg-white text-rose-600 rounded-[1.75rem] font-black text-[12px] uppercase tracking-widest border-4 border-rose-600 active:scale-95 transition-all flex items-center justify-center space-x-3"
                       >
                         <Trash2 className="w-5 h-5" />
                         <span>Wipe Registry</span>
                       </button>
                    </div>
                  </div>
                )}

                <div className="p-10 bg-emerald-50 rounded-[3.5rem] border-4 border-emerald-100 flex flex-col items-center text-center space-y-5">
                  <div className="relative">
                    <Trophy className="w-16 h-16 text-emerald-600 relative z-10" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-black text-emerald-900 uppercase tracking-tighter">Road to Success</h4>
                    <p className="text-[12px] font-black text-emerald-800 uppercase tracking-widest mt-2 leading-relaxed">
                      Preparation is the key to victory. <br/> Your efforts define your future.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </main>

      <footer className="p-8 bg-white border-t-4 border-black flex flex-col items-center space-y-4 sticky bottom-0 z-20">
         <div className="flex items-center space-x-3 text-black">
            <Trophy className="w-5 h-5 text-amber-500" />
            <span className="text-[14px] font-black uppercase tracking-[0.4em]">EXCELLENCE GATEWAY</span>
         </div>
         <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Oxford Model Sr. Sec. School • Gothwad Tech</p>
      </footer>
    </div>
  );
};

export default ExamHub;
