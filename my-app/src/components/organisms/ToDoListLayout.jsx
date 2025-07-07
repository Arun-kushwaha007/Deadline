import React from 'react';
import { Trash2, CheckCircle, Circle, Calendar, Clock } from 'lucide-react';

const ToDoListLayout = ({
  tasks,
  task,
  setTask,
  addTask,
  toggleComplete,
  deleteTask,
}) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-4">
      {tasks.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">📝</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
            No tasks yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Add your first task to get started!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((t, index) => (
            <div
              key={t._id}
              className={`group bg-white dark:bg-gray-700 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all duration-200 transform hover:scale-[1.02] ${
                t.completed 
                  ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800' 
                  : 'hover:border-blue-300 dark:hover:border-blue-600'
              }`}
              style={{
                animationDelay: `${index * 100}ms`,
                animation: 'fadeInUp 0.5s ease-out forwards'
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  {/* Custom Checkbox */}
                  <button
                    onClick={() => toggleComplete(t._id)}
                    className={`flex-shrink-0 mt-1 transition-all duration-200 ${
                      t.completed
                        ? 'text-green-500 hover:text-green-600'
                        : 'text-gray-400 hover:text-blue-500'
                    }`}
                  >
                    {t.completed ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>

                  {/* Task Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span 
                        className={`text-base font-medium transition-all duration-200 ${
                          t.completed 
                            ? 'line-through text-gray-500 dark:text-gray-400' 
                            : 'text-gray-800 dark:text-white'
                        }`}
                      >
                        {t.text}
                      </span>
                      {t.completed && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                          ✓ Done
                        </span>
                      )}
                    </div>
                    
                    {/* Task Metadata */}
                    <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>Created {formatDate(t.createdAt || new Date())}</span>
                      </div>
                      {t.completed && t.updatedAt && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>Completed {formatDate(t.updatedAt)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={() => deleteTask(t._id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                    aria-label="Delete task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Progress indicator for completed tasks */}
              {t.completed && (
                <div className="mt-3 pt-3 border-t border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                    <CheckCircle className="w-4 h-4" />
                    <span className="font-medium">Task completed!</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Tasks Summary */}
      {tasks.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <Circle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
                  {tasks.filter(t => !t.completed).length} Active
                </span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="text-sm font-medium text-green-800 dark:text-green-300">
                  {tasks.filter(t => t.completed).length} Completed
                </span>
              </div>
            </div>
            
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total: {tasks.length} task{tasks.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      )}

      {/* Motivational Message */}
      {tasks.length > 0 && tasks.every(t => t.completed) && (
        <div className="mt-6 p-4 bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl border border-green-200 dark:border-green-800">
          <div className="text-center">
            <div className="text-4xl mb-2">🎉</div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">
              All tasks completed!
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Great job! You've finished everything on your list.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};


const styles = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default ToDoListLayout;