import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import './css/CalendarView.css';

const CalendarView = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const tasks = useSelector((state) => state.tasks.tasks);

  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
  const currentUserId = loggedInUser?.userId;

  // Filter tasks for the calendar
  const calendarTasks = tasks.filter(task => {
    if (task.assignedTo === 'everyone' || task.assignedTo === null || task.assignedTo === undefined) {
      return true;
    }
    if (task.assignedTo && typeof task.assignedTo === 'object' && task.assignedTo.userId) {
      return String(task.assignedTo.userId) === String(currentUserId);
    }
    if (typeof task.assignedTo === 'string') {
      return String(task.assignedTo) === String(currentUserId);
    }
    return false;
  });

  const events = useMemo(() => {
    return calendarTasks.reduce((acc, task) => {
      if (!task.title) return acc;

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
  }, [calendarTasks]);

  const handleEventClick = (info) => {
    setSelectedTask({
      title: info.event.title,
      priority: info.event.extendedProps.priority,
      status: info.event.extendedProps.status,
      description: info.event.extendedProps.description,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedTask(null);
  };

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
          eventClick={handleEventClick}
        />
      </div>

      {/* Modal */}
      {modalOpen && selectedTask && (
        <div className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-50 z-50">
          <div className="bg-zinc-800 rounded-lg p-6 w-full max-w-md text-white relative">
            <h2 className="text-2xl font-bold mb-4">{selectedTask.title}</h2>
            <p className="mb-2">
              <span className="font-semibold">Priority:</span>{" "}
              <span
                className={
                  selectedTask.priority === "high"
                    ? "text-red-400"
                    : selectedTask.priority === "medium"
                    ? "text-orange-400"
                    : "text-green-400"
                }
              >
                {selectedTask.priority}
              </span>
            </p>
            <p className="mb-2">
              <span className="font-semibold">Status:</span>{" "}
              {selectedTask.status}
            </p>
            <p className="mb-4">
              <span className="font-semibold">Description:</span>{" "}
              {selectedTask.description || "No description provided."}
            </p>
            <button
              onClick={closeModal}
              className="mt-4 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;
