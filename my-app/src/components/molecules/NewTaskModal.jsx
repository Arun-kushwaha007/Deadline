import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  XMarkIcon,
  PlusIcon,
  FlagIcon,
  CalendarDaysIcon,
  UserIcon,
  UsersIcon,
  BuildingOfficeIcon,
  ClockIcon,
  TagIcon,
  CheckCircleIcon,
  PlayIcon,
  SparklesIcon,
  EyeIcon,
  EyeSlashIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { createTask, updateTask, fetchUsers } from '../../redux/slices/tasksSlice';
import { 
  fetchMyOrganizations, 
  fetchOrganizationDetails, 
  fetchOrganizationMembers,
  clearOrganizationMembers 
} from '../../redux/organizationSlice';

const NewTaskModal = ({ isOpen, onClose, taskToEdit, viewOnly }) => {
  const dispatch = useDispatch();
  const { users, usersStatus, error: usersError } = useSelector((state) => state.tasks);
  
  const { 
    currentUserOrganizations, 
    currentUserOrganizationsStatus, 
    selectedOrganization,
    organizationMembers,
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
  const [visibility, setVisibility] = useState('public'); // Changed default to 'public'
  const [errors, setErrors] = useState({});
  const [assigneeSearch, setAssigneeSearch] = useState('');
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [organizationId, setOrganizationId] = useState('');
  const [assigneeRole, setAssigneeRole] = useState('member');

const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || '{}');

  // Priority configuration
  const priorityConfig = {
    low: { 
      color: 'text-green-400', 
      bg: 'bg-green-500/20', 
      border: 'border-green-500/30',
      emoji: '🟢',
      label: 'Low Priority'
    },
    medium: { 
      color: 'text-yellow-400', 
      bg: 'bg-yellow-500/20', 
      border: 'border-yellow-500/30',
      emoji: '🟡',
      label: 'Medium Priority'
    },
    high: { 
      color: 'text-red-400', 
      bg: 'bg-red-500/20', 
      border: 'border-red-500/30',
      emoji: '🔴',
      label: 'High Priority'
    }
  };

  // Status configuration
  const statusConfig = {
    todo: { 
      color: 'text-blue-400', 
      bg: 'bg-blue-500/20', 
      border: 'border-blue-500/30',
      icon: ClockIcon,
      label: 'To Do'
    },
    inprogress: { 
      color: 'text-yellow-400', 
      bg: 'bg-yellow-500/20', 
      border: 'border-yellow-500/30',
      icon: PlayIcon,
      label: 'In Progress'
    },
    done: { 
      color: 'text-green-400', 
      bg: 'bg-green-500/20', 
      border: 'border-green-500/30',
      icon: CheckCircleIcon,
      label: 'Completed'
    }
  };

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

  useEffect(() => {
    if (organizationId) {
      const hasOrgDetails = selectedOrganization && selectedOrganization._id === organizationId;
      const orgDetailsCurrentlyLoading = detailsLoading && selectedOrganization?._id !== organizationId;
      const membersCache = organizationMembers[organizationId];
      const membersCurrentlyLoading = membersCache?.status === 'loading';

      if (!hasOrgDetails && !orgDetailsCurrentlyLoading) {
        dispatch(fetchOrganizationDetails(organizationId));
      }
      
      if (!membersCache || (membersCache.status !== 'succeeded' && !membersCurrentlyLoading)) {
        dispatch(fetchOrganizationMembers(organizationId));
      }
    }
  }, [organizationId, dispatch, selectedOrganization, organizationMembers, detailsLoading]);

 useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title || '');
      setDescription(taskToEdit.description || '');
      setDueDate(taskToEdit.dueDate 
        ? new Date(taskToEdit.dueDate).toISOString().slice(0, 16)
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
        setOrganizationId(taskToEdit.organization._id || taskToEdit.organization);
      }
      // Keep existing assignedBy for edit mode
      setAssignedBy(taskToEdit.assignedBy || loggedInUser.name || 'Unknown');
    } else {
      setTitle('');
      setDescription('');
      setDueDate('');
      setStatus('todo');
      setPriority('');
      setLabels('');
      setSubtasks([{ title: '', done: false }]);
      setAssignee(null);
      setAssignedBy(loggedInUser.name || 'Unknown'); // Set logged-in user name by default
      setVisibility('public'); // Set public as default
      setOrganizationId('');
    }
  }, [taskToEdit, users, isOpen, loggedInUser.name]);

  useEffect(() => {
    let potentialMembers = [];

    if (organizationId) {
      const cachedMembersData = organizationMembers[organizationId];
      const selectedOrgData = selectedOrganization;

      // Source 1: organizationMembers cache (from fetchOrganizationMembers)
      if (cachedMembersData?.status === 'succeeded' && cachedMembersData.members) {
        potentialMembers = cachedMembersData.members.map(member => {
          if (member && member.userId && typeof member.userId === 'object' && member.userId._id && member.userId.name) {
            return member.userId; 
          }
          if (member && member._id && member.name) {
            return member; 
          }
          return null;
        }).filter(user => user);
      }
      
      
      // This is used if cache was empty/failed OR if it yielded no members and selectedOrgData is available
      if (potentialMembers.length === 0 && selectedOrgData && selectedOrgData._id === organizationId && selectedOrgData.members) {
        potentialMembers = selectedOrgData.members.map(member => {

          if (member && member._id && member.name) {
            return member; 
          }
          
          if (member && member.userId && typeof member.userId === 'object' && member.userId._id && member.userId.name) {
            return member.userId;
          }
          return null;
        }).filter(user => user);
      }
    } else {

      potentialMembers = users; 
    }

 
    const finalMembersToFilter = potentialMembers.filter(
      user => user && user._id && typeof user.name === 'string'
    );

    const filtered = assigneeSearch.trim() === ''
      ? finalMembersToFilter
      : finalMembersToFilter.filter(user =>
          user.name.toLowerCase().includes(assigneeSearch.toLowerCase())
        );

    setFilteredMembers(filtered);
  }, [assigneeSearch, organizationId, selectedOrganization, organizationMembers, users]);

  useEffect(() => {
    if (organizationId && assignee && assignee._id !== 'everyone') {
      let orgUserObjects = [];
      const cachedMembersData = organizationMembers[organizationId];
      const selectedOrgData = selectedOrganization;

      if (cachedMembersData?.status === 'succeeded' && cachedMembersData.members) {
        orgUserObjects = cachedMembersData.members.map(member => {
          if (member && member.userId && typeof member.userId === 'object' && member.userId._id) return member.userId;
          if (member && member._id) return member; 
          return null;
        }).filter(Boolean);
      } else if (selectedOrgData && selectedOrgData._id === organizationId && selectedOrgData.members) {
        orgUserObjects = selectedOrgData.members.map(member => {
          if (member && member._id) return member; 
          if (member && member.userId && typeof member.userId === 'object' && member.userId._id) return member.userId;
          return null;
        }).filter(Boolean);
      }
      
      if (orgUserObjects.length > 0) {
        const isAssigneeStillMember = orgUserObjects.some(
          userObj => userObj._id === assignee._id
        );
        if (!isAssigneeStillMember) {
          setAssignee(null); // Clear assignee if they are no longer in the selected org's member list
        }
      } else if (assignee) { // If org has no members, clear assignee unless it's "everyone"
        setAssignee(null);
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
     setAssignedBy(loggedInUser.name || 'Unknown'); // Reset to logged-in user
     setVisibility('public'); 
     setErrors({});
     setAssigneeSearch('');
     setOrganizationId('');
     dispatch(clearOrganizationMembers());
   };
 
   const handleSubmit = async (e) => {
     e.preventDefault();
     if (!validateForm()) return;
 
     setLoading(true);
 
     // Use the current assignedBy state (which is already set to logged-in user)
     const assigner = assignedBy || loggedInUser.name || 'Unknown';
 
     const taskPayload = {
       title,
       description,
       dueDate: new Date(dueDate).toISOString(),
       status,
       priority,
       labels: labels.split(',').map(l => l.trim()).filter(Boolean),
       subtasks: subtasks.filter(s => s.title.trim()),
       assignedTo: assignee?._id !== 'everyone' ? assignee._id : null,
       ...(assignee && assignee._id !== 'everyone' && { assigneeRole }),
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
  
  const membersLoading = organizationId && (
    organizationMembers[organizationId]?.status === 'loading' ||
    (detailsLoading && (!selectedOrganization || selectedOrganization._id !== organizationId))
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-green-500/10 to-blue-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                {taskToEdit ? (
                  <FlagIcon className="w-5 h-5 text-white" />
                ) : (
                  <PlusIcon className="w-5 h-5 text-white" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {viewOnly ? 'View Task' : taskToEdit ? 'Edit Task' : 'Create New Task'}
                </h2>
                <p className="text-blue-100 text-sm">
                  {viewOnly ? 'Task details' : taskToEdit ? 'Update task information' : 'Add a new task to your workflow'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <XMarkIcon className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Task Title */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                <FlagIcon className="w-4 h-4" />
                Task Title *
              </label>
              <input
                type="text"
                placeholder="Enter task title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={viewOnly}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
              {errors.title && (
                <p className="text-red-400 text-sm flex items-center gap-1">
                  <XMarkIcon className="w-3 h-3" />
                  {errors.title}
                </p>
              )}
            </div>

            {/* Task Description */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                <SparklesIcon className="w-4 h-4" />
                Description *
              </label>
              <textarea
                rows={4}
                placeholder="Describe the task in detail..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={viewOnly}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed"
              />
              {errors.description && (
                <p className="text-red-400 text-sm flex items-center gap-1">
                  <XMarkIcon className="w-3 h-3" />
                  {errors.description}
                </p>
              )}
            </div>

            {/* Organization and Due Date Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Organization Dropdown */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                  <BuildingOfficeIcon className="w-4 h-4" />
                  Organization *
                </label>
                <select
                  value={organizationId}
                  onChange={(e) => {
                    setOrganizationId(e.target.value);
                    setAssignee(null);
                    setAssigneeSearch('');
                  }}
                  disabled={currentUserOrganizationsStatus === 'loading' || currentUserOrganizationsStatus === 'failed' || viewOnly}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">Select Organization</option>
                  {currentUserOrganizationsStatus === 'succeeded' &&
                    currentUserOrganizations.map((org) => (
                      <option key={org._id} value={org._id}>
                        {org.name}
                      </option>
                    ))}
                </select>
                {currentUserOrganizationsStatus === 'loading' && (
                 <p className="text-blue-400 text-sm flex items-center gap-2">
                   <span className="w-3 h-3 border border-blue-400/30 border-t-blue-400 rounded-full animate-spin"></span>
                   Loading organizations...
                 </p>
                )}
                {currentUserOrganizationsStatus === 'failed' && (
                  <p className="text-red-400 text-sm">Error loading organizations</p>
                )}
                {errors.organizationId && (
                  <p className="text-red-400 text-sm flex items-center gap-1">
                    <XMarkIcon className="w-3 h-3" />
                    {errors.organizationId}
                  </p>
                )}
              </div>

              {/* Due Date */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                  <CalendarDaysIcon className="w-4 h-4" />
                  Due Date *
                </label>
                <input
                  type="datetime-local"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  disabled={viewOnly}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
                {errors.dueDate && (
                  <p className="text-red-400 text-sm flex items-center gap-1">
                    <XMarkIcon className="w-3 h-3" />
                    {errors.dueDate}
                  </p>
                )}
              </div>
            </div>

            {/* Priority and Status Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Priority Selection */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                  <FlagIcon className="w-4 h-4" />
                  Priority *
                </label>
                <div className="space-y-2">
                  {Object.entries(priorityConfig).map(([key, config]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => !viewOnly && setPriority(key)}
                      disabled={viewOnly}
                      className={`w-full p-3 rounded-lg border transition-all text-left ${
                        priority === key
                          ? `${config.bg} ${config.border} ring-2 ring-blue-500/50`
                          : 'bg-gray-700/30 border-gray-600/30 hover:bg-gray-600/30'
                      } ${viewOnly ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{config.emoji}</span>
                        <span className={`font-medium ${priority === key ? 'text-white' : 'text-gray-300'}`}>
                          {config.label}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
                {errors.priority && (
                  <p className="text-red-400 text-sm flex items-center gap-1">
                    <XMarkIcon className="w-3 h-3" />
                    {errors.priority}
                  </p>
                )}
              </div>

              {/* Status Selection */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                  <CheckCircleIcon className="w-4 h-4" />
                  Status
                </label>
                <div className="space-y-2">
                  {Object.entries(statusConfig).map(([key, config]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => !viewOnly && setStatus(key)}
                      disabled={viewOnly}
                      className={`w-full p-3 rounded-lg border transition-all text-left ${
                        status === key
                          ? `${config.bg} ${config.border} ring-2 ring-blue-500/50`
                          : 'bg-gray-700/30 border-gray-600/30 hover:bg-gray-600/30'
                      } ${viewOnly ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="flex items-center gap-3">
                        <config.icon className={`w-4 h-4 ${status === key ? config.color : 'text-gray-400'}`} />
                        <span className={`font-medium ${status === key ? 'text-white' : 'text-gray-300'}`}>
                          {config.label}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Assignee Section */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                <UserIcon className="w-4 h-4" />
                Assign To * {organizationId && `(${availableMembersCount} members available)`}
              </label>
              
              {!organizationId && (
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-400 text-sm">Please select an organization first to see available members.</p>
                </div>
              )}
              
              {membersLoading && (
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                 <p className="text-blue-400 text-sm flex items-center gap-2">
                   <span className="w-4 h-4 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin"></span>
                   Loading organization members...
                 </p>
                </div>
              )}
              
              {organizationId && !membersLoading && availableMembersCount > 0 && (
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Search members..."
                    value={assigneeSearch}
                    onChange={(e) => setAssigneeSearch(e.target.value)}
                    disabled={assignee?._id === 'everyone' || availableMembersCount === 0 || viewOnly}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  
                  {assigneeSearch && filteredMembers.length > 0 && (
                    <div className="border border-gray-600/50 rounded-lg max-h-32 overflow-y-auto bg-gray-800/50">
                      {filteredMembers.map((user) => (
                        <div
                          key={user._id}
                          onClick={() => {
                            if (!viewOnly) {
                              setAssignee(user);
                              setAssigneeSearch('');
                            }
                          }}
                          className="px-4 py-3 hover:bg-gray-700/50 cursor-pointer border-b border-gray-700/30 last:border-b-0 flex items-center gap-3"
                        >
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <UserIcon className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-white">{user.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {assigneeSearch && filteredMembers.length === 0 && availableMembersCount > 0 && (
                    <div className="bg-gray-700/30 rounded-lg p-3">
                      <p className="text-gray-400 text-sm">No members found in this organization</p>
                    </div>
                  )}

                  {!viewOnly && (
                    <button
                      type="button"
                      onClick={() => {
                        setAssignee({ _id: 'everyone', name: 'Everyone' });
                        setAssigneeSearch('');
                      }}
                      disabled={availableMembersCount === 0}
                      className="text-sm text-blue-400 hover:text-blue-300 hover:underline transition-colors"
                    >
                      <UsersIcon className="w-4 h-4 inline mr-1" />
                      Assign to Everyone in Organization
                    </button>
                  )}

                  {assignee && (
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                            {assignee._id === 'everyone' ? (
                              <UsersIcon className="w-4 h-4 text-white" />
                            ) : (
                              <UserIcon className="w-4 h-4 text-white" />
                            )}
                          </div>
                          <span className="text-green-400 font-medium">
                            Assigned to: {assignee.name}
                          </span>
                        </div>
                        {!viewOnly && (
                          <button
                            type="button"
                            onClick={() => {
                              setAssignee(null);
                              setAssigneeRole('member');
                            }}
                            className="text-red-400 hover:text-red-300 text-sm transition-colors"
                          >
                            <XMarkIcon className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  )}

               
                </div>
              )}
              
              {organizationId && !membersLoading && availableMembersCount === 0 && (
                <div className="bg-gray-700/30 rounded-lg p-3">
                  <p className="text-gray-400 text-sm">No members available in this organization.</p>
                </div>
              )}
              
              {errors.assignee && (
                <p className="text-red-400 text-sm flex items-center gap-1">
                  <XMarkIcon className="w-3 h-3" />
                  {errors.assignee}
                </p>
              )}
            </div>

            {/* Labels and Assigned By Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         {/* Labels */}
                         <div className="space-y-2">
                           <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                             <TagIcon className="w-4 h-4" />
                             Labels
                           </label>
                           <input
                             type="text"
                             placeholder="Enter labels (comma-separated)"
                             value={labels}
                             onChange={(e) => setLabels(e.target.value)}
                             disabled={viewOnly}
                             className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                           />
                           <p className="text-xs text-gray-400">
                             Use commas to separate multiple labels
                           </p>
                         </div>
           
                         {/* Assigned By */}
                         <div className="space-y-2">
                           <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                             <UserIcon className="w-4 h-4" />
                             Assigned By
                           </label>
                           <div className="relative">
                             <input
                               type="text"
                               value={assignedBy}
                               disabled={true} // Always disabled
                               className="w-full px-4 py-3 bg-gray-600/50 border border-gray-500/50 rounded-lg text-gray-300 cursor-not-allowed opacity-75"
                             />
                             <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                               <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                 <UserIcon className="w-3 h-3 text-white" />
                               </div>
                             </div>
                           </div>
                           <p className="text-xs text-gray-400">
                             Automatically set to current user
                           </p>
                         </div>
                       </div>
           
                       {/* Visibility Settings */}
                       <div className="space-y-3">
                         <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                           <EyeIcon className="w-4 h-4" />
                           Visibility
                         </label>
                         <div className="grid grid-cols-2 gap-3">
                      
                           <button
                             type="button"
                             disabled={true} // Disabled since it's always selected
                             className="p-4 rounded-lg border bg-blue-500/20 border-blue-500/30 ring-2 ring-blue-500/50 cursor-default"
                           >
                             <div className="flex items-center gap-3">
                               <EyeIcon className="w-5 h-5 text-blue-400" />
                               <div className="text-left">
                                 <div className="font-medium text-white">
                                   Public
                                 </div>
                                 <div className="text-xs text-gray-400">
                                   All org members can see
                                 </div>
                               </div>
                             </div>
                           </button>
                           
                           {/* Private Option - Disabled */}
                           <div className="p-4 rounded-lg border bg-gray-700/30 border-gray-600/30 opacity-50 cursor-not-allowed relative">
                             <div className="flex items-center gap-3">
                               <EyeSlashIcon className="w-5 h-5 text-gray-500" />
                               <div className="text-left">
                                 <div className="font-medium text-gray-500">
                                   Private
                                 </div>
                                 <div className="text-xs text-gray-500">
                                   Coming in next version
                                 </div>
                               </div>
                             </div>
                          
                             <div className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                               Soon
                             </div>
                           </div>
                         </div>
                         <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                           <p className="text-blue-400 text-sm flex items-center gap-2">
                             <EyeIcon className="w-4 h-4" />
                             Currently all tasks are public within the organization. Private tasks will be available in the next version.
                           </p>
                         </div>
                       </div>
            {/* Subtasks Section */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                <CheckCircleIcon className="w-4 h-4" />
                Subtasks
              </label>
              <div className="space-y-3">
                {subtasks.map((subtask, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg border border-gray-600/30">
                    <input
                      type="text"
                      placeholder={`Subtask ${idx + 1}`}
                      value={subtask.title}
                      onChange={(e) =>
                        setSubtasks((prev) =>
                          prev.map((s, i) => (i === idx ? { ...s, title: e.target.value } : s))
                        )
                      }
                      disabled={viewOnly}
                      className="flex-1 px-3 py-2 bg-gray-800/50 border border-gray-600/50 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    {!viewOnly && (
                      <button
                        type="button"
                        onClick={() =>
                          setSubtasks((prev) => prev.filter((_, i) => i !== idx))
                        }
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-md transition-colors"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                {!viewOnly && (
                  <button
                    type="button"
                    onClick={() => setSubtasks([...subtasks, { title: '', done: false }])}
                    className="w-full p-3 border-2 border-dashed border-gray-600/50 rounded-lg text-gray-400 hover:text-gray-300 hover:border-gray-500/50 transition-colors flex items-center justify-center gap-2"
                  >
                    <PlusIcon className="w-4 h-4" />
                    Add Subtask
                  </button>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-6 border-t border-gray-700/50">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 font-medium rounded-lg transition-all duration-200"
              >
                {viewOnly ? 'Close' : 'Cancel'}
              </button>
              {!viewOnly && (
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100 shadow-lg"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : taskToEdit ? (
                    <>
                      <CheckCircleIcon className="w-4 h-4" />
                      Update Task
                    </>
                  ) : (
                    <>
                      <PlusIcon className="w-4 h-4" />
                      Create Task
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewTaskModal;