import { Card } from '../shared/Card';
import { Button } from '../shared/Button';
import { Modal } from '../shared/Modal';
import { useState } from 'react';
import { Plus, Search, Edit, Trash2, BookOpen, Users, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { usePersistence } from '../../hooks/usePersistence';
import { STORAGE_KEYS, INITIAL_DATA, Course } from '../../lib/storage';
import { DEPARTMENTS } from '../../lib/constants';

export function AdminCourseManagement() {
  const [courses, setCourses] = usePersistence<Course[]>(STORAGE_KEYS.COURSES, INITIAL_DATA.COURSES);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    department: 'Computer Science',
    professor: '',
    students: 0,
    credits: 3,
    semester: 'Spring 2025',
    status: 'active' as 'active' | 'inactive',
  });

  const departments = DEPARTMENTS;

  const handleAddCourse = () => {
    const newCourse: Course = {
      id: Date.now(),
      ...formData,
    };
    setCourses([...courses, newCourse]);
    setShowAddModal(false);
    toast.success('Course added successfully');
    resetForm();
  };

  const handleEditCourse = () => {
    if (selectedCourse) {
      const updatedCourses = courses.map(c =>
        c.id === selectedCourse.id
          ? { ...c, ...formData }
          : c
      );
      setCourses(updatedCourses);
      setShowEditModal(false);
      toast.success('Course updated successfully');
      resetForm();
      setSelectedCourse(null);
    }
  };

  const handleDeleteCourse = (id: number) => {
    setCourses(courses.filter(c => c.id !== id));
    toast.success('Course deleted successfully');
  };

  const openEditModal = (course: Course) => {
    setSelectedCourse(course);
    setFormData({
      code: course.code,
      name: course.name,
      department: course.department,
      professor: course.professor,
      students: course.students,
      credits: course.credits,
      semester: course.semester,
      status: course.status,
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      code: '',
      name: '',
      department: 'Computer Science',
      professor: '',
      students: 0,
      credits: 3,
      semester: 'Spring 2025',
      status: 'active',
    });
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.professor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = filterDepartment === 'all' || course.department === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">Course Management</h1>
          <p className="text-gray-600">Manage courses and programs across all departments</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4" />
          Add Course
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-700 mb-2">Search Courses</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, code, or professor"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">Filter by Department</label>
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Total Courses</p>
            <p className="text-gray-900">{courses.length}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Active Courses</p>
            <p className="text-green-600">{courses.filter(c => c.status === 'active').length}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Total Students</p>
            <p className="text-blue-600">{courses.reduce((sum, c) => sum + c.students, 0)}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Departments</p>
            <p className="text-purple-600">{new Set(courses.map(c => c.department)).size}</p>
          </div>
        </Card>
      </div>

      {/* Courses Table */}
      <Card title="All Courses">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-gray-700">Course Code</th>
                <th className="text-left py-3 px-4 text-gray-700">Course Name</th>
                <th className="text-left py-3 px-4 text-gray-700">Department</th>
                <th className="text-left py-3 px-4 text-gray-700">Professor</th>
                <th className="text-center py-3 px-4 text-gray-700">Students</th>
                <th className="text-center py-3 px-4 text-gray-700">Credits</th>
                <th className="text-left py-3 px-4 text-gray-700">Semester</th>
                <th className="text-center py-3 px-4 text-gray-700">Status</th>
                <th className="text-center py-3 px-4 text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.map((course) => (
                <tr key={course.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900">{course.code}</td>
                  <td className="py-3 px-4 text-gray-900">{course.name}</td>
                  <td className="py-3 px-4 text-gray-600">{course.department}</td>
                  <td className="py-3 px-4 text-gray-600">{course.professor}</td>
                  <td className="py-3 px-4 text-center text-gray-900">{course.students}</td>
                  <td className="py-3 px-4 text-center text-gray-900">{course.credits}</td>
                  <td className="py-3 px-4 text-gray-600">{course.semester}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-1 rounded text-sm ${course.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                      }`}>
                      {course.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => openEditModal(course)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label="Edit course"
                      >
                        <Edit className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleDeleteCourse(course.id)}
                        className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                        aria-label="Delete course"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredCourses.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No courses found</p>
            </div>
          )}
        </div>
      </Card>

      {/* Add Course Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          resetForm();
        }}
        title="Add New Course"
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => {
              setShowAddModal(false);
              resetForm();
            }}>
              Cancel
            </Button>
            <Button onClick={handleAddCourse} disabled={!formData.code || !formData.name}>
              <Plus className="w-4 h-4" />
              Add Course
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2">Course Code *</label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., CS301"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">Credits</label>
              <input
                type="number"
                value={formData.credits}
                onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                min="1"
                max="6"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">Course Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="e.g., Data Structures"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2">Department</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">Semester</label>
              <input
                type="text"
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., Spring 2025"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">Professor</label>
            <input
              type="text"
              value={formData.professor}
              onChange={(e) => setFormData({ ...formData, professor: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="e.g., Dr. Smith"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </Modal>

      {/* Edit Course Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          resetForm();
          setSelectedCourse(null);
        }}
        title="Edit Course"
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => {
              setShowEditModal(false);
              resetForm();
              setSelectedCourse(null);
            }}>
              Cancel
            </Button>
            <Button onClick={handleEditCourse} disabled={!formData.code || !formData.name}>
              <Edit className="w-4 h-4" />
              Save Changes
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2">Course Code *</label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">Credits</label>
              <input
                type="number"
                value={formData.credits}
                onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                min="1"
                max="6"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">Course Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2">Department</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">Semester</label>
              <input
                type="text"
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">Professor</label>
            <input
              type="text"
              value={formData.professor}
              onChange={(e) => setFormData({ ...formData, professor: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
}
