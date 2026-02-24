import React from 'react';

const ProfileSkillsTab = ({
  userSkills,
  showSkillsModal,
  setShowSkillsModal,
  newSkill,
  setNewSkill,
  addSkill,
  removeSkill,
  updateSkillLevel,
  skillColorOptions,
}) => (
  <>
    <div className="bg-white/80 dark:bg-muted/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-border/50 dark:border-border/50">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
          🎯 Skills & Expertise
        </h3>
        <button
          onClick={() => setShowSkillsModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all duration-300 transform hover:scale-105 font-medium shadow-lg"
        >
          ➕ Add Skill
        </button>
      </div>
      
      {userSkills.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎯</div>
          <h4 className="text-xl font-semibold text-muted-foreground mb-2">No Skills Added Yet</h4>
          <p className="text-muted-foreground dark:text-muted-foreground mb-6">Start building your profile by adding your skills and expertise</p>
          <button
            onClick={() => setShowSkillsModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all duration-300 transform hover:scale-105 font-medium shadow-lg"
          >
            🚀 Add Your First Skill
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {userSkills.map((skill, index) => (
            <div key={skill.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-foreground/80 font-medium">{skill.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-sm">{skill.level}%</span>
                  <button
                    onClick={() => removeSkill(skill.id)}
                    className="text-red-500 hover:text-red-700 transition-colors p-1"
                    title="Remove skill"
                  >
                    ❌
                  </button>
                </div>
              </div>
              <div className="w-full bg-slate-200 dark:bg-accent rounded-full h-3 overflow-hidden">
                <div 
                  className={`h-full ${skill.color} rounded-full transition-all duration-1000 ease-out`}
                  style={{ width: `${skill.level}%` }}
                ></div>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={skill.level}
                onChange={(e) => updateSkillLevel(skill.id, parseInt(e.target.value))}
                className="w-full mt-2 opacity-50 hover:opacity-100 transition-opacity"
              />
            </div>
          ))}
        </div>
      )}
    </div>

    {/* Skills Modal */}
    {showSkillsModal && (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-lg flex justify-center items-center z-50 p-4 animate-fade-in">
        <div className="bg-white/95 dark:bg-muted/95 backdrop-blur-sm rounded-3xl w-full max-w-md shadow-2xl border border-border/50 dark:border-border/50 animate-scale-in">
          
          {/* Modal Header */}
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-6 rounded-t-3xl">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <span>🎯</span> Add New Skill
            </h2>
          </div>

          <div className="p-6">
            {/* Skill Name */}
            <div className="mb-4">
              <label className="block text-sm font-bold text-foreground/80 mb-2">
                Skill Name
              </label>
              <input
                type="text"
                value={newSkill.name}
                onChange={(e) => setNewSkill({...newSkill, name: e.target.value})}
                className="w-full px-4 py-3 border border-slate-300 dark:border-border rounded-xl dark:bg-accent dark:text-foreground focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-300"
                placeholder="e.g. JavaScript, Project Management, Design"
              />
            </div>

            {/* Skill Level */}
            <div className="mb-4">
              <label className="block text-sm font-bold text-foreground/80 mb-2">
                Proficiency Level: {newSkill.level}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={newSkill.level}
                onChange={(e) => setNewSkill({...newSkill, level: parseInt(e.target.value)})}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Beginner</span>
                <span>Expert</span>
              </div>
            </div>

            {/* Color Selection */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-foreground/80 mb-2">
                Color Theme
              </label>
              <div className="grid grid-cols-4 gap-2">
                {skillColorOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setNewSkill({...newSkill, color: option.value})}
                    className={`w-full h-10 rounded-lg transition-all duration-200 ${option.value} ${
                      newSkill.color === option.value ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                    }`}
                    title={option.label}
                  />
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowSkillsModal(false)}
                className="flex-1 px-4 py-3 bg-muted0 hover:bg-slate-600 text-white rounded-xl transition-all duration-300 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={addSkill}
                disabled={!newSkill.name.trim()}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Skill
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
  </>
);

export default ProfileSkillsTab;
