import { Card } from '../shared/Card';
import { Button } from '../shared/Button';
import { useEffect, useMemo, useState } from 'react';
import { Save, Search, Download, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { usePersistence } from '../../hooks/usePersistence';
import { STORAGE_KEYS, INITIAL_DATA, StudentGrade, Course, User } from '../../lib/storage';

export function ProfessorGrades() {
  const [selectedCourse, setSelectedCourse] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  const [students, setStudents] = usePersistence<StudentGrade[]>(STORAGE_KEYS.GRADES, INITIAL_DATA.GRADES);
  const [courses] = usePersistence<Course[]>(STORAGE_KEYS.COURSES, INITIAL_DATA.COURSES);
  const [currentUser] = usePersistence<User | null>(STORAGE_KEYS.CURRENT_USER, null);
  const deptCourses = currentUser?.department
    ? courses.filter(c => c.department === (currentUser?.department || ''))
    : courses;

  // Students are created when they apply for exams via the student portal

  useEffect(() => {
    if (!selectedCourse && deptCourses.length > 0) {
      setSelectedCourse(deptCourses[0].code);
    }
  }, [deptCourses, selectedCourse]);



  // Grading is restricted to students who applied for the exam; rows are created by StudentExamApplication

  const handleGradeChange = (studentId: number, field: 'midterm1' | 'midterm2' | 'final', value: string) => {
    // Validate grade input (0-100)
    if (value && (isNaN(Number(value)) || Number(value) < 0 || Number(value) > 100)) {
      toast.error('Grade must be between 0 and 100');
      return;
    }

    setStudents(students.map(student => {
      if (student.id === studentId) {
        const updated: StudentGrade = { ...student, [field]: value };
        if (field === 'final' && value !== '') {
          // Final chosen: clear midterms
          (updated as any).midterm1 = '';
          (updated as any).midterm2 = '';
        } else if ((field === 'midterm1' || field === 'midterm2') && value !== '') {
          // Midterms chosen: clear final
          (updated as any).final = '';
        }
        const f = (updated as any).final !== '' ? Number((updated as any).final) : null;
        const m1 = (updated as any).midterm1 !== '' ? Number((updated as any).midterm1) : null;
        const m2 = (updated as any).midterm2 !== '' ? Number((updated as any).midterm2) : null;
        if (f !== null) {
          updated.average = Math.round(f);
        } else if (m1 !== null && m2 !== null) {
          updated.average = Math.round((m1 + m2) / 2);
        } else {
          updated.average = null;
        }
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

  const filteredStudents = students
    .filter(s => (selectedCourse ? s.courseId === selectedCourse : true))
    .filter(s => !!s.applied)
    .filter(student =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const getGradeColor = (grade: string) => {
    if (!grade) return '';
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
              {deptCourses.length === 0 && (
                <option value="" disabled>No courses available</option>
              )}
              {deptCourses.map(course => (
                <option key={course.id} value={course.code}>{`${course.name} ${course.code}`}</option>
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
              <li>• Enter scores between 0 and 100</li>
              <li>• Grade is based on either a single Final exam OR two Midterms</li>
              <li>• Passing threshold is 55% (grade 6); below 55% is grade 5 (fail)</li>
              <li>• Students appear here only after they apply for the exam</li>
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
                <th className="text-left py-3 px-4 text-gray-700 sticky left-0 bg-white z-10">Student ID</th>
                <th className="text-left py-3 px-4 text-gray-700 sticky left-[140px] bg-white z-10">Name</th>
                <th className="text-center py-3 px-0 text-gray-700 w-[110px]">Midterm 1</th>
                <th className="text-center py-3 px-0 text-gray-700 w-[110px]">Midterm 2</th>
                <th className="text-center py-3 px-0 text-gray-700 w-[110px]">Final</th>
                <th className="text-center py-3 px-4 text-gray-700 w-[100px]">Score %</th>
                <th className="text-center py-3 px-4 text-gray-700 w-[100px]">Grade (5–10)</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900 sticky left-0 bg-white z-10">{student.studentId}</td>
                  <td className="py-3 px-4 text-gray-900 sticky left-[140px] bg-white z-10">{student.name}</td>
                  <td className="py-3 px-2">
                    <input
                      type="text"
                      value={(student as any).midterm1}
                      onChange={(e) => handleGradeChange(student.id, 'midterm1', e.target.value)}
                      className={`w-[90px] mx-auto block px-2 py-1.5 text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-300 ${getGradeColor((student as any).midterm1)}`}
                      disabled={(student as any).final !== ''}
                      placeholder="0-100"
                    />
                  </td>
                  <td className="py-3 px-2">
                    <input
                      type="text"
                      value={(student as any).midterm2}
                      onChange={(e) => handleGradeChange(student.id, 'midterm2', e.target.value)}
                      className={`w-[90px] mx-auto block px-2 py-1.5 text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-300 ${getGradeColor((student as any).midterm2)}`}
                      disabled={(student as any).final !== ''}
                      placeholder="0-100"
                    />
                  </td>
                  <td className="py-3 px-2">
                    <input
                      type="text"
                      value={student.final}
                      onChange={(e) => handleGradeChange(student.id, 'final', e.target.value)}
                      className={`w-[90px] mx-auto block px-2 py-1.5 text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-300 ${getGradeColor(student.final)}`}
                      disabled={(student as any).midterm1 !== '' || (student as any).midterm2 !== ''}
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
                  <td className="py-3 px-4 text-center">
                    {student.average !== null ? (
                      <span className="inline-block px-3 py-1 rounded-full bg-gray-100 text-gray-800">
                        {/* @ts-ignore */}
                        {(() => {
                          const v = student.average as number;
                          return v >= 95 ? 10 : v >= 85 ? 9 : v >= 75 ? 8 : v >= 65 ? 7 : v >= 55 ? 6 : 5;
                        })()}
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
              <p>No eligible students found{selectedCourse ? ` for ${selectedCourse}` : ''}. Students will appear after they apply for the exam.</p>
            </div>
          )}
        </div>
      </Card>



      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Total Students</p>
            <p className="text-gray-900">{filteredStudents.length}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Completed Grading</p>
            <p className="text-green-600">
              {filteredStudents.filter(s => (s.final !== '') || ((s as any).midterm1 !== '' && (s as any).midterm2 !== '')).length}
            </p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Class Average</p>
            <p className="text-blue-600">
              {filteredStudents.filter(s => s.average !== null).length > 0
                ? Math.round(
                  filteredStudents.filter(s => s.average !== null).reduce((sum, s) => sum + (s.average || 0), 0) /
                  filteredStudents.filter(s => s.average !== null).length
                )
                : '-'}
            </p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Passing Rate</p>
            <p className="text-green-600">
              {filteredStudents.filter(s => s.average !== null).length > 0
                ? Math.round(
                  (filteredStudents.filter(s => s.average !== null && (s.average as number) >= 55).length /
                    filteredStudents.filter(s => s.average !== null).length) * 100
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
