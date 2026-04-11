import { Card } from '../shared/Card';
import {
  Users,
  BookOpen,
  Calendar,
  TrendingUp,
} from 'lucide-react';
import { useMemo } from 'react';
import { usePersistence } from '../../hooks/usePersistence';
import { STORAGE_KEYS, INITIAL_DATA, Course, ScheduleItem, StudentGrade, Announcement, User } from '../../lib/storage';

export function ProfessorDashboard() {
  const [currentUser] = usePersistence<User | null>(STORAGE_KEYS.CURRENT_USER, null);
  const [courses] = usePersistence<Course[]>(STORAGE_KEYS.COURSES, INITIAL_DATA.COURSES);
  const [scheduleItems] = usePersistence<ScheduleItem[]>(STORAGE_KEYS.SCHEDULE, INITIAL_DATA.SCHEDULE);
  const [grades] = usePersistence<StudentGrade[]>(STORAGE_KEYS.GRADES, INITIAL_DATA.GRADES);
  const [announcements] = usePersistence<Announcement[]>(STORAGE_KEYS.ANNOUNCEMENTS, INITIAL_DATA.ANNOUNCEMENTS);

  const profCourses = useMemo(() => {
    return courses.filter(c =>
      (currentUser?.name ? c.professor === currentUser.name : true) &&
      (currentUser?.department ? c.department === currentUser.department : true) &&
      c.status === 'active'
    );
  }, [courses, currentUser]);

  const courseDisplayName = (c: Course) => `${c.name} ${c.code}`;
  const profCourseNames = new Set(profCourses.map(courseDisplayName));
  const profCourseCodes = new Set(profCourses.map(c => c.code));

  const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const todayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date().getDay()];
  const dayIndex = (d: string) => dayOrder.indexOf(d);
  const todayIdx = dayIndex(todayName);

  const upcomingClasses = useMemo(() => {
    const items = scheduleItems
      .filter(i => profCourseNames.has(i.course))
      .map(i => ({
        course: i.course,
        day: i.day,
        time: i.time,
        room: i.room,
        students: i.students,
      }))
      .sort((a, b) => {
        const ai = dayIndex(a.day);
        const bi = dayIndex(b.day);
        const normA = ai < 0 ? 99 : (ai - (todayIdx < 0 ? 0 : todayIdx) + dayOrder.length) % dayOrder.length;
        const normB = bi < 0 ? 99 : (bi - (todayIdx < 0 ? 0 : todayIdx) + dayOrder.length) % dayOrder.length;
        return normA - normB;
      })
      .slice(0, 5);
    return items;
  }, [scheduleItems, profCourseNames, todayIdx]);

  const totalStudents = useMemo(() => {
    return profCourses.reduce((sum, c) => sum + (c.students || 0), 0);
  }, [profCourses]);

  const avgGrade = useMemo(() => {
    const relevant = grades.filter(g => profCourseCodes.has(g.courseId));
    const avgs = relevant.map(g => g.average).filter(a => a !== null) as number[];
    if (avgs.length === 0) return '-';
    return Math.round(avgs.reduce((a, b) => a + b, 0) / avgs.length);
  }, [grades, profCourseCodes]);

  const announcementsCount = useMemo(() => {
    const names = new Set(profCourses.map(courseDisplayName));
    return announcements.filter(a => names.has(a.course)).length;
  }, [announcements, profCourses]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-gray-900 mb-2">Professor Dashboard</h1>
        <p className="text-gray-600">
          Welcome back{currentUser?.name ? `, ${currentUser.name}` : ''}! {currentUser?.department ? `Department: ${currentUser.department}` : ''}
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Active Courses</p>
              <p className="text-gray-900">{profCourses.length}</p>
              <p className="text-sm text-gray-500 mt-2">Filtered by your department</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <BookOpen className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Students</p>
              <p className="text-gray-900">{totalStudents}</p>
              <p className="text-sm text-gray-500 mt-2">Across your courses</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Upcoming Classes</p>
              <p className="text-gray-900">{upcomingClasses.length}</p>
              <p className="text-sm text-gray-500 mt-2">This week</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Average Grade</p>
              <p className="text-gray-900">{avgGrade}</p>
              <p className="text-sm text-gray-500 mt-2">Across graded students</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Classes */}
        <Card title="Upcoming Classes">
          <div className="space-y-4">
            {upcomingClasses.map((classItem, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors cursor-pointer"
              >
                <div className="bg-green-600 p-2 rounded-lg">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-900">{classItem.course}</p>
                  <p className="text-sm text-gray-600">{classItem.day} • {classItem.time}</p>
                  <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                    <span>{classItem.room}</span>
                    <span>•</span>
                    <span>{classItem.students} students</span>
                  </div>
                </div>
              </div>
            ))}
            {upcomingClasses.length === 0 && (
              <div className="text-center text-gray-500 py-6">No upcoming classes</div>
            )}
          </div>
        </Card>

        <Card title="Announcements">
          <div className="space-y-2">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <p className="text-gray-900">Announcements for your courses</p>
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">{announcementsCount}</span>
            </div>
            {announcementsCount === 0 && (
              <div className="text-center text-gray-500 py-6">No announcements yet</div>
            )}
          </div>
        </Card>
      </div>

      {/* Course Overview */}
      <Card title="Course Overview">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {profCourses.map((c) => {
            const courseGrades = grades.filter(g => g.courseId === c.code);
            const avgs = courseGrades.map(g => g.average).filter(a => a !== null) as number[];
            const courseAvg = avgs.length > 0 ? Math.round(avgs.reduce((a, b) => a + b, 0) / avgs.length) : '-';
            return (
              <div key={c.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-gray-900">{c.name} {c.code}</h4>
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm">{c.status === 'active' ? 'Active' : 'Inactive'}</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Students:</span>
                    <span className="text-gray-900">{c.students}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Average Grade:</span>
                    <span className="text-gray-900">{courseAvg}</span>
                  </div>
                </div>
              </div>
            );
          })}
          {profCourses.length === 0 && (
            <div className="text-center text-gray-500 py-6">No courses assigned</div>
          )}
        </div>
      </Card>

      <Card title="Summary">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-gray-900 mb-1">Courses</p>
            <p className="text-sm text-gray-600">{profCourses.length} active</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-gray-900 mb-1">Students</p>
            <p className="text-sm text-gray-600">{totalStudents} total</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-gray-900 mb-1">Announcements</p>
            <p className="text-sm text-gray-600">{announcementsCount}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
