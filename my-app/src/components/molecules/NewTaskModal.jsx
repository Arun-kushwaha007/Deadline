import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addTask, editTask } from '../../redux/slices/tasksSlice';
import { v4 as uuidv4 } from 'uuid';

const orgMembers = [
  { id: '1', name: 'Alice Johnson' },
  { id: '2', name: 'Bob Smith' },
  { id: '3', name: 'Charlie Brown' },
  { id: '4', name: 'David Lee' },
  { id: '5', name: 'Eve Adams' },
];

const NewTaskModal = ({ isOpen, onClose, taskToEdit }) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState('todo');
  const [priority, setPriority] = useState('');
  const [labels, setLabels] = useState('');
  const [subtasks, setSubtasks] = useState([{ title: '', done: false }]);
  const [assignee, setAssignee] = useState(null);
  const [assignedBy, setAssignedBy] = useState('');
  const [visibility, setVisibility] = useState('private');
  const [errors, setErrors] = useState({});

  const [assigneeSearch, setAssigneeSearch] = useState('');
  const [filteredMembers, setFilteredMembers] = useState(orgMembers);

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title || '');
      setDescription(taskToEdit.description || '');
      setDueDate(taskToEdit.dueDate || '');
      setStatus(taskToEdit.status || 'todo');
      setPriority(taskToEdit.priority || '');
      setLabels((taskToEdit.labels || []).join(', '));
      setSubtasks(taskToEdit.subtasks || [{ title: '', done: false }]);
      setAssignee(taskToEdit.assignee || null);
      setAssignedBy(taskToEdit.assignedBy || '');
      setVisibility(taskToEdit.visibility || 'private');
    } else {
      setTitle('');
      setDescription('');
      setDueDate('');
      setStatus('todo');
      setPriority('');
      setLabels('');
      setSubtasks([{ title: '', done: false }]);
      setAssignee(null);
      setAssignedBy('');
      setVisibility('private');
    }
  }, [taskToEdit]);

  useEffect(() => {
    if (assigneeSearch.trim() === '') {
      setFilteredMembers(orgMembers);
    } else {
      setFilteredMembers(
        orgMembers.filter((m) =>
          m.name.toLowerCase().includes(assigneeSearch.toLowerCase())
        )
      );
    }
  }, [assigneeSearch]);

  const validateForm = () => {
    const newErrors = {
      title: !title ? 'Title is required' : '',
      description: !description ? 'Description is required' : '',
      dueDate: !dueDate ? 'Due date is required' : '',
      priority: !priority ? 'Priority is required' : '',
      assignee: !assignee ? 'Assignee is required' : '',
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((e) => e === '');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const user = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
    const assigner = assignedBy || user.name || 'Unknown';

    const payload = {
      title,
      description,
      priority,
      dueDate,
      status,
      labels: labels.split(',').map((l) => l.trim()).filter(Boolean),
      subtasks: subtasks.filter((s) => s.title.trim()),
      assignee,
      assignedBy: assigner,
      visibility,
    };

    taskToEdit
      ? dispatch(editTask({ id: taskToEdit.id, ...payload }))
      : dispatch(addTask({ id: uuidv4(), ...payload }));

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
          {taskToEdit ? 'Edit Task' : 'Create New Task'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 rounded bg-slate-700 text-white"
          />
          {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}

          <textarea
            rows="3"
            placeholder="Task Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 rounded bg-slate-700 text-white"
          />
          {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}

          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full p-2 rounded bg-slate-700 text-white"
          />
          {errors.dueDate && <p className="text-red-500 text-sm">{errors.dueDate}</p>}

          <input
            type="text"
            placeholder="Labels (comma-separated)"
            value={labels}
            onChange={(e) => setLabels(e.target.value)}
            className="w-full p-2 rounded bg-slate-700 text-white"
          />

          {/* Assignee Dropdown */}
          <div>
            <label className="block text-sm mb-1 text-white">Assign To</label>
            <input
              type="text"
              placeholder="Search members..."
              value={assigneeSearch}
              onChange={(e) => setAssigneeSearch(e.target.value)}
              className="w-full p-2 mb-2 rounded bg-slate-700 text-white"
              disabled={assignee?.id === 'everyone'}
            />
            {assigneeSearch && (
              <div className="border dark:border-slate-600 rounded max-h-32 overflow-y-auto bg-white dark:bg-slate-700">
                {filteredMembers.length === 0 ? (
                  <div className="p-2 text-sm text-gray-500">No members found</div>
                ) : (
                  filteredMembers.map((member) => (
                    <div
                      key={member.id}
                      onClick={() => {
                        setAssignee(member);
                        setAssigneeSearch('');
                      }}
                      className="px-3 py-2 hover:bg-blue-100 dark:hover:bg-slate-600 cursor-pointer"
                    >
                      {member.name}
                    </div>
                  ))
                )}
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                setAssignee({ id: 'everyone', name: 'Everyone' });
                setAssigneeSearch('');
              }}
              className="mt-1 text-xs text-blue-400 hover:underline"
            >
              Assign to Everyone
            </button>

            {assignee && (
              <div className="mt-2 text-sm text-green-400 flex justify-between items-center">
                Assigned to: {assignee.name}
                <button
                  type="button"
                  onClick={() => setAssignee(null)}
                  className="text-red-400 hover:underline text-xs ml-2"
                >
                  ✕ Remove
                </button>
              </div>
            )}
            {errors.assignee && <p className="text-red-500 text-sm">{errors.assignee}</p>}
          </div>

          <input
            type="text"
            placeholder="Assigned By"
            value={assignedBy}
            onChange={(e) => setAssignedBy(e.target.value)}
            className="w-full p-2 rounded bg-slate-700 text-white"
          />

          <div>
            <label className="block text-sm text-white mb-1">Visibility</label>
            <div className="flex gap-4 text-white">
              <label>
                <input
                  type="radio"
                  value="public"
                  checked={visibility === 'public'}
                  onChange={() => setVisibility('public')}
                  className="mr-1"
                />
                Public
              </label>
              <label>
                <input
                  type="radio"
                  value="private"
                  checked={visibility === 'private'}
                  onChange={() => setVisibility('private')}
                  className="mr-1"
                />
                Private
              </label>
            </div>
            <p className="text-xs text-gray-300 mt-1">
              Public: All org members can see this task. Private: Only the assignee can view it.
            </p>
          </div>

          {/* Subtasks */}
          <div>
            <label className="block text-sm mb-1 text-white">Subtasks</label>
            {subtasks.map((subtask, idx) => (
              <div key={idx} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  placeholder={`Subtask ${idx + 1}`}
                  value={subtask.title}
                  onChange={(e) =>
                    setSubtasks((prev) =>
                      prev.map((s, i) => (i === idx ? { ...s, title: e.target.value } : s))
                    )
                  }
                  className="flex-1 p-2 rounded bg-slate-700 text-white"
                />
                <button
                  type="button"
                  onClick={() =>
                    setSubtasks((prev) => prev.filter((_, i) => i !== idx))
                  }
                  className="text-red-400 hover:underline text-sm"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setSubtasks([...subtasks, { title: '', done: false }])}
              className="text-blue-400 hover:underline text-sm"
            >
              + Add Subtask
            </button>
          </div>

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full p-2 rounded bg-slate-700 text-white"
          >
            <option value="">Select Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          {errors.priority && <p className="text-red-500 text-sm">{errors.priority}</p>}

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full p-2 rounded bg-slate-700 text-white"
          >
            <option value="todo">To Do</option>
            <option value="inprogress">In Progress</option>
            <option value="done">Done</option>
          </select>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 rounded text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
            >
              {taskToEdit ? 'Update Task' : 'Add Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTaskModal;
