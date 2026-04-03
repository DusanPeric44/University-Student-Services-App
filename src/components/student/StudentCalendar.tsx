import { Card } from '../shared/Card';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin } from 'lucide-react';

export function StudentCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 10, 27)); // November 27, 2025
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const events = [
    { date: new Date(2025, 10, 27), type: 'class', title: 'Data Structures', time: '10:00 AM', location: 'Room 301', color: 'blue' },
    { date: new Date(2025, 10, 27), type: 'class', title: 'Web Development', time: '2:00 PM', location: 'Lab 5', color: 'blue' },
    { date: new Date(2025, 10, 28), type: 'class', title: 'Database Systems', time: '9:00 AM', location: 'Room 205', color: 'blue' },
    { date: new Date(2025, 11, 1), type: 'deadline', title: 'Assignment Due: Web Dev Project', time: '11:59 PM', color: 'red' },
    { date: new Date(2025, 11, 5), type: 'event', title: 'Career Fair', time: '10:00 AM', location: 'Student Center', color: 'purple' },
    { date: new Date(2025, 11, 8), type: 'exam', title: 'Computer Networks Exam', time: '10:00 AM', location: 'Room 401', color: 'orange' },
    { date: new Date(2025, 11, 10), type: 'exam', title: 'Data Structures Midterm', time: '10:00 AM', location: 'Room 301', color: 'orange' },
    { date: new Date(2025, 11, 12), type: 'exam', title: 'Web Development Final', time: '2:00 PM', location: 'Lab 5', color: 'orange' },
    { date: new Date(2025, 11, 15), type: 'deadline', title: 'Tuition Payment Due', time: 'End of Day', color: 'red' },
    { date: new Date(2025, 11, 15), type: 'exam', title: 'Database Systems Midterm', time: '9:00 AM', location: 'Room 205', color: 'orange' },
    { date: new Date(2025, 11, 18), type: 'exam', title: 'Software Engineering Final', time: '1:00 PM', location: 'Room 102', color: 'orange' },
    { date: new Date(2025, 11, 20), type: 'exam', title: 'Operating Systems Final', time: '3:00 PM', location: 'Room 303', color: 'orange' },
    { date: new Date(2025, 11, 21), type: 'holiday', title: 'Winter Break Begins', color: 'green' },
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(
      event =>
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear()
    );
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const calendarDays = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const isToday = (day: number) => {
    const today = new Date(2025, 10, 27); // Current date in prototype
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(clickedDate);
  };

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-gray-900 mb-2">University Calendar</h1>
        <p className="text-gray-600">View your classes, exams, and important dates</p>
      </div>

      {/* Legend */}
      <Card>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-sm text-gray-700">Classes</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-500 rounded"></div>
            <span className="text-sm text-gray-700">Exams</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-sm text-gray-700">Deadlines</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-500 rounded"></div>
            <span className="text-sm text-gray-700">Events</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-sm text-gray-700">Holidays</span>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar View */}
        <Card className="lg:col-span-2">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-gray-900">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={previousMonth}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Previous month"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={nextMonth}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Next month"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Day Headers */}
            {dayNames.map(day => (
              <div key={day} className="text-center py-2 text-sm text-gray-600">
                {day}
              </div>
            ))}

            {/* Calendar Days */}
            {calendarDays.map((day, index) => {
              if (day === null) {
                return <div key={`empty-${index}`} className="aspect-square" />;
              }

              const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
              const dayEvents = getEventsForDate(date);
              const today = isToday(day);

              return (
                <button
                  key={day}
                  onClick={() => handleDateClick(day)}
                  className={`
                    aspect-square p-2 rounded-lg border transition-all
                    ${today ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}
                    ${selectedDate?.getDate() === day && selectedDate?.getMonth() === currentDate.getMonth() ? 'ring-2 ring-blue-500' : ''}
                  `}
                >
                  <div className="text-sm text-gray-900 mb-1">{day}</div>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {dayEvents.slice(0, 3).map((event, i) => (
                      <div
                        key={i}
                        className={`w-1.5 h-1.5 rounded-full bg-${event.color}-500`}
                        title={event.title}
                      />
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Event Details */}
        <Card title={selectedDate ? `Events for ${monthNames[selectedDate.getMonth()]} ${selectedDate.getDate()}` : 'Select a Date'}>
          {selectedDateEvents.length > 0 ? (
            <div className="space-y-4">
              {selectedDateEvents.map((event, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-l-4 border-l-${event.color}-500 bg-${event.color}-50`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`bg-${event.color}-500 p-2 rounded-lg`}>
                      <CalendarIcon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-gray-900 mb-2">{event.title}</h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{event.time}</span>
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>{event.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <CalendarIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>{selectedDate ? 'No events scheduled for this date' : 'Click on a date to view events'}</p>
            </div>
          )}
        </Card>
      </div>

      {/* Upcoming Events */}
      <Card title="Upcoming Events">
        <div className="space-y-3">
          {events
            .filter(event => event.date >= new Date(2025, 10, 27))
            .sort((a, b) => a.date.getTime() - b.date.getTime())
            .slice(0, 5)
            .map((event, index) => (
              <div
                key={index}
                className={`flex items-center gap-4 p-3 rounded-lg border-l-4 border-l-${event.color}-500 bg-gray-50`}
              >
                <div className="flex-1">
                  <h4 className="text-gray-900">{event.title}</h4>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                    <span>{event.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    <span>•</span>
                    <span>{event.time}</span>
                    {event.location && (
                      <>
                        <span>•</span>
                        <span>{event.location}</span>
                      </>
                    )}
                  </div>
                </div>
                <span className={`px-3 py-1 rounded text-sm bg-${event.color}-100 text-${event.color}-700 capitalize`}>
                  {event.type}
                </span>
              </div>
            ))}
        </div>
      </Card>
    </div>
  );
}
