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

export function AdminDashboard() {
  const enrollmentData = [
    { month: 'Jan', students: 2400 },
    { month: 'Feb', students: 2450 },
    { month: 'Mar', students: 2520 },
    { month: 'Apr', students: 2580 },
    { month: 'May', students: 2650 },
    { month: 'Jun', students: 2700 },
  ];

  const courseEnrollmentData = [
    { name: 'Computer Science', value: 850 },
    { name: 'Engineering', value: 650 },
    { name: 'Business', value: 520 },
    { name: 'Arts', value: 380 },
    { name: 'Science', value: 300 },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const performanceData = [
    { semester: 'Fall 2023', average: 8.1 },
    { semester: 'Spring 2024', average: 8.3 },
    { semester: 'Fall 2024', average: 8.4 },
    { semester: 'Spring 2025', average: 8.6 },
  ];

  const recentActivities = [
    { action: 'New user registered', user: 'John Doe (Student)', time: '10 minutes ago' },
    { action: 'Course updated', user: 'Prof. Smith', time: '1 hour ago' },
    { action: 'Bulk grade submission', user: 'Prof. Johnson', time: '2 hours ago' },
    { action: 'New course created', user: 'Admin User', time: '3 hours ago' },
    { action: 'System backup completed', user: 'System', time: '5 hours ago' },
  ];

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
              <p className="text-gray-900">2,700</p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-600">+3.8% this month</span>
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
              <p className="text-gray-900">156</p>
              <p className="text-sm text-gray-500 mt-2">Spring Semester 2025</p>
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
              <p className="text-gray-900">85</p>
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
              <p className="text-green-600">Excellent</p>
              <p className="text-sm text-gray-500 mt-2">99.9% uptime</p>
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
            <YAxis domain={[7, 10]} />
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
                <p className="text-sm text-gray-600">Pending Applications</p>
                <p className="text-gray-900">24</p>
              </div>
              <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                Review
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Active Exams</p>
                <p className="text-gray-900">12</p>
              </div>
              <div className="bg-green-600 text-white px-3 py-1 rounded-full text-sm">
                In Progress
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Department Requests</p>
                <p className="text-gray-900">8</p>
              </div>
              <div className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm">
                Pending
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">System Alerts</p>
                <p className="text-gray-900">3</p>
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
