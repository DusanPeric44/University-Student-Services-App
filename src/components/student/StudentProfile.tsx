import { Card } from '../shared/Card';
import { User as UserIcon, Mail, Calendar, DollarSign, CheckCircle, XCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { usePersistence } from '../../hooks/usePersistence';
import { STORAGE_KEYS, INITIAL_DATA, User, Course, StudentGrade, AttendanceStudent } from '../../lib/storage';

export function StudentProfile() {
  const [currentUser] = usePersistence<User | null>(STORAGE_KEYS.CURRENT_USER, null);
  const [grades] = usePersistence<StudentGrade[]>(STORAGE_KEYS.GRADES, INITIAL_DATA.GRADES);
  const [courses] = usePersistence<Course[]>(STORAGE_KEYS.COURSES, INITIAL_DATA.COURSES);
  const [attendance] = usePersistence<AttendanceStudent[]>(STORAGE_KEYS.ATTENDANCE, INITIAL_DATA.ATTENDANCE);

  const studentIdStr = currentUser ? String(currentUser.id) : '';
  const studentGrades = grades.filter(g => g.studentId === studentIdStr && g.average !== null);
  const gradeData = studentGrades.map(g => {
    const course = courses.find(c => String(c.id) === g.courseId);
    return { course: course ? course.name : `Course ${g.courseId}`, average: g.average as number };
  });

  const studentAttendance = attendance.filter(a => a.studentId === studentIdStr);
  const presentCount = studentAttendance.filter(a => a.attendance === true).length;
  const absentCount = studentAttendance.filter(a => a.attendance === false).length;
  const attendanceRate = studentAttendance.length > 0
    ? Math.round((presentCount / studentAttendance.length) * 100)
    : '-';
  const attendanceData = [
    { status: 'Present', count: presentCount },
    { status: 'Absent', count: absentCount },
  ];

  const letterGradeForAverage = (avg: number) => {
    if (avg >= 9.0) return 'A';
    if (avg >= 8.5) return 'A-';
    if (avg >= 8.0) return 'B+';
    if (avg >= 7.0) return 'B';
    if (avg >= 6.0) return 'C';
    return 'D';
  };

  const currentCourses = studentGrades.map(g => {
    const course = courses.find(c => String(c.id) === g.courseId);
    const avg = g.average as number;
    return {
      name: course ? course.name : `Course ${g.courseId}`,
      grade: letterGradeForAverage(avg),
      credits: course ? course.credits : '-',
    };
  });

  const payments = [
    { id: 1, description: 'Tuition Fee - Fall 2024', amount: '$2,500', date: 'Sep 1, 2024', status: 'paid' },
    { id: 2, description: 'Lab Fee', amount: '$150', date: 'Sep 15, 2024', status: 'paid' },
    { id: 3, description: 'Library Fee', amount: '$50', date: 'Oct 1, 2024', status: 'paid' },
    { id: 4, description: 'Tuition Fee - Spring 2025', amount: '$2,500', date: 'Dec 15, 2024', status: 'due' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-gray-900 mb-2">Student Profile</h1>
        <p className="text-gray-600">Your personal information and academic progress</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Information */}
        <Card title="Personal Information" className="lg:col-span-1">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <UserIcon className="w-12 h-12 text-blue-600" />
            </div>
            <h3 className="text-gray-900 mb-1">{currentUser?.name || 'Student'}</h3>
            <p className="text-gray-600">Student ID: {currentUser?.id ?? '-'}</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="text-gray-900">{currentUser?.email || '-'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">Enrollment Date</p>
                <p className="text-gray-900">{currentUser?.joinDate || '-'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">Department</p>
                <p className="text-gray-900">{currentUser?.department || '-'}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Academic Success */}
        <Card title="Academic Success" className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Overall GPA</p>
              <p className="text-gray-900">
                {studentGrades.length > 0
                  ? `${Math.round((studentGrades.reduce((s, g) => s + (g.average || 0), 0) / studentGrades.length) * 10) / 10} / 10.0`
                  : '-'}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Enrolled Courses</p>
              <p className="text-gray-900">{currentCourses.length}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Attendance Rate</p>
              <p className="text-gray-900">{attendanceRate}%</p>
            </div>
          </div>

          {/* Grade Progression Chart */}
          <div className="mb-6">
            <h4 className="text-gray-900 mb-4">Grades by Course</h4>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={gradeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="course" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="average" stroke="#3b82f6" strokeWidth={2} name="Average Grade" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Attendance Chart */}
          <div>
            <h4 className="text-gray-900 mb-4">Attendance Summary</h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis domain={[0, Math.max(5, presentCount + absentCount)]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#10b981" name="Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Current Courses */}
      <Card title="Current Courses">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-gray-700">Course Name</th>
                <th className="text-left py-3 px-4 text-gray-700">Current Grade</th>
                <th className="text-left py-3 px-4 text-gray-700">Credits</th>
              </tr>
            </thead>
            <tbody>
              {currentCourses.map((course, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900">{course.name}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                      course.grade.startsWith('A') ? 'bg-green-100 text-green-800' :
                      course.grade.startsWith('B') ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {course.grade}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-900">{course.credits}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Payment History */}
      <Card title="Payment History">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-gray-700">Description</th>
                <th className="text-left py-3 px-4 text-gray-700">Amount</th>
                <th className="text-left py-3 px-4 text-gray-700">Date</th>
                <th className="text-left py-3 px-4 text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900">{payment.description}</td>
                  <td className="py-3 px-4 text-gray-900">{payment.amount}</td>
                  <td className="py-3 px-4 text-gray-600">{payment.date}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
                      payment.status === 'paid' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {payment.status === 'paid' ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )}
                      {payment.status === 'paid' ? 'Paid' : 'Due'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex items-center justify-between p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-3">
            <DollarSign className="w-6 h-6 text-blue-600" />
            <div>
              <p className="text-gray-900">Total Outstanding Balance</p>
              <p className="text-sm text-gray-600">Due by December 15, 2025</p>
            </div>
          </div>
          <p className="text-blue-600">$2,500</p>
        </div>
      </Card>
    </div>
  );
}
