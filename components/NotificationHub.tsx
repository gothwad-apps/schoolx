
import React, { useState, useEffect } from 'react';
import { Bell, X, Plus, Clock, MessageSquareQuote, Send, Inbox, User, Users } from 'lucide-react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { Notification, UserRole } from '../types';
import CreateNotificationModal from './CreateNotificationModal';

interface NotificationHubProps {
  isOpen: boolean;
  onClose: () => void;
  isAdmin: boolean;
  currentUserRole: UserRole | null;
  currentUserName?: string;
}

const NotificationHub: React.FC<NotificationHubProps> = ({ isOpen, onClose, isAdmin, currentUserRole, currentUserName }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState<'SENT' | 'RECEIVED'>('SENT');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const q = query(collection(db, 'notifications'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setNotifications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification)));
    });
    return () => unsubscribe();
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === 'SENT') {
      return isAdmin; // Only admins see all history
    }
    return currentUserRole && n.targets.includes(currentUserRole);
  });

  return (
    <div className="fixed inset-0 z-[70] flex flex-col bg-slate-50 animate-in slide-in-from-right duration-300">
      <header className="bg-white px-6 pt-10 pb-4 border-b border-slate-100 flex flex-col space-y-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 leading-none">Bulletin Hub</h2>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Institutional Comms</p>
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 active:scale-90 transition-transform">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center">
          <button 
            onClick={() => setActiveTab('SENT')}
            className={`flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-[0.85rem] font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'SENT' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>History</span>
          </button>
          <button 
            onClick={() => setActiveTab('RECEIVED')}
            className={`flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-[0.85rem] font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'RECEIVED' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}
          >
            <Inbox className="w-3.5 h-3.5" />
            <span>Inbox</span>
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6 space-y-4 pb-32">
        {filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center opacity-30 grayscale">
            <MessageSquareQuote className="w-16 h-16 mb-4" />
            <p className="text-xs font-black uppercase tracking-widest">
              {activeTab === 'RECEIVED' ? 'No incoming alerts' : 'No history found'}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <div key={notif.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <User className="w-3.5 h-3.5 text-indigo-500" />
                    <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{notif.senderName}</span>
                  </div>
                  <h3 className="text-base font-black text-slate-900 leading-tight">{notif.subject}</h3>
                </div>
                <div className="flex -space-x-1.5">
                  {notif.targets.map((target, idx) => (
                    <div key={idx} className={`w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-[8px] font-black text-white shadow-sm ${
                      target === 'TEACHER' ? 'bg-orange-500' : target === 'STUDENT' ? 'bg-blue-500' : 'bg-emerald-500'
                    }`}>
                      {target[0]}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-xs text-slate-700 font-medium leading-relaxed">{notif.content}</p>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center space-x-2 text-slate-400">
                  <Clock className="w-3 h-3" />
                  <span className="text-[9px] font-bold uppercase tracking-tighter">
                    {new Date(notif.createdAt).toLocaleDateString()} at {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                {activeTab === 'SENT' && (
                  <div className="flex items-center space-x-1 text-slate-300">
                    <Users className="w-3 h-3" />
                    <span className="text-[8px] font-black uppercase tracking-widest">Audience: {notif.targets.length}</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </main>

      {isAdmin && (
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="fixed bottom-10 right-8 w-16 h-16 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-2xl active:scale-90 transition-transform z-20"
        >
          <Plus className="w-8 h-8" />
        </button>
      )}

      <CreateNotificationModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)}
        senderName={currentUserName || 'System Admin'}
      />
    </div>
  );
};

export default NotificationHub;
