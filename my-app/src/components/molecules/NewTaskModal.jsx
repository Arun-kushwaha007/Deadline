import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createTask, updateTask, fetchUsers } from '../../redux/slices/tasksSlice';
import { 
  fetchMyOrganizations, 
  fetchOrganizationDetails, 
  fetchOrganizationMembers,
  clearOrganizationMembers 
} from '../../redux/organizationSlice';

const NewTaskModal = ({ isOpen, onClose, taskToEdit }) => {
  const dispatch = useDispatch();
  const { users, usersStatus, error: usersError } = useSelector((state) => state.tasks);
  
  const { 
    currentUserOrganizations, 
    currentUserOrganizationsStatus, 
    selectedOrganization,
    organizationMembers, // Add this for cached members
    detailsLoading,
    error: currentUserOrganizationsError 
  } = useSelector((state) => state.organization);

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
  const [organizationId, setOrganizationId] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (usersStatus === 'idle') {
        dispatch(fetchUsers());
      }
      if (currentUserOrganizationsStatus === 'idle') {
        dispatch(fetchMyOrganizations()); 
      }
    }
  }, [isOpen, usersStatus, currentUserOrganizationsStatus, dispatch]);

  // Fetch organization details when organizationId changes
  useEffect(() => {
    if (organizationId) {
      // Check if we already have the organization details and members
      const hasOrgDetails = selectedOrganization && selectedOrganization._id === organizationId;
      const hasMembersCache = organizationMembers[organizationId]?.status === 'succeeded';
      
      if (!hasOrgDetails) {
        dispatch(fetchOrganizationDetails(organizationId));
      }
      
      // Fetch members separately if not cached
      if (!hasMembersCache) {
        dispatch(fetchOrganizationMembers(organizationId));
      }
    }
  }, [organizationId, dispatch, selectedOrganization, organizationMembers]);

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title || '');
      setDescription(taskToEdit.description || '');
      setDueDate(taskToEdit.dueDate 
        ? new Date(taskToEdit.dueDate).toISOString().slice(0, 16) // "YYYY-MM-DDTHH:MM"
        : ''
      );
      
      setStatus(taskToEdit.status || 'todo');
      setPriority(taskToEdit.priority || '');
      setLabels((taskToEdit.labels || []).join(', '));
      setSubtasks(taskToEdit.subtasks || [{ title: '', done: false }]);
      if (users.length > 0) {
        const member = users.find(u => u._id === taskToEdit.assignedTo);
        setAssignee(member || null);
      }
      if (taskToEdit.organization) {
        // Ensure we are setting the ID string, not the whole object
        setOrganizationId(taskToEdit.organization._id || taskToEdit.organization);
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
      setOrganizationId('');
    }
  }, [taskToEdit, users, isOpen]);

  // Filter members based on selected organization and search term
  useEffect(() => {
    let membersToFilter = [];

    if (organizationId) {
      // First try to get members from cache
      const cachedMembers = organizationMembers[organizationId];
      if (cachedMembers?.status === 'succeeded') {
        membersToFilter = cachedMembers.members
          .map(member => member.userId)
          .filter(user => user && user._id);
      }
      // Fallback to selectedOrganization if cache not available
      else if (selectedOrganization && selectedOrganization._id === organizationId) {
        membersToFilter = selectedOrganization.members
          .map(member => member.userId)
          .filter(user => user && user._id);
      }
    } else {
      // If no organization selected, show all users (fallback)
      membersToFilter = users;
    }

    // Apply search filter
    const filtered = assigneeSearch.trim() === ''
      ? membersToFilter
      : membersToFilter.filter(user =>
          user.name.toLowerCase().includes(assigneeSearch.toLowerCase())
        );

    setFilteredMembers(filtered);
  }, [assigneeSearch, organizationId, selectedOrganization, organizationMembers, users]);

  // Reset assignee when organization changes
  useEffect(() => {
    if (organizationId && assignee) {
      let orgMembers = [];
      
      // Get members from cache or selectedOrganization
      const cachedMembers = organizationMembers[organizationId];
      if (cachedMembers?.status === 'succeeded') {
        orgMembers = cachedMembers.members;
      } else if (selectedOrganization && selectedOrganization._id === organizationId) {
        orgMembers = selectedOrganization.members;
      }
      
      // Check if current assignee is still a member of the selected organization
      if (orgMembers.length > 0) {
        const isAssigneeMember = orgMembers.some(
          member => member.userId?._id === assignee._id
        );
        if (!isAssigneeMember && assignee._id !== 'everyone') {
          setAssignee(null); // Reset assignee if they're not in the new org
        }
      }
    }
  }, [organizationId, selectedOrganization, organizationMembers, assignee]);

  const validateForm = () => {
    const newErrors = {
      title: !title ? 'Title is required' : '',
      description: !description ? 'Description is required' : '',
      dueDate: !dueDate ? 'Due date is required' : '',
      priority: !priority ? 'Priority is required' : '',
      assignee: !assignee ? 'Assignee is required' : '',
      organizationId: !organizationId ? 'Organization is required' : '',
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
    setOrganizationId('');
    // Clear any cached members when form is reset
    dispatch(clearOrganizationMembers());
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
     dueDate: new Date(dueDate).toISOString(), // ensure ISO format is stored in DB
     
      status,
      priority,
      labels: labels.split(',').map(l => l.trim()).filter(Boolean),
      subtasks: subtasks.filter(s => s.title.trim()),
      assignedTo: assignee?._id !== 'everyone' ? assignee._id : null,
      assignedBy: assigner,
      visibility,
      organization: organizationId,
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

  // Get available members count for display
  const getAvailableMembersCount = () => {
    if (!organizationId) return 0;
    
    const cachedMembers = organizationMembers[organizationId];
    if (cachedMembers?.status === 'succeeded') {
      return cachedMembers.members.filter(member => member.userId).length;
    }
    
    if (selectedOrganization && selectedOrganization._id === organizationId) {
      return selectedOrganization.members.filter(member => member.userId).length;
    }
    
    return 0;
  };

  const availableMembersCount = getAvailableMembersCount();
  
  // Check if members are loading
  const membersLoading = organizationId && (
    organizationMembers[organizationId]?.status === 'loading' ||
    (detailsLoading && (!selectedOrganization || selectedOrganization._id !== organizationId))
  );

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
              onChange={(e) => {
                setOrganizationId(e.target.value);
                setAssignee(null); // Reset assignee when org changes
                setAssigneeSearch(''); // Clear search
              }}
              className="w-full p-2 rounded bg-slate-700 text-white"
              disabled={currentUserOrganizationsStatus === 'loading' || currentUserOrganizationsStatus === 'failed'}
            >
              <option value="">Select Organization</option>
              {currentUserOrganizationsStatus === 'succeeded' &&
                currentUserOrganizations.map((org) => (
                  <option key={org._id} value={org._id}>
                    {org.name}
                  </option>
                ))}
            </select>
            {currentUserOrganizationsStatus === 'loading' && <p className="text-blue-400 text-sm">Loading organizations...</p>}
            {currentUserOrganizationsStatus === 'failed' && <p className="text-red-500 text-sm">Error loading organizations: {currentUserOrganizationsError?.message || 'Unknown error'}</p>}
            {errors.organizationId && <p className="text-red-500 text-sm">{errors.organizationId}</p>}
          </div>

         <input
           type="datetime-local"
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
            <label className="block text-sm mb-1 text-white">
              Assign To {organizationId && `(${availableMembersCount} members available)`}
            </label>
            
            {!organizationId && (
              <p className="text-yellow-400 text-sm mb-2">Please select an organization first to see available members.</p>
            )}
            
            {membersLoading && (
              <p className="text-blue-400 text-sm mb-2">Loading organization members...</p>
            )}
            
            {organizationId && !membersLoading && availableMembersCount > 0 && (
              <>
                <input
                  type="text"
                  placeholder="Search members..."
                  value={assigneeSearch}
                  onChange={(e) => setAssigneeSearch(e.target.value)}
                  className="w-full p-2 mb-2 rounded bg-slate-700 text-white"
                  disabled={assignee?._id === 'everyone' || availableMembersCount === 0}
                />
                
                {assigneeSearch && filteredMembers.length > 0 && (
                  <div className="border dark:border-slate-600 rounded max-h-32 overflow-y-auto bg-white dark:bg-slate-700">
                    {filteredMembers.map((user) => (
                      <div
                        key={user._id}
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
                
                {assigneeSearch && filteredMembers.length === 0 && availableMembersCount > 0 && (
                  <div className="p-2 text-sm text-gray-500">No members found in this organization</div>
                )}
                
                {availableMembersCount === 0 && (
                  <p className="text-sm text-gray-400">No members available in this organization.</p>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setAssignee({ _id: 'everyone', name: 'Everyone' });
                    setAssigneeSearch('');
                  }}
                  className="mt-1 text-xs text-blue-400 hover:underline"
                  disabled={availableMembersCount === 0}
                >
                  Assign to Everyone in Organization
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