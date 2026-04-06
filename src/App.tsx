import { useEffect, useState } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { LoginUser } from './components/LoginUser';
import { StudentDashboard } from './components/student/StudentDashboard';
import { StudentProfile } from './components/student/StudentProfile';
import { StudentExamApplication } from './components/student/StudentExamApplication';
import { StudentAnnouncements } from './components/student/StudentAnnouncements';
import { StudentCalendar } from './components/student/StudentCalendar';
import { ProfessorDashboard } from './components/professor/ProfessorDashboard';
import { ProfessorSchedule } from './components/professor/ProfessorSchedule';
import { ProfessorAttendance } from './components/professor/ProfessorAttendance';
import { ProfessorGrades } from './components/professor/ProfessorGrades';
import { ProfessorAnnouncements } from './components/professor/ProfessorAnnouncements';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminUserManagement } from './components/admin/AdminUserManagement';
import { AdminCourseManagement } from './components/admin/AdminCourseManagement';
import { AdminReports } from './components/admin/AdminReports';
import { AdminRoleManagement } from './components/admin/AdminRoleManagement';
import { Layout } from './components/Layout';
import { Toaster } from 'sonner';
import { STORAGE_KEYS, User, storage, INITIAL_DATA } from './lib/storage';

export type UserRole = 'student' | 'professor' | 'admin' | null;

export default function App() {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState('dashboard');

  const handleLogin = (role: UserRole) => {
    setUserRole(role);
    setCurrentPage('login-user');
  };

  const handleLoginUser = (user: User) => {
    setCurrentUser(user);
    storage.set(STORAGE_KEYS.CURRENT_USER, user);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setUserRole(null);
    setCurrentUser(null);
    storage.set(STORAGE_KEYS.CURRENT_USER, null as any);
    setCurrentPage('dashboard');
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    const users = storage.get<User[]>(STORAGE_KEYS.USERS, INITIAL_DATA.USERS);
    if (!users.some(u => u.role === 'admin')) {
      const adminUser: User = {
        id: Date.now(),
        name: 'Administrator',
        email: 'admin@university.local',
        role: 'admin',
        status: 'active',
        joinDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        department: 'Administration',
      };
      storage.set(STORAGE_KEYS.USERS, [...users, adminUser]);
    }
    const saved = storage.get<User | null>(STORAGE_KEYS.CURRENT_USER, null);
    if (saved) {
      setCurrentUser(saved);
      setUserRole(saved.role as UserRole);
    }
  }, []);

  if (!userRole) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  if (userRole && !currentUser && currentPage === 'login-user') {
    return <LoginUser role={userRole as any} onBack={() => setUserRole(null)} onLogin={handleLoginUser} />;
  }

  const renderContent = () => {
    // Student Routes
    if (userRole === 'student') {
      switch (currentPage) {
        case 'dashboard':
          return <StudentDashboard />;
        case 'profile':
          return <StudentProfile />;
        case 'apply-exams':
          return <StudentExamApplication />;
        case 'announcements':
          return <StudentAnnouncements />;
        case 'calendar':
          return <StudentCalendar />;
        default:
          return <StudentDashboard />;
      }
    }

    // Professor Routes
    if (userRole === 'professor') {
      switch (currentPage) {
        case 'dashboard':
          return <ProfessorDashboard />;
        case 'schedule':
          return <ProfessorSchedule />;
        case 'attendance':
          return <ProfessorAttendance />;
        case 'grades':
          return <ProfessorGrades />;
        case 'announcements':
          return <ProfessorAnnouncements />;
        default:
          return <ProfessorDashboard />;
      }
    }

    // Admin Routes
    if (userRole === 'admin') {
      switch (currentPage) {
        case 'dashboard':
          return <AdminDashboard />;
        case 'users':
          return <AdminUserManagement />;
        case 'courses':
          return <AdminCourseManagement />;
        case 'reports':
          return <AdminReports />;
        case 'roles':
          return <AdminRoleManagement />;
        default:
          return <AdminDashboard />;
      }
    }

    return null;
  };

  return (
    <>
      <Toaster position="top-right" richColors />
      <Layout
        userRole={userRole}
        currentUser={currentUser}
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      >
        {renderContent()}
      </Layout>
    </>
  );
}
