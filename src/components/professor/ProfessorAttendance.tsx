import { Card } from '../shared/Card';
import { Button } from '../shared/Button';
import { useEffect, useMemo, useState } from 'react';
import { Check, X, Search, Calendar, Download, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { usePersistence } from '../../hooks/usePersistence';
import { STORAGE_KEYS, INITIAL_DATA, AttendanceStudent, ScheduleItem, Course, User, storage, AttendanceHistory } from '../../lib/storage';

export function ProfessorAttendance() {
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedDate, setSelectedDate] = useState('2025-11-27');
  const [searchQuery, setSearchQuery] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  const [attendanceHistory, setAttendanceHistory] = usePersistence<AttendanceHistory>(STORAGE_KEYS.ATTENDANCE, INITIAL_DATA.ATTENDANCE);
  const [scheduleItems] = usePersistence<ScheduleItem[]>(STORAGE_KEYS.SCHEDULE, INITIAL_DATA.SCHEDULE);
  const [courses] = usePersistence<Course[]>(STORAGE_KEYS.COURSES, INITIAL_DATA.COURSES);
  const [users] = usePersistence<User[]>(STORAGE_KEYS.USERS, INITIAL_DATA.USERS);
  const currentUser = storage.get<User | null>(STORAGE_KEYS.CURRENT_USER, null);

  const currentSessionKey = useMemo(() => `${selectedCourse}_${selectedDate}`, [selectedCourse, selectedDate]);

  const lectureOptions = (() => {
    const map = new Map<string, string>();
    scheduleItems
      .filter(i => i.type === 'lecture')
      .forEach(i => {
        const id = `${i.course} | ${i.day} | ${i.time}`;
        const name = `${i.course} — ${i.day} ${i.time}`;
        map.set(id, name);
      });
    return Array.from(map, ([id, name]) => ({ id, name }));
  })();

  useEffect(() => {
    if (!selectedCourse && lectureOptions.length > 0) {
      setSelectedCourse(lectureOptions[0].id);
    }
  }, [lectureOptions, selectedCourse]);

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const getDayNameFromDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return dayNames[d.getDay()];
  };
  const getNextDateForDay = (targetDay: string, from: Date) => {
    const d = new Date(from);
    for (let i = 0; i < 14; i++) {
      if (dayNames[d.getDay()] === targetDay) break;
      d.setDate(d.getDate() + 1);
    }
    return d.toISOString().split('T')[0];
  };
  const selectedLectureDay = selectedCourse ? (selectedCourse.split(' | ')[1] || '') : '';
  useEffect(() => {
    if (selectedLectureDay) {
      const next = getNextDateForDay(selectedLectureDay, new Date());
      setSelectedDate(next);
    }
  }, [selectedLectureDay]);

  const selectedCourseDisplay = useMemo(() => (selectedCourse ? selectedCourse.split(' | ')[0] : ''), [selectedCourse]);
  const selectedCourseDept = useMemo(() => {
    const c = courses.find(c => `${c.name} ${c.code}` === selectedCourseDisplay);
    return c?.department || '';
  }, [courses, selectedCourseDisplay]);

  const effectiveDept = useMemo(() => selectedCourseDept || currentUser?.department || '', [selectedCourseDept, currentUser]);

  const currentSessionRecords = useMemo(() => {
    return attendanceHistory[currentSessionKey] || {};
  }, [attendanceHistory, currentSessionKey]);

  const deptStudents = useMemo(() => {
    if (!effectiveDept) return [];
    return users.filter(u => u.role === 'student' && u.department === effectiveDept);
  }, [users, effectiveDept]);

  const displayStudents = useMemo(() => {
    return deptStudents.map(student => ({
      ...student,
      attendance: currentSessionRecords[student.studentId || String(student.id)] ?? null
    }));
  }, [deptStudents, currentSessionRecords]);

  const handleAttendance = (studentId: string, present: boolean) => {
    const updatedHistory = {
      ...attendanceHistory,
      [currentSessionKey]: {
        ...currentSessionRecords,
        [studentId]: present
      }
    };
    setAttendanceHistory(updatedHistory);
    setHasChanges(true);
  };

  const markAllPresent = () => {
    const newRecords: { [id: string]: boolean } = {};
    deptStudents.forEach(s => {
      newRecords[s.studentId || String(s.id)] = true;
    });
    setAttendanceHistory({
      ...attendanceHistory,
      [currentSessionKey]: newRecords
    });
    setHasChanges(true);
    toast.success('All students marked present');
  };

  const markAllAbsent = () => {
    const newRecords: { [id: string]: boolean } = {};
    deptStudents.forEach(s => {
      newRecords[s.studentId || String(s.id)] = false;
    });
    setAttendanceHistory({
      ...attendanceHistory,
      [currentSessionKey]: newRecords
    });
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

  const filteredStudents = displayStudents.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (student.studentId || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const presentCount = displayStudents.filter(s => s.attendance === true).length;
  const absentCount = displayStudents.filter(s => s.attendance === false).length;
  const unmarkedCount = displayStudents.filter(s => s.attendance === null).length;

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
            <label className="block text-sm text-gray-700 mb-2">Lecture</label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {lectureOptions.length === 0 ? (
                <option value="" disabled>No lectures available</option>
              ) : (
                lectureOptions.map(option => (
                  <option key={option.id} value={option.id}>{option.name}</option>
                ))
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  const v = e.target.value;
                  if (selectedLectureDay && getDayNameFromDate(v) !== selectedLectureDay) {
                    const corrected = getNextDateForDay(selectedLectureDay, new Date(v));
                    setSelectedDate(corrected);
                    toast.error(`Only ${selectedLectureDay} is allowed for the selected lecture. Adjusted to ${corrected}.`);
                    return;
                  }
                  setSelectedDate(v);
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            {selectedLectureDay && (
              <p className="text-xs text-gray-500 mt-1">Only {selectedLectureDay} dates are allowed for this lecture.</p>
            )}
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
            <p className="text-gray-900">{displayStudents.length}</p>
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
                        onClick={() => handleAttendance(student.studentId || String(student.id), true)}
                        className={`p-2 rounded-lg transition-colors ${student.attendance === true
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-green-100 hover:text-green-600'
                          }`}
                        aria-label="Mark present"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleAttendance(student.studentId || String(student.id), false)}
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
