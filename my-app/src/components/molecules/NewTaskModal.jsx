import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createTask, updateTask, fetchUsers } from '../../redux/slices/tasksSlice';
import { 
  fetchMyOrganizations, 
  fetchOrganizationDetails, 
  fetchOrganizationMembers,
  clearOrganizationMembers 
} from '../../redux/organizationSlice';

import {
  XMarkIcon,
  PlusIcon,
  UserIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  FlagIcon,
  TagIcon,
  CheckCircleIcon,
  EyeIcon,
  EyeSlashIcon,
  UsersIcon,
  SparklesIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

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
  const [visibility, setVisibility] = useState('private');
  const [errors, setErrors] = useState({});
  const [assigneeSearch, setAssigneeSearch] = useState('');
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [organizationId, setOrganizationId] = useState('');

  // Priority configurations
  const priorityConfig = {
    low: { color: 'text-green-400', bg: 'bg-green-500/20', border: 'border-green-500/30', icon: '🟢' },
    medium: { color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/30', icon: '🟡' },
    high: { color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/30', icon: '🔴' }
  };

  const statusConfig = {
    todo: { color: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500/30', icon: '📋' },
    inprogress: { color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/30', icon: '⚡' },
    done: { color: 'text-green-400', bg: 'bg-green-500/20', border: 'border-green-500/30', icon: '✅' }
  };

  // All existing useEffect and logic remain the same...
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
      const hasMembersCache = organizationMembers[organizationId]?.status === 'succeeded';
      
      if (!hasOrgDetails) {
        dispatch(fetchOrganizationDetails(organizationId));
      }
      
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
    } else {
      resetForm();
    }
  }, [taskToEdit, users, isOpen]);

  useEffect(() => {
    let membersToFilter = [];

    if (organizationId) {
      const cachedMembers = organizationMembers[organizationId];
      if (cachedMembers?.status === 'succeeded') {
        membersToFilter = cachedMembers.members
          .map(member => member.userId)
          .filter(user => user && user._id);
      }
      else if (selectedOrganization && selectedOrganization._id === organizationId) {
        membersToFilter = selectedOrganization.members
          .map(member => member.userId)
          .filter(user => user && user._id);
      }
    } else {
      membersToFilter = users;
    }

    const filtered = assigneeSearch.trim() === ''
      ? membersToFilter
      : membersToFilter.filter(user =>
          user.name.toLowerCase().includes(assigneeSearch.toLowerCase())
        );

    setFilteredMembers(filtered);
  }, [assigneeSearch, organizationId, selectedOrganization, organizationMembers, users]);

  useEffect(() => {
    if (organizationId && assignee) {
      let orgMembers = [];
      
      const cachedMembers = organizationMembers[organizationId];
      if (cachedMembers?.status === 'succeeded') {
        orgMembers = cachedMembers.members;
      } else if (selectedOrganization && selectedOrganization._id === organizationId) {
        orgMembers = selectedOrganization.members;
      }
      
      if (orgMembers.length > 0) {
        const isAssigneeMember = orgMembers.some(
          member => member.userId?._id === assignee._id
        );
        if (!isAssigneeMember && assignee._id !== 'everyone') {
          setAssignee(null);
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
      dueDate: new Date(dueDate).toISOString(),
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                {viewOnly ? (
                  <EyeIcon className="w-5 h-5 text-white" />
                ) : taskToEdit ? (
                  <SparklesIcon className="w-5 h-5 text-white" />
                ) : (
                  <PlusIcon className="w-5 h-5 text-white" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {viewOnly ? 'View Task' : taskToEdit ? 'Edit Task' : 'Create New Task'}
                </h2>
                <p className="text-blue-100 text-sm">
                  {viewOnly ? 'Task details and information' : 'Fill in the details to manage your task'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <XMarkIcon className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                <SparklesIcon className="w-4 h-4" />
                Task Title
              </label>
              <input
                type="text"
                placeholder="Enter task title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={viewOnly}
                className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50"
              />
              {errors.title && <p className="text-red-400 text-sm flex items-center gap-1">
                <span>⚠️</span> {errors.title}
              </p>}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                <TagIcon className="w-4 h-4" />
                Description
              </label>
              <textarea
                rows={3}
                placeholder="Describe your task..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={viewOnly}
                className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none disabled:opacity-50"
              />
              {errors.description && <p className="text-red-400 text-sm flex items-center gap-1">
                <span>⚠️</span> {errors.description}
              </p>}
            </div>

            {/* Organization & Due Date Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Organization */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                  <BuildingOfficeIcon className="w-4 h-4" />
                  Organization
                </label>
                <select
                  value={organizationId}
                  onChange={(e) => {
                    setOrganizationId(e.target.value);
                    setAssignee(null);
                    setAssigneeSearch('');
                  }}
                  disabled={viewOnly || currentUserOrganizationsStatus === 'loading'}
                  className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50"
                >
                  <option value="">Select Organization</option>
                  {currentUserOrganizationsStatus === 'succeeded' &&
                    currentUserOrganizations.map((org) => (
                      <option key={org._id} value={org._id}>
                        {org.name}
                      </option>
                    ))}
                </select>
                {currentUserOrganizationsStatus === 'loading' && 
                  <p className="text-blue-400 text-sm flex items-center gap-1">
                    <ClockIcon className="w-3 h-3 animate-spin" />
                    Loading organizations...
                  </p>
                }
                {errors.organizationId && <p className="text-red-400 text-sm flex items-center gap-1">
                  <span>⚠️</span> {errors.organizationId}
                </p>}
              </div>

              {/* Due Date */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                  <CalendarIcon className="w-4 h-4" />
                  Due Date
                </label>
                <input
                  type="datetime-local"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  disabled={viewOnly}
                  className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50"
                />
                {errors.dueDate && <p className="text-red-400 text-sm flex items-center gap-1">
                  <span>⚠️</span> {errors.dueDate}
                </p>}
              </div>
            </div>

            {/* Priority & Status Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Priority */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                  <FlagIcon className="w-4 h-4" />
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  disabled={viewOnly}
                  className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50"
                >
                  <option value="">Select Priority</option>
                  <option value="low">🟢 Low Priority</option>
                  <option value="medium">🟡 Medium Priority</option>
                  <option value="high">🔴 High Priority</option>
                </select>
                {priority && (
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${priorityConfig[priority].bg} ${priorityConfig[priority].border} ${priorityConfig[priority].color}`}>
                    <span>{priorityConfig[priority].icon}</span>
                    {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
                  </div>
                )}
                {errors.priority && <p className="text-red-400 text-sm flex items-center gap-1">
                  <span>⚠️</span> {errors.priority}
                </p>}
              </div>

              {/* Status */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                  <CheckCircleIcon className="w-4 h-4" />
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  disabled={viewOnly}
                  className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50"
                >
                  <option value="todo">📋 To Do</option>
                  <option value="inprogress">⚡ In Progress</option>
                  <option value="done">✅ Done</option>
                </select>
                {status && (
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${statusConfig[status].bg} ${statusConfig[status].border} ${statusConfig[status].color}`}>
                    <span>{statusConfig[status].icon}</span>
                    {status === 'todo' ? 'To Do' : status === 'inprogress' ? 'In Progress' : 'Done'}
                  </div>
                )}
              </div>
            </div>

            {/* Labels */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                <TagIcon className="w-4 h-4" />
                Labels
              </label>
              <input
                type="text"
                placeholder="Add labels (comma-separated)..."
                value={labels}
                onChange={(e) => setLabels(e.target.value)}
                disabled={viewOnly}
                className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50"
              />
              {labels && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {labels.split(',').map((label, idx) => (
                    <span
                      key={idx}
                      className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 px-3 py-1 rounded-full text-xs font-medium text-indigo-300"
                    >
                      #{label.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Assignee Section */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                <UserIcon className="w-4 h-4" />
                Assign To {organizationId && `(${availableMembersCount} members available)`}
              </label>
              
              {!organizationId ? (
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-400 text-sm flex items-center gap-2">
                    <span>⚠️</span>
                    Please select an organization first to see available members.
                  </p>
                </div>
              ) : membersLoading ? (
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-400 text-sm flex items-center gap-2">
                    <ClockIcon className="w-4 h-4 animate-spin" />
                    Loading organization members...
                  </p>
                </div>
              ) : availableMembersCount > 0 ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Search members..."
                    value={assigneeSearch}
                    onChange={(e) => setAssigneeSearch(e.target.value)}
                    disabled={viewOnly || assignee?._id === 'everyone'}
                    className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50"
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

                  {!viewOnly && (
                    <button
                      type="button"
                      onClick={() => {
                        setAssignee({ _id: 'everyone', name: 'Everyone' });
                        setAssigneeSearch('');
                      }}
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
                            onClick={() => setAssignee(null)}
                            className="text-red-400 hover:text-red-300 text-sm transition-colors"
                          >
                            <XMarkIcon className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-gray-600/20 border border-gray-600/30 rounded-lg p-3">
                  <p className="text-gray-400 text-sm">No members available in this organization.</p>
                </div>
              )}
              
              {errors.assignee && <p className="text-red-400 text-sm flex items-center gap-1">
                <span>⚠️</span> {errors.assignee}
              </p>}
            </div>

            {/* Assigned By */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                <UserIcon className="w-4 h-4" />
                Assigned By
              </label>
              <input
                type="text"
                placeholder="Who is assigning this task?"
                value={assignedBy}
                onChange={(e) => setAssignedBy(e.target.value)}
                disabled={viewOnly}
                className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50"
              />
            </div>

            {/* Visibility */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                <EyeIcon className="w-4 h-4" />
                Visibility
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="public"
                    checked={visibility === 'public'}
                    onChange={() => setVisibility('public')}
                    disabled={viewOnly}
                    className="text-blue-500 focus:ring-blue-500"
                  />
                  <div className="flex items-center gap-2 text-gray-300">
                    <EyeIcon className="w-4 h-4" />
                    <span>Public</span>
                  </div>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="private"
                    checked={visibility === 'private'}
                    onChange={() => setVisibility('private')}
                    disabled={viewOnly}
                    className="text-blue-500 focus:ring-blue-500"
                  />
                  <div className="flex items-center gap-2 text-gray-300">
                    <EyeSlashIcon className="w-4 h-4" />
                    <span>Private</span>
                  </div>
                </label>
              </div>
              <p className="text-xs text-gray-400 bg-gray-700/30 rounded-lg p-2">
                Public: All organization members can see this task. Private: Only the assignee can view it.
              </p>
            </div>

            {/* Subtasks */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                <CheckCircleIcon className="w-4 h-4" />
                Subtasks
              </label>
              <div className="space-y-2">
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
                      className="flex-1 p-2 rounded bg-gray-800/50 border border-gray-600/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50"
                    />
                    {!viewOnly && (
                      <button
                        type="button"
                        onClick={() =>
                          setSubtasks((prev) => prev.filter((_, i) => i !== idx))
                        }
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                {!viewOnly && (
                  <button
                    type="button"
                    onClick={() => setSubtasks([...subtasks, { title: '', done: false }])}
                    className="w-full p-3 border-2 border-dashed border-gray-600/50 rounded-lg text-blue-400 hover:text-blue-300 hover:border-blue-500/50 transition-colors flex items-center justify-center gap-2"
                  >
                    <PlusIcon className="w-4 h-4" />
                    Add Subtask
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="bg-gray-800/50 border-t border-gray-700/50 p-6">
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-600 hover:bg-gray-500 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              {viewOnly ? 'Close' : 'Cancel'}
            </button>
            {!viewOnly && (
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <ClockIcon className="w-4 h-4 animate-spin" />
                    Saving...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    {taskToEdit ? <SparklesIcon className="w-4 h-4" /> : <PlusIcon className="w-4 h-4" />}
                    {taskToEdit ? 'Update Task' : 'Create Task'}
                  </div>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewTaskModal;