import { Card } from '../shared/Card';
import { Button } from '../shared/Button';
import { Modal } from '../shared/Modal';
import { useState } from 'react';
import { Calendar, Clock, MapPin, Users, Plus, Edit, Trash2, Save } from 'lucide-react';
import { toast } from 'sonner';
import { usePersistence } from '../../hooks/usePersistence';
import { STORAGE_KEYS, INITIAL_DATA, ScheduleItem, Course, User, Exam, Announcement } from '../../lib/storage';

export function ProfessorSchedule() {
  const [scheduleItems, setScheduleItems] = usePersistence<ScheduleItem[]>(STORAGE_KEYS.SCHEDULE, INITIAL_DATA.SCHEDULE);
  const [courses] = usePersistence<Course[]>(STORAGE_KEYS.COURSES, INITIAL_DATA.COURSES);
  const [exams, setExams] = usePersistence<Exam[]>(STORAGE_KEYS.EXAMS, INITIAL_DATA.EXAMS);
  const [announcements, setAnnouncements] = usePersistence<Announcement[]>(STORAGE_KEYS.ANNOUNCEMENTS, INITIAL_DATA.ANNOUNCEMENTS);
  const [currentUser] = usePersistence<User | null>(STORAGE_KEYS.CURRENT_USER, null);
  const deptCourses = currentUser?.department
    ? courses.filter(c => c.department === currentUser.department)
    : courses;

  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddExamModal, setShowAddExamModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ScheduleItem | null>(null);
  const [draggedItem, setDraggedItem] = useState<ScheduleItem | null>(null);

  const [formData, setFormData] = useState({
    day: 'Monday',
    time: '',
    course: '',
    room: '',
    students: 0,
    type: 'lecture' as 'lecture' | 'lab' | 'office-hours',
  });

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeSlots = [
    '8:00 AM - 10:00 AM',
    '10:00 AM - 12:00 PM',
    '12:00 PM - 2:00 PM',
    '2:00 PM - 4:00 PM',
    '4:00 PM - 6:00 PM',
  ];

  const [examForm, setExamForm] = useState({
    course: '',
    date: '',
    time: '',
    location: '',
    type: 'Midterm' as string,
  });

  const handleDragStart = (item: ScheduleItem) => {
    setDraggedItem(item);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (day: string, time: string) => {
    if (draggedItem) {
      const updatedItems = scheduleItems.map(item =>
        item.id === draggedItem.id
          ? { ...item, day, time }
          : item
      );
      setScheduleItems(updatedItems);
      toast.success('Schedule updated successfully');
      setDraggedItem(null);
    }
  };

  const handleAddSchedule = () => {
    const newItem: ScheduleItem = {
      id: Date.now(),
      ...formData,
    };
    setScheduleItems([...scheduleItems, newItem]);
    setShowAddModal(false);
    toast.success('Schedule item added successfully');
    resetForm();
  };

  const handleEditSchedule = () => {
    if (selectedItem) {
      const updatedItems = scheduleItems.map(item =>
        item.id === selectedItem.id
          ? { ...selectedItem, ...formData }
          : item
      );
      setScheduleItems(updatedItems);
      setShowEditModal(false);
      toast.success('Schedule updated successfully');
      resetForm();
      setSelectedItem(null);
    }
  };

  const handleDeleteSchedule = (id: number) => {
    setScheduleItems(scheduleItems.filter(item => item.id !== id));
    toast.success('Schedule item deleted successfully');
  };

  const openEditModal = (item: ScheduleItem) => {
    setSelectedItem(item);
    setFormData({
      day: item.day,
      time: item.time,
      course: item.course,
      room: item.room,
      students: item.students,
      type: item.type,
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      day: 'Monday',
      time: '',
      course: '',
      room: '',
      students: 0,
      type: 'lecture',
    });
  };

  const resetExamForm = () => {
    setExamForm({
      course: '',
      date: '',
      time: '',
      location: '',
      type: 'Midterm 1',
    });
  };

  const getItemsForSlot = (day: string, time: string) => {
    return scheduleItems.filter(item => item.day === day && item.time === time);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'lecture': return 'blue';
      case 'lab': return 'purple';
      case 'office-hours': return 'green';
      default: return 'gray';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">Schedule Management</h1>
          <p className="text-gray-600">Create and arrange your class schedules using drag and drop</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4" />
            Add Schedule
          </Button>
          <Button variant="secondary" onClick={() => setShowAddExamModal(true)}>
            <Plus className="w-4 h-4" />
            Add Exam
          </Button>
        </div>
      </div>

      {/* Instructions */}
      <Card>
        <div className="flex items-start gap-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Calendar className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h4 className="text-gray-900 mb-1">How to use</h4>
            <p className="text-sm text-gray-600">
              Drag and drop schedule items to different time slots to rearrange your schedule.
              Click the edit icon to modify details or the delete icon to remove an item.
            </p>
          </div>
        </div>
      </Card>

      {/* Weekly Schedule Grid */}
      <Card title="Weekly Schedule">
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Header */}
            <div className="grid grid-cols-6 gap-2 mb-2">
              <div className="p-3">
                <h4 className="text-gray-700">Time</h4>
              </div>
              {days.map(day => (
                <div key={day} className="p-3 bg-green-100 rounded-lg text-center">
                  <h4 className="text-gray-900">{day}</h4>
                </div>
              ))}
            </div>

            {/* Time Slots */}
            {timeSlots.map(time => (
              <div key={time} className="grid grid-cols-6 gap-2 mb-2">
                <div className="p-3 bg-gray-100 rounded-lg flex items-center">
                  <p className="text-sm text-gray-700">{time}</p>
                </div>
                {days.map(day => {
                  const items = getItemsForSlot(day, time);
                  return (
                    <div
                      key={`${day}-${time}`}
                      className="min-h-[100px] p-2 border-2 border-dashed border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                      onDragOver={handleDragOver}
                      onDrop={() => handleDrop(day, time)}
                    >
                      {items.map(item => {
                        const color = getTypeColor(item.type);
                        return (
                          <div
                            key={item.id}
                            draggable
                            onDragStart={() => handleDragStart(item)}
                            className={`
                              bg-${color}-50 border border-${color}-200 rounded-lg p-3 mb-2 cursor-move
                              hover:shadow-md transition-all group
                            `}
                          >
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 truncate" title={item.course}>
                                  {item.course || "Untitled Course"}
                                </p>
                              </div>
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openEditModal(item);
                                  }}
                                  className="p-1 hover:bg-white rounded"
                                  aria-label="Edit"
                                >
                                  <Edit className="w-3 h-3 text-gray-600" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteSchedule(item.id);
                                  }}
                                  className="p-1 hover:bg-white rounded"
                                  aria-label="Delete"
                                >
                                  <Trash2 className="w-3 h-3 text-red-600" />
                                </button>
                              </div>
                            </div>
                            <div className="space-y-1 text-xs text-gray-600">
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                <span>{item.room}</span>
                              </div>
                              {item.students > 0 && (
                                <div className="flex items-center gap-1">
                                  <Users className="w-3 h-3" />
                                  <span>{item.students} students</span>
                                </div>
                              )}
                            </div>
                            <span className={`inline-block mt-2 px-2 py-0.5 rounded text-xs bg-${color}-100 text-${color}-700 capitalize`}>
                              {item.type.replace('-', ' ')}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Upcoming Exams */}
      <Card title="Upcoming Exams">
        {exams.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No exams scheduled</p>
          </div>
        ) : (
          <div className="space-y-3">
            {exams.map(exam => (
              <div key={exam.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-4">
                  <span className="text-gray-900">{exam.course}</span>
                  <span className="text-sm text-gray-600">{exam.type}</span>
                  <span className="text-sm text-gray-600">{exam.date} • {exam.time}</span>
                  <span className="text-sm text-gray-600">{exam.location}</span>
                </div>
                <button
                  onClick={() => {
                    setExams(exams.filter(e => e.id !== exam.id));
                    toast.success('Exam removed');
                  }}
                  className="p-2 hover:bg-red-100 rounded"
                  aria-label="Remove exam"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Add Schedule Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          resetForm();
        }}
        title="Add New Schedule Item"
        footer={
          <>
            <Button variant="secondary" onClick={() => {
              setShowAddModal(false);
              resetForm();
            }}>
              Cancel
            </Button>
            <Button onClick={handleAddSchedule}>
              <Save className="w-4 h-4" />
              Add Schedule
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-2">Day</label>
            <select
              value={formData.day}
              onChange={(e) => setFormData({ ...formData, day: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {days.map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">Time Slot</label>
            <select
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select time slot</option>
              {timeSlots.map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">Course</label>
            <select
              value={formData.course}
              onChange={(e) => setFormData({ ...formData, course: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {deptCourses.length === 0 ? (
                <option value="" disabled>No courses available for your department</option>
              ) : (
                <>
                  <option value="">Select course</option>
                  {deptCourses.map(course => (
                    <option key={course.id} value={`${course.name} ${course.code}`}>
                      {`${course.name} ${course.code}`}
                    </option>
                  ))}
                </>
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">Room</label>
            <input
              type="text"
              value={formData.room}
              onChange={(e) => setFormData({ ...formData, room: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="e.g., Room 301"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">Number of Students</label>
            <input
              type="number"
              value={formData.students}
              onChange={(e) => setFormData({ ...formData, students: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="0"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="lecture">Lecture</option>
              <option value="lab">Lab</option>
              <option value="office-hours">Office Hours</option>
            </select>
          </div>
        </div>
      </Modal>

      {/* Add Exam Modal */}
      <Modal
        isOpen={showAddExamModal}
        onClose={() => {
          setShowAddExamModal(false);
          resetExamForm();
        }}
        title="Add New Exam"
        footer={
          <>
            <Button variant="secondary" onClick={() => {
              setShowAddExamModal(false);
              resetExamForm();
            }}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                const courseName = deptCourses.find(c => `${c.name} ${c.code}` === examForm.course)?.name;
                const courseCode = deptCourses.find(c => `${c.name} ${c.code}` === examForm.course)?.code;
                if (!examForm.course || !examForm.date || !examForm.time || !examForm.location) {
                  toast.error('Please fill all exam fields');
                  return;
                }
                const newExam: Exam = {
                  id: Date.now(),
                  course: examForm.course || (courseName && courseCode ? `${courseName} ${courseCode}` : ''),
                  date: examForm.date,
                  time: examForm.time,
                  location: examForm.location,
                  professor: currentUser?.name || 'Professor',
                  type: examForm.type,
                };

                const newAnnouncement: Announcement = {
                  id: Date.now() + 1,
                  title: `${examForm.type} Exam Schedule released`,
                  content: "The examination schedule has been published. Please check your course pages for specific dates and times. Remember to apply for exams through the student portal at least 48 hours in advance.",
                  course: examForm.course || (courseName && courseCode ? `${courseName} ${courseCode}` : ''),
                  date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                  time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
                  priority: 'high',
                  type: 'exam',
                  author: currentUser?.name || 'Professor',
                };

                setExams([...exams, newExam]);
                setAnnouncements([newAnnouncement, ...announcements]);
                setShowAddExamModal(false);
                toast.success('Exam added successfully. Automatic announcement is created');
                resetExamForm();
              }}
            >
              <Save className="w-4 h-4" />
              Add Exam
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-2">Course</label>
            <select
              value={examForm.course}
              onChange={(e) => setExamForm({ ...examForm, course: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select course</option>
              {deptCourses.map(course => (
                <option key={course.id} value={`${course.name} ${course.code}`}>
                  {`${course.name} ${course.code}`}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2">Date</label>
              <input
                type="date"
                value={examForm.date}
                onChange={(e) => setExamForm({ ...examForm, date: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">Time</label>
              <input
                type="time"
                value={examForm.time}
                onChange={(e) => setExamForm({ ...examForm, time: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-2">Location</label>
            <input
              type="text"
              value={examForm.location}
              onChange={(e) => setExamForm({ ...examForm, location: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Room 401"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-2">Type</label>
            <select
              value={examForm.type}
              onChange={(e) => setExamForm({ ...examForm, type: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="Midterm 1">Midterm 1</option>
              <option value="Midterm 2">Midterm 2</option>
              <option value="Final">Final</option>
            </select>
          </div>
        </div>
      </Modal>

      {/* Edit Schedule Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          resetForm();
          setSelectedItem(null);
        }}
        title="Edit Schedule Item"
        footer={
          <>
            <Button variant="secondary" onClick={() => {
              setShowEditModal(false);
              resetForm();
              setSelectedItem(null);
            }}>
              Cancel
            </Button>
            <Button onClick={handleEditSchedule}>
              <Save className="w-4 h-4" />
              Save Changes
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-2">Day</label>
            <select
              value={formData.day}
              onChange={(e) => setFormData({ ...formData, day: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {days.map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">Time Slot</label>
            <select
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {timeSlots.map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">Course</label>
            <select
              value={formData.course}
              onChange={(e) => setFormData({ ...formData, course: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {deptCourses.length === 0 ? (
                <option value="" disabled>No courses available for your department</option>
              ) : (
                deptCourses.map(course => (
                  <option key={course.id} value={`${course.name} ${course.code}`}>
                    {`${course.name} ${course.code}`}
                  </option>
                ))
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">Room</label>
            <input
              type="text"
              value={formData.room}
              onChange={(e) => setFormData({ ...formData, room: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">Number of Students</label>
            <input
              type="number"
              value={formData.students}
              onChange={(e) => setFormData({ ...formData, students: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="lecture">Lecture</option>
              <option value="lab">Lab</option>
              <option value="office-hours">Office Hours</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
}
