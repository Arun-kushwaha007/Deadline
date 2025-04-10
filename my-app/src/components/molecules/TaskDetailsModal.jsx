import React from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/solid';

const TaskDetailsModal = ({ task, onClose }) => {
  if (!task) return null;

  return (
    <Dialog open={!!task} onClose={onClose} className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
        <div className="relative bg-white dark:bg-slate-800 rounded-lg max-w-md w-full p-6 shadow-xl z-50 text-black dark:text-white">
          <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-white">
            <XMarkIcon className="h-5 w-5" />
          </button>
          <Dialog.Title className="text-xl font-bold mb-2">{task.title}</Dialog.Title>
          <p className="text-sm text-gray-300">Status: <span className="capitalize">{task.status}</span></p>
          <p className="mt-4 text-sm text-gray-200">Description coming soon...</p>
        </div>
      </div>
    </Dialog>
  );
};

export default TaskDetailsModal;
