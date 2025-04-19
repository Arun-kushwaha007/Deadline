import { useState, useEffect, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { addTask, editTask } from '../../redux/slices/tasksSlice';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { SocketContext } from '../../context/SocketContext';

const NewTaskModal = ({ isOpen, onClose, taskToEdit }) => {
  const { user } = useContext(SocketContext);
  const dispatch = useDispatch();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState('todo');
  const [priority, setPriority] = useState('');
  const [labels, setLabels] = useState('');
  const [tags, setTags] = useState('');
  const [assignedTo, setAssignedTo] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [subtasks, setSubtasks] = useState([{ title: '', done: false }]);
  const [errors, setErrors] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: '',
  });

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/teams/${user.teamId}/members`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTeamMembers(response.data);
      } catch (error) {
        console.error('Error fetching team members:', error);
        // Handle error appropriately, e.g., display an error message
      }
    };

    if (user && user.teamId) {
      fetchTeamMembers();
    }
  }, [user]);
  // Pre-fill fields when editing
  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title || '');
      setDescription(taskToEdit.description || '');
      setDueDate(taskToEdit.dueDate || '');
      setStatus(taskToEdit.status || 'todo');
      setPriority(taskToEdit.priority || '');
      setLabels((taskToEdit.labels || []).join(', '));
      setTags((taskToEdit.tags || []).join(', '));
      setAssignedTo(taskToEdit.assignedTo || []);
      setSubtasks(taskToEdit.subtasks || [{ title: '', done: false }]);
    } else {
      setTitle('');
      setDescription('');
      setDueDate('');
      setStatus('todo');
      setPriority('');
      setLabels('');
      setTags('');
      setAssignedTo([]);
      setSubtasks([{ title: '', done: false }]);
    }
  }, [taskToEdit]);

  // Validate the form inputs
  const validateForm = () => {
    const newErrors = {
      title: title.trim() === '' ? 'Title is required' : '',
      description: description.trim() === '' ? 'Description is required' : '',
      dueDate: dueDate === '' ? 'Due date is required' : '',
      priority: priority === '' ? 'Priority is required' : '',
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === '');
  };

  const handleSubtaskChange = (index, value) => {
    const updated = [...subtasks];
    updated[index].title = value;
    setSubtasks(updated);
  };

  const addSubtask = () => {
    setSubtasks([...subtasks, { title: '', done: false }]);
  };

  const removeSubtask = (index) => {
    setSubtasks(subtasks.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return; // Only submit if the form is valid

    const taskPayload = {
      title,
      description,
      priority,
      dueDate,
      status,
      labels: labels.split(',').map((l) => l.trim()).filter(Boolean),
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      subtasks: subtasks.filter((s) => s.title.trim()),
      assignedTo,
    };

    if (taskToEdit) {
      dispatch(editTask({ id: taskToEdit.id, ...taskPayload }));
    } else {
      dispatch(addTask({ id: uuidv4(), ...taskPayload }));
    }

    onClose(); // Close the modal after submission
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg w-96"
      >
        <h2 className="text-lg font-bold mb-4 text-gray-100">
          {taskToEdit ? 'Edit Task' : 'Create New Task'}
        </h2>

        <input
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full mb-2 p-2 rounded bg-slate-700 text-white"
        />
        {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full mb-2 p-2 rounded bg-slate-700 text-white"
          rows={3}
        />
        {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full mb-2 p-2 rounded bg-slate-700 text-white"
        />
        {errors.dueDate && <p className="text-red-500 text-sm">{errors.dueDate}</p>}

        <input
          type="text"
          placeholder="Labels (comma-separated)"
          value={labels}
          onChange={(e) => setLabels(e.target.value)}
          className="w-full mb-2 p-2 rounded bg-slate-700 text-white"
        />

        <input
          type="text"
          placeholder="Tags (comma-separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full mb-2 p-2 rounded bg-slate-700 text-white"
        />
        <div className="mb-4">
          <p className="text-sm text-white mb-2">Subtasks</p>
          {subtasks.map((subtask, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={subtask.title}
                onChange={(e) => handleSubtaskChange(index, e.target.value)}
                className="flex-1 p-2 rounded bg-slate-700 text-white"
                placeholder={`Subtask ${index + 1}`}
              />
              <button
                type="button"
                onClick={() => removeSubtask(index)}
                className="text-red-400 hover:underline"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addSubtask}
            className="text-blue-400 hover:underline text-sm"
          >
            + Add Subtask
          </button>
        </div>

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="w-full mb-4 p-2 rounded bg-slate-700 text-white"
        >
          <option value="">Select Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        {errors.priority && <p className="text-red-500 text-sm">{errors.priority}</p>}

        <select
          className="w-full p-2 mb-4 rounded bg-slate-700 text-white"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="todo">To Do</option>
          <option value="inprogress">In Progress</option>
          <option value="done">Done</option>
        </select>

        <select
          multiple
          value={assignedTo}
          onChange={(e) => setAssignedTo(Array.from(e.target.selectedOptions, (option) => option.value))}
          className="w-full p-2 mb-4 rounded bg-slate-700 text-white"
        >
          <option value="" disabled>Assign to</option>
          {teamMembers.map((member) => (
            <option key={member._id} value={member._id}>
              {member.name}
            </option>
          ))}
        </select>


        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 rounded text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-accent rounded text-white"
          >
            {taskToEdit ? 'Update Task' : 'Add Task'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewTaskModal;
