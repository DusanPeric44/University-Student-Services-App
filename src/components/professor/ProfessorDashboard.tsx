import { Card } from '../shared/Card';
import {
  Users,
  BookOpen,
  Calendar,
  ClipboardCheck,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';

export function ProfessorDashboard() {
  const upcomingClasses = [
    { course: 'Data Structures CS301', time: 'Today, 10:00 AM', room: 'Room 301', students: 45 },
    { course: 'Algorithms CS401', time: 'Today, 2:00 PM', room: 'Room 205', students: 38 },
    { course: 'Data Structures CS301', time: 'Tomorrow, 10:00 AM', room: 'Room 301', students: 45 },
  ];

  const pendingTasks = [
    { task: 'Grade submissions for Midterm Exam', course: 'Data Structures', deadline: 'Due in 2 days' },
    { task: 'Attendance review for November', course: 'Algorithms', deadline: 'Due in 5 days' },
    { task: 'Final exam schedule confirmation', course: 'All Courses', deadline: 'Due in 7 days' },
  ];

  const recentActivity = [
    { action: 'Grades entered for Assignment 3', course: 'Data Structures', time: '2 hours ago' },
    { action: 'Attendance marked for Nov 26', course: 'Algorithms', time: '1 day ago' },
    { action: 'Announcement posted', course: 'Data Structures', time: '2 days ago' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-gray-900 mb-2">Professor Dashboard</h1>
        <p className="text-gray-600">Welcome back, Dr. Smith! Here's your overview.</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Active Courses</p>
              <p className="text-gray-900">4</p>
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
              <p className="text-sm text-gray-600 mb-1">Total Students</p>
              <p className="text-gray-900">156</p>
              <p className="text-sm text-gray-500 mt-2">Across all courses</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Upcoming Classes</p>
              <p className="text-gray-900">3</p>
              <p className="text-sm text-gray-500 mt-2">This week</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pending Tasks</p>
              <p className="text-gray-900">3</p>
              <p className="text-sm text-red-600 mt-2">Requires attention</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <ClipboardCheck className="w-6 h-6 text-red-600" />
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
                className="flex items-start gap-4 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors cursor-pointer"
              >
                <div className="bg-green-600 p-2 rounded-lg">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-900">{classItem.course}</p>
                  <p className="text-sm text-gray-600">{classItem.time}</p>
                  <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                    <span>{classItem.room}</span>
                    <span>•</span>
                    <span>{classItem.students} students</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Pending Tasks */}
        <Card title="Pending Tasks">
          <div className="space-y-4">
            {pendingTasks.map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 border border-orange-200 bg-orange-50 rounded-lg"
              >
                <div className="bg-orange-100 p-2 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-900">{item.task}</p>
                  <p className="text-sm text-gray-600">{item.course}</p>
                  <p className="text-sm text-orange-600 mt-1">{item.deadline}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Course Overview */}
      <Card title="Course Overview">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-gray-900">Data Structures CS301</h4>
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm">Active</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Students:</span>
                <span className="text-gray-900">45</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Average Grade:</span>
                <span className="text-gray-900">8.2</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Attendance:</span>
                <span className="text-gray-900">92%</span>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-gray-900">Algorithms CS401</h4>
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm">Active</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Students:</span>
                <span className="text-gray-900">38</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Average Grade:</span>
                <span className="text-gray-900">8.5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Attendance:</span>
                <span className="text-gray-900">95%</span>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-gray-900">Database Systems CS302</h4>
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm">Active</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Students:</span>
                <span className="text-gray-900">42</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Average Grade:</span>
                <span className="text-gray-900">7.9</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Attendance:</span>
                <span className="text-gray-900">88%</span>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-gray-900">Machine Learning CS501</h4>
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm">Active</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Students:</span>
                <span className="text-gray-900">31</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Average Grade:</span>
                <span className="text-gray-900">8.7</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Attendance:</span>
                <span className="text-gray-900">97%</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Recent Activity */}
      <Card title="Recent Activity">
        <div className="space-y-3">
          {recentActivity.map((activity, index) => (
            <div key={index} className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg">
              <div className="bg-blue-100 p-2 rounded-lg">
                <TrendingUp className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-gray-900">{activity.action}</p>
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                  <span>{activity.course}</span>
                  <span>•</span>
                  <span>{activity.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
