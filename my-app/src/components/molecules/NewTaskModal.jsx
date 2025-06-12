import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createTask, updateTask, fetchUsers } from '../../redux/slices/tasksSlice';
import { fetchMyOrganizations } from '../../redux/organizationSlice'; // Corrected import path

const NewTaskModal = ({ isOpen, onClose, taskToEdit }) => {
  const dispatch = useDispatch();
  const { users, usersStatus, error: usersError } = useSelector((state) => state.tasks);
  // Updated to use currentUserOrganizations, currentUserOrganizationsStatus, currentUserOrganizationsError
const { 
  currentUserOrganizations, 
  currentUserOrganizationsStatus, 
  error: currentUserOrganizationsError 
} = useSelector((state) => state.organization); // ✅ correct key

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
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [organizationId, setOrganizationId] = useState(''); // New state for selected organization

  useEffect(() => {
    if (isOpen) {
      if (usersStatus === 'idle') {
        dispatch(fetchUsers());
      }
      // Use currentUserOrganizationsStatus for the condition
      if (currentUserOrganizationsStatus === 'idle') {
        dispatch(fetchMyOrganizations()); 
      }
    }
  }, [isOpen, usersStatus, currentUserOrganizationsStatus, dispatch]);

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title || '');
      setDescription(taskToEdit.description || '');
      setDueDate(taskToEdit.dueDate ? new Date(taskToEdit.dueDate).toISOString().split('T')[0] : '');
      setStatus(taskToEdit.status || 'todo');
      setPriority(taskToEdit.priority || '');
      setLabels((taskToEdit.labels || []).join(', '));
      setSubtasks(taskToEdit.subtasks || [{ title: '', done: false }]);
      if (users.length > 0) {
        const member = users.find(u => u._id === taskToEdit.assignedTo);
        setAssignee(member || null);
      }
      if (taskToEdit.organization) { // Set organizationId if taskToEdit has it
        setOrganizationId(taskToEdit.organization);
      }
    } else {
      // Reset form for new task
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
      setOrganizationId(''); // Reset organizationId for new task
    }
  }, [taskToEdit, users, isOpen]); // Added isOpen to reset org on new task creation after modal opens

  useEffect(() => {
    if (usersStatus === 'succeeded') {
      setFilteredMembers(
        assigneeSearch.trim() === ''
          ? users
          : users.filter(u =>
              u.name.toLowerCase().includes(assigneeSearch.toLowerCase())
            )
      );
    } else {
      setFilteredMembers([]);
    }
  }, [assigneeSearch, users, usersStatus]);

  const validateForm = () => {
    const newErrors = {
      title: !title ? 'Title is required' : '',
      description: !description ? 'Description is required' : '',
      dueDate: !dueDate ? 'Due date is required' : '',
      priority: !priority ? 'Priority is required' : '',
      assignee: !assignee ? 'Assignee is required' : '',
      organizationId: !organizationId ? 'Organization is required' : '', // Add organization validation
    };
    setErrors(newErrors);
    return Object.values(newErrors).every(e => e === '');
  };

  const resetForm = () => {
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
    setErrors({});
    setAssigneeSearch('');
    setOrganizationId(''); // Reset organizationId in resetForm
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    const user = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
    const assigner = assignedBy || user.name || 'Unknown';

    const taskPayload = {
      title,
      description,
      dueDate,
      status,
      priority,
      labels: labels.split(',').map(l => l.trim()).filter(Boolean),
      subtasks: subtasks.filter(s => s.title.trim()),
      assignedTo: assignee?._id !== 'everyone' ? assignee._id : null, // Use _id
      assignedBy: assigner,
      visibility,
      organization: organizationId, // Add organization to taskPayload
    };

    try {
      if (taskToEdit) {
        await dispatch(updateTask({ id: taskToEdit.id, ...taskPayload }));
      } else {
        await dispatch(createTask(taskPayload));
      }
      resetForm();
      onClose();
    } catch (err) {
      console.error('Task submission failed', err);
    } finally {
      setLoading(false);
    }
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
            rows={3}
            placeholder="Task Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 rounded bg-slate-700 text-white"
          />
          {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}

          {/* Organization Dropdown */}
          <div>
            <label className="block text-sm mb-1 text-white">Organization</label>
            <select
              value={organizationId}
              onChange={(e) => setOrganizationId(e.target.value)}
              className="w-full p-2 rounded bg-slate-700 text-white"
              // Use currentUserOrganizationsStatus for disabled condition
              disabled={currentUserOrganizationsStatus === 'loading' || currentUserOrganizationsStatus === 'failed'}
            >
              <option value="">Select Organization</option>
              {/* Populate with currentUserOrganizations and check currentUserOrganizationsStatus */}
              {currentUserOrganizationsStatus === 'succeeded' &&
                currentUserOrganizations.map((org) => (
                  <option key={org._id} value={org._id}>
                    {org.name}
                  </option>
                ))}
            </select>
            {/* Display loading/error based on currentUserOrganizationsStatus and currentUserOrganizationsError */}
            {currentUserOrganizationsStatus === 'loading' && <p className="text-blue-400 text-sm">Loading organizations...</p>}
            {currentUserOrganizationsStatus === 'failed' && <p className="text-red-500 text-sm">Error loading organizations: {currentUserOrganizationsError?.message || 'Unknown error'}</p>}
            {errors.organizationId && <p className="text-red-500 text-sm">{errors.organizationId}</p>}
          </div>

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

          {/* Assignee Section */}
          <div>
            <label className="block text-sm mb-1 text-white">Assign To</label>
            <label className="block text-sm mb-1 text-white">Assign To</label>
            {usersStatus === 'loading' && <p className="text-blue-400">Loading users...</p>}
            {usersStatus === 'failed' && <p className="text-red-500">Error loading users: {usersError?.message || 'Unknown error'}</p>}
            {usersStatus === 'succeeded' && (
              <>
                <input
                  type="text"
                  placeholder="Search members..."
                  value={assigneeSearch}
                  onChange={(e) => setAssigneeSearch(e.target.value)}
                  className="w-full p-2 mb-2 rounded bg-slate-700 text-white"
                  disabled={assignee?._id === 'everyone' || users.length === 0}
                />
                {assigneeSearch && filteredMembers.length > 0 && (
                  <div className="border dark:border-slate-600 rounded max-h-32 overflow-y-auto bg-white dark:bg-slate-700">
                    {filteredMembers.map((user) => (
                      <div
                        key={user._id} // Use user._id
                        onClick={() => {
                          setAssignee(user);
                          setAssigneeSearch('');
                        }}
                        className="px-3 py-2 hover:bg-blue-100 dark:hover:bg-slate-600 cursor-pointer"
                      >
                        {user.name}
                      </div>
                    ))}
                  </div>
                )}
                {assigneeSearch && filteredMembers.length === 0 && users.length > 0 && (
                  <div className="p-2 text-sm text-gray-500">No members found</div>
                )}
                 {users.length === 0 && usersStatus === 'succeeded' && (
                   <p className="text-sm text-gray-400">No users available to assign.</p>
                 )}

                <button
                  type="button"
                  onClick={() => {
                    setAssignee({ _id: 'everyone', name: 'Everyone' }); // Use _id
                    setAssigneeSearch('');
                  }}
                  className="mt-1 text-xs text-blue-400 hover:underline"
                  disabled={users.length === 0 && usersStatus !== 'loading'}
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
              </>
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
              disabled={loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
            >
              {loading ? 'Saving...' : taskToEdit ? 'Update Task' : 'Add Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTaskModal;
