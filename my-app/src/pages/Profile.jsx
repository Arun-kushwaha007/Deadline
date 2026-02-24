import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import DashboardLayout from '../components/organisms/DashboardLayout';
import DefaultAvatar from '../components/common/DefaultAvatar';
import ProfileOverviewTab from '../components/Profile/ProfileOverviewTab';
import ProfileSkillsTab from '../components/Profile/ProfileSkillsTab';
import ProfileAchievementsTab from '../components/Profile/ProfileAchievementsTab';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [bio, setBio] = useState('');
  const [section, setSection] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [preview, setPreview] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  
  // New state for skills management
  const [userSkills, setUserSkills] = useState([]);
  const [showSkillsModal, setShowSkillsModal] = useState(false);
  const [newSkill, setNewSkill] = useState({ name: '', level: 50, color: 'bg-blue-500' });

  // Achievement system with progress tracking
  const [userProgress, setUserProgress] = useState({
    tasksCompleted: 0,
    organizationsJoined: 0,
    activeDays: 0,
    projectsCollaborated: 0,
    skillsCertified: 0,
    improvementsSuggested: 0,
    loginStreak: 0,
    lastLoginDate: null,
  });

  // DefaultAvatar is now imported from '../components/common/DefaultAvatar'

  // Achievement definitions with unlock conditions
  const achievementDefinitions = [
    {
      id: 'task_master',
      icon: '🏆',
      title: 'Task Master',
      desc: 'Complete 50+ tasks',
      requirement: 50,
      progressKey: 'tasksCompleted',
      category: 'productivity'
    },
    {
      id: 'streak_keeper',
      icon: '🔥',
      title: 'Streak Keeper',
      desc: '30 day login streak',
      requirement: 30,
      progressKey: 'loginStreak',
      category: 'engagement'
    },
    {
      id: 'team_player',
      icon: '⭐',
      title: 'Team Player',
      desc: 'Join 3+ organizations',
      requirement: 3,
      progressKey: 'organizationsJoined',
      category: 'collaboration'
    },
    {
      id: 'goal_achiever',
      icon: '🎯',
      title: 'Goal Achiever',
      desc: 'Complete 10+ projects',
      requirement: 10,
      progressKey: 'projectsCollaborated',
      category: 'achievement'
    },
    {
      id: 'learner',
      icon: '📚',
      title: 'Learner',
      desc: 'Add 5+ skills',
      requirement: 5,
      progressKey: 'skillsCertified',
      category: 'learning'
    },
    {
      id: 'innovator',
      icon: '🚀',
      title: 'Innovator',
      desc: 'Make 10+ improvements',
      requirement: 10,
      progressKey: 'improvementsSuggested',
      category: 'innovation'
    },
  ];

  // Calculate achievement status
  const getAchievementStatus = (achievement) => {
    const currentProgress = userProgress[achievement.progressKey] || 0;
    const isUnlocked = currentProgress >= achievement.requirement;
    const progressPercentage = Math.min((currentProgress / achievement.requirement) * 100, 100);
    
    return {
      isUnlocked,
      progress: currentProgress,
      percentage: progressPercentage,
      remaining: Math.max(achievement.requirement - currentProgress, 0)
    };
  };

  // Skill color options
  const skillColorOptions = [
    { value: 'bg-blue-500', label: 'Blue', preview: '#3B82F6' },
    { value: 'bg-green-500', label: 'Green', preview: '#10B981' },
    { value: 'bg-primary', label: 'Purple', preview: '#8B5CF6' },
    { value: 'bg-orange-500', label: 'Orange', preview: '#F97316' },
    { value: 'bg-destructive', label: 'Red', preview: '#EF4444' },
    { value: 'bg-yellow-500', label: 'Yellow', preview: '#EAB308' },
    { value: 'bg-pink-500', label: 'Pink', preview: '#EC4899' },
    { value: 'bg-primary', label: 'Indigo', preview: '#6366F1' }
  ];


