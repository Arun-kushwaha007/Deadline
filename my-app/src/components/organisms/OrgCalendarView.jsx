import React, { useMemo, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { fetchTasks, clearTasks } from '../../redux/slices/tasksSlice';
import './css/CalendarView.css';

const OrgCalendarView = () => {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.tasks);
  const selectedOrganization = useSelector(
    (state) => state.organization.selectedOrganization
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // Fetch tasks for selected organization
  useEffect(() => {
    if (selectedOrganization?._id) {
      dispatch(fetchTasks(selectedOrganization._id));
    } else {
      dispatch(clearTasks());
    }
  }, [dispatch, selectedOrganization]);

  const events = useMemo(() => {
    if (!tasks || tasks.length === 0) return [];

    return tasks.reduce((acc, task) => {
      if (!task.title) return acc;

      let startDate = null;
      let endDate = null;

      if (task.createdAt) {
        const parsedCreatedAt = new Date(task.createdAt);
        if (!isNaN(parsedCreatedAt)) {
          startDate = parsedCreatedAt;
        }
      }

      if (task.dueDate) {
        const parsedDueDate = new Date(task.dueDate);
        if (!isNaN(parsedDueDate)) {
          // Add +1 day to include due date on calendar
          parsedDueDate.setDate(parsedDueDate.getDate() + 1);
          endDate = parsedDueDate;
        }
      }

      if (!endDate && startDate) {
        endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 1);
      }

      if (startDate) {
        acc.push({
          id: task._id || task.id,
          title: task.title,
          start: startDate.toISOString(),
          end: endDate?.toISOString() || null,
          allDay: true,
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
            assignedTo: task.assignedTo,
          },
        });
      }

      return acc;
    }, []);
  }, [tasks]);

  const handleEventClick = (info) => {
    setSelectedTask({
      title: info.event.title,
      priority: info.event.extendedProps.priority,
      status: info.event.extendedProps.status,
      description: info.event.extendedProps.description,
      assignedTo: info.event.extendedProps.assignedTo,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedTask(null);
  };

  if (!selectedOrganization) {
    return (
      <div className="p-6 text-white text-center">
        <h1 className="text-2xl font-bold">
          Please select an organization to view its Calendar.
        </h1>
      </div>
    );
  }

  return (
    <div className="p-6 text-white min-h-screen">
      <h1 className="text-3xl font-bold text-orange-500 mb-6">
        🗓️ {selectedOrganization?.name} - Org Calendar
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
        <div className="fixed inset-0 flex items-center justify-center bg-transparnt bg-opacity-50 z-50">
          <div className="bg-zinc-800 rounded-lg p-6 w-full max-w-md text-white relative">
            <h2 className="text-2xl font-bold mb-4">
              {selectedTask.title}
            </h2>
            <p className="mb-2">
              <span className="font-semibold">Priority:</span>{' '}
              <span
                className={
                  selectedTask.priority === 'high'
                    ? 'text-red-400'
                    : selectedTask.priority === 'medium'
                    ? 'text-orange-400'
                    : 'text-green-400'
                }
              >
                {selectedTask.priority}
              </span>
            </p>
            <p className="mb-2">
              <span className="font-semibold">Status:</span>{' '}
              {selectedTask.status}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Assigned To:</span>{' '}
              {selectedTask.assignedTo === 'everyone'
                ? 'Everyone'
                : selectedTask.assignedTo?.name ||
                  selectedTask.assignedTo?.email ||
                  'Unassigned'}
            </p>
            <p className="mb-4">
              <span className="font-semibold">Description:</span>{' '}
              {selectedTask.description || 'No description provided.'}
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

export default OrgCalendarView;
