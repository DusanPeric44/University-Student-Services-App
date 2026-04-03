import { Card } from '../shared/Card';
import { Button } from '../shared/Button';
import { useState } from 'react';
import { Check, X, Search, Calendar, Download, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Student {
  id: number;
  name: string;
  studentId: string;
  attendance: boolean | null;
}

export function ProfessorAttendance() {
  const [selectedCourse, setSelectedCourse] = useState('CS301');
  const [selectedDate, setSelectedDate] = useState('2025-11-27');
  const [searchQuery, setSearchQuery] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  const [students, setStudents] = useState<Student[]>([
    { id: 1, name: 'John Anderson', studentId: '2024-CS-1234', attendance: null },
    { id: 2, name: 'Emma Wilson', studentId: '2024-CS-1235', attendance: null },
    { id: 3, name: 'Michael Brown', studentId: '2024-CS-1236', attendance: null },
    { id: 4, name: 'Sarah Davis', studentId: '2024-CS-1237', attendance: null },
    { id: 5, name: 'James Johnson', studentId: '2024-CS-1238', attendance: null },
    { id: 6, name: 'Emily Martinez', studentId: '2024-CS-1239', attendance: null },
    { id: 7, name: 'Daniel Garcia', studentId: '2024-CS-1240', attendance: null },
    { id: 8, name: 'Olivia Rodriguez', studentId: '2024-CS-1241', attendance: null },
    { id: 9, name: 'William Lee', studentId: '2024-CS-1242', attendance: null },
    { id: 10, name: 'Sophia Taylor', studentId: '2024-CS-1243', attendance: null },
  ]);

  const courses = [
    { id: 'CS301', name: 'Data Structures CS301' },
    { id: 'CS401', name: 'Algorithms CS401' },
    { id: 'CS302', name: 'Database Systems CS302' },
    { id: 'CS501', name: 'Machine Learning CS501' },
  ];

  const handleAttendance = (studentId: number, present: boolean) => {
    setStudents(students.map(student =>
      student.id === studentId
        ? { ...student, attendance: present }
        : student
    ));
    setHasChanges(true);
  };

  const markAllPresent = () => {
    setStudents(students.map(student => ({ ...student, attendance: true })));
    setHasChanges(true);
    toast.success('All students marked present');
  };

  const markAllAbsent = () => {
    setStudents(students.map(student => ({ ...student, attendance: false })));
    setHasChanges(true);
    toast.success('All students marked absent');
  };

  const handleSave = () => {
    toast.success('Attendance saved successfully');
    setHasChanges(false);
  };

  const handleExport = () => {
    toast.success('Attendance report exported');
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.studentId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const presentCount = students.filter(s => s.attendance === true).length;
  const absentCount = students.filter(s => s.attendance === false).length;
  const unmarkedCount = students.filter(s => s.attendance === null).length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-gray-900 mb-2">Track Attendance</h1>
        <p className="text-gray-600">Mark student attendance efficiently for your courses</p>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-700 mb-2">Course</label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {courses.map(course => (
                <option key={course.id} value={course.id}>{course.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">Search Students</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Name or Student ID"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Total Students</p>
            <p className="text-gray-900">{students.length}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Present</p>
            <p className="text-green-600">{presentCount}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Absent</p>
            <p className="text-red-600">{absentCount}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Unmarked</p>
            <p className="text-gray-600">{unmarkedCount}</p>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <div className="flex flex-wrap gap-3">
          <Button variant="success" size="sm" onClick={markAllPresent}>
            <CheckCircle className="w-4 h-4" />
            Mark All Present
          </Button>
          <Button variant="danger" size="sm" onClick={markAllAbsent}>
            <XCircle className="w-4 h-4" />
            Mark All Absent
          </Button>
          <Button variant="secondary" size="sm" onClick={handleExport}>
            <Download className="w-4 h-4" />
            Export Report
          </Button>
          {hasChanges && (
            <Button variant="primary" size="sm" onClick={handleSave}>
              <Check className="w-4 h-4" />
              Save Changes
            </Button>
          )}
        </div>
      </Card>

      {/* Attendance List */}
      <Card title="Student Attendance">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-gray-700">#</th>
                <th className="text-left py-3 px-4 text-gray-700">Student ID</th>
                <th className="text-left py-3 px-4 text-gray-700">Name</th>
                <th className="text-center py-3 px-4 text-gray-700">Attendance</th>
                <th className="text-center py-3 px-4 text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student, index) => (
                <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-600">{index + 1}</td>
                  <td className="py-3 px-4 text-gray-900">{student.studentId}</td>
                  <td className="py-3 px-4 text-gray-900">{student.name}</td>
                  <td className="py-3 px-4 text-center">
                    {student.attendance === true && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                        <Check className="w-4 h-4" />
                        Present
                      </span>
                    )}
                    {student.attendance === false && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                        <X className="w-4 h-4" />
                        Absent
                      </span>
                    )}
                    {student.attendance === null && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                        Not Marked
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleAttendance(student.id, true)}
                        className={`p-2 rounded-lg transition-colors ${student.attendance === true
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-green-100 hover:text-green-600'
                          }`}
                        aria-label="Mark present"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleAttendance(student.id, false)}
                        className={`p-2 rounded-lg transition-colors ${student.attendance === false
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600'
                          }`}
                        aria-label="Mark absent"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredStudents.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No students found</p>
            </div>
          )}
        </div>
      </Card>

      {/* Save Reminder */}
      {hasChanges && (
        <div className="fixed bottom-6 right-6 z-50">
          <Card className="shadow-2xl">
            <div className="flex items-center gap-4">
              <p className="text-gray-900">You have unsaved changes</p>
              <Button onClick={handleSave}>
                <Check className="w-4 h-4" />
                Save Now
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