useEffect(() => {
  const fetchUserProfile = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

      const response = await fetch(`${backendUrl}/api/users/profile`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data);
        setBio(data.bio || '');
        setSection(data.section || '');
        setProfilePic(data.profilePic || '');
        setPreview(data.profilePic || '');
        setUserSkills(data.userSkills || []);
        
        // Set user progress with defaults
        const fetchedProgress = data.userProgress || {};
        const defaultProgress = {
          tasksCompleted: 0,
          organizationsJoined: 0,
          activeDays: 0,
          projectsCollaborated: 0,
          skillsCertified: 0,
          improvementsSuggested: 0,
          loginStreak: 0,
          lastLoginDate: null,
        };
        setUserProgress({ ...defaultProgress, ...fetchedProgress });

        // Update localStorage with fresh data
        const updatedLoggedInUser = {
          name: data.name, 
          email: data.email, 
          userId: data.userId,
          profilePic: data.profilePic || '',
          bio: data.bio || '',
          section: data.section || '',
        };
        localStorage.setItem('loggedInUser', JSON.stringify(updatedLoggedInUser));

      } else {
        console.error('Failed to fetch profile:', response.statusText);
        // You could show a toast notification here instead of alert
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // You could show a toast notification here instead of alert
    } finally {
      setIsLoading(false);
    }
  };

  fetchUserProfile();
}, []);

  // Progress simulation functions (for demo purposes) - Will need API calls if kept
  const simulateProgress = async (key, increment = 1) => {

    
    const currentProgress = userProgress || {};
    const updatedLocalProgress = {
      ...currentProgress,
      [key]: (currentProgress[key] || 0) + increment
    };
    
    if (key === 'skillsCertified') {
      updatedLocalProgress.skillsCertified = userSkills.length;
    }
    
    setUserProgress(updatedLocalProgress);

    checkForNewAchievements(updatedLocalProgress);

 
  };


  const checkForNewAchievements = (newProgress) => {
    achievementDefinitions.forEach(achievement => {
      const oldValue = userProgress[achievement.progressKey] || 0;
      const newValue = newProgress[achievement.progressKey] || 0;
      
      if (oldValue < achievement.requirement && newValue >= achievement.requirement) {
        showAchievementUnlockNotification(achievement);
      }
    });
  };

  // Show achievement unlock notification
  const showAchievementUnlockNotification = (achievement) => {
    toast.success(`${achievement.icon} Achievement Unlocked: ${achievement.title}`, {
      duration: 5000,
      style: {
        background: 'linear-gradient(to right, #facc15, #f97316)',
        color: 'white',
        fontWeight: 'bold',
        borderRadius: '1rem',
        border: '2px solid #fde047',
      },
    });
  };

  // Helper function to make authenticated API calls for profile updates
  const updateUserProfileAPI = async (profileData) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Authentication token not found. Please log in.');
      navigate('/login');
      return null;
    }
    try {
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });
      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error updating profile:", error);
      alert(`Failed to update profile: ${error.message}`);
      return null;
    }
  };

  // Add new skill
  const addSkill = async () => {
    if (newSkill.name.trim()) {

      const skillToAdd = { 
        // id: Date.now(),
        name: newSkill.name.trim(),
        level: newSkill.level,
        color: newSkill.color,
        dateAdded: new Date().toISOString()
      };
      
      const newSkillsArray = [...userSkills, skillToAdd];
      const updatedProfileData = await updateUserProfileAPI({ userSkills: newSkillsArray });

      if (updatedProfileData) {
        setUserSkills(updatedProfileData.userSkills || []);
        setUserProgress(updatedProfileData.userProgress || userProgress); 
        
    
        const currentProgress = updatedProfileData.userProgress || userProgress;
        const updatedLocalProgress = { ...currentProgress, skillsCertified: updatedProfileData.userSkills.length };
        setUserProgress(updatedLocalProgress);
        checkForNewAchievements(updatedLocalProgress);


        setNewSkill({ name: '', level: 50, color: 'bg-blue-500' });
        setShowSkillsModal(false);
        
        toast.success(`✅ Skill "${skillToAdd.name}" added successfully!`);
      }
    }
  };

  // Remove skill
  const removeSkill = async (skillIdToRemove) => {

    const newSkillsArray = userSkills.filter(skill => skill._id !== skillIdToRemove);
    const updatedProfileData = await updateUserProfileAPI({ userSkills: newSkillsArray });

    if (updatedProfileData) {
      setUserSkills(updatedProfileData.userSkills || []);
      setUserProgress(updatedProfileData.userProgress || userProgress);

      const currentProgress = updatedProfileData.userProgress || userProgress;
      const updatedLocalProgress = { ...currentProgress, skillsCertified: updatedProfileData.userSkills.length };
      setUserProgress(updatedLocalProgress);
      checkForNewAchievements(updatedLocalProgress);
    }
  };

  // Update skill level
  const updateSkillLevel = async (skillIdToUpdate, newLevel) => {
    const newSkillsArray = userSkills.map(skill =>
      skill._id === skillIdToUpdate ? { ...skill, level: newLevel } : skill 
    );
    const updatedProfileData = await updateUserProfileAPI({ userSkills: newSkillsArray });

    if (updatedProfileData) {
      setUserSkills(updatedProfileData.userSkills || []);
      // No direct progress change here unless skillsCertified definition changes
    }
  };


  const handleUpdate = async () => {
    const profileDataToUpdate = {
      name: user.name,
      bio,
      section,
      profilePic: preview, 
    };

    const updatedUserData = await updateUserProfileAPI(profileDataToUpdate);

    if (updatedUserData) {
      setUser(updatedUserData); 
      setBio(updatedUserData.bio || '');
      setSection(updatedUserData.section || '');
      setProfilePic(updatedUserData.profilePic || '');
    
      setPreview(updatedUserData.profilePic || ''); 
      setShowEditModal(false);
      

    toast.success('✅ Profile updated successfully!');
    } 
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleCopyUserId = () => {
    if (user?.userId) {
      navigator.clipboard.writeText(user.userId);
      toast.success('🔗 User ID copied to clipboard!');
    }
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="">
      <div className="h-8 bg-slate-300 dark:bg-slate-600 rounded-lg mb-4 w-1/3"></div>
      <div className="h-4 bg-slate-200 dark:bg-accent rounded mb-2 w-2/3"></div>
      <div className="h-4 bg-slate-200 dark:bg-accent rounded mb-8 w-1/2"></div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-card rounded-3xl p-8 shadow-xl">
            <div className="w-32 h-32 bg-slate-300 dark:bg-slate-600 rounded-full mx-auto mb-6"></div>
            <div className="h-6 bg-slate-300 dark:bg-slate-600 rounded mb-2"></div>
            <div className="h-4 bg-slate-200 dark:bg-accent rounded mb-4"></div>
            <div className="h-10 bg-slate-200 dark:bg-accent rounded"></div>
          </div>
        </div>
        
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-card rounded-2xl p-6">
                <div className="w-12 h-12 bg-slate-300 dark:bg-slate-600 rounded-xl mb-4"></div>
                <div className="h-4 bg-slate-200 dark:bg-accent rounded mb-2"></div>
                <div className="h-8 bg-slate-300 dark:bg-slate-600 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50/30 to-yellow-50/30 dark:from-card dark:via-slate-900 dark:to-orange-950/30 py-8 px-4 sm:px-6 lg:px-8 transition-all duration-500">
          <div className="max-w-7xl mx-auto">
            <LoadingSkeleton />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!user) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50/30 to-yellow-50/30 dark:from-card dark:via-slate-900 dark:to-orange-950/30 flex items-center justify-center">
          
          <div className="bg-white/80 dark:bg-muted/80 backdrop-blur-sm rounded-3xl p-12 shadow-2xl text-center border border-border/50 dark:border-border/50 relative z-10 max-w-md mx-4">
            <div className="text-8xl mb-6 ">🔐</div>
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
              Authentication Required
            </h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Please log in to view your profile and access your personal dashboard.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="group px-8 py-4 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 text-white rounded-2xl hover:from-orange-600 hover:via-amber-600 hover:to-yellow-600 transition-all duration-300 hover:scale-[1.01] hover:-translate-y-1 font-semibold shadow-lg hover:shadow-xl"
            >
              <span className="group-hover:">🚀</span> Go to Login
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const dashboardStats = [
    {
      label: 'Organizations Joined',
      value: userProgress.organizationsJoined,
      icon: '🏢',
      color: 'bg-primary',
      bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20',
      borderColor: 'border-blue-200 dark:border-blue-800',
      progress: Math.min((userProgress.organizationsJoined / 5) * 100, 100),
      // action: () => simulateProgress('organizationsJoined')
    },
    {
      label: 'Tasks Completed',
      value: userProgress.tasksCompleted,
      icon: '✅',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-gradient-to-br bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-800',
      progress: Math.min((userProgress.tasksCompleted / 50) * 100, 100),
      // action: () => simulateProgress('tasksCompleted')
    },
    {
      label: 'Login Streak',
      value: `${userProgress.loginStreak} days`,
      icon: '🔥',
      color: 'from-amber-500 to-orange-600',
      bgColor: 'bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-900/20 dark:to-orange-800/20',
      borderColor: 'border-amber-200 dark:border-orange-800',
      progress: Math.min((userProgress.loginStreak / 30) * 100, 100),
    },
    {
      label: 'Skills Added',
      value: userSkills.length,
      icon: '🎯',
      color: 'bg-primary',
      bgColor: 'bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20',
      borderColor: 'border-purple-200 dark:border-purple-800',
      progress: Math.min((userSkills.length / 10) * 100, 100),
    },
  ];

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50/30 to-yellow-50/30 dark:from-card dark:via-slate-900 dark:to-orange-950/30 transition-all duration-500">

        <div className="relative z-10 py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            
            {/* Header Section */}
            <div className="text-center mb-16 relative">
              <div className="relative z-10">
                <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 bg-clip-text text-transparent mb-6 animate-fade-in">
                  My Profile
                </h1>
                <p className="text-muted-foreground text-xl max-w-2xl mx-auto leading-relaxed animate-fade-in-delayed">
                  Manage your personal information, track your progress, and showcase your achievements
                </p>
              </div>
            </div>

            {/* Enhanced User ID Section */}
            <div className="mb-12 max-w-4xl mx-auto">
              <div className="bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-yellow-500/10 border border-orange-200/50 dark:border-orange-800/50 rounded-3xl p-8 backdrop-blur-sm shadow-lg">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-white text-2xl">🔑</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
                      Your Unique ID
                    </h2>
                    <p className="text-muted-foreground">
                      Share this ID with organizations to join their workspace
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={user.userId || 'N/A'}
                    readOnly
                    className="flex-1 px-6 py-4 bg-white/80 dark:bg-muted/80 backdrop-blur-sm border border-slate-300/50 dark:border-border/50 rounded-xl font-mono text-lg cursor-not-allowed shadow-inner"
                  />
                  <button
                    onClick={handleCopyUserId}
                    className="group px-8 py-4 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 text-white rounded-xl hover:from-orange-600 hover:via-amber-600 hover:to-yellow-600 transition-all duration-300 hover:scale-[1.01] hover:-translate-y-1 font-semibold shadow-lg hover:shadow-xl"
                  >
                    <span className="group-hover:">📋</span> Copy
                  </button>
                </div>
              </div>
            </div>

         
            {/* Tab Navigation */}
            <div className="mb-8">
              <div className="flex justify-center">
                <div className="bg-white/50 dark:bg-muted/50 backdrop-blur-sm rounded-2xl p-2 border border-border/50 dark:border-border/50 shadow-lg">
                  {[
                    { id: 'overview', label: '📊 Overview', icon: '📊' },
                    { id: 'skills', label: '🎯 Skills', icon: '🎯' },
                    { id: 'achievements', label: '🏆 Achievements', icon: '🏆' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-6 py-3 rounded-xl transition-all duration-300 font-medium ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg transform scale-105'
                          : 'text-muted-foreground hover:text-foreground dark:hover:text-slate-200 hover:bg-accent'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              
              {/* Enhanced Profile Card */}
              <div className="lg:col-span-1">
                <div className="bg-white/80 dark:bg-muted/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-border/50 dark:border-border/50 relative overflow-hidden">
                  {/* Background pattern */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-orange-400 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-amber-400 to-transparent rounded-full translate-y-12 -translate-x-12"></div>
                  </div>
                  
                  <div className="relative z-10 text-center">
                    <div className="relative inline-block mb-6">
                      {preview ? (
                        <img
                          src={preview}
                          alt="Profile"
                          className="w-36 h-36 rounded-full object-cover border-4 border-orange-400 shadow-2xl"
                        />
                      ) : (
                        <DefaultAvatar size={36} />
                      )}
                      <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 rounded-full border-4 border-white dark:border-gray-800 flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    </div>
                    
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-200 bg-clip-text text-transparent mb-2">
                      {user.name}
                    </h2>
                    
                    <p className="text-muted-foreground mb-2 flex items-center justify-center gap-2">
                      <span>📧</span> {user.email || 'user@example.com'}
                    </p>

                    {section && (
                      <div className="mb-4">
                        <span className="inline-block bg-gradient-to-r from-orange-500/20 to-amber-500/20 text-orange-700 dark:text-orange-300 px-4 py-2 rounded-full text-sm font-medium border border-orange-200 dark:border-orange-800">
                          🎯 {section}
                        </span>
                      </div>
                    )}

                    {bio && (
                      <div className="mt-6 p-4 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-600 rounded-2xl border border-border">
                        <p className="text-sm text-foreground/80 italic leading-relaxed">
                          "{bio}"
                        </p>
                      </div>
                    )}

                    <button
                      onClick={() => setShowEditModal(true)}
                      className="mt-8 w-full group px-6 py-4 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 text-white rounded-2xl hover:from-orange-600 hover:via-amber-600 hover:to-yellow-600 transition-all duration-300 hover:scale-[1.01] hover:-translate-y-1 font-semibold shadow-lg hover:shadow-xl"
                    >
                      <span className="group-hover:">✏️</span> Edit Profile
                    </button>
                  </div>
                </div>
              </div>

              {/* Enhanced Content Area */}
              <div className="lg:col-span-2">
                {activeTab === 'overview' && (
                  <ProfileOverviewTab dashboardStats={dashboardStats} />
                )}

                {activeTab === 'skills' && (
                  <ProfileSkillsTab
                    userSkills={userSkills}
                    showSkillsModal={showSkillsModal}
                    setShowSkillsModal={setShowSkillsModal}
                    newSkill={newSkill}
                    setNewSkill={setNewSkill}
                    addSkill={addSkill}
                    removeSkill={removeSkill}
                    updateSkillLevel={updateSkillLevel}
                    skillColorOptions={skillColorOptions}
                  />
                )}

                {activeTab === 'achievements' && (
                  <ProfileAchievementsTab
                    achievementDefinitions={achievementDefinitions}
                    getAchievementStatus={getAchievementStatus}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Edit Profile Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-lg flex justify-center items-center z-50 p-4 animate-fade-in">
            <div className="bg-white/95 dark:bg-muted/95 backdrop-blur-sm rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl border border-border/50 dark:border-border/50 animate-scale-in">
              
              {/* Enhanced Modal Header */}
              <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 p-8 rounded-t-3xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-yellow-400/20 "></div>
                <h2 className="text-3xl font-bold text-white flex items-center gap-3 relative z-10">
                  <span className="">✏️</span> Edit Profile
                </h2>
                <p className="text-orange-100 mt-2 relative z-10">Update your personal information and preferences</p>
              </div>

              <div className="p-8">
                {/* Enhanced Profile Picture Section */}
                <div className="mb-8">
                  <label className="text-sm font-bold text-foreground/80 mb-4 flex items-center gap-2">
                    <span className="text-lg">📸</span> Profile Picture
                  </label>
                  
                  <div className="flex justify-center mb-6">
                    <div className="relative">
                      {preview ? (
                        <img
                          src={preview}
                          alt="Preview"
                          className="w-32 h-32 rounded-full border-4 border-orange-400 object-cover shadow-2xl"
                        />
                      ) : (
                        <DefaultAvatar size={32} />
                      )}
                      <div className="absolute inset-0 bg-black/20 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                        <span className="text-white text-2xl">📷</span>
                      </div>
                    </div>
                  </div>
                  
                  <input
                    type="file"
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="w-full px-4 py-3 border-2 border-dashed border-orange-300 dark:border-orange-600 rounded-xl dark:bg-accent  file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-orange-100 file:text-orange-700 hover:file:bg-orange-200 transition-all duration-300 hover:border-orange-400"
                  />
                </div>

                {/* Enhanced Bio Section */}
                <div className="mb-8">
                  <label className="text-sm font-bold text-foreground/80 mb-4 flex items-center gap-2">
                    <span className="text-lg">📝</span> Bio
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={4}
                    className="w-full px-6 py-4 border border-slate-300 dark:border-border rounded-2xl dark:bg-accent  resize-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-300 shadow-inner"
                    placeholder="Tell us about yourself, your interests, and what motivates you..."
                  />
                </div>

                {/* Enhanced Skills Section */}
                <div className="mb-10">
                  <label className="text-sm font-bold text-foreground/80 mb-4 flex items-center gap-2">
                    <span className="text-lg">🎯</span> Job Title / Role
                  </label>
                  <input
                    type="text"
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    className="w-full px-6 py-4 border border-slate-300 dark:border-border rounded-2xl dark:bg-accent  focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-300 shadow-inner"
                    placeholder="E.g. Full Stack Developer, UI/UX Designer, Project Manager"
                  />
                </div>

                {/* Enhanced Action Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 px-6 py-4 bg-muted0 hover:bg-slate-600 text-white rounded-2xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:scale-[1.01]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdate}
                    className="flex-1 group px-6 py-4 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-600 hover:via-amber-600 hover:to-yellow-600 text-white rounded-2xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:scale-[1.01]"
                  >
                    <span className="group-hover:">💾</span> Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  ); 
}; 


export default Profile;