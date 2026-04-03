import { Card } from '../shared/Card';
import { Button } from '../shared/Button';
import { Modal } from '../shared/Modal';
import { useState } from 'react';
import { Calendar, Clock, MapPin, Users, Plus, Edit, Trash2, Save } from 'lucide-react';
import { toast } from 'sonner';

interface ScheduleItem {
  id: number;
  day: string;
  time: string;
  course: string;
  room: string;
  students: number;
  type: 'lecture' | 'lab' | 'office-hours';
}

export function ProfessorSchedule() {
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([
    { id: 1, day: 'Monday', time: '10:00 AM - 12:00 PM', course: 'Data Structures CS301', room: 'Room 301', students: 45, type: 'lecture' },
    { id: 2, day: 'Monday', time: '2:00 PM - 4:00 PM', course: 'Algorithms CS401', room: 'Room 205', students: 38, type: 'lecture' },
    { id: 3, day: 'Tuesday', time: '9:00 AM - 11:00 AM', course: 'Database Systems CS302', room: 'Room 102', students: 42, type: 'lecture' },
    { id: 4, day: 'Wednesday', time: '10:00 AM - 12:00 PM', course: 'Data Structures CS301', room: 'Room 301', students: 45, type: 'lecture' },
    { id: 5, day: 'Wednesday', time: '3:00 PM - 5:00 PM', course: 'Machine Learning CS501', room: 'Lab 5', students: 31, type: 'lab' },
    { id: 6, day: 'Thursday', time: '2:00 PM - 4:00 PM', course: 'Algorithms CS401', room: 'Room 205', students: 38, type: 'lecture' },
    { id: 7, day: 'Friday', time: '1:00 PM - 3:00 PM', course: 'Office Hours', room: 'Office 412', students: 0, type: 'office-hours' },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
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
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4" />
          Add Schedule
        </Button>
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
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <p className="text-sm text-gray-900">{item.course}</p>
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => openEditModal(item)}
                                  className="p-1 hover:bg-white rounded"
                                  aria-label="Edit"
                                >
                                  <Edit className="w-3 h-3 text-gray-600" />
                                </button>
                                <button
                                  onClick={() => handleDeleteSchedule(item.id)}
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
            <label className="block text-sm text-gray-700 mb-2">Course Name</label>
            <input
              type="text"
              value={formData.course}
              onChange={(e) => setFormData({ ...formData, course: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="e.g., Data Structures CS301"
            />
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
            <label className="block text-sm text-gray-700 mb-2">Course Name</label>
            <input
              type="text"
              value={formData.course}
              onChange={(e) => setFormData({ ...formData, course: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
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
