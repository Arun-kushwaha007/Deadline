import React from 'react';
import { useSelector } from 'react-redux';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

const CalendarView = () => {
  const tasks = useSelector((state) => state.tasks.tasks);

  const events = tasks.map((task) => ({
    id: task.id,
    title: task.title,
    start: task.dueDate || task.createdAt,
    color:
      task.priority === 'high'
        ? '#ef4444'
        : task.priority === 'medium'
        ? '#f97316'
        : '#10b981',
    extendedProps: {
      description: task.description,
      priority: task.priority,
      status: task.status,
    },
  }));

  return (
    <div className="p-6 text-white min-h-screen">
      <h1 className="text-3xl font-bold text-orange-500 mb-6">
        📅 Task Calendar
      </h1>

      <div className="bg-zinc-800 text-white rounded-lg p-4 shadow-lg">
        <style>
          {`
            .fc .fc-col-header-cell {
              background-color: #27272a;
              color: #f9fafb;
              border: 1px solid #3f3f46;
            }
          `}
        </style>

        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            start: 'prev,next today',
            center: 'title',
            end: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          height="auto"
          events={events}
          eventClick={(info) => {
            alert(
              `Task: ${info.event.title}\n\nPriority: ${info.event.extendedProps.priority}\nStatus: ${info.event.extendedProps.status}\nDescription: ${info.event.extendedProps.description}`
            );
          }}
          eventDisplay="block"
        />
      </div>
    </div>
  );
};

export default CalendarView;
