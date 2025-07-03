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
      task.assignedTo === loggedInUser?.userId || // Changed from _id to userId
      task.assignedTo === null ||
      task.assignedTo === undefined
  );

  const events = useMemo(() => {
    return myTasks.reduce((acc, task) => {
      if (!task.title) {
        return acc;
      }

      let startDate;
      let endDate = null;

      if (task.dueDate) {
        const parsedDueDate = new Date(task.dueDate);
        if (!isNaN(parsedDueDate)) {
          startDate = parsedDueDate;
          endDate = new Date(parsedDueDate.getTime() + 60 * 60 * 1000);
        }
      }

      if (!startDate && task.createdAt) {
        const parsedCreatedAt = new Date(task.createdAt);
        if (!isNaN(parsedCreatedAt)) {
          startDate = parsedCreatedAt;
        }
      }

      if (startDate) {
        acc.push({
          id: task._id,
          title: task.title,
          start: startDate.toISOString(),
          end: endDate ? endDate.toISOString() : null,
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
        });
      }
      return acc;
    }, []);
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
