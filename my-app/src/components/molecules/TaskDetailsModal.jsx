import React, { useState, useEffect, useContext } from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import { useDispatch } from 'react-redux';
import { editTask, deleteTask } from '../../redux/slices/tasksSlice';
import axios from 'axios';

import { SocketContext } from '../../context/SocketContext';
const TaskDetailsModal = ({ task, onClose }) => {
  const dispatch = useDispatch();
  const { user } = useContext(SocketContext);
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');

  if (!task) return null;

  const [tags, setTags] = useState((task?.tags || []).join(', '));
  const [assignedTo, setAssignedTo] = useState(task?.assignedTo || []);
  const [teamMembers, setTeamMembers] = useState([]);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [teamId, setTeamId] = useState(null);

  useEffect(() => {
    const fetchTeamId = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/users/${user._id}/team`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTeamId(response.data?._id);
      } catch (error) {
        console.error('Error fetching team ID:', error);
      }
    };

    const fetchTeamMembers = async (currentTeamId) => {
      try {
        const token = localStorage.getItem('token');
        const teamId = currentTeamId || task.teamId;
        const response = await axios.get(`http://localhost:5000/api/teams/${teamId}/members`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTeamMembers(response.data);
      } catch (error) {
        console.error('Error fetching team members:', error);
      }
    };

    const fetchAssignedUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (assignedTo.length > 0) {
          const response = await axios.get(`http://localhost:5000/api/users/bulk?ids=${assignedTo.join(',')}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setAssignedUsers(response.data);
        } else {
          setAssignedUsers([]);
        }
      } catch (error) {
        console.error('Error fetching assigned users:', error);
      }
    };

    if (!task.teamId) fetchTeamId();
    fetchAssignedUsers();
  }, [task, assignedTo, user]);


  const handleSave = async () => {
    const updatedTask = { title, description, tags: tags.split(',').map(tag => tag.trim()), assignedTo };
    dispatch(editTask({ id: task.id, ...updatedTask }));
    setEditMode(false);
    onClose()
  }; 

  const handleDelete = () => {
    dispatch(deleteTask(task.id));
    onClose(); // Close after delete
  };

  return (
    <Dialog open={!!task} onClose={onClose} className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
        <div className="relative bg-white dark:bg-slate-800 rounded-lg max-w-md w-full p-6 shadow-xl z-50 text-black dark:text-white">
          <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-white">
            <XMarkIcon className="h-5 w-5" />
          </button>

          <Dialog.Title className="text-xl font-bold mb-4">Task Details</Dialog.Title>

          {editMode ? (
            <>
              <input
                value={title || ""}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full mb-2 p-2 rounded bg-slate-700 text-white"
              />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full mb-4 p-2 rounded bg-slate-700 text-white"
                rows={4}
              />
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full mb-2 p-2 rounded bg-slate-700 text-white"
                placeholder="Tags (comma-separated)"
              />
              <select
                multiple
                value={assignedTo}
                onChange={(e) => {
                  setAssignedTo(Array.from(e.target.selectedOptions, (option) => option.value));
                }}
                value={assignedTo}
                className="w-full p-2 mb-4 rounded bg-slate-700 text-white"
              >
                <option value="" disabled>Assign to</option>
                {teamMembers.map((member) => (
                  <option key={member._id} value={member._id}>
                    {member.name}
                  </option>
                ))}
              </select>
                Assigned to:
                {assignedUsers.length > 0
                  ? assignedUsers.map((user) => user.name).join(', ')
                  : ' Unassigned'}
              </p>


              <div className="flex justify-end space-x-2">
                <button onClick={handleSave} className="bg-green-600 px-4 py-2 rounded text-white">Save</button>
                <button onClick={() => setEditMode(false)} className="bg-gray-600 px-4 py-2 rounded text-white">Cancel</button>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-lg font-semibold mb-1">{task.title}</h2>
              <p className="text-sm mb-4 text-gray-300">{task.description || 'No description.'}</p>
              <p className="text-sm text-gray-400 mb-2">
                Tags: {task.tags && task.tags.length > 0 ? task.tags.join(', ') : 'No tags'}
              </p>
              <p className="text-sm text-gray-400 mb-2">
                Assigned to:
                {assignedUsers.length > 0
                  ? assignedUsers.map((user) => user.name).join(', ')
                  : ' Unassigned'}
              </p>





              <p className="text-sm text-gray-400 mb-6">Status: <span className="capitalize">{task.status}</span></p>
              <div className="flex justify-end space-x-3">
                <button onClick={() => setEditMode(true)} className="bg-blue-600 px-3 py-1 rounded text-white flex items-center gap-1">
                  <PencilIcon className="h-4 w-4" /> Edit
                </button>
                <button onClick={handleDelete} className="bg-red-600 px-3 py-1 rounded text-white flex items-center gap-1">
                  <TrashIcon className="h-4 w-4" /> Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </Dialog>
  );
};


export default TaskDetailsModal;
