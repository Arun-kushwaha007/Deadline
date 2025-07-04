import { useState } from 'react';
import { 
  CalendarIcon, 
  ClockIcon, 
  UserIcon, 
  EyeIcon, 
  PencilIcon, 
  TrashIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  TagIcon,
  ChevronDownIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

export default function TaskCard({
  title,
  description,
  dueDate,
  createdAt,
  priority,
  labels = [],
  subtasks = [],
  assignee,
  assignedBy,
  visibility = 'private',
  onView,
  onEdit,
  onDelete,
}) {
  const [expanded, setExpanded] = useState(false);

  const priorityConfig = {
    low: {
      bg: 'bg-green-500/20',
      border: 'border-green-500/30',
      text: 'text-green-400',
      icon: '🟢',
      gradient: 'from-green-500/10 to-emerald-500/10'
    },
    medium: {
      bg: 'bg-yellow-500/20',
      border: 'border-yellow-500/30',
      text: 'text-yellow-400',
      icon: '🟡',
      gradient: 'from-yellow-500/10 to-orange-500/10'
    },
    high: {
      bg: 'bg-red-500/20',
      border: 'border-red-500/30',
      text: 'text-red-400',
      icon: '🔴',
      gradient: 'from-red-500/10 to-pink-500/10'
    },
  };

  const visibilityConfig = {
    public: { icon: '🌍', color: 'text-blue-400' },
    team: { icon: '👥', color: 'text-purple-400' },
    private: { icon: '🔒', color: 'text-gray-400' }
  };

  const priorityStyle = priorityConfig[priority] || priorityConfig.medium;
  const visibilityStyle = visibilityConfig[visibility] || visibilityConfig.private;

  const completedSubtasks = subtasks.filter(subtask => subtask.done).length;
  const totalSubtasks = subtasks.length;
  const progressPercentage = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

  const isOverdue = dueDate && new Date(dueDate) < new Date();
  const isDueSoon = dueDate && new Date(dueDate) <= new Date(Date.now() + 24 * 60 * 60 * 1000);

  const ActionButton = ({ icon: Icon, label, onClick, variant = 'default' }) => {
    const variants = {
      default: 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/50',
      primary: 'text-blue-400 hover:text-blue-300 hover:bg-blue-500/20',
      warning: 'text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/20',
      danger: 'text-red-400 hover:text-red-300 hover:bg-red-500/20'
    };

    return (
      <button
        className={`p-2 rounded-lg transition-all duration-200 group ${variants[variant]}`}
        onClick={(e) => {
          e.stopPropagation();
          onClick?.();
        }}
        onPointerDown={(e) => e.stopPropagation()}
        type="button"
        title={label}
      >
        <Icon className="w-4 h-4" />
      </button>
    );
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div
      className={`
        relative group bg-gradient-to-br from-gray-800/90 to-gray-900/90 
        backdrop-blur-sm border border-gray-700/50 rounded-2xl shadow-xl 
        transition-all duration-300 cursor-pointer overflow-hidden
        ${expanded 
          ? 'p-6 scale-[1.02] shadow-2xl border-gray-600/60 z-20' 
          : 'p-4 hover:scale-[1.01] hover:shadow-lg hover:border-gray-600/40'
        }
        ${isOverdue ? 'ring-2 ring-red-500/30' : ''}
      `}
      style={{ 
        minHeight: expanded ? 'auto' : '120px', 
        minWidth: '280px', 
        maxWidth: '380px',
        backgroundImage: expanded ? `linear-gradient(135deg, ${priorityStyle.gradient})` : ''
      }}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      onClick={() => setExpanded((prev) => !prev)}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/10 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-white/5 to-transparent rounded-full translate-y-12 -translate-x-12"></div>
      </div>

      {/* Header */}
      <div className="relative flex justify-between items-start mb-3">
        <div className="flex-1 min-w-0">
          <h3 className={`font-bold text-white leading-tight ${
            expanded ? 'text-lg mb-2' : 'text-base truncate'
          }`}>
            {title}
          </h3>
          
          {!expanded && description && (
            <p className="text-sm text-gray-400 truncate">{description}</p>
          )}
        </div>

        <div className="flex items-center gap-2 ml-3 flex-shrink-0">
          {/* Priority Badge */}
          {priority && (
            <div className={`
              px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1
              ${priorityStyle.bg} ${priorityStyle.border} ${priorityStyle.text} border
            `}>
              <span className="text-xs">{priorityStyle.icon}</span>
              {expanded && priority.toUpperCase()}
            </div>
          )}

          {/* Expand/Collapse Indicator */}
          <div className="text-gray-500">
            {expanded ? 
              <ChevronDownIcon className="w-4 h-4" /> : 
              <ChevronRightIcon className="w-4 h-4" />
            }
          </div>
        </div>
      </div>

      {/* Quick Info (Always Visible) */}
      <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
        <div className="flex items-center gap-3">
          {dueDate && (
            <span className={`flex items-center gap-1 ${
              isOverdue ? 'text-red-400' : isDueSoon ? 'text-yellow-400' : 'text-gray-400'
            }`}>
              <CalendarIcon className="w-3 h-3" />
              {formatDate(dueDate)}
            </span>
          )}
          
          {totalSubtasks > 0 && (
            <span className="flex items-center gap-1">
              <CheckCircleIcon className="w-3 h-3" />
              {completedSubtasks}/{totalSubtasks}
            </span>
          )}
        </div>

        <span className={`flex items-center gap-1 ${visibilityStyle.color}`}>
          <span className="text-xs">{visibilityStyle.icon}</span>
          {expanded && visibility}
        </span>
      </div>

      {/* Progress Bar for Subtasks */}
      {totalSubtasks > 0 && !expanded && (
        <div className="w-full bg-gray-700 rounded-full h-1.5 mb-3">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      )}

      {expanded && (
        <>
          {/* Description */}
          {description && (
            <div className="mb-4">
              <p className="text-sm text-gray-300 leading-relaxed">{description}</p>
            </div>
          )}

          {/* Labels */}
          {labels.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <TagIcon className="w-4 h-4 text-gray-400" />
                <span className="text-xs font-medium text-gray-400">Labels</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {labels.map((label, idx) => (
                  <span
                    key={idx}
                    className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 px-3 py-1 rounded-full text-xs font-medium text-indigo-300"
                  >
                    #{label}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Dates */}
          <div className="grid grid-cols-1 gap-2 mb-4 text-xs">
            {dueDate && (
              <div className={`flex items-center gap-2 p-2 rounded-lg ${
                isOverdue 
                  ? 'bg-red-500/10 border border-red-500/20 text-red-300' 
                  : isDueSoon 
                  ? 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-300'
                  : 'bg-gray-700/50 text-gray-300'
              }`}>
                <CalendarIcon className="w-4 h-4" />
                <span>Due: {formatDate(dueDate)}</span>
                {isOverdue && <ExclamationTriangleIcon className="w-4 h-4 text-red-400" />}
              </div>
            )}
            
            {createdAt && (
              <div className="flex items-center gap-2 text-gray-400">
                <ClockIcon className="w-4 h-4" />
                <span>Created: {formatDate(createdAt)}</span>
              </div>
            )}
          </div>

          {/* Assignment Info */}
          {(assignee?.name || assignedBy) && (
            <div className="mb-4 p-3 bg-gray-700/30 rounded-lg border border-gray-600/30">
              <div className="flex items-center gap-2 mb-2">
                <UserIcon className="w-4 h-4 text-gray-400" />
                <span className="text-xs font-medium text-gray-400">Assignment</span>
              </div>
              <div className="space-y-1 text-xs">
                {assignee?.name && (
                  <p className="text-gray-300">
                    <span className="text-gray-400">Assigned to:</span> 
                    <span className="text-white font-medium ml-1">{assignee.name}</span>
                  </p>
                )}
                {assignedBy && (
                  <p className="text-gray-300">
                    <span className="text-gray-400">Assigned by:</span> 
                    <span className="text-white font-medium ml-1">{assignedBy}</span>
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Subtasks */}
          {subtasks.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <CheckCircleIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-300">Subtasks</span>
                </div>
                <span className="text-xs text-gray-400">
                  {completedSubtasks}/{totalSubtasks} completed
                </span>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
                <div 
                  className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>

              <ul className="space-y-2">
                {subtasks.map((subtask, idx) => (
                  <li
                    key={idx}
                    className={`flex items-center gap-3 p-2 rounded-lg transition-all ${
                      subtask.done 
                        ? 'bg-green-500/10 border border-green-500/20' 
                        : 'bg-gray-700/30 border border-gray-600/30'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={subtask.done}
                      readOnly
                      className="w-4 h-4 accent-green-500 rounded"
                    />
                    <span className={`text-sm flex-1 ${
                      subtask.done 
                        ? 'text-gray-400 line-through' 
                        : 'text-gray-200'
                    }`}>
                      {subtask.title}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4 border-t border-gray-700/50">
            <ActionButton 
              icon={EyeIcon} 
              label="View" 
              onClick={onView} 
              variant="primary" 
            />
            <ActionButton 
              icon={PencilIcon} 
              label="Edit" 
              onClick={onEdit} 
              variant="warning" 
            />
            {onDelete && (
              <ActionButton 
                icon={TrashIcon} 
                label="Delete" 
                onClick={onDelete} 
                variant="danger" 
              />
            )}
          </div>
        </>
      )}

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"></div>
    </div>
  );
}