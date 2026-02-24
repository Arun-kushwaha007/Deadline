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

      <div className="relative bg-muted border border-slate-700 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Modal Header */}
        <div className="bg-muted p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-background border border-border rounded-full flex items-center justify-center">
                <BuildingOfficeIcon className="w-5 h-5 text-foreground" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">Create New Organization</h2>
                <p className="text-muted-foreground text-sm">Build your team workspace</p>
              </div>
            </div>
            <button
              onClick={closeModal}
              className="p-2 hover:bg-background rounded-lg transition-colors border border-transparent hover:border-border"
              aria-label="Close modal"
            >
              <XMarkIcon className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* Organization Name */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-muted-foreground">
              Organization Name *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <BuildingOfficeIcon className="h-5 w-5 text-muted-foreground" />
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
                className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-border/50 rounded-lg text-white placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
                autoFocus
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Choose a unique name for your organization
            </p>
          </div>

          {/* Organization Description */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-muted-foreground">
              Description (Optional)
            </label>
            <div className="relative">
              <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
                <SparklesIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
              </div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Brief description of your organization..."
                rows={3}
                className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-border/50 rounded-lg text-white placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Help others understand what your organization does
            </p>
          </div>

          {/* Features Preview */}
          <div className="bg-slate-700/30 rounded-lg p-4 border border-border/30">
            <div className="flex items-center gap-2 mb-3">
              <UsersIcon className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">What you'll get:</span>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
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
            <div className="bg-destructive/20 border border-red-500/30 rounded-lg p-3 flex items-center gap-2">
              <XMarkIcon className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span className="text-red-400 text-sm font-medium">{error}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={closeModal}
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-slate-700/50 hover:bg-slate-600/50 disabled:opacity-50 disabled:cursor-not-allowed text-muted-foreground font-medium rounded-lg transition-all duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={isLoading || !name.trim()}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary hover:bg-primary/90 disabled:bg-muted-foreground text-primary-foreground font-medium rounded-lg transition-all duration-200 hover:scale-[1.01] disabled:scale-100 shadow-sm"
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
          {/* <div className="text-xs text-muted-foreground text-center pt-2 border-t border-slate-700/50">
            Press <kbd className="px-1.5 py-0.5 bg-slate-700/50 rounded text-xs">Enter</kbd> to create • 
            <kbd className="px-1.5 py-0.5 bg-slate-700/50 rounded text-xs ml-1">Esc</kbd> to cancel
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default CreateOrganizationModal;