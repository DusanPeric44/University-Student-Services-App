import { Card } from '../shared/Card';
import { Button } from '../shared/Button';
import { useEffect, useMemo, useState } from 'react';
import { Save, Search, Download, AlertCircle, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { usePersistence } from '../../hooks/usePersistence';
import { STORAGE_KEYS, INITIAL_DATA, StudentGrade, Course, User, storage } from '../../lib/storage';
import { Modal } from '../shared/Modal';

export function ProfessorGrades() {
  const [selectedCourse, setSelectedCourse] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  const [students, setStudents] = usePersistence<StudentGrade[]>(STORAGE_KEYS.GRADES, INITIAL_DATA.GRADES);
  const [courses] = usePersistence<Course[]>(STORAGE_KEYS.COURSES, INITIAL_DATA.COURSES);
  const [users] = usePersistence<User[]>(STORAGE_KEYS.USERS, INITIAL_DATA.USERS);
  const currentUser = storage.get<User | null>(STORAGE_KEYS.CURRENT_USER, null);
  const deptCourses = currentUser?.department
    ? courses.filter(c => c.department === (currentUser?.department || ''))
    : courses;

  const [showAddModal, setShowAddModal] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: '', studentId: '' });

  useEffect(() => {
    if (!selectedCourse && deptCourses.length > 0) {
      setSelectedCourse(deptCourses[0].code);
    }
  }, [deptCourses, selectedCourse]);

  const selectedCourseObj = useMemo(() => courses.find(c => c.code === selectedCourse), [courses, selectedCourse]);
  const selectedCourseDept = selectedCourseObj?.department || '';

  useEffect(() => {
    if (!selectedCourse) return;
    const deptStudents = users.filter(u => u.role === 'student' && u.department === selectedCourseDept);
    const existing = new Set(students.filter(s => s.courseId === selectedCourse).map(s => s.studentId));
    const missing: StudentGrade[] = deptStudents
      .filter(u => !existing.has(u.studentId || String(u.id)))
      .map(u => ({
        id: Date.now() + u.id,
        name: u.name,
        studentId: u.studentId || String(u.id),
        assignment1: '',
        assignment2: '',
        midterm: '',
        final: '',
        average: null,
        courseId: selectedCourse,
      }));
    if (missing.length > 0) {
      setStudents([...students, ...missing]);
      setHasChanges(true);
    }
  }, [selectedCourse, selectedCourseDept, users, students, setStudents]);

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

  const filteredStudents = students
    .filter(s => (selectedCourse ? s.courseId === selectedCourse : true))
    .filter(student =>
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
          <Button variant="secondary" size="sm" onClick={() => setShowAddModal(true)} disabled={!selectedCourse}>
            <Plus className="w-4 h-4" />
            Add Student
          </Button>
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
              <p>No students found{selectedCourse ? ` for ${selectedCourse}` : ''}</p>
            </div>
          )}
        </div>
      </Card>

      {/* Add Student Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setNewStudent({ name: '', studentId: '' });
        }}
        title="Add Student"
        size="md"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setShowAddModal(false);
                setNewStudent({ name: '', studentId: '' });
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (!selectedCourse) return;
                const item: StudentGrade = {
                  id: Date.now(),
                  name: newStudent.name.trim(),
                  studentId: newStudent.studentId.trim(),
                  assignment1: '',
                  assignment2: '',
                  midterm: '',
                  final: '',
                  average: null,
                  courseId: selectedCourse,
                };
                if (!item.name || !item.studentId) {
                  toast.error('Name and Student ID are required');
                  return;
                }
                setStudents([...students, item]);
                setHasChanges(true);
                toast.success('Student added');
                setShowAddModal(false);
                setNewStudent({ name: '', studentId: '' });
              }}
            >
              <Plus className="w-4 h-4" />
              Add
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-2">Course</label>
            <input
              type="text"
              value={selectedCourse}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-2">Student Name *</label>
            <input
              type="text"
              value={newStudent.name}
              onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="e.g., John Doe"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-2">Student ID *</label>
            <input
              type="text"
              value={newStudent.studentId}
              onChange={(e) => setNewStudent({ ...newStudent, studentId: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="e.g., 2026-CS-0001"
            />
          </div>
        </div>
      </Modal>

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
