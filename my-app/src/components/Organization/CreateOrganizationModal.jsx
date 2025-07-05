import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  XMarkIcon,
  BuildingOfficeIcon,
  SparklesIcon,
  PlusIcon,
  UsersIcon
} from '@heroicons/react/24/outline';
import { createOrganization } from '../../redux/organizationSlice';

const CreateOrganizationModal = ({ closeModal }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const dispatch = useDispatch();

  const handleCreate = async () => {
    if (!name.trim()) {
      setError('Organization name is required');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      await dispatch(createOrganization({ 
        name: name.trim(),
        description: description.trim() 
      }));
      closeModal();
    } catch (err) {
      setError('Failed to create organization. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      handleCreate();
    }
    if (e.key === 'Escape') {
      closeModal();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-green-500/10 to-blue-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <BuildingOfficeIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Create New Organization</h2>
                <p className="text-blue-100 text-sm">Build your team workspace</p>
              </div>
            </div>
            <button
              onClick={closeModal}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <XMarkIcon className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* Organization Name */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Organization Name *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <BuildingOfficeIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError('');
                }}
                onKeyPress={handleKeyPress}
                placeholder="Enter organization name"
                className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
                autoFocus
              />
            </div>
            <p className="text-xs text-gray-400">
              Choose a unique name for your organization
            </p>
          </div>

          {/* Organization Description */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Description (Optional)
            </label>
            <div className="relative">
              <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
                <SparklesIcon className="h-5 w-5 text-gray-400 mt-0.5" />
              </div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Brief description of your organization..."
                rows={3}
                className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              />
            </div>
            <p className="text-xs text-gray-400">
              Help others understand what your organization does
            </p>
          </div>

          {/* Features Preview */}
          <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/30">
            <div className="flex items-center gap-2 mb-3">
              <UsersIcon className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-300">What you'll get:</span>
            </div>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                Team collaboration workspace
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                Task management and tracking
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                Member roles and permissions
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
                Calendar and deadline management
              </li>
            </ul>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 flex items-center gap-2">
              <XMarkIcon className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span className="text-red-400 text-sm font-medium">{error}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={closeModal}
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-gray-700/50 hover:bg-gray-600/50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-300 font-medium rounded-lg transition-all duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={isLoading || !name.trim()}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100 shadow-lg"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Creating...
                </>
              ) : (
                <>
                  <PlusIcon className="w-4 h-4" />
                  Create Organization
                </>
              )}
            </button>
          </div>

          {/* Keyboard Shortcuts */}
          <div className="text-xs text-gray-500 text-center pt-2 border-t border-gray-700/50">
            Press <kbd className="px-1.5 py-0.5 bg-gray-700/50 rounded text-xs">Enter</kbd> to create • 
            <kbd className="px-1.5 py-0.5 bg-gray-700/50 rounded text-xs ml-1">Esc</kbd> to cancel
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateOrganizationModal;