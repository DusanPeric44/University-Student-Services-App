
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
  USERS: [] as User[],
  COURSES: [] as Course[],
  GRADES: [] as StudentGrade[],
  ANNOUNCEMENTS: [] as Announcement[],
  EXAMS: [] as Exam[],
  STUDENT_APPLICATIONS: [] as Exam[],
  SCHEDULE: [] as ScheduleItem[],
  ATTENDANCE: [] as AttendanceStudent[]
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
