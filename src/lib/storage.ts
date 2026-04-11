
// Storage keys for local storage
export const STORAGE_KEYS = {
  USERS: 'uni_users',
  COURSES: 'uni_courses',
  GRADES: 'uni_grades',
  ANNOUNCEMENTS: 'uni_announcements',
  EXAMS: 'uni_exams',
  STUDENT_APPLICATIONS: 'uni_student_applications',
  CURRENT_USER: 'uni_current_user',
  SCHEDULE: 'uni_schedule',
  ATTENDANCE: 'uni_attendance',
};

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'student' | 'professor' | 'admin';
  status: 'active' | 'inactive' | 'suspended';
  joinDate: string;
  department?: string;
  studentId?: string;
}

export interface Course {
  id: number;
  code: string;
  name: string;
  department: string;
  professor: string;
  students: number;
  credits: number;
  semester: string;
  status: 'active' | 'inactive';
}

export interface StudentGrade {
  id: number;
  name: string;
  studentId: string;
  assignment1: string;
  assignment2: string;
  midterm: string;
  final: string;
  average: number | null;
  courseId: string;
}

export interface Announcement {
  id: number;
  title: string;
  content: string;
  course: string;
  date: string;
  time: string;
  priority: 'normal' | 'high';
  type?: string;
  author?: string;
}

export interface Exam {
  id: number;
  course: string;
  date: string;
  time: string;
  location: string;
  professor?: string;
  type: string;
  enrolled?: boolean;
  status?: string;
  applicationDate?: string;
}

export interface ScheduleItem {
  id: number;
  day: string;
  time: string;
  course: string;
  room: string;
  students: number;
  type: 'lecture' | 'lab' | 'office-hours';
}

export interface AttendanceStudent {
  id: number;
  name: string;
  studentId: string;
  attendance: boolean | null;
}

