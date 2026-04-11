import { Card } from '../shared/Card';
import { Button } from '../shared/Button';
import { useEffect, useMemo, useState } from 'react';
import { Save, Search, Download, AlertCircle, Calendar, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { usePersistence } from '../../hooks/usePersistence';
import { STORAGE_KEYS, INITIAL_DATA, StudentGrade, Course, User, Exam } from '../../lib/storage';

export function ProfessorGrades() {
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedExamId, setSelectedExamId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const [examGrades, setExamGrades] = useState<{ [studentId: number]: string }>({});

  const [students, setStudents] = usePersistence<StudentGrade[]>(STORAGE_KEYS.GRADES, INITIAL_DATA.GRADES);
  const [courses] = usePersistence<Course[]>(STORAGE_KEYS.COURSES, INITIAL_DATA.COURSES);
  const [exams] = usePersistence<Exam[]>(STORAGE_KEYS.EXAMS, INITIAL_DATA.EXAMS);
  const [allAppliedExams] = usePersistence<Exam[]>(STORAGE_KEYS.STUDENT_APPLICATIONS, INITIAL_DATA.STUDENT_APPLICATIONS);
  const [currentUser] = usePersistence<User | null>(STORAGE_KEYS.CURRENT_USER, null);
  const deptCourses = currentUser?.department
    ? courses.filter(c => c.department === (currentUser?.department || ''))
    : courses;

  const selectedCourseData = deptCourses.find(c => c.code === selectedCourse);
  const courseExams = exams.filter(e => e.course.includes(selectedCourse) || (selectedCourseData && e.course.includes(selectedCourseData.name)));

  useEffect(() => {
    if (!selectedCourse && deptCourses.length > 0) {
      setSelectedCourse(deptCourses[0].code);
    }
  }, [deptCourses, selectedCourse]);

  useEffect(() => {
    // Reset selected exam when course changes
    setSelectedExamId(null);
    setExamGrades({});
  }, [selectedCourse]);

  const handleExamGradeChange = (studentId: number, value: string) => {
    if (value && (isNaN(Number(value)) || Number(value) < 0 || Number(value) > 100)) {
      toast.error('Grade must be between 0 and 100');
      return;
    }
    setExamGrades(prev => ({ ...prev, [studentId]: value }));
  };

  const handleSaveExamGrades = () => {
    if (!selectedExamId) return;
    const exam = exams.find(e => e.id === selectedExamId);
    if (!exam) return;

    const field = getGradeField(exam.type);

    const updatedStudents = students.map(student => {
      if (examGrades[student.id] !== undefined) {
        const updated: StudentGrade = { ...student, [field]: examGrades[student.id] };
        
        // Recalculate average (same logic as before)
        const f = updated.final !== '' ? Number(updated.final) : null;
        const m1 = updated.midterm1 !== '' ? Number(updated.midterm1) : null;
        const m2 = updated.midterm2 !== '' ? Number(updated.midterm2) : null;
        
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
    });

    setStudents(updatedStudents);
    setExamGrades({});
    toast.success('Grades updated successfully');
  };

  const isExamPast = (examDate: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = new Date(examDate);
    return date < today;
  };

  const getGradeField = (examType: string) => {
    const type = examType.toLowerCase();
    if (type.includes('midterm 1') || type === 'midterm') return 'midterm1';
    if (type.includes('midterm 2')) return 'midterm2';
    if (type.includes('final')) return 'final';
    return 'final'; // Default fallback
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

  const selectedExam = exams.find(e => e.id === selectedExamId);
  const examStudents = useMemo(() => {
    if (!selectedExamId) return [];
    // Only show students who have a confirmed application for this specific exam
    const appliedStudentIds = new Set(
      allAppliedExams
        .filter(app => app.id === selectedExamId && app.status === 'confirmed')
        .map(app => app.studentId)
    );
    return filteredStudents.filter(s => appliedStudentIds.has(s.studentId));
  }, [selectedExamId, allAppliedExams, filteredStudents]);

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
        <h1 className="text-gray-900 mb-2">Grade Management</h1>
        <p className="text-gray-600">Overview and manage student grades by course and exam</p>
      </div>

      {/* Course Selection Interface */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Course</label>
            <div className="relative">
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none bg-white"
              >
                {deptCourses.length === 0 && (
                  <option value="" disabled>No courses available</option>
                )}
                {deptCourses.map(course => (
                  <option key={course.id} value={course.code}>{`${course.name} (${course.code})`}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <Search className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Students</label>
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
        </div>
      </Card>

      {/* Student Grade Overview (Read-only) */}
      <Card title="Student Grade Overview">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-gray-700 sticky left-0 bg-white z-10">Student ID</th>
                <th className="text-left py-3 px-4 text-gray-700 sticky left-[140px] bg-white z-10">Name</th>
                <th className="text-center py-3 px-4 text-gray-700">Midterm 1</th>
                <th className="text-center py-3 px-4 text-gray-700">Midterm 2</th>
                <th className="text-center py-3 px-4 text-gray-700">Final</th>
                <th className="text-center py-3 px-4 text-gray-700">Score %</th>
                <th className="text-center py-3 px-4 text-gray-700">Grade</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900 sticky left-0 bg-white z-10">{student.studentId}</td>
                  <td className="py-3 px-4 text-gray-900 sticky left-[140px] bg-white z-10 font-medium">{student.name}</td>
                  <td className={`py-3 px-4 text-center font-semibold ${getGradeColor(student.midterm1)}`}>
                    {student.midterm1 || '-'}
                  </td>
                  <td className={`py-3 px-4 text-center font-semibold ${getGradeColor(student.midterm2)}`}>
                    {student.midterm2 || '-'}
                  </td>
                  <td className={`py-3 px-4 text-center font-semibold ${getGradeColor(student.final)}`}>
                    {student.final || '-'}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {student.average !== null ? (
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${student.average >= 90 ? 'bg-green-100 text-green-700' :
                        student.average >= 80 ? 'bg-blue-100 text-blue-700' :
                        student.average >= 70 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                        }`}>
                        {student.average}%
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {student.average !== null ? (
                      <span className="inline-block px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-sm font-bold">
                        {student.average >= 95 ? 10 : student.average >= 85 ? 9 : student.average >= 75 ? 8 : student.average >= 65 ? 7 : student.average >= 55 ? 6 : 5}
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
              <p>No students enrolled in this course.</p>
            </div>
          )}
        </div>
      </Card>

      {/* Exam Management Section */}
      <Card title="Exam Management & Grading">
        <div className="space-y-6">
          <div className="max-w-md">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Exam to Grade</label>
            <select
              value={selectedExamId || ''}
              onChange={(e) => setSelectedExamId(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
            >
              <option value="">Select an exam</option>
              {courseExams.map(exam => (
                <option key={exam.id} value={exam.id}>
                  {`${exam.type} - ${exam.date} (${exam.location})`}
                </option>
              ))}
            </select>
          </div>

          {selectedExam && (
            <div className="space-y-4">
              <div className={`p-4 rounded-lg border flex items-start gap-3 ${isExamPast(selectedExam.date) ? 'bg-blue-50 border-blue-200' : 'bg-yellow-50 border-yellow-200'}`}>
                {isExamPast(selectedExam.date) ? (
                  <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5" />
                ) : (
                  <Calendar className="w-5 h-5 text-yellow-600 mt-0.5" />
                )}
                <div>
                  <h4 className={`font-semibold ${isExamPast(selectedExam.date) ? 'text-blue-900' : 'text-yellow-900'}`}>
                    {isExamPast(selectedExam.date) ? 'Grading Available' : 'Grading Locked'}
                  </h4>
                  <p className={`text-sm ${isExamPast(selectedExam.date) ? 'text-blue-700' : 'text-yellow-700'}`}>
                    {isExamPast(selectedExam.date) 
                      ? `This exam took place on ${selectedExam.date}. You can now enter grades.`
                      : `This exam is scheduled for ${selectedExam.date}. Grading will be enabled after this date.`
                    }
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-gray-700">Student ID</th>
                      <th className="text-left py-3 px-4 text-gray-700">Name</th>
                      <th className="text-center py-3 px-4 text-gray-700 w-[150px]">
                        {selectedExam.type} Grade
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {examStudents.map((student) => {
                      const field = getGradeField(selectedExam.type);
                      const currentGrade = student[field as keyof StudentGrade] as string;
                      
                      return (
                        <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 text-gray-900">{student.studentId}</td>
                          <td className="py-3 px-4 text-gray-900">{student.name}</td>
                          <td className="py-3 px-4">
                            <input
                              type="text"
                              value={examGrades[student.id] ?? currentGrade ?? ''}
                              onChange={(e) => handleExamGradeChange(student.id, e.target.value)}
                              disabled={!isExamPast(selectedExam.date)}
                              placeholder="0-100"
                              className="w-full px-3 py-1.5 text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-50 disabled:text-gray-400"
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {isExamPast(selectedExam.date) && Object.keys(examGrades).length > 0 && (
                <div className="flex justify-end pt-4">
                  <Button onClick={handleSaveExamGrades}>
                    <Save className="w-4 h-4" />
                    Save Exam Grades
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>



      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Total Students</p>
            <p className="text-gray-900 font-bold">{filteredStudents.length}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Completed Grading</p>
            <p className="text-green-600 font-bold">
              {filteredStudents.filter(s => (s.final !== '') || (s.midterm1 !== '' && s.midterm2 !== '')).length}
            </p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Class Average</p>
            <p className="text-blue-600 font-bold">
              {filteredStudents.filter(s => s.average !== null).length > 0
                ? Math.round(
                  filteredStudents.filter(s => s.average !== null).reduce((sum, s) => sum + (s.average || 0), 0) /
                  filteredStudents.filter(s => s.average !== null).length
                )
                : '-'}%
            </p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Passing Rate</p>
            <p className="text-green-600 font-bold">
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
    </div>
  );
}
