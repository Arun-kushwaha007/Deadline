import React from 'react';

const ProfileAchievementsTab = ({ achievementDefinitions, getAchievementStatus }) => (
  <div className="bg-white/80 dark:bg-muted/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-border/50 dark:border-border/50">
    <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
      🏆 Achievements & Badges
    </h3>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {achievementDefinitions.map((achievement, index) => {
        const status = getAchievementStatus(achievement);
        return (
          <div 
            key={achievement.id} 
            className={`text-center p-4 rounded-2xl border transition-all duration-300 hover:scale-[1.01] ${
              status.isUnlocked
                ? 'bg-gradient-to-br from-yellow-50 to-orange-100 dark:from-yellow-900/20 dark:to-orange-800/20 border-yellow-200 dark:border-yellow-800 shadow-lg'
                : 'bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-600 border-border opacity-60'
            }`}
            title={status.isUnlocked ? 'Achievement Unlocked!' : `Progress: ${status.progress}/${achievement.requirement}`}
          >
            <div className={`text-3xl mb-2 relative ${!status.isUnlocked ? 'filter grayscale' : ''}`}>
              {achievement.icon}
              {status.isUnlocked && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
              {!status.isUnlocked && (
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center">
                  <span className="text-white text-2xl">🔒</span>
                </div>
              )}
            </div>
            <h4 className={`font-semibold text-sm mb-1 ${
              status.isUnlocked 
                ? 'text-foreground' 
                : 'text-muted-foreground'
            }`}>
              {achievement.title}
            </h4>
            <p className="text-xs text-muted-foreground mb-2">
              {achievement.desc}
            </p>
            
            {/* Progress bar for locked achievements */}
            {!status.isUnlocked && (
              <div className="mt-3">
                <div className="w-full bg-slate-200 dark:bg-accent rounded-full h-2">
                  <div 
                    className="h-full bg-gradient-to-r from-orange-400 to-yellow-500 rounded-full transition-all duration-500"
                    style={{ width: `${status.percentage}%` }}
                  ></div>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {status.progress}/{achievement.requirement} ({Math.round(status.percentage)}%)
                </div>
              </div>
            )}
            
            {/* Achievement unlocked indicator */}
            {status.isUnlocked && (
              <div className="mt-2">
                <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  🎉 Unlocked!
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  </div>
);

export default ProfileAchievementsTab;
