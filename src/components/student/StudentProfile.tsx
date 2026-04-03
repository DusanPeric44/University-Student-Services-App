import { Card } from '../shared/Card';
import { User, Mail, Phone, MapPin, Calendar, Award, DollarSign, CheckCircle, XCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

export function StudentProfile() {
  const gradeData = [
    { semester: 'Fall 2023', grade: 8.2 },
    { semester: 'Spring 2024', grade: 8.5 },
    { semester: 'Fall 2024', grade: 8.4 },
    { semester: 'Spring 2025', grade: 8.7 },
  ];

  const attendanceData = [
    { month: 'Sep', attendance: 95 },
    { month: 'Oct', attendance: 92 },
    { month: 'Nov', attendance: 97 },
  ];

  const payments = [
    { id: 1, description: 'Tuition Fee - Fall 2024', amount: '$2,500', date: 'Sep 1, 2024', status: 'paid' },
    { id: 2, description: 'Lab Fee', amount: '$150', date: 'Sep 15, 2024', status: 'paid' },
    { id: 3, description: 'Library Fee', amount: '$50', date: 'Oct 1, 2024', status: 'paid' },
    { id: 4, description: 'Tuition Fee - Spring 2025', amount: '$2,500', date: 'Dec 15, 2024', status: 'due' },
  ];

  const currentCourses = [
    { name: 'Data Structures', grade: 'A', credits: 4 },
    { name: 'Web Development', grade: 'A-', credits: 3 },
    { name: 'Database Systems', grade: 'B+', credits: 4 },
    { name: 'Software Engineering', grade: 'A', credits: 3 },
    { name: 'Computer Networks', grade: 'B', credits: 3 },
    { name: 'Operating Systems', grade: 'A-', credits: 4 },
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
              <User className="w-12 h-12 text-blue-600" />
            </div>
            <h3 className="text-gray-900 mb-1">John Anderson</h3>
            <p className="text-gray-600">Student ID: 2024-CS-1234</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="text-gray-900">john.anderson@university.edu</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="text-gray-900">+1 (555) 123-4567</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">Address</p>
                <p className="text-gray-900">123 Campus Drive, University City</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">Enrollment Date</p>
                <p className="text-gray-900">September 1, 2023</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Award className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">Program</p>
                <p className="text-gray-900">B.Sc. Computer Science</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Academic Success */}
        <Card title="Academic Success" className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Overall GPA</p>
              <p className="text-gray-900">8.7 / 10.0</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Credits Earned</p>
              <p className="text-gray-900">84 / 120</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Attendance Rate</p>
              <p className="text-gray-900">95%</p>
            </div>
          </div>

          {/* Grade Progression Chart */}
          <div className="mb-6">
            <h4 className="text-gray-900 mb-4">Grade Progression</h4>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={gradeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="semester" />
                <YAxis domain={[7, 10]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="grade" stroke="#3b82f6" strokeWidth={2} name="Average Grade" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Attendance Chart */}
          <div>
            <h4 className="text-gray-900 mb-4">Recent Attendance</h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="attendance" fill="#10b981" name="Attendance %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Current Courses */}
      <Card title="Current Courses - Spring 2025">
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
