import { Card } from '../shared/Card';
import { Button } from '../shared/Button';
import { useState } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Download, TrendingUp, Users, BookOpen, DollarSign, Calendar } from 'lucide-react';
import { toast } from 'sonner';

export function AdminReports() {
  const [selectedReport, setSelectedReport] = useState<string>('students');

  // Student Statistics Data
  const studentEnrollmentTrend = [
    { month: 'Jan', count: 2400, growth: 50 },
    { month: 'Feb', count: 2450, growth: 55 },
    { month: 'Mar', count: 2520, growth: 70 },
    { month: 'Apr', count: 2580, growth: 60 },
    { month: 'May', count: 2650, growth: 70 },
    { month: 'Jun', count: 2700, growth: 50 },
  ];

  const studentsByDepartment = [
    { name: 'Computer Science', value: 850, percentage: 31.5 },
    { name: 'Engineering', value: 650, percentage: 24.1 },
    { name: 'Business', value: 520, percentage: 19.3 },
    { name: 'Arts', value: 380, percentage: 14.1 },
    { name: 'Science', value: 300, percentage: 11.0 },
  ];

  const studentPerformance = [
    { range: '9.0-10.0', count: 450 },
    { range: '8.0-8.9', count: 980 },
    { range: '7.0-7.9', count: 820 },
    { range: '6.0-6.9', count: 350 },
    { range: 'Below 6.0', count: 100 },
  ];

  // Exam Statistics Data
  const examParticipation = [
    { month: 'Sep', total: 2400, passed: 2200, failed: 200 },
    { month: 'Oct', total: 2500, passed: 2350, failed: 150 },
    { month: 'Nov', total: 2600, passed: 2450, failed: 150 },
    { month: 'Dec', total: 2700, passed: 2580, failed: 120 },
  ];

  const examsByDepartment = [
    { dept: 'Computer Sci', exams: 45 },
    { dept: 'Engineering', exams: 38 },
    { dept: 'Business', exams: 32 },
    { dept: 'Arts', exams: 25 },
    { dept: 'Science', exams: 28 },
  ];

  // Payment Statistics Data
  const paymentTrends = [
    { month: 'Jan', collected: 180000, pending: 20000 },
    { month: 'Feb', collected: 190000, pending: 18000 },
    { month: 'Mar', collected: 195000, pending: 15000 },
    { month: 'Apr', collected: 200000, pending: 12000 },
    { month: 'May', collected: 210000, pending: 10000 },
    { month: 'Jun', collected: 220000, pending: 8000 },
  ];

  const paymentByType = [
    { name: 'Tuition Fees', value: 850000 },
    { name: 'Lab Fees', value: 120000 },
    { name: 'Library Fees', value: 45000 },
    { name: 'Sports Fees', value: 30000 },
    { name: 'Other', value: 55000 },
  ];

  // Course Statistics Data
  const courseEnrollmentStats = [
    { dept: 'Computer Sci', courses: 32, students: 850 },
    { dept: 'Engineering', courses: 28, students: 650 },
    { dept: 'Business', courses: 24, students: 520 },
    { dept: 'Arts', courses: 20, students: 380 },
    { dept: 'Science', courses: 22, students: 300 },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const handleExport = (reportType: string) => {
    toast.success(`${reportType} report exported successfully`);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">Reports & Statistics</h1>
          <p className="text-gray-600">Comprehensive analytics and data visualization</p>
        </div>
        <Button onClick={() => handleExport(selectedReport)}>
          <Download className="w-4 h-4" />
          Export Report
        </Button>
      </div>

      {/* Report Type Tabs */}
      <Card>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedReport('students')}
            className={`px-4 py-2 rounded-lg transition-colors ${selectedReport === 'students'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            Student Statistics
          </button>
          <button
            onClick={() => setSelectedReport('exams')}
            className={`px-4 py-2 rounded-lg transition-colors ${selectedReport === 'exams'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            Exam Statistics
          </button>
          <button
            onClick={() => setSelectedReport('payments')}
            className={`px-4 py-2 rounded-lg transition-colors ${selectedReport === 'payments'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            Payment Statistics
          </button>
          <button
            onClick={() => setSelectedReport('courses')}
            className={`px-4 py-2 rounded-lg transition-colors ${selectedReport === 'courses'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            Course Statistics
          </button>
        </div>
      </Card>

      {/* Student Statistics */}
      {selectedReport === 'students' && (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Students</p>
                  <p className="text-gray-900">2,700</p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-600">+3.8%</span>
                  </div>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </Card>

            <Card>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Average GPA</p>
                <p className="text-gray-900">8.6</p>
                <p className="text-sm text-green-600 mt-2">+0.2 from last semester</p>
              </div>
            </Card>

            <Card>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Graduation Rate</p>
                <p className="text-gray-900">94.5%</p>
                <p className="text-sm text-gray-500 mt-2">2024-2025</p>
              </div>
            </Card>

            <Card>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Retention Rate</p>
                <p className="text-gray-900">96.2%</p>
                <p className="text-sm text-green-600 mt-2">+1.5%</p>
              </div>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title="Student Enrollment Trend">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={studentEnrollmentTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="count" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} name="Total Students" />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            <Card title="Students by Department">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={studentsByDepartment}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {studentsByDepartment.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>

          <Card title="Student Performance Distribution">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={studentPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#10b981" name="Number of Students" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </>
      )}

      {/* Exam Statistics */}
      {selectedReport === 'exams' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Total Exams</p>
                <p className="text-gray-900">168</p>
                <p className="text-sm text-gray-500 mt-2">This semester</p>
              </div>
            </Card>

            <Card>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Pass Rate</p>
                <p className="text-green-600">95.4%</p>
                <p className="text-sm text-green-600 mt-2">+2.1%</p>
              </div>
            </Card>

            <Card>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Average Score</p>
                <p className="text-gray-900">82.3</p>
                <p className="text-sm text-gray-500 mt-2">Out of 100</p>
              </div>
            </Card>

            <Card>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Participation</p>
                <p className="text-gray-900">98.5%</p>
                <p className="text-sm text-green-600 mt-2">Excellent</p>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title="Exam Participation Trends">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={examParticipation}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={2} name="Total Exams" />
                  <Line type="monotone" dataKey="passed" stroke="#10b981" strokeWidth={2} name="Passed" />
                  <Line type="monotone" dataKey="failed" stroke="#ef4444" strokeWidth={2} name="Failed" />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <Card title="Exams by Department">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={examsByDepartment}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="dept" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="exams" fill="#f59e0b" name="Number of Exams" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </>
      )}

      {/* Payment Statistics */}
      {selectedReport === 'payments' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                <p className="text-gray-900">$1.1M</p>
                <p className="text-sm text-green-600 mt-2">+5.2%</p>
              </div>
            </Card>

            <Card>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Collected</p>
                <p className="text-green-600">$220K</p>
                <p className="text-sm text-gray-500 mt-2">This month</p>
              </div>
            </Card>

            <Card>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Pending</p>
                <p className="text-orange-600">$8K</p>
                <p className="text-sm text-gray-500 mt-2">Outstanding</p>
              </div>
            </Card>

            <Card>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Collection Rate</p>
                <p className="text-gray-900">96.5%</p>
                <p className="text-sm text-green-600 mt-2">Excellent</p>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title="Payment Collection Trends">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={paymentTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="collected" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} name="Collected ($)" />
                  <Area type="monotone" dataKey="pending" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} name="Pending ($)" />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            <Card title="Payment Distribution by Type">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={paymentByType}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: $${(value / 1000).toFixed(0)}K`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {paymentByType.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </>
      )}

      {/* Course Statistics */}
      {selectedReport === 'courses' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Total Courses</p>
                <p className="text-gray-900">156</p>
                <p className="text-sm text-gray-500 mt-2">Active courses</p>
              </div>
            </Card>

            <Card>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Avg. Class Size</p>
                <p className="text-gray-900">42</p>
                <p className="text-sm text-gray-500 mt-2">Students per course</p>
              </div>
            </Card>

            <Card>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Popular Major</p>
                <p className="text-blue-600">Computer Sci</p>
                <p className="text-sm text-gray-500 mt-2">850 students</p>
              </div>
            </Card>

            <Card>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Course Fill Rate</p>
                <p className="text-gray-900">87.3%</p>
                <p className="text-sm text-green-600 mt-2">+3.1%</p>
              </div>
            </Card>
          </div>

          <Card title="Course Enrollment by Department">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={courseEnrollmentStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dept" />
                <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" />
                <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="courses" fill="#3b82f6" name="Number of Courses" />
                <Bar yAxisId="right" dataKey="students" fill="#10b981" name="Total Students" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </>
      )}
    </div>
  );
}