// Initial Data
export const INITIAL_DATA = {
  USERS: [
    { id: 1, name: 'John Anderson', email: 'john.anderson@university.edu', role: 'student', status: 'active', joinDate: 'Sep 1, 2023', department: 'Computer Science', studentId: 'IB230001' },
    { id: 2, name: 'Dr. Sarah Smith', email: 'sarah.smith@university.edu', role: 'professor', status: 'active', joinDate: 'Jan 15, 2020', department: 'Computer Science' },
    { id: 3, name: 'Emma Wilson', email: 'emma.wilson@university.edu', role: 'student', status: 'active', joinDate: 'Sep 1, 2023', department: 'Engineering', studentId: 'IB230002' },
    { id: 4, name: 'Prof. Michael Brown', email: 'michael.brown@university.edu', role: 'professor', status: 'active', joinDate: 'Aug 20, 2018', department: 'Engineering' },
    { id: 5, name: 'Admin User', email: 'admin@university.edu', role: 'admin', status: 'active', joinDate: 'Jan 1, 2015', department: 'Administration' },
    { id: 6, name: 'James Johnson', email: 'james.johnson@university.edu', role: 'student', status: 'active', joinDate: 'Sep 1, 2024', department: 'Business', studentId: 'IB240003' },
    { id: 7, name: 'Dr. Emily Martinez', email: 'emily.martinez@university.edu', role: 'professor', status: 'inactive', joinDate: 'Mar 10, 2019', department: 'Arts' },
    { id: 8, name: 'Daniel Garcia', email: 'daniel.garcia@university.edu', role: 'student', status: 'suspended', joinDate: 'Sep 1, 2022', department: 'Science', studentId: 'IB220004' },
  ] as User[],
  COURSES: [
    { id: 1, code: 'CS301', name: 'Data Structures', department: 'Computer Science', professor: 'Dr. Sarah Smith', students: 45, credits: 4, semester: 'Spring 2025', status: 'active' },
    { id: 2, code: 'CS401', name: 'Algorithms', department: 'Computer Science', professor: 'Dr. Sarah Smith', students: 38, credits: 4, semester: 'Spring 2025', status: 'active' },
    { id: 3, code: 'CS302', name: 'Database Systems', department: 'Computer Science', professor: 'Prof. Michael Brown', students: 42, credits: 4, semester: 'Spring 2025', status: 'active' },
    { id: 4, code: 'CS501', name: 'Machine Learning', department: 'Computer Science', professor: 'Prof. Michael Brown', students: 31, credits: 3, semester: 'Spring 2025', status: 'active' },
    { id: 5, code: 'ENG201', name: 'Thermodynamics', department: 'Engineering', professor: 'Dr. Sarah Smith', students: 50, credits: 4, semester: 'Spring 2025', status: 'active' },
    { id: 6, code: 'BUS101', name: 'Business Management', department: 'Business', professor: 'Prof. Michael Brown', students: 65, credits: 3, semester: 'Spring 2025', status: 'active' },
    { id: 7, code: 'CS201', name: 'Programming Basics', department: 'Computer Science', professor: 'Dr. Emily Martinez', students: 0, credits: 3, semester: 'Fall 2024', status: 'inactive' },
  ] as Course[],
  GRADES: [
    { id: 1, name: 'John Anderson', studentId: '2024-CS-1234', assignment1: '85', assignment2: '90', midterm: '88', final: '', average: null, courseId: 'CS301' },
    { id: 2, name: 'Emma Wilson', studentId: '2024-CS-1235', assignment1: '92', assignment2: '88', midterm: '90', final: '', average: null, courseId: 'CS301' },
    { id: 3, name: 'Michael Brown', studentId: '2024-CS-1236', assignment1: '78', assignment2: '82', midterm: '80', final: '', average: null, courseId: 'CS301' },
    { id: 4, name: 'Sarah Davis', studentId: '2024-CS-1237', assignment1: '95', assignment2: '93', midterm: '94', final: '', average: null, courseId: 'CS301' },
  ] as StudentGrade[],
  ANNOUNCEMENTS: [
    {
      id: 1,
      title: 'Midterm Exam Schedule released',
      content: 'The midterm examination schedule for all courses has been published. Please check your course pages for specific dates and times. Remember to apply for exams through the student portal at least 48 hours in advance.',
      course: 'Data Structures CS301',
      date: 'Nov 25, 2025',
      time: '9:30 AM',
      priority: 'high',
      type: 'exam',
      author: 'Academic Office'
    },
    {
      id: 2,
      title: 'Assignment 3 Deadline Extension',
      content: 'Due to technical issues with the submission system, Assignment 3 deadline has been extended to December 5, 2025.',
      course: 'Algorithms CS401',
      date: 'Nov 24, 2025',
      time: '2:15 PM',
      priority: 'normal',
      type: 'academic',
      author: 'Prof. Michael Brown'
    },
    {
      id: 3,
      title: 'Office Hours Update',
      content: 'This week\'s office hours will be moved to Thursday 3:00 PM - 5:00 PM instead of Friday.',
      course: 'All Courses',
      date: 'Nov 23, 2025',
      time: '10:00 AM',
      priority: 'normal',
      type: 'info',
      author: 'Dr. Sarah Smith'
    },
    {
      id: 4,
      title: 'Library Hours Extended During Exam Period',
      content: 'Starting December 1st, the university library will extend its hours to support students during the examination period. New hours: Monday-Friday 7:00 AM - 11:00 PM, Saturday-Sunday 9:00 AM - 9:00 PM.',
      date: 'Nov 24, 2025',
      time: '2:15 PM',
      type: 'info',
      author: 'Library Services',
      priority: 'normal',
      course: 'General'
    },
    {
      id: 5,
      title: 'Payment Deadline Reminder',
      content: 'This is a reminder that the Spring 2025 semester tuition payment deadline is December 15, 2025. Please ensure your payment is submitted on time to avoid late fees.',
      date: 'Nov 23, 2025',
      time: '10:00 AM',
      type: 'payment',
      author: 'Finance Office',
      priority: 'high',
      course: 'General'
    }
  ] as Announcement[],
  EXAMS: [
    { id: 1, course: 'Data Structures', date: 'Dec 10, 2025', time: '10:00 AM - 12:00 PM', location: 'Room 301', professor: 'Dr. Sarah Smith', type: 'Midterm', enrolled: true },
    { id: 2, course: 'Web Development', date: 'Dec 12, 2025', time: '2:00 PM - 4:00 PM', location: 'Lab 5', professor: 'Prof. Michael Brown', type: 'Final', enrolled: true },
    { id: 3, course: 'Database Systems', date: 'Dec 15, 2025', time: '9:00 AM - 11:00 AM', location: 'Room 205', professor: 'Dr. Sarah Smith', type: 'Midterm', enrolled: true },
    { id: 4, course: 'Software Engineering', date: 'Dec 18, 2025', time: '1:00 PM - 3:00 PM', location: 'Room 102', professor: 'Dr. Michael Brown', type: 'Final', enrolled: true },
  ] as Exam[],
  STUDENT_APPLICATIONS: [
    { id: 5, course: 'Computer Networks', date: 'Dec 8, 2025', time: '10:00 AM - 12:00 PM', location: 'Room 401', status: 'confirmed', applicationDate: 'Nov 20, 2025' },
    { id: 6, course: 'Operating Systems', date: 'Dec 20, 2025', time: '3:00 PM - 5:00 PM', location: 'Room 303', status: 'confirmed', applicationDate: 'Nov 22, 2025' },
  ] as Exam[],
  SCHEDULE: [
    { id: 1, day: 'Monday', time: '10:00 AM - 12:00 PM', course: 'Data Structures CS301', room: 'Room 301', students: 45, type: 'lecture' },
    { id: 2, day: 'Monday', time: '2:00 PM - 4:00 PM', course: 'Algorithms CS401', room: 'Room 205', students: 38, type: 'lecture' },
    { id: 3, day: 'Tuesday', time: '9:00 AM - 11:00 AM', course: 'Database Systems CS302', room: 'Room 102', students: 42, type: 'lecture' },
    { id: 4, day: 'Wednesday', time: '10:00 AM - 12:00 PM', course: 'Data Structures CS301', room: 'Room 301', students: 45, type: 'lecture' },
    { id: 5, day: 'Wednesday', time: '3:00 PM - 5:00 PM', course: 'Machine Learning CS501', room: 'Lab 5', students: 31, type: 'lab' },
    { id: 6, day: 'Thursday', time: '2:00 PM - 4:00 PM', course: 'Algorithms CS401', room: 'Room 205', students: 38, type: 'lecture' },
    { id: 7, day: 'Friday', time: '1:00 PM - 3:00 PM', course: 'Office Hours', room: 'Office 412', students: 0, type: 'office-hours' },
  ] as ScheduleItem[],
  ATTENDANCE: [
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
  ] as AttendanceStudent[]
};

// Generic storage utility
export const storage = {
  get: <T>(key: string, defaultValue: T): T => {
    const saved = localStorage.getItem(key);
    if (!saved) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error(`Error parsing storage key "${key}":`, e);
      return defaultValue;
    }
  },

  set: <T>(key: string, value: T): void => {
    localStorage.setItem(key, JSON.stringify(value));
  },

  update: <T>(key: string, id: string | number, newData: Partial<T>): void => {
    const data = storage.get<any[]>(key, []);
    const updated = data.map(item => (item.id === id ? { ...item, ...newData } : item));
    storage.set(key, updated);
  },

  push: <T>(key: string, item: T): void => {
    const data = storage.get<any[]>(key, []);
    storage.set(key, [...data, item]);
  },

  remove: (key: string, id: string | number): void => {
    const data = storage.get<any[]>(key, []);
    storage.set(key, data.filter(item => item.id !== id));
  },

  reset: (key: string, initialData: any): void => {
    localStorage.setItem(key, JSON.stringify(initialData));
  },

  clearAll: (): void => {
    localStorage.clear();
    window.location.reload();
  }
};
