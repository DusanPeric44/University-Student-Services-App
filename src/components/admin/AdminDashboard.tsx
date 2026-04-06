import { Card } from '../shared/Card';
import {
  Users,
  BookOpen,
  GraduationCap,
  TrendingUp,
  UserCheck,
  AlertCircle,
} from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useMemo } from 'react';
import { usePersistence } from '../../hooks/usePersistence';
import { STORAGE_KEYS, INITIAL_DATA, User, Course, Announcement, Exam, StudentGrade } from '../../lib/storage';

export function AdminDashboard() {
  const [users] = usePersistence<User[]>(STORAGE_KEYS.USERS, INITIAL_DATA.USERS);
  const [courses] = usePersistence<Course[]>(STORAGE_KEYS.COURSES, INITIAL_DATA.COURSES);
  const [announcements] = usePersistence<Announcement[]>(STORAGE_KEYS.ANNOUNCEMENTS, INITIAL_DATA.ANNOUNCEMENTS);
  const [exams] = usePersistence<Exam[]>(STORAGE_KEYS.EXAMS, INITIAL_DATA.EXAMS);
  const [grades] = usePersistence<StudentGrade[]>(STORAGE_KEYS.GRADES, INITIAL_DATA.GRADES);
  const [applications] = usePersistence<Exam[]>(STORAGE_KEYS.STUDENT_APPLICATIONS, INITIAL_DATA.STUDENT_APPLICATIONS);

  const totalStudents = useMemo(() => users.filter(u => u.role === 'student').length, [users]);
  const activeCourses = useMemo(() => courses.filter(c => c.status === 'active').length, [courses]);
  const activeFaculty = useMemo(() => users.filter(u => u.role === 'professor' && u.status === 'active').length, [users]);

  const enrollmentData = useMemo(() => {
    const map = new Map<string, number>();
    users.filter(u => u.role === 'student').forEach(u => {
      const d = new Date(u.joinDate);
      const key = isNaN(d.getTime()) ? 'Unknown' : `${d.toLocaleString('en-US', { month: 'short' })} ${d.getFullYear()}`;
      map.set(key, (map.get(key) || 0) + 1);
    });
    return Array.from(map.entries())
      .map(([month, students]) => ({ month, students }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6);
  }, [users]);

  const courseEnrollmentData = useMemo(() => {
    const map = new Map<string, number>();
    courses.forEach(c => {
      map.set(c.department, (map.get(c.department) || 0) + 1);
    });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [courses]);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const performanceData = useMemo(() => {
    const byCourse = new Map<string, { sum: number; count: number }>();
    grades.filter(g => g.average !== null).forEach(g => {
      const key = g.courseId;
      const entry = byCourse.get(key) || { sum: 0, count: 0 };
      entry.sum += g.average as number;
      entry.count += 1;
      byCourse.set(key, entry);
    });
    return Array.from(byCourse.entries()).map(([courseId, { sum, count }]) => ({
      semester: courseId,
      average: Math.round(sum / count),
    }));
  }, [grades]);

  const recentActivities = useMemo(() => {
    const items: { action: string; user: string; time: string }[] = [];
    const lastUsers = [...users].slice(-2);
    const lastCourses = [...courses].slice(-2);
    const lastAnnouncements = [...announcements].slice(-2);
    const lastExams = [...exams].slice(-1);
    lastUsers.forEach(u => items.push({ action: 'New user added', user: `${u.name} (${u.role})`, time: u.joinDate }));
    lastCourses.forEach(c => items.push({ action: 'Course added/updated', user: c.professor || '—', time: c.semester }));
    lastAnnouncements.forEach(a => items.push({ action: 'Announcement posted', user: a.author || '—', time: a.date }));
    lastExams.forEach(e => items.push({ action: 'Exam scheduled', user: e.professor || '—', time: e.date }));
    return items.slice(-5);
  }, [users, courses, announcements, exams]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-gray-900 mb-2">Administrator Dashboard</h1>
        <p className="text-gray-600">System overview and key metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Students</p>
              <p className="text-gray-900">{totalStudents}</p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-600">Current</span>
              </div>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <GraduationCap className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Active Courses</p>
              <p className="text-gray-900">{activeCourses}</p>
              <p className="text-sm text-gray-500 mt-2">Current Semester</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <BookOpen className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Faculty Members</p>
              <p className="text-gray-900">{activeFaculty}</p>
              <p className="text-sm text-gray-500 mt-2">Active professors</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <UserCheck className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">System Health</p>
              <p className="text-green-600">OK</p>
              <p className="text-sm text-gray-500 mt-2">Local demo</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <AlertCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Student Enrollment Trend */}
        <Card title="Student Enrollment Trend">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={enrollmentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="students" stroke="#3b82f6" strokeWidth={2} name="Total Students" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Program Distribution */}
        <Card title="Program Distribution">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={courseEnrollmentData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {courseEnrollmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Academic Performance */}
      <Card title="Academic Performance Trend">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="semester" />
              <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Bar dataKey="average" fill="#10b981" name="Average GPA" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent System Activity */}
        <Card title="Recent System Activity">
          <div className="space-y-3">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Users className="w-4 h-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-900">{activity.action}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                    <span>{activity.user}</span>
                    <span>•</span>
                    <span>{activity.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Stats */}
        <Card title="Quick Statistics">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Student Applications</p>
                <p className="text-gray-900">{applications.length}</p>
              </div>
              <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                Review
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Active Exams</p>
                <p className="text-gray-900">{exams.length}</p>
              </div>
              <div className="bg-green-600 text-white px-3 py-1 rounded-full text-sm">
                In Progress
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Departments</p>
                <p className="text-gray-900">{new Set(courses.map(c => c.department)).size}</p>
              </div>
              <div className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm">
                Overview
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">System Alerts</p>
                <p className="text-gray-900">{announcements.filter(a => a.priority === 'high').length}</p>
              </div>
              <div className="bg-orange-600 text-white px-3 py-1 rounded-full text-sm">
                Action Required
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
