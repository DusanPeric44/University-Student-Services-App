import { Card } from '../shared/Card';
import { Button } from '../shared/Button';
import { useState } from 'react';
import { Save, Search, Download, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { usePersistence } from '../../hooks/usePersistence';
import { STORAGE_KEYS, INITIAL_DATA, StudentGrade } from '../../lib/storage';

export function ProfessorGrades() {
  const [selectedCourse, setSelectedCourse] = useState('CS301');
  const [searchQuery, setSearchQuery] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  const [students, setStudents] = usePersistence<StudentGrade[]>(STORAGE_KEYS.GRADES, INITIAL_DATA.GRADES);

  const courses = [
    { id: 'CS301', name: 'Data Structures CS301' },
    { id: 'CS401', name: 'Algorithms CS401' },
    { id: 'CS302', name: 'Database Systems CS302' },
    { id: 'CS501', name: 'Machine Learning CS501' },
  ];

  const handleGradeChange = (studentId: number, field: keyof StudentGrade, value: string) => {
    // Validate grade input (0-100)
    if (value && (isNaN(Number(value)) || Number(value) < 0 || Number(value) > 100)) {
      toast.error('Grade must be between 0 and 100');
      return;
    }

    setStudents(students.map(student => {
      if (student.id === studentId) {
        const updated = { ...student, [field]: value };
        // Calculate average
        const grades = [updated.assignment1, updated.assignment2, updated.midterm, updated.final]
          .filter(g => g !== '')
          .map(g => Number(g));
        updated.average = grades.length > 0 ? Math.round(grades.reduce((a, b) => a + b, 0) / grades.length) : null;
        return updated;
      }
      return student;
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    toast.success('Grades saved successfully');
    setHasChanges(false);
  };

  const handleExport = () => {
    toast.success('Grade report exported');
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.studentId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getGradeColor = (grade: string) => {
    const num = Number(grade);
    if (isNaN(num)) return '';
    if (num >= 90) return 'text-green-600';
    if (num >= 80) return 'text-blue-600';
    if (num >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-gray-900 mb-2">Enter Grades</h1>
        <p className="text-gray-600">Efficiently manage and enter student grades</p>
      </div>

      {/* Filters & Actions */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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

        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" size="sm" onClick={handleExport}>
            <Download className="w-4 h-4" />
            Export Grades
          </Button>
          {hasChanges && (
            <Button variant="success" size="sm" onClick={handleSave}>
              <Save className="w-4 h-4" />
              Save Changes
            </Button>
          )}
        </div>
      </Card>

      {/* Grading Instructions */}
      <Card>
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-gray-900 mb-1">Grading Guidelines</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Enter grades between 0 and 100</li>
              <li>• Average is calculated automatically based on entered grades</li>
              <li>• Click "Save Changes" to submit your grades</li>
              <li>• Use Tab key to navigate between cells quickly</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Grades Table */}
      <Card title="Student Grades">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-gray-700 sticky left-0 bg-white">Student ID</th>
                <th className="text-left py-3 px-4 text-gray-700 sticky left-[140px] bg-white">Name</th>
                <th className="text-center py-3 px-4 text-gray-700 min-w-[120px]">Assignment 1<br /><span className="text-xs text-gray-500">(20%)</span></th>
                <th className="text-center py-3 px-4 text-gray-700 min-w-[120px]">Assignment 2<br /><span className="text-xs text-gray-500">(20%)</span></th>
                <th className="text-center py-3 px-4 text-gray-700 min-w-[120px]">Midterm<br /><span className="text-xs text-gray-500">(30%)</span></th>
                <th className="text-center py-3 px-4 text-gray-700 min-w-[120px]">Final<br /><span className="text-xs text-gray-500">(30%)</span></th>
                <th className="text-center py-3 px-4 text-gray-700 min-w-[100px]">Average</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900 sticky left-0 bg-white">{student.studentId}</td>
                  <td className="py-3 px-4 text-gray-900 sticky left-[140px] bg-white">{student.name}</td>
                  <td className="py-3 px-4">
                    <input
                      type="text"
                      value={student.assignment1}
                      onChange={(e) => handleGradeChange(student.id, 'assignment1', e.target.value)}
                      className={`w-full px-3 py-2 text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${getGradeColor(student.assignment1)}`}
                      placeholder="0-100"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type="text"
                      value={student.assignment2}
                      onChange={(e) => handleGradeChange(student.id, 'assignment2', e.target.value)}
                      className={`w-full px-3 py-2 text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${getGradeColor(student.assignment2)}`}
                      placeholder="0-100"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type="text"
                      value={student.midterm}
                      onChange={(e) => handleGradeChange(student.id, 'midterm', e.target.value)}
                      className={`w-full px-3 py-2 text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${getGradeColor(student.midterm)}`}
                      placeholder="0-100"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type="text"
                      value={student.final}
                      onChange={(e) => handleGradeChange(student.id, 'final', e.target.value)}
                      className={`w-full px-3 py-2 text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${getGradeColor(student.final)}`}
                      placeholder="0-100"
                    />
                  </td>
                  <td className="py-3 px-4 text-center">
                    {student.average !== null ? (
                      <span className={`inline-block px-3 py-1 rounded-full ${student.average >= 90 ? 'bg-green-100 text-green-700' :
                          student.average >= 80 ? 'bg-blue-100 text-blue-700' :
                            student.average >= 70 ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                        }`}>
                        {student.average}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
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
            <p className="text-sm text-gray-600 mb-1">Completed Grading</p>
            <p className="text-green-600">
              {students.filter(s => s.assignment1 && s.assignment2 && s.midterm && s.final).length}
            </p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Class Average</p>
            <p className="text-blue-600">
              {students.filter(s => s.average !== null).length > 0
                ? Math.round(
                  students.filter(s => s.average !== null).reduce((sum, s) => sum + (s.average || 0), 0) /
                  students.filter(s => s.average !== null).length
                )
                : '-'}
            </p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Passing Rate</p>
            <p className="text-green-600">
              {students.filter(s => s.average !== null).length > 0
                ? Math.round(
                  (students.filter(s => s.average !== null && s.average >= 60).length /
                    students.filter(s => s.average !== null).length) * 100
                ) + '%'
                : '-'}
            </p>
          </div>
        </Card>
      </div>

      {/* Save Reminder */}
      {hasChanges && (
        <div className="fixed bottom-6 right-6 z-50">
          <Card className="shadow-2xl">
            <div className="flex items-center gap-4">
              <p className="text-gray-900">You have unsaved changes</p>
              <Button onClick={handleSave}>
                <Save className="w-4 h-4" />
                Save Now
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
