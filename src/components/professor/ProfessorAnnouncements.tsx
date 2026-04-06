import { Card } from '../shared/Card';
import { Button } from '../shared/Button';
import { Modal } from '../shared/Modal';
import { useState } from 'react';
import { Plus, Edit, Trash2, Send, Calendar, Users } from 'lucide-react';
import { toast } from 'sonner';
import { usePersistence } from '../../hooks/usePersistence';
import { STORAGE_KEYS, INITIAL_DATA, Announcement, Course, User, storage } from '../../lib/storage';

export function ProfessorAnnouncements() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    course: 'all',
    priority: 'normal' as 'normal' | 'high',
    type: 'info',
  });

  const [announcements, setAnnouncements] = usePersistence<Announcement[]>(STORAGE_KEYS.ANNOUNCEMENTS, INITIAL_DATA.ANNOUNCEMENTS);
  const [coursesData] = usePersistence<Course[]>(STORAGE_KEYS.COURSES, INITIAL_DATA.COURSES);
  const currentUser = storage.get<User | null>(STORAGE_KEYS.CURRENT_USER, null);
  const deptCourses = currentUser?.department
    ? coursesData.filter(c => c.department === currentUser.department)
    : coursesData;
  const courseOptions = [
    { id: 'all', name: 'All Courses' },
    ...deptCourses.map(c => ({ id: c.code, name: `${c.name} ${c.code}` }))
  ];

  const handleCreate = () => {
    const newAnnouncement: Announcement = {
      id: Date.now(),
      title: formData.title,
      content: formData.content,
      course: formData.course === 'all'
        ? 'All Courses'
        : (coursesData.find(c => c.code === formData.course)
          ? `${coursesData.find(c => c.code === formData.course)!.name} ${coursesData.find(c => c.code === formData.course)!.code}`
          : 'All Courses'),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      priority: formData.priority,
      type: formData.type,
      author: 'Professor',
    };

    setAnnouncements([newAnnouncement, ...announcements]);
    setShowCreateModal(false);
    toast.success('Announcement published successfully');
    resetForm();
  };

  const handleEdit = () => {
    if (selectedAnnouncement) {
      const updatedAnnouncements = announcements.map(a =>
        a.id === selectedAnnouncement.id
          ? {
            ...a,
            title: formData.title,
            content: formData.content,
            course: formData.course === 'all'
              ? 'All Courses'
              : (coursesData.find(c => c.code === formData.course)
                ? `${coursesData.find(c => c.code === formData.course)!.name} ${coursesData.find(c => c.code === formData.course)!.code}`
                : 'All Courses'),
            priority: formData.priority,
            type: formData.type,
          }
          : a
      );
      setAnnouncements(updatedAnnouncements);
      setShowEditModal(false);
      toast.success('Announcement updated successfully');
      resetForm();
      setSelectedAnnouncement(null);
    }
  };

  const handleDelete = (id: number) => {
    setAnnouncements(announcements.filter(a => a.id !== id));
    toast.success('Announcement deleted successfully');
  };

  const openEditModal = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      content: announcement.content,
      course: courseOptions.find(c => c.name === announcement.course)?.id || 'all',
      priority: announcement.priority,
      type: announcement.type || 'info',
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      course: 'all',
      priority: 'normal',
      type: 'info',
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">Announcements</h1>
          <p className="text-gray-600">Create and manage course announcements</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4" />
          Create Announcement
        </Button>
      </div>

      {/* Published Announcements */}
      <Card title="Published Announcements">
        {announcements.length === 0 ? (
          <div className="text-center py-12">
            <Send className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No announcements yet</p>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4" />
              Create Your First Announcement
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <div
                key={announcement.id}
                className={`border rounded-lg p-4 ${announcement.priority === 'high'
                  ? 'border-orange-200 bg-orange-50'
                  : 'border-gray-200'
                  }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <h3 className="text-gray-900">{announcement.title}</h3>
                      {announcement.priority === 'high' && (
                        <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-sm">
                          High Priority
                        </span>
                      )}
                    </div>

                    <p className="text-gray-700 mb-3">{announcement.content}</p>

                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{announcement.course}</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{announcement.date} at {announcement.time}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(announcement)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      aria-label="Edit announcement"
                    >
                      <Edit className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(announcement.id)}
                      className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                      aria-label="Delete announcement"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Create Announcement Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          resetForm();
        }}
        title="Create New Announcement"
        size="lg"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setShowCreateModal(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!formData.title || !formData.content}
            >
              <Send className="w-4 h-4" />
              Publish Announcement
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Title <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter announcement title"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Content <span className="text-red-600">*</span>
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              placeholder="Enter announcement content"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2">Announcement Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="info">Information</option>
                <option value="exam">Exam</option>
                <option value="academic">Academic</option>
                <option value="event">Event</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">Target Course</label>
              <select
                value={formData.course}
                onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {courseOptions.map(course => (
                  <option key={course.id} value={course.id}>{course.name}</option>
                ))}
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-sm text-gray-700 mb-2">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'normal' | 'high' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="normal">Normal</option>
                <option value="high">High Priority</option>
              </select>
            </div>
          </div>
        </div>
      </Modal>

      {/* Edit Announcement Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          resetForm();
          setSelectedAnnouncement(null);
        }}
        title="Edit Announcement"
        size="lg"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setShowEditModal(false);
                resetForm();
                setSelectedAnnouncement(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleEdit}
              disabled={!formData.title || !formData.content}
            >
              <Send className="w-4 h-4" />
              Update Announcement
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Title <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Content <span className="text-red-600">*</span>
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2">Announcement Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="info">Information</option>
                <option value="exam">Exam</option>
                <option value="academic">Academic</option>
                <option value="event">Event</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">Target Course</label>
              <select
                value={formData.course}
                onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {courseOptions.map(course => (
                  <option key={course.id} value={course.id}>{course.name}</option>
                ))}
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-sm text-gray-700 mb-2">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'normal' | 'high' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="normal">Normal</option>
                <option value="high">High Priority</option>
              </select>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
