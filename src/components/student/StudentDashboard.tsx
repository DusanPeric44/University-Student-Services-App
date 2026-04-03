import { Card } from '../shared/Card';
import {
  BookOpen,
  Calendar,
  DollarSign,
  TrendingUp,
  Clock,
  AlertCircle,
} from 'lucide-react';

export function StudentDashboard() {
  const upcomingClasses = [
    { course: 'Data Structures', time: 'Today, 10:00 AM', room: 'Room 301' },
    { course: 'Web Development', time: 'Today, 2:00 PM', room: 'Lab 5' },
    { course: 'Database Systems', time: 'Tomorrow, 9:00 AM', room: 'Room 205' },
  ];

  const recentAnnouncements = [
    {
      title: 'Midterm Exam Schedule Released',
      date: 'Nov 25, 2025',
      type: 'exam',
    },
    {
      title: 'Library Hours Extended',
      date: 'Nov 24, 2025',
      type: 'info',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-gray-900 mb-2">Student Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's your overview.</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Average Grade</p>
              <p className="text-gray-900">8.7</p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-600">+0.3 from last semester</span>
              </div>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Enrolled Courses</p>
              <p className="text-gray-900">6</p>
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
              <p className="text-sm text-gray-600 mb-1">Upcoming Exams</p>
              <p className="text-gray-900">3</p>
              <p className="text-sm text-gray-500 mt-2">Next 2 weeks</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pending Payment</p>
              <p className="text-gray-900">$450</p>
              <p className="text-sm text-red-600 mt-2">Due: Dec 15, 2025</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Classes */}
        <Card title="Upcoming Classes">
          <div className="space-y-4">
            {upcomingClasses.map((classItem, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-900">{classItem.course}</p>
                  <p className="text-sm text-gray-600">{classItem.time}</p>
                  <p className="text-sm text-gray-500">{classItem.room}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Announcements */}
        <Card title="Recent Announcements">
          <div className="space-y-4">
            {recentAnnouncements.map((announcement, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors cursor-pointer"
              >
                <div
                  className={`p-2 rounded-lg ${
                    announcement.type === 'exam'
                      ? 'bg-orange-100'
                      : 'bg-blue-100'
                  }`}
                >
                  <AlertCircle
                    className={`w-5 h-5 ${
                      announcement.type === 'exam'
                        ? 'text-orange-600'
                        : 'text-blue-600'
                    }`}
                  />
                </div>
                <div className="flex-1">
                  <p className="text-gray-900">{announcement.title}</p>
                  <p className="text-sm text-gray-500">{announcement.date}</p>
                </div>
              </div>
            ))}
            <button className="w-full text-center py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              View All Announcements
            </button>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card title="Quick Actions">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button className="flex items-center gap-3 p-4 border-2 border-blue-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <span className="text-gray-900">View Courses</span>
          </button>
          <button className="flex items-center gap-3 p-4 border-2 border-green-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all">
            <Calendar className="w-6 h-6 text-green-600" />
            <span className="text-gray-900">Apply for Exams</span>
          </button>
          <button className="flex items-center gap-3 p-4 border-2 border-purple-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all">
            <DollarSign className="w-6 h-6 text-purple-600" />
            <span className="text-gray-900">Make Payment</span>
          </button>
        </div>
      </Card>
    </div>
  );
}
