import { Card } from '../shared/Card';
import { Bell, Calendar, AlertCircle, Info, Award, Building } from 'lucide-react';
import { useState } from 'react';
import { usePersistence } from '../../hooks/usePersistence';
import { STORAGE_KEYS, INITIAL_DATA, Announcement } from '../../lib/storage';

export function StudentAnnouncements() {
  const [filter, setFilter] = useState<string>('all');
  const [announcements] = usePersistence<Announcement[]>(STORAGE_KEYS.ANNOUNCEMENTS, INITIAL_DATA.ANNOUNCEMENTS);

  const typeConfig = {
    exam: { icon: Calendar, color: 'orange', label: 'Exam' },
    info: { icon: Info, color: 'blue', label: 'Information' },
    payment: { icon: AlertCircle, color: 'red', label: 'Payment' },
    academic: { icon: Award, color: 'purple', label: 'Academic' },
    scholarship: { icon: Award, color: 'green', label: 'Scholarship' },
    event: { icon: Building, color: 'indigo', label: 'Event' }
  };

  const filteredAnnouncements = filter === 'all' 
    ? announcements 
    : announcements.filter(a => a.type === filter);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-gray-900 mb-2">Announcements</h1>
        <p className="text-gray-600">Stay updated with important university news and notifications</p>
      </div>

      {/* Filter Tabs */}
      <Card>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Announcements
          </button>
          <button
            onClick={() => setFilter('exam')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'exam'
                ? 'bg-orange-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Exams
          </button>
          <button
            onClick={() => setFilter('academic')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'academic'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Academic
          </button>
          <button
            onClick={() => setFilter('payment')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'payment'
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Payments
          </button>
          <button
            onClick={() => setFilter('info')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'info'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Information
          </button>
        </div>
      </Card>

      {/* Announcements List */}
      <div className="space-y-4">
        {filteredAnnouncements.map((announcement) => {
          // Fallback for announcements without a valid type
          const config = typeConfig[announcement.type as keyof typeof typeConfig] || typeConfig.info;
          const Icon = config.icon;

          return (
            <Card key={announcement.id} className={`
              ${announcement.priority === 'high' ? 'border-l-4 border-l-' + config.color + '-500' : ''}
            `}>
              <div className="flex gap-4">
                {/* Icon */}
                <div className={`flex-shrink-0 bg-${config.color}-100 p-3 rounded-lg h-fit`}>
                  <Icon className={`w-6 h-6 text-${config.color}-600`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="text-gray-900">{announcement.title}</h3>
                        <span className={`px-2 py-1 rounded text-sm bg-${config.color}-100 text-${config.color}-700`}>
                          {config.label}
                        </span>
                        {announcement.priority === 'high' && (
                          <span className="px-2 py-1 rounded text-sm bg-red-100 text-red-700">
                            Important
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <span>{announcement.author}</span>
                        <span>•</span>
                        <span>{announcement.date}</span>
                        <span>•</span>
                        <span>{announcement.time}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {announcement.content}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredAnnouncements.length === 0 && (
        <Card>
          <div className="text-center py-12">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No announcements in this category</p>
          </div>
        </Card>
      )}
    </div>
  );
}
