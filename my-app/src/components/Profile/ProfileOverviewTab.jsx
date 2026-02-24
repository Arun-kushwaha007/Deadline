import React from 'react';

const ProfileOverviewTab = ({ dashboardStats }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
    {dashboardStats.map((stat, index) => (
      <div
        key={stat.label}
        className={`${stat.bgColor} border ${stat.borderColor} rounded-3xl p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 relative overflow-hidden cursor-pointer`}
        style={{ animationDelay: `${index * 100}ms` }}
        onClick={stat.action}
      >
        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-white/20 to-white/40 transition-all duration-1000" 
             style={{ width: `${stat.progress}%` }}></div>
        
        <div className="flex items-center justify-between mb-4">
          <div className={`w-14 h-14 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg`}>
            {stat.icon}
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Progress</div>
            <div className="text-sm font-bold text-foreground/80">{Math.round(stat.progress)}%</div>
          </div>
        </div>
        
        <h3 className="text-foreground/80 text-sm font-semibold mb-2">
          {stat.label}
        </h3>
        
        <p className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
          {stat.value}
        </p>
        
        {stat.action && (
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-xs text-muted-foreground bg-white/80 px-2 py-1 rounded">Click to test</span>
          </div>
        )}
      </div>
    ))}
  </div>
);

export default ProfileOverviewTab;
