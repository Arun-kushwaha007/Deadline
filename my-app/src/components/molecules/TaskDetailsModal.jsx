import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import { useDispatch } from 'react-redux';
import { updateTask, deleteTaskThunk } from '../../redux/slices/tasksSlice';

const TaskDetailsModal = ({ task, onClose }) => {
  const dispatch = useDispatch();
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');

  if (!task) return null;

  const handleSave = () => {
    dispatch(updateTask({ id: task.id, title, description }));
    setEditMode(false);
  };

  const handleDelete = () => {
    dispatch(deleteTaskThunk(task.id));
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
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full mb-2 p-2 rounded bg-slate-700 text-white"
              />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full mb-4 p-2 rounded bg-slate-700 text-white"
                rows={4}
              />
              <div className="flex justify-end space-x-2">
                <button onClick={handleSave} className="bg-green-600 px-4 py-2 rounded text-white">Save</button>
                <button onClick={() => setEditMode(false)} className="bg-gray-600 px-4 py-2 rounded text-white">Cancel</button>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-lg font-semibold mb-1">{task.title}</h2>
              <p className="text-sm mb-4 text-gray-300">{task.description || 'No description.'}</p>
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
