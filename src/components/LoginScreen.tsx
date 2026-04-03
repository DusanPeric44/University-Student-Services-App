import { UserRole } from '../App';
import { GraduationCap, UserCircle, BookOpen, Shield } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (role: UserRole) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <GraduationCap className="w-16 h-16 text-blue-600" />
          </div>
          <h1 className="text-blue-900 mb-2">University Student Services</h1>
          <p className="text-gray-600">Select your role to access the portal</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Student Login */}
          <button
            onClick={() => onLogin('student')}
            className="group bg-white border-2 border-blue-200 rounded-xl p-8 hover:border-blue-500 hover:shadow-xl transition-all duration-300 flex flex-col items-center gap-4"
          >
            <div className="bg-blue-100 p-4 rounded-full group-hover:bg-blue-500 transition-colors duration-300">
              <UserCircle className="w-12 h-12 text-blue-600 group-hover:text-white transition-colors duration-300" />
            </div>
            <div className="text-center">
              <h3 className="text-gray-900 mb-2">Student</h3>
              <p className="text-sm text-gray-600">
                Access courses, exams, and grades
              </p>
            </div>
          </button>

          {/* Professor Login */}
          <button
            onClick={() => onLogin('professor')}
            className="group bg-white border-2 border-green-200 rounded-xl p-8 hover:border-green-500 hover:shadow-xl transition-all duration-300 flex flex-col items-center gap-4"
          >
            <div className="bg-green-100 p-4 rounded-full group-hover:bg-green-500 transition-colors duration-300">
              <BookOpen className="w-12 h-12 text-green-600 group-hover:text-white transition-colors duration-300" />
            </div>
            <div className="text-center">
              <h3 className="text-gray-900 mb-2">Professor</h3>
              <p className="text-sm text-gray-600">
                Manage schedules, grades, and attendance
              </p>
            </div>
          </button>

          {/* Admin Login */}
          <button
            onClick={() => onLogin('admin')}
            className="group bg-white border-2 border-purple-200 rounded-xl p-8 hover:border-purple-500 hover:shadow-xl transition-all duration-300 flex flex-col items-center gap-4"
          >
            <div className="bg-purple-100 p-4 rounded-full group-hover:bg-purple-500 transition-colors duration-300">
              <Shield className="w-12 h-12 text-purple-600 group-hover:text-white transition-colors duration-300" />
            </div>
            <div className="text-center">
              <h3 className="text-gray-900 mb-2">Administrator</h3>
              <p className="text-sm text-gray-600">
                System management and reporting
              </p>
            </div>
          </button>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Click on any role to view the prototype interface</p>
        </div>
      </div>
    </div>
  );
}
