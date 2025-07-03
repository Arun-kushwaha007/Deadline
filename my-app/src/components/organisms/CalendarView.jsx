import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
// import './CalendarView.css'; // Import CSS shown below
import './css/CalendarView.css'
const CalendarView = () => {
  const tasks = useSelector((state) => state.tasks.tasks);

  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

  // Filter only tasks assigned to this user
  const myTasks = tasks.filter(
    (task) =>
      task.assignedTo === loggedInUser?._id ||
      task.assignedTo === null ||
      task.assignedTo === undefined
  );

  const events = useMemo(() => {
    return myTasks
      .filter((task) => task.dueDate || task.createdAt)
      .map((task) => ({
        id: task._id,
        title: task.title,
        start: task.dueDate
          ? new Date(task.dueDate).toISOString()
          : new Date(task.createdAt).toISOString(),
        end: task.dueDate
          ? new Date(new Date(task.dueDate).getTime() + 60 * 60 * 1000).toISOString()
          : null,
        backgroundColor:
          task.priority === 'high'
            ? '#ef4444'
            : task.priority === 'medium'
            ? '#f97316'
            : '#10b981',
        borderColor:
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
  }, [myTasks]);

  return (
    <div className="p-6 text-white min-h-screen">
      <h1 className="text-3xl font-bold text-orange-500 mb-6">
        📅 My Task Calendar
      </h1>

      <div className="bg-zinc-800 rounded-lg p-4 shadow-lg">
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
          eventDisplay="block"
          eventClick={(info) => {
            alert(
              `Task: ${info.event.title}\n\nPriority: ${info.event.extendedProps.priority}\nStatus: ${info.event.extendedProps.status}\nDescription: ${info.event.extendedProps.description}`
            );
          }}
        />
      </div>
    </div>
  );
};

export default CalendarView;
