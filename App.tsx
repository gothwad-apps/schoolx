
import React, { useState, useEffect } from 'react';
import SplashScreen from './components/SplashScreen';
import RoleSelection from './components/RoleSelection';
import LoginScreen from './components/LoginScreen';
import AddTeacherModal from './components/AddTeacherModal';
import AddStudentModal from './components/AddStudentModal';
import NotificationHub from './components/NotificationHub';
import ExamHub from './components/ExamHub';
import DashboardOverview from './components/DashboardOverview';
import StaffManager from './components/StaffManager';
import ClassDrilldown from './components/ClassDrilldown';
import SettingsManager from './components/SettingsManager';
import AboutSchoolModal from './components/AboutSchoolModal';
import AboutDeveloperModal from './components/AboutDeveloperModal';
import { UserRole, AppState, AdminTab } from './types';
import { db } from './firebase';
import { collection, getDocs, doc, getDoc, updateDoc, setDoc, query, orderBy, where } from 'firebase/firestore';
import { 
  ShieldCheck, LogOut, LayoutDashboard, Bell, 
  Menu, Settings, Users, Wallet, 
  ClipboardCheck, BookMarked, School, X, Briefcase, Info, Code, Terminal, Calendar
} from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('LOADING');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>('OVERVIEW');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationHubOpen, setIsNotificationHubOpen] = useState(false);
  const [isExamHubOpen, setIsExamHubOpen] = useState(false);
  const [isAboutSchoolOpen, setIsAboutSchoolOpen] = useState(false);
  const [isAboutDeveloperOpen, setIsAboutDeveloperOpen] = useState(false);
  
  // Settings State
  const [schoolName, setSchoolName] = useState('');
  const [tempSchoolName, setTempSchoolName] = useState('');
  
  const [vision, setVision] = useState('');
  const [tempVision, setTempVision] = useState('');
  const [location, setLocation] = useState('');
  const [tempLocation, setTempLocation] = useState('');
  const [contact, setContact] = useState('');
  const [tempContact, setTempContact] = useState('');
  const [email, setEmail] = useState('');
  const [tempEmail, setTempEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [tempWebsite, setTempWebsite] = useState('');

  const [juniorMaxClass, setJuniorMaxClass] = useState(5);
  const [tempJuniorMax, setTempJuniorMax] = useState(5);
  const [classConfigs, setClassConfigs] = useState<Record<string, number>>({});
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Module Navigation State (Persistent per tab)
  const [selClass, setSelClass] = useState<Record<string, string | null>>({ STUDENTS: null, HOMEWORK: null, ATTENDANCE: null, FINANCE: null });
  const [selSec, setSelSec] = useState<Record<string, string | null>>({ STUDENTS: null, HOMEWORK: null, ATTENDANCE: null, FINANCE: null });
  const [selStaffCategory, setSelStaffCategory] = useState<'JUNIOR' | 'SENIOR' | 'BOTH' | null>(null);

  // Data State
  const [teachers, setTeachers] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [classTeacher, setClassTeacher] = useState<any>(null);
  const [coClassTeacher, setCoClassTeacher] = useState<any>(null);
  const [isAddTeacherModalOpen, setIsAddTeacherModalOpen] = useState(false);
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settingsDoc = await getDoc(doc(db, 'config', 'school_settings'));
        if (settingsDoc.exists()) {
          const data = settingsDoc.data();
          setSchoolName(data.schoolName || '');
          setTempSchoolName(data.schoolName || '');
          setVision(data.vision || '');
          setTempVision(data.vision || '');
          setLocation(data.location || '');
          setTempLocation(data.location || '');
          setContact(data.contact || '');
          setTempContact(data.contact || '');
          setEmail(data.email || '');
          setTempEmail(data.email || '');
          setWebsite(data.website || '');
          setTempWebsite(data.website || '');

          setJuniorMaxClass(data.juniorMaxClass || 5);
          setTempJuniorMax(data.juniorMaxClass || 5);
          setClassConfigs(data.classConfigs || {});
        } else {
          const defaultConfigs: Record<string, number> = {};
          for(let i=1; i<=12; i++) defaultConfigs[i] = 1;
          const defaultData = { 
            schoolName: '', 
            vision: '', 
            location: '', 
            contact: '', 
            email: '', 
            website: '',
            juniorMaxClass: 5, 
            classConfigs: defaultConfigs 
          };
          await setDoc(doc(db, 'config', 'school_settings'), defaultData);
          setClassConfigs(defaultConfigs);
        }
      } catch (err) {
        console.error("Cloud connection issue.", err);
        setSchoolName('OFFLINE');
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    const currentClass = selClass[activeTab];
    const currentSec = selSec[activeTab];

    if (appState === 'DASHBOARD') {
      if (activeTab === 'TEACHERS') {
        fetchTeachers();
      }
      if (currentClass && currentSec) {
        refreshSectionData(currentClass, currentSec);
      }
    }
  }, [appState, activeTab, currentUser, selClass, selSec, selStaffCategory]);

  const refreshSectionData = (cls: string, sec: string) => {
    if (activeTab === 'STUDENTS' || activeTab === 'FINANCE') fetchStudentsForSection(cls, sec);
    fetchTeachersForSection(cls, sec);
  };

  const fetchTeachers = async () => {
    try {
      const q = query(collection(db, 'teachers'), orderBy('name', 'asc'));
      const snapshot = await getDocs(q);
      setTeachers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) { console.error(err); }
  };

  const fetchStudentsForSection = async (cls: string, sec: string) => {
    try {
      const q = query(collection(db, 'students'), where('class', '==', cls), where('section', '==', sec));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      data.sort((a: any, b: any) => (parseInt(a.rollNo) || 0) - (parseInt(b.rollNo) || 0));
      setStudents(data);
    } catch (err) { console.error(err); }
  };

  const fetchTeachersForSection = async (cls: string, sec: string) => {
    try {
      const q = query(collection(db, 'teachers'), where('assignedClass', '==', cls), where('section', '==', sec));
      const snapshot = await getDocs(q);
      const list = snapshot.docs.map(doc => doc.data());
      setClassTeacher(list.find(t => t.teacherRole === 'CLASS_TEACHER') || null);
      setCoClassTeacher(list.find(t => t.teacherRole === 'CO_CLASS_TEACHER') || null);
    } catch (err) { console.error(err); }
  };

  const updateSchoolSettings = async () => {
    if (!tempSchoolName.trim()) return alert("Enter School Name");
    setIsSavingSettings(true);
    try {
      await updateDoc(doc(db, 'config', 'school_settings'), { 
        schoolName: tempSchoolName.trim(), 
        vision: tempVision.trim(),
        location: tempLocation.trim(),
        contact: tempContact.trim(),
        email: tempEmail.trim(),
        website: tempWebsite.trim(),
        juniorMaxClass: tempJuniorMax, 
        classConfigs 
      });
      setSchoolName(tempSchoolName.trim());
      setVision(tempVision.trim());
      setLocation(tempLocation.trim());
      setContact(tempContact.trim());
      setEmail(tempEmail.trim());
      setWebsite(tempWebsite.trim());
      setJuniorMaxClass(tempJuniorMax);
      
      alert("Cloud Sync Successful!");
      setActiveTab('OVERVIEW');
    } catch (err) { alert("Sync Failed."); } finally { setIsSavingSettings(false); }
  };

  const handleLogout = () => {
    setAppState('ROLE_SELECTION');
    setSelectedRole(null);
    setCurrentUser(null);
    setIsSidebarOpen(false);
  };

  const renderDashboardContent = () => {
    const currentClass = selClass[activeTab];
    const currentSec = selSec[activeTab];

    switch (activeTab) {
      case 'OVERVIEW':
        return <DashboardOverview schoolName={schoolName} teachersCount={teachers.length} />;
      case 'TEACHERS':
        return (
          <StaffManager 
            juniorMaxClass={juniorMaxClass}
            currentUser={currentUser}
            teachers={teachers}
            selStaffCategory={selStaffCategory}
            setSelStaffCategory={setSelStaffCategory}
            onAddTeacher={() => setIsAddTeacherModalOpen(true)}
          />
        );
      case 'STUDENTS':
        return (
          <ClassDrilldown 
            module="STUDENTS" icon={Users} colorClass="text-indigo-600" bgClass="bg-indigo-50" gradClass="bg-gradient-to-br from-indigo-500 to-indigo-700"
            selClass={selClass['STUDENTS']} setSelClass={(cls) => setSelClass(prev => ({...prev, STUDENTS: cls}))}
            selSec={selSec['STUDENTS']} setSelSec={(sec) => setSelSec(prev => ({...prev, STUDENTS: sec}))}
            classConfigs={classConfigs} classTeacher={classTeacher} coClassTeacher={coClassTeacher} students={students}
            currentUser={currentUser} onRefresh={() => currentClass && currentSec && refreshSectionData(currentClass, currentSec)}
          />
        );
      case 'HOMEWORK':
        return (
          <ClassDrilldown 
            module="HOMEWORK" icon={BookMarked} colorClass="text-purple-600" bgClass="bg-purple-50" gradClass="bg-gradient-to-br from-purple-500 to-purple-700"
            selClass={selClass['HOMEWORK']} setSelClass={(cls) => setSelClass(prev => ({...prev, HOMEWORK: cls}))}
            selSec={selSec['HOMEWORK']} setSelSec={(sec) => setSelSec(prev => ({...prev, HOMEWORK: sec}))}
            classConfigs={classConfigs} classTeacher={classTeacher} coClassTeacher={coClassTeacher} students={students}
            currentUser={currentUser} onRefresh={() => currentClass && currentSec && refreshSectionData(currentClass, currentSec)}
          />
        );
      case 'ATTENDANCE':
        return (
          <ClassDrilldown 
            module="ATTENDANCE" icon={ClipboardCheck} colorClass="text-emerald-600" bgClass="bg-emerald-50" gradClass="bg-gradient-to-br from-emerald-500 to-emerald-700"
            selClass={selClass['ATTENDANCE']} setSelClass={(cls) => setSelClass(prev => ({...prev, ATTENDANCE: cls}))}
            selSec={selSec['ATTENDANCE']} setSelSec={(sec) => setSelSec(prev => ({...prev, ATTENDANCE: sec}))}
            classConfigs={classConfigs} classTeacher={classTeacher} coClassTeacher={coClassTeacher} students={students}
            currentUser={currentUser} onRefresh={() => currentClass && currentSec && refreshSectionData(currentClass, currentSec)}
          />
        );
      case 'FINANCE':
        return (
          <ClassDrilldown 
            module="FINANCE" icon={Wallet} colorClass="text-amber-600" bgClass="bg-amber-50" gradClass="bg-gradient-to-br from-amber-500 to-amber-700"
            selClass={selClass['FINANCE']} setSelClass={(cls) => setSelClass(prev => ({...prev, FINANCE: cls}))}
            selSec={selSec['FINANCE']} setSelSec={(sec) => setSelSec(prev => ({...prev, FINANCE: sec}))}
            classConfigs={classConfigs} classTeacher={classTeacher} coClassTeacher={coClassTeacher} students={students}
            currentUser={currentUser} onRefresh={() => currentClass && currentSec && refreshSectionData(currentClass, currentSec)}
          />
        );
      case 'SETTINGS':
        return (
          <SettingsManager 
            tempSchoolName={tempSchoolName} setTempSchoolName={setTempSchoolName}
            tempVision={tempVision} setTempVision={setTempVision}
            tempLocation={tempLocation} setTempLocation={setTempLocation}
            tempContact={tempContact} setTempContact={setTempContact}
            tempEmail={tempEmail} setTempEmail={setTempEmail}
            tempWebsite={tempWebsite} setTempWebsite={setTempWebsite}
            tempJuniorMaxClass={juniorMaxClass} setTempJuniorMaxClass={setJuniorMaxClass}
            tempJuniorMax={tempJuniorMax} setTempJuniorMax={setTempJuniorMax}
            classConfigs={classConfigs} setClassConfigs={setClassConfigs}
            onSave={updateSchoolSettings} isSaving={isSavingSettings}
          />
        );
      default: return null;
    }
  };

  const handleLoadingFinish = () => setAppState('ROLE_SELECTION');
  const handleRoleSelect = (role: UserRole) => { setSelectedRole(role); setAppState('LOGIN'); };
  const handleLoginSuccess = (userData: any) => { setCurrentUser(userData); setAppState('DASHBOARD'); };

  if (appState === 'LOADING') return <SplashScreen onFinish={handleLoadingFinish} schoolName={schoolName} />;
  if (appState === 'ROLE_SELECTION') return <RoleSelection onSelectRole={handleRoleSelect} schoolName={schoolName} />;
  if (appState === 'LOGIN' && selectedRole) return <LoginScreen role={selectedRole} onBack={() => setAppState('ROLE_SELECTION')} onLoginSuccess={handleLoginSuccess} schoolName={schoolName} />;

  return (
    <div className="min-h-[100dvh] bg-slate-50 flex flex-col font-sans selection:bg-indigo-100 antialiased overflow-x-hidden">
      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
          <div className="relative w-[280px] bg-white h-full shadow-2xl animate-in slide-in-from-left duration-300 flex flex-col">
            <div className="p-8 border-b border-slate-100 flex items-center space-x-4">
              <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg"><School className="w-6 h-6 text-white" /></div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest truncate">{schoolName || 'LOADING..'}</p>
                <p className="text-xs font-black text-slate-900 mt-0.5">Cloud System v3.1</p>
              </div>
            </div>
            <div className="flex-1 p-6 space-y-2">
              <button onClick={() => { setActiveTab('OVERVIEW'); setIsSidebarOpen(false); }} className={`w-full flex items-center space-x-4 p-4 rounded-2xl font-black text-sm transition-all ${activeTab === 'OVERVIEW' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 active:bg-slate-50'}`}><LayoutDashboard className="w-5 h-5" /><span>Overview</span></button>
              <button onClick={() => { setActiveTab('SETTINGS'); setIsSidebarOpen(false); }} className={`w-full flex items-center space-x-4 p-4 rounded-2xl font-black text-sm transition-all ${activeTab === 'SETTINGS' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 active:bg-slate-50'}`}><Settings className="w-5 h-5" /><span>Settings</span></button>
              
              <div className="pt-4 pb-2 px-4"><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Discovery</p></div>
              <button onClick={() => { setIsAboutSchoolOpen(true); setIsSidebarOpen(false); }} className="w-full flex items-center space-x-4 p-4 rounded-2xl font-black text-sm text-slate-600 active:bg-slate-50 transition-all"><Info className="w-5 h-5 text-indigo-500" /><span>About School</span></button>
              <button onClick={() => { setIsAboutDeveloperOpen(true); setIsSidebarOpen(false); }} className="w-full flex items-center space-x-4 p-4 rounded-2xl font-black text-sm text-slate-600 active:bg-slate-50 transition-all"><Terminal className="w-5 h-5 text-indigo-500" /><span>About Developer</span></button>
            </div>
            <div className="p-6 border-t border-slate-100">
              <button onClick={handleLogout} className="w-full flex items-center space-x-4 p-4 rounded-2xl font-black text-sm text-rose-600 bg-rose-50 active:scale-95 transition-transform"><LogOut className="w-5 h-5" /><span>Sign Out</span></button>
            </div>
          </div>
        </div>
      )}

      {/* Modals & Screens */}
      <NotificationHub 
        isOpen={isNotificationHubOpen} 
        onClose={() => setIsNotificationHubOpen(false)} 
        isAdmin={currentUser?.role === UserRole.ADMIN} 
        currentUserRole={currentUser?.role || null}
        currentUserName={currentUser?.name || currentUser?.email || 'Administrator'}
      />
      <ExamHub
        isOpen={isExamHubOpen}
        onClose={() => setIsExamHubOpen(false)}
        currentUser={currentUser}
        isAdmin={currentUser?.role === UserRole.ADMIN}
      />
      <AboutSchoolModal 
        isOpen={isAboutSchoolOpen} 
        onClose={() => setIsAboutSchoolOpen(false)} 
        schoolName={schoolName}
        vision={vision}
        location={location}
        contact={contact}
        email={email}
        website={website}
      />
      <AboutDeveloperModal isOpen={isAboutDeveloperOpen} onClose={() => setIsAboutDeveloperOpen(false)} />
      
      <AddTeacherModal isOpen={isAddTeacherModalOpen} onClose={() => setIsAddTeacherModalOpen(false)} onSuccess={fetchTeachers} />
      <AddStudentModal isOpen={isAddStudentModalOpen} onClose={() => setIsAddStudentModalOpen(false)} onSuccess={() => {
        const c = selClass['STUDENTS']; const s = selSec['STUDENTS'];
        if (c && s) fetchStudentsForSection(c, s);
      }} />

      {/* Header */}
      <header className="bg-white/90 backdrop-blur-xl px-6 pt-9 pb-4 border-b border-slate-100 flex items-center justify-between sticky top-0 z-40">
        <button onClick={() => setIsSidebarOpen(true)} className="w-11 h-11 bg-slate-50 text-slate-900 rounded-2xl flex items-center justify-center active:scale-90 transition-transform shadow-sm">
          <Menu className="w-6 h-6" />
        </button>
        <div className="text-center px-4 flex-1 min-w-0">
          <h2 className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.25em] leading-none truncate w-full">{schoolName || 'SCHOOL NAME LOADING..'}</h2>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Institutional Cloud</p>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={() => setIsExamHubOpen(true)} className="w-11 h-11 bg-slate-50 text-slate-900 rounded-2xl flex items-center justify-center shadow-sm active:scale-90 transition-transform">
            <Calendar className="w-5 h-5 text-indigo-600" />
          </button>
          <button onClick={() => setIsNotificationHubOpen(true)} className="w-11 h-11 bg-slate-50 text-slate-900 rounded-2xl flex items-center justify-center relative shadow-sm active:scale-90 transition-transform">
            <Bell className="w-5 h-5" />
            <div className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></div>
          </button>
        </div>
      </header>

      <main className="flex-1 px-6 py-7 pb-32 overflow-y-auto">{renderDashboardContent()}</main>

      {/* Navigation */}
      <nav className="fixed bottom-6 left-4 right-4 z-40">
        <div className="bg-slate-900/95 backdrop-blur-2xl rounded-[2.75rem] p-2.5 px-3.5 flex items-center justify-between shadow-2xl border border-white/5">
          {[
            { id: 'OVERVIEW', icon: LayoutDashboard, label: 'Home' },
            { id: 'TEACHERS', icon: Briefcase, label: 'Staff' },
            { id: 'STUDENTS', icon: Users, label: 'Class' },
            { id: 'HOMEWORK', icon: BookMarked, label: 'Work' },
            { id: 'ATTENDANCE', icon: ClipboardCheck, label: 'Attend' },
            { id: 'FINANCE', icon: Wallet, label: 'Fees' }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button 
                key={tab.id} 
                onClick={() => {
                  setActiveTab(tab.id as AdminTab);
                }} 
                className={`relative flex flex-col items-center justify-center p-2.5 rounded-[1.75rem] transition-all duration-300 ${isActive ? 'scale-110 flex-grow bg-white/10' : 'opacity-40 grayscale scale-100 w-12'}`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-200'}`} />
                <span className={`text-[7px] font-black uppercase tracking-tighter mt-1 ${isActive ? 'text-white' : 'text-slate-200'}`}>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default App;
