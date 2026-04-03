import { ReactNode } from "react";
import { UserRole } from "../App";
import {
  LayoutDashboard,
  UserCircle,
  FileText,
  Calendar,
  Bell,
  BookOpen,
  Users,
  ClipboardList,
  Award,
  Settings,
  BarChart3,
  LogOut,
  Menu,
  X,
  GraduationCap,
  RotateCcw,
} from "lucide-react";
import { useState } from "react";
import { storage } from "../lib/storage";

interface LayoutProps {
  children: ReactNode;
  userRole: UserRole;
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export function Layout({
  children,
  userRole,
  currentPage,
  onNavigate,
  onLogout,
}: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] =
    useState(false);

  const handleReset = () => {
    if (confirm("Are you sure you want to reset all data? This will clear all your changes.")) {
      storage.clearAll();
    }
  };

  const navigationItems = {
    student: [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
      },
      {
        id: "announcements",
        label: "Announcements",
        icon: Bell,
      },
      {
        id: "apply-exams",
        label: "Apply for Exams",
        icon: FileText,
      },
      {
        id: "calendar",
        label: "University Calendar",
        icon: Calendar,
      },
      { id: "profile", label: "Profile", icon: UserCircle },
    ],
    professor: [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
      },
      {
        id: "schedule",
        label: "Schedule Management",
        icon: Calendar,
      },
      {
        id: "attendance",
        label: "Track Attendance",
        icon: ClipboardList,
      },
      { id: "grades", label: "Enter Grades", icon: Award },
      {
        id: "announcements",
        label: "Announcements",
        icon: Bell,
      },
    ],
    admin: [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
      },
      { id: "users", label: "User Management", icon: Users },
      {
        id: "courses",
        label: "Course Management",
        icon: BookOpen,
      },
      { id: "roles", label: "Role Management", icon: Settings },
      {
        id: "reports",
        label: "Reports & Statistics",
        icon: BarChart3,
      },
    ],
  };

  const roleColors = {
    student: "blue",
    professor: "green",
    admin: "purple",
  };

  const color = userRole ? roleColors[userRole] : "blue";
  const navItems = userRole ? navigationItems[userRole] : [];

  const roleLabels = {
    student: "Student Portal",
    professor: "Professor Portal",
    admin: "Administrator Portal",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <header
        className={`bg-${color}-600 text-white shadow-lg sticky top-0 z-40`}
      >
        <div className="px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                setIsMobileMenuOpen(!isMobileMenuOpen)
              }
              className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
            <GraduationCap className="w-8 h-8" />
            <div>
              <h2 className="text-white">UniManager</h2>
              <p className="text-xs opacity-90">
                {userRole ? roleLabels[userRole] : ""}
              </p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <aside
          className={`
            ${color === "blue" ? "bg-blue-700" : ""}
            ${color === "green" ? "bg-green-700" : ""}
            ${color === "purple" ? "bg-purple-700" : ""}
            text-white w-64 min-h-[calc(100vh-73px)] 
            fixed lg:sticky top-[73px] left-0 
            transition-transform duration-300 z-30
            ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          `}
        >
          <nav className="p-4">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        onNavigate(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`
                        w-full flex items-center gap-3 px-4 py-3 rounded-lg
                        transition-all duration-200
                        ${isActive
                          ? "bg-white text-" +
                          color +
                          "-700 shadow-lg"
                          : "hover:bg-white/10"
                        }
                      `}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="overflow-hidden whitespace-nowrap text-ellipsis">{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* Persistence Reset Button */}
            <div className="mt-8 pt-8 border-t border-white/20">
              <button
                onClick={handleReset}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-all text-white/80 hover:text-white"
                title="Reset local storage to initial data"
              >
                <RotateCcw className="w-5 h-5" />
                <span>Reset Application Data</span>
              </button>
            </div>
          </nav>
        </aside>

        {/* Mobile Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}