import { Card } from '../shared/Card';
import { Button } from '../shared/Button';
import { useState } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Download, TrendingUp, Users, BookOpen, DollarSign, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { useMemo } from 'react';
import { usePersistence } from '../../hooks/usePersistence';
import { STORAGE_KEYS, INITIAL_DATA, User, Course, Exam, StudentGrade, Payment } from '../../lib/storage';

export function AdminReports() {
  const [selectedReport, setSelectedReport] = useState<string>('students');

  const [users] = usePersistence<User[]>(STORAGE_KEYS.USERS, INITIAL_DATA.USERS);
  const [courses] = usePersistence<Course[]>(STORAGE_KEYS.COURSES, INITIAL_DATA.COURSES);
  const [exams] = usePersistence<Exam[]>(STORAGE_KEYS.EXAMS, INITIAL_DATA.EXAMS);
  const [grades] = usePersistence<StudentGrade[]>(STORAGE_KEYS.GRADES, INITIAL_DATA.GRADES);
  const [payments] = usePersistence<Payment[]>(STORAGE_KEYS.PAYMENTS, INITIAL_DATA.PAYMENTS);

  const studentCount = useMemo(() => users.filter(u => u.role === 'student').length, [users]);
  const averageGPA = useMemo(() => {
    const avgs = grades.filter(g => g.average !== null).map(g => g.average as number);
    if (avgs.length === 0) return '-';
    return Math.round(avgs.reduce((s, n) => s + n, 0) / avgs.length);
  }, [grades]);
  const graduationRate = '-';
  const retentionRate = '-';

  const studentEnrollmentTrend = useMemo(() => {
    const map = new Map<string, number>();
    users.filter(u => u.role === 'student').forEach(u => {
      const d = new Date(u.joinDate);
      const key = isNaN(d.getTime()) ? 'Unknown' : `${d.toLocaleString('en-US', { month: 'short' })} ${d.getFullYear()}`;
      map.set(key, (map.get(key) || 0) + 1);
    });
    return Array.from(map.entries())
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6);
  }, [users]);

  const studentsByDepartment = useMemo(() => {
    const map = new Map<string, number>();
    users.filter(u => u.role === 'student').forEach(u => {
      const dept = u.department || 'General';
      map.set(dept, (map.get(dept) || 0) + 1);
    });
    const total = Array.from(map.values()).reduce((s, n) => s + n, 0) || 1;
    return Array.from(map.entries()).map(([name, value]) => ({
      name,
      value,
      percentage: Number(((value / total) * 100).toFixed(1)),
    }));
  }, [users]);

  const studentPerformance = useMemo(() => {
    const bins = [
      { range: '90-100', count: 0 },
      { range: '80-89', count: 0 },
      { range: '70-79', count: 0 },
      { range: '60-69', count: 0 },
      { range: 'Below 60', count: 0 },
    ];
    grades.filter(g => g.average !== null).forEach(g => {
      const a = g.average as number;
      if (a >= 90) bins[0].count++;
      else if (a >= 80) bins[1].count++;
      else if (a >= 70) bins[2].count++;
      else if (a >= 60) bins[3].count++;
      else bins[4].count++;
    });
    return bins;
  }, [grades]);

  // Exam Statistics Data
  const examParticipation = useMemo(() => {
    const map = new Map<string, number>();
    exams.forEach(e => {
      const d = new Date(e.date);
      const key = isNaN(d.getTime()) ? 'Unknown' : `${d.toLocaleString('en-US', { month: 'short' })}`;
      map.set(key, (map.get(key) || 0) + 1);
    });
    return Array.from(map.entries()).map(([month, total]) => ({ month, total, passed: 0, failed: 0 }));
  }, [exams]);

  const examsByDepartment = useMemo(() => {
    const courseDept = new Map<string, string>();
    courses.forEach(c => courseDept.set(`${c.name}`.toLowerCase(), c.department));
    const map = new Map<string, number>();
    exams.forEach(e => {
      const key = courseDept.get(`${e.course}`.toLowerCase()) || 'General';
      map.set(key, (map.get(key) || 0) + 1);
    });
    return Array.from(map.entries()).map(([dept, exams]) => ({ dept, exams }));
  }, [exams, courses]);

  // Payment Statistics Data
  const paymentTrends = useMemo(() => {
    const map = new Map<string, { collected: number; pending: number }>();
    payments.forEach(p => {
      const d = new Date(p.date);
      const key = isNaN(d.getTime()) ? 'Unknown' : `${d.toLocaleString('en-US', { month: 'short' })}`;
      const current = map.get(key) || { collected: 0, pending: 0 };
      if (p.status === 'paid') current.collected += p.amount;
      else current.pending += p.amount;
      map.set(key, current);
    });
    
    // Sort months (simplified)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map(month => ({
      month,
      collected: map.get(month)?.collected || 0,
      pending: map.get(month)?.pending || 0
    })).filter(m => m.collected > 0 || m.pending > 0);
  }, [payments]);

  const paymentByType = useMemo(() => {
    const map = new Map<string, number>();
    payments.forEach(p => {
      map.set(p.type, (map.get(p.type) || 0) + p.amount);
    });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [payments]);

  const totalRevenue = useMemo(() => payments.reduce((s, p) => s + p.amount, 0), [payments]);
  const collectedRevenue = useMemo(() => payments.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0), [payments]);
  const pendingRevenue = useMemo(() => payments.filter(p => p.status === 'pending').reduce((s, p) => s + p.amount, 0), [payments]);
  const collectionRate = useMemo(() => totalRevenue > 0 ? ((collectedRevenue / totalRevenue) * 100).toFixed(1) : '0', [collectedRevenue, totalRevenue]);

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
                  <p className="text-gray-900">{studentCount}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-600">Current</span>
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
                <p className="text-gray-900">{averageGPA}</p>
                <p className="text-sm text-green-600 mt-2">Calculated</p>
              </div>
            </Card>

            <Card>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Graduation Rate</p>
                <p className="text-gray-900">{graduationRate}</p>
                <p className="text-sm text-gray-500 mt-2">-</p>
              </div>
            </Card>

            <Card>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Retention Rate</p>
                <p className="text-gray-900">{retentionRate}</p>
                <p className="text-sm text-green-600 mt-2">-</p>
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
                <p className="text-gray-900">{exams.length}</p>
                <p className="text-sm text-gray-500 mt-2">This semester</p>
              </div>
            </Card>

            <Card>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Pass Rate</p>
                <p className="text-green-600">-</p>
                <p className="text-sm text-green-600 mt-2">-</p>
              </div>
            </Card>

            <Card>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Average Score</p>
                <p className="text-gray-900">{averageGPA}</p>
                <p className="text-sm text-gray-500 mt-2">Out of 100</p>
              </div>
            </Card>

            <Card>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Participation</p>
                <p className="text-gray-900">-</p>
                <p className="text-sm text-green-600 mt-2">-</p>
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
                <p className="text-gray-900">BAM {(totalRevenue / 1000).toFixed(1)}K</p>
                <p className="text-sm text-green-600 mt-2">Overall</p>
              </div>
            </Card>

            <Card>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Collected</p>
                <p className="text-green-600">BAM {(collectedRevenue / 1000).toFixed(1)}K</p>
                <p className="text-sm text-gray-500 mt-2">All time</p>
              </div>
            </Card>

            <Card>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Pending</p>
                <p className="text-orange-600">BAM {(pendingRevenue / 1000).toFixed(1)}K</p>
                <p className="text-sm text-gray-500 mt-2">Outstanding</p>
              </div>
            </Card>

            <Card>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Collection Rate</p>
                <p className="text-gray-900">{collectionRate}%</p>
                <p className="text-sm text-green-600 mt-2">Active</p>
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
                  <Tooltip formatter={(value: number) => `BAM ${value}`} />
                  <Legend />
                  <Area type="monotone" dataKey="collected" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} name="Collected (BAM)" />
                  <Area type="monotone" dataKey="pending" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} name="Pending (BAM)" />
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
                    label={({ name, value }) => `${name}: BAM ${value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {paymentByType.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `BAM ${value}`} />
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
                <p className="text-gray-900">{courses.length}</p>
                <p className="text-sm text-gray-500 mt-2">All courses</p>
              </div>
            </Card>

            <Card>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Avg. Class Size</p>
                <p className="text-gray-900">{courses.length ? Math.round(courses.reduce((s, c) => s + (c.students || 0), 0) / courses.length) : '-'}</p>
                <p className="text-sm text-gray-500 mt-2">Students per course</p>
              </div>
            </Card>

            <Card>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Popular Major</p>
                <p className="text-blue-600">
                  {(() => {
                    const map = new Map<string, number>();
                    courses.forEach(c => map.set(c.department, (map.get(c.department) || 0) + (c.students || 0)));
                    const arr = Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
                    return arr.length ? arr[0][0] : '-';
                  })()}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  {(() => {
                    const map = new Map<string, number>();
                    courses.forEach(c => map.set(c.department, (map.get(c.department) || 0) + (c.students || 0)));
                    const arr = Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
                    return arr.length ? `${arr[0][1]} students` : '-';
                  })()}
                </p>
              </div>
            </Card>

            <Card>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Course Fill Rate</p>
                <p className="text-gray-900">
                  {courses.length ? Math.round((courses.filter(c => c.status === 'active').length / courses.length) * 100) + '%' : '-'}
                </p>
                <p className="text-sm text-green-600 mt-2">Current</p>
              </div>
            </Card>
          </div>

          <Card title="Course Enrollment by Department">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={(() => {
                const map = new Map<string, { courses: number; students: number }>();
                courses.forEach(c => {
                  const entry = map.get(c.department) || { courses: 0, students: 0 };
                  entry.courses += 1;
                  entry.students += c.students || 0;
                  map.set(c.department, entry);
                });
                return Array.from(map.entries()).map(([dept, v]) => ({ dept, courses: v.courses, students: v.students }));
              })()}>
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
