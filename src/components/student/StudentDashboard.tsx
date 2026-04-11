import { Card } from '../shared/Card';
import {
  BookOpen,
  Calendar,
  DollarSign,
  TrendingUp,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { usePersistence } from '../../hooks/usePersistence';
import { STORAGE_KEYS, INITIAL_DATA, Announcement, ScheduleItem, Course, StudentGrade, Exam, User, Payment } from '../../lib/storage';
import { useState, useMemo } from 'react';
import { PaymentForm } from './PaymentForm';

export function StudentDashboard() {
  const [schedule] = usePersistence<ScheduleItem[]>(STORAGE_KEYS.SCHEDULE, INITIAL_DATA.SCHEDULE);
  const [announcements] = usePersistence<Announcement[]>(STORAGE_KEYS.ANNOUNCEMENTS, INITIAL_DATA.ANNOUNCEMENTS);
  const [courses] = usePersistence<Course[]>(STORAGE_KEYS.COURSES, INITIAL_DATA.COURSES);
  const [grades] = usePersistence<StudentGrade[]>(STORAGE_KEYS.GRADES, INITIAL_DATA.GRADES);
  const [allExams] = usePersistence<Exam[]>(STORAGE_KEYS.EXAMS, INITIAL_DATA.EXAMS);
  const [allAppliedExams] = usePersistence<Exam[]>(STORAGE_KEYS.STUDENT_APPLICATIONS, INITIAL_DATA.STUDENT_APPLICATIONS);
  const [currentUser] = usePersistence<User | null>(STORAGE_KEYS.CURRENT_USER, null);
  const [allPayments, setAllPayments] = usePersistence<Payment[]>(STORAGE_KEYS.PAYMENTS, INITIAL_DATA.PAYMENTS);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const studentId = currentUser?.studentId || String(currentUser?.id);
  const studentGrades = grades.filter(g => g.studentId === studentId && g.average !== null);

  const pendingPayments = useMemo(() => {
    return allPayments.filter(p => p.studentId === studentId && p.status === 'pending');
  }, [allPayments, studentId]);

  const totalPendingAmount = useMemo(() => {
    return pendingPayments.reduce((sum, p) => sum + p.amount, 0);
  }, [pendingPayments]);

  const nextPaymentDate = useMemo(() => {
    if (pendingPayments.length === 0) return '-';
    const dates = pendingPayments.map(p => new Date(p.date)).sort((a, b) => a.getTime() - b.getTime());
    return dates[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }, [pendingPayments]);

  const toBosnianGrade = (percent: number) => {
    if (percent >= 95) return 10;
    if (percent >= 85) return 9;
    if (percent >= 75) return 8;
    if (percent >= 65) return 7;
    if (percent >= 55) return 6;
    return 5;
  };

  const myAverage =
    studentGrades.length > 0
      ? (studentGrades.reduce((sum, g) => sum + toBosnianGrade(g.average as number), 0) / studentGrades.length).toFixed(1)
      : '-';

  const myAppliedExams = allAppliedExams.filter(e => e.studentId === studentId);
  const appliedCourseNames = new Set(myAppliedExams.map(e => e.course));
  const availableUpcomingExams = allExams.filter(e => !appliedCourseNames.has(e.course));

  const upcomingClasses = schedule.slice(0, 3).map(item => ({
    course: item.course,
    time: item.time,
    room: item.room,
  }));

  const recentAnnouncements = announcements.slice(0, 2).map(a => ({
    title: a.title,
    date: a.date,
    type: a.type || 'info',
  }));

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-gray-900 mb-2">Student Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's your overview.</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Average Grade</p>
              <p className="text-gray-900">{myAverage}</p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-600">Calculated from your scores</span>
              </div>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Enrolled Courses</p>
              <p className="text-gray-900">{courses.length}</p>
              <p className="text-sm text-gray-500 mt-2">Current Semester</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <BookOpen className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Upcoming Exams</p>
              <p className="text-gray-900">{availableUpcomingExams.length || '-'}</p>
              <p className="text-sm text-gray-500 mt-2">Available to apply</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pending Payment</p>
              <p className="text-gray-900">BAM {totalPendingAmount}</p>
              <p className="text-sm text-red-600 mt-2">Due: {nextPaymentDate}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Classes */}
        <Card title="Upcoming Classes">
          <div className="space-y-4">
            {upcomingClasses.length > 0 ? (
              upcomingClasses.map((classItem, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <div className="bg-blue-600 p-2 rounded-lg">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900">{classItem.course}</p>
                    <p className="text-sm text-gray-600">{classItem.time}</p>
                    <p className="text-sm text-gray-500">{classItem.room}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 border border-dashed border-blue-200 rounded-lg text-center text-gray-500">
                No upcoming classes
              </div>
            )}
          </div>
        </Card>

        {/* Recent Announcements */}
        <Card title="Recent Announcements">
          <div className="space-y-4">
            {recentAnnouncements.length > 0 ? (
              recentAnnouncements.map((announcement, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors cursor-pointer"
                >
                  <div
                    className={`p-2 rounded-lg ${
                      announcement.type === 'exam'
                        ? 'bg-orange-100'
                        : 'bg-blue-100'
                    }`}
                  >
                    <AlertCircle
                      className={`w-5 h-5 ${
                        announcement.type === 'exam'
                          ? 'text-orange-600'
                          : 'text-blue-600'
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900">{announcement.title}</p>
                    <p className="text-sm text-gray-500">{announcement.date}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 border border-dashed border-gray-200 rounded-lg text-center text-gray-500">
                No announcements
              </div>
            )}
            <button className="w-full text-center py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              View All Announcements
            </button>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card title="Quick Actions">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button className="flex items-center gap-3 p-4 border-2 border-blue-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <span className="text-gray-900">View Courses</span>
          </button>
          <button className="flex items-center gap-3 p-4 border-2 border-green-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all">
            <Calendar className="w-6 h-6 text-green-600" />
            <span className="text-gray-900">Apply for Exams</span>
          </button>
          <button 
            onClick={() => setIsPaymentModalOpen(true)}
            className="flex items-center gap-3 p-4 border-2 border-purple-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all"
          >
            <DollarSign className="w-6 h-6 text-purple-600" />
            <span className="text-gray-900">Make Payment</span>
          </button>
        </div>
      </Card>

      <PaymentForm
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        currentUser={currentUser}
        onSuccess={setAllPayments}
      />
    </div>
  );
}
