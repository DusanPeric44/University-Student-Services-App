import { Card } from '../shared/Card';
import { Button } from '../shared/Button';
import { User as UserIcon, Mail, Calendar, DollarSign, CheckCircle, XCircle, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { usePersistence } from '../../hooks/usePersistence';
import { STORAGE_KEYS, INITIAL_DATA, User, Course, StudentGrade, AttendanceHistory, Payment } from '../../lib/storage';
import { useState, useMemo, Fragment } from 'react';
import { PaymentForm } from './PaymentForm';

export function StudentProfile() {
  const [currentUser] = usePersistence<User | null>(STORAGE_KEYS.CURRENT_USER, null);
  const [grades] = usePersistence<StudentGrade[]>(STORAGE_KEYS.GRADES, INITIAL_DATA.GRADES);
  const [courses] = usePersistence<Course[]>(STORAGE_KEYS.COURSES, INITIAL_DATA.COURSES);
  const [attendance] = usePersistence<AttendanceHistory>(STORAGE_KEYS.ATTENDANCE, INITIAL_DATA.ATTENDANCE);
  const [allPayments] = usePersistence<Payment[]>(STORAGE_KEYS.PAYMENTS, INITIAL_DATA.PAYMENTS);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [expandedPayment, setExpandedPayment] = useState<string | null>(null);

  const studentId = currentUser?.studentId || String(currentUser?.id);

  const payments = allPayments.filter(p => p.studentId === studentId);

  const groupedPayments = useMemo(() => {
    const groups: { [key: string]: { date: string; status: string; amount: number; payments: Payment[] } } = {};
    payments.forEach(p => {
      const key = p.transactionId || `${p.date}-${p.description}`;
      if (!groups[key]) {
        groups[key] = { date: p.date, status: p.status, amount: 0, payments: [] };
      }
      groups[key].amount += p.amount;
      groups[key].payments.push(p);
    });
    return Object.entries(groups).sort((a, b) => new Date(b[1].date).getTime() - new Date(a[1].date).getTime());
  }, [payments]);

  const studentGrades = grades.filter(g => g.studentId === studentId && g.average !== null);
  const toBosnianGrade = (percent: number) => {
    if (percent >= 95) return 10;
    if (percent >= 85) return 9;
    if (percent >= 75) return 8;
    if (percent >= 65) return 7;
    if (percent >= 55) return 6;
    return 5;
  };
  const gradeData = studentGrades.map(g => {
    const course = courses.find(c => c.code === g.courseId);
    const percent = g.average as number;
    return { course: course ? course.name : `Course ${g.courseId}`, average: toBosnianGrade(percent) };
  });

  const studentRecords = Object.values(attendance)
    .map(session => session[studentId])
    .filter(val => val !== undefined && val !== null);

  const presentCount = studentRecords.filter(val => val === true).length;
  const absentCount = studentRecords.filter(val => val === false).length;
  const attendanceRate = studentRecords.length > 0
    ? Math.round((presentCount / studentRecords.length) * 100)
    : '-';
  const attendanceData = [
    { status: 'Present', count: presentCount },
    { status: 'Absent', count: absentCount },
  ];

  

  const currentCourses = studentGrades.map(g => {
    const course = courses.find(c => c.code === g.courseId);
    const avgPercent = g.average as number;
    const numeric = toBosnianGrade(avgPercent);
    return {
      name: course ? course.name : `Course ${g.courseId}`,
      grade: String(numeric),
      credits: course ? course.credits : '-',
    };
  });

  const totalOutstanding = payments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">Student Profile</h1>
          <p className="text-gray-600">Your personal information and academic progress</p>
        </div>
        <Button onClick={() => setIsPaymentModalOpen(true)}>
          <Plus className="w-4 h-4" />
          Make Payment
        </Button>
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
              <p className="text-sm text-gray-600 mb-1">Overall Grade</p>
              <p className="text-gray-900">
                {studentGrades.length > 0
                  ? `${Math.round((studentGrades.reduce((s, g) => s + toBosnianGrade(g.average as number), 0) / studentGrades.length) * 10) / 10} / 10.0`
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
                <YAxis domain={[5, 10]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="average" stroke="#3b82f6" strokeWidth={2} name="Final Grade" />
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
                <th className="text-left py-3 px-4 text-gray-700">Final Grade</th>
                <th className="text-left py-3 px-4 text-gray-700">Credits</th>
              </tr>
            </thead>
            <tbody>
              {currentCourses.map((course, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900">{course.name}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                      Number(course.grade) >= 9 ? 'bg-green-100 text-green-800' :
                      Number(course.grade) >= 7 ? 'bg-blue-100 text-blue-800' :
                      Number(course.grade) >= 6 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
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
                <th className="text-left py-3 px-4 text-gray-700">Total Amount</th>
                <th className="text-left py-3 px-4 text-gray-700">Date</th>
                <th className="text-left py-3 px-4 text-gray-700">Status</th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody>
              {groupedPayments.map(([id, group]) => (
                <Fragment key={id}>
                  <tr 
                    className={`border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${expandedPayment === id ? 'bg-gray-50' : ''}`}
                    onClick={() => setExpandedPayment(expandedPayment === id ? null : id)}
                  >
                    <td className="py-3 px-4 text-gray-900 font-medium">
                      {group.payments[0].description.includes('Installment') 
                        ? `Monthly Fee - ${new Date(group.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`
                        : group.payments[0].description}
                    </td>
                    <td className="py-3 px-4 text-gray-900 font-bold">BAM {group.amount.toFixed(2)}</td>
                    <td className="py-3 px-4 text-gray-600">{group.date}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
                        group.status === 'paid' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {group.status === 'paid' ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <XCircle className="w-4 h-4" />
                        )}
                        {group.status === 'paid' ? 'Paid' : 'Due'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {expandedPayment === id ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                    </td>
                  </tr>
                  {expandedPayment === id && (
                    <tr className="bg-gray-50/50">
                      <td colSpan={5} className="px-4 py-3">
                        <div className="space-y-2 border-l-2 border-blue-200 ml-4 pl-4">
                          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Fee Breakdown</p>
                          {group.payments.map((p) => (
                            <div key={p.id} className="flex justify-between items-center text-sm py-1">
                              <span className="text-gray-700">{p.description.split(' (')[0]}</span>
                              <span className="text-gray-900 font-medium">BAM {p.amount.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
              {groupedPayments.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">
                    No payment history found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex items-center justify-between p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-3">
            <DollarSign className="w-6 h-6 text-blue-600" />
            <div>
              <p className="text-gray-900">Total Outstanding Balance</p>
              <p className="text-sm text-gray-600">Updated automatically</p>
            </div>
          </div>
          <p className="text-blue-600">BAM {totalOutstanding}</p>
        </div>
      </Card>

      <PaymentForm
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        currentUser={currentUser}
      />
    </div>
  );
}
