import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/organisms/DashboardLayout';

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

  // Enhanced Default Avatar component
  const DefaultAvatar = ({ size = 32, className = "" }) => (
    <div 
      className={`bg-gradient-to-br from-orange-400 via-amber-500 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold shadow-xl relative overflow-hidden ${className}`}
      style={{ width: `${size * 4}px`, height: `${size * 4}px` }}
    >
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-amber-400/20 animate-pulse"></div>
      
      {/* Avatar icon */}
      <svg
        className="w-1/2 h-1/2 relative z-10"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
      </svg>
      
      {/* Shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shine"></div>
    </div>
  );

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
    { value: 'bg-purple-500', label: 'Purple', preview: '#8B5CF6' },
    { value: 'bg-orange-500', label: 'Orange', preview: '#F97316' },
    { value: 'bg-red-500', label: 'Red', preview: '#EF4444' },
    { value: 'bg-yellow-500', label: 'Yellow', preview: '#EAB308' },
    { value: 'bg-pink-500', label: 'Pink', preview: '#EC4899' },
    { value: 'bg-indigo-500', label: 'Indigo', preview: '#6366F1' }
  ];

  // Load user data and progress
  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        console.log('[Profile.jsx] Token for fetchUserProfile:', token); // Log the token

        if (!token) {
          alert('Authentication token not found. Please log in.');
          navigate('/login');
          setIsLoading(false); // Stop loading if no token
          return;
        }

        const response = await fetch('/api/users/profile', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            alert('Session expired or invalid. Please log in again.');
            navigate('/login');
          } else {
            throw new Error(`Failed to fetch profile: ${response.statusText}`);
          }
          return;
        }

        const data = await response.json();
        setUser(data);
        setBio(data.bio || '');
        setSection(data.section || '');
        setProfilePic(data.profilePic || '');
        setPreview(data.profilePic || '');
        setUserSkills(data.userSkills || []);
        
        // Ensure userProgress is an object, even if not fully populated from DB
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

        // updateLoginStreak might need to be called here if still relevant
        // or handled server-side during login. For now, just setting the state.
        // if (data.userProgress) {
        //   updateLoginStreak(data.userProgress); 
        // }


      } catch (error) {
        console.error('[Profile.jsx] Error fetching user profile:', error);
        if (error.response) { // If error has a response object (e.g., from Axios)
          console.error('[Profile.jsx] Error response data:', await error.response.text());
          console.error('[Profile.jsx] Error response status:', error.response.status);
        } else if (error.message && error.message.includes('not valid JSON')) {
            // This case handles the fetch API directly when it receives non-JSON
            // We need access to the raw response if possible, which is tricky from here
            // as the original response object isn't typically part of the SyntaxError.
            // The alert already notifies the user. The key is that the backend sent non-JSON.
            console.error('[Profile.jsx] Received non-JSON response from server. This often means HTML error page or misconfigured proxy.');
        }
        alert('Failed to load profile data. Please try again later or check console for details.');
        // Potentially navigate to login or an error page
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  // Initialize user progress - This logic might be moved to backend or user registration
  // const initializeUserProgress = (userId) => {
  //   const initialProgress = {
  //     tasksCompleted: 0,
  //     organizationsJoined: 0,
  //     activeDays: 1,
  //     projectsCollaborated: 0,
  //     skillsCertified: 0,
  //     improvementsSuggested: 0,
  //     loginStreak: 1,
  //     lastLoginDate: new Date().toDateString(),
  //   };
    
  //   setUserProgress(initialProgress);
  //   // localStorage.setItem('userProgress', JSON.stringify(initialProgress)); // Removed
  // };

  // Update login streak - This should ideally be handled server-side on login
  // const updateLoginStreak = (currentProgress) => {
  //   const today = new Date().toDateString();
  //   const lastLogin = currentProgress.lastLoginDate ? new Date(currentProgress.lastLoginDate).toDateString() : null;
    
  //   if (lastLogin !== today) {
  //     const yesterday = new Date();
  //     yesterday.setDate(yesterday.getDate() - 1);
      
  //     let newStreak;
  //     if (lastLogin === yesterday.toDateString()) {
  //       newStreak = (currentProgress.loginStreak || 0) + 1;
  //     } else {
  //       newStreak = 1; // Reset streak if more than 1 day gap
  //     }
      
  //     const updatedProgress = {
  //       ...currentProgress,
  //       loginStreak: newStreak,
  //       lastLoginDate: new Date().toISOString(), // Store as ISO string for backend
  //       activeDays: (currentProgress.activeDays || 0) + 1
  //     };
      
  //     setUserProgress(updatedProgress);
  //     // localStorage.setItem('userProgress', JSON.stringify(updatedProgress)); // Removed
  //     // TODO: API call to update this on backend if needed immediately.
  //   }
  // };

  // Progress simulation functions (for demo purposes) - Will need API calls if kept
  const simulateProgress = async (key, increment = 1) => {
    // This function now primarily serves for local UI updates and achievement checks.
    // Actual progress updates should happen via specific actions (e.g., completing a task)
    // which would then call an API to update the backend.
    // For now, we'll keep the local state update for UI responsiveness
    // and achievement notifications.
    
    const currentProgress = userProgress || {}; // Ensure userProgress is defined
    const updatedLocalProgress = {
      ...currentProgress,
      [key]: (currentProgress[key] || 0) + increment
    };
    
    if (key === 'skillsCertified') {
      updatedLocalProgress.skillsCertified = userSkills.length;
    }
    
    setUserProgress(updatedLocalProgress);
    // localStorage.setItem('userProgress', JSON.stringify(updatedProgress)); // Removed
    
    // Show achievement unlock notification if applicable
    checkForNewAchievements(updatedLocalProgress);

    // TODO: Consider if an API call is needed here for general progress simulation
    // or if this function should be removed/refactored if progress is updated elsewhere.
  };

  // Check for newly unlocked achievements
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
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-4 rounded-2xl shadow-2xl z-50 animate-slide-in-right border-2 border-yellow-300';
    notification.innerHTML = `
      <div class="flex items-center gap-3">
        <span class="text-2xl animate-bounce">${achievement.icon}</span>
        <div>
          <div class="font-bold">Achievement Unlocked!</div>
          <div class="text-sm opacity-90">${achievement.title}</div>
        </div>
      </div>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 5000);
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
      // Note: Mongoose will generate _id, client-side 'id' is for local keying if needed before save
      // but ideally, we'd get the new skill object (with _id) back from server.
      // For now, we optimistically add and then update with server response.
      const skillToAdd = { 
        // id: Date.now(), // Temporary, will be replaced by MongoDB _id
        name: newSkill.name.trim(),
        level: newSkill.level,
        color: newSkill.color,
        dateAdded: new Date().toISOString()
      };
      
      const newSkillsArray = [...userSkills, skillToAdd];
      const updatedProfileData = await updateUserProfileAPI({ userSkills: newSkillsArray });

      if (updatedProfileData) {
        setUserSkills(updatedProfileData.userSkills || []); // Refresh with server state
        setUserProgress(updatedProfileData.userProgress || userProgress); // Refresh progress
        
        // Update skills certified progress locally for immediate UI feedback
        // simulateProgress('skillsCertified', 0); // This will use the new userSkills.length
        const currentProgress = updatedProfileData.userProgress || userProgress;
        const updatedLocalProgress = { ...currentProgress, skillsCertified: updatedProfileData.userSkills.length };
        setUserProgress(updatedLocalProgress);
        checkForNewAchievements(updatedLocalProgress);


        setNewSkill({ name: '', level: 50, color: 'bg-blue-500' });
        setShowSkillsModal(false);
        
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in-right';
        notification.innerHTML = `✅ Skill "${skillToAdd.name}" added successfully!`;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
      }
    }
  };

  // Remove skill
  const removeSkill = async (skillIdToRemove) => {
    // Note: skillIdToRemove is the MongoDB _id if skills are fetched from DB
    // If it's a temporary client-side ID (like Date.now()), this needs careful handling.
    // Assuming skills in userSkills state have `_id` from the database.
    const newSkillsArray = userSkills.filter(skill => skill._id !== skillIdToRemove); // Use _id from MongoDB
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
      skill._id === skillIdToUpdate ? { ...skill, level: newLevel } : skill // Use _id
    );
    const updatedProfileData = await updateUserProfileAPI({ userSkills: newSkillsArray });

    if (updatedProfileData) {
      setUserSkills(updatedProfileData.userSkills || []);
      // No direct progress change here unless skillsCertified definition changes
    }
  };

  // Rest of your existing functions (handleUpdate, handleImageUpload, etc.)
  const handleUpdate = async () => {
    const profileDataToUpdate = {
      name: user.name, // Assuming name can be updated, though not in modal currently
      bio,
      section,
      profilePic: preview, // This could be a base64 string or a URL
    };

    const updatedUserData = await updateUserProfileAPI(profileDataToUpdate);

    if (updatedUserData) {
      setUser(updatedUserData); // Update the main user object
      setBio(updatedUserData.bio || '');
      setSection(updatedUserData.section || '');
      setProfilePic(updatedUserData.profilePic || '');
      // Preview is already set locally, but ensure consistency if backend modifies URL
      setPreview(updatedUserData.profilePic || ''); 
      setShowEditModal(false);
      
      // Success notification with animation
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in-right';
    notification.innerHTML = '✅ Profile updated successfully!';
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
    } // This closes the if(updatedUserData) block
  }; // This closes the handleUpdate async function

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
      
      // Copy notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in-right';
      notification.innerHTML = '🔗 User ID copied to clipboard!';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.remove();
      }, 3000);
    }
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded-lg mb-4 w-1/3"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-2/3"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-8 w-1/2"></div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl">
            <div className="w-32 h-32 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-6"></div>
            <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
        
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6">
                <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-xl mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
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
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50/30 to-yellow-50/30 dark:from-zinc-900 dark:via-gray-900 dark:to-orange-950/30 py-8 px-4 sm:px-6 lg:px-8 transition-all duration-500">
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
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50/30 to-yellow-50/30 dark:from-zinc-900 dark:via-gray-900 dark:to-orange-950/30 flex items-center justify-center">
          {/* Animated background elements */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-orange-400/5 dark:bg-orange-600/5 rounded-full blur-3xl animate-float"></div>
            <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-amber-400/5 dark:bg-amber-600/5 rounded-full blur-3xl animate-float-delayed"></div>
          </div>
          
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-12 shadow-2xl text-center border border-gray-200/50 dark:border-gray-700/50 relative z-10 max-w-md mx-4">
            <div className="text-8xl mb-6 animate-bounce">🔐</div>
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
              Authentication Required
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
              Please log in to view your profile and access your personal dashboard.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="group px-8 py-4 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 text-white rounded-2xl hover:from-orange-600 hover:via-amber-600 hover:to-yellow-600 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 font-semibold shadow-lg hover:shadow-xl"
            >
              <span className="group-hover:animate-pulse">🚀</span> Go to Login
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
      color: 'from-blue-500 to-blue-600',
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
      bgColor: 'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20',
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
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20',
      borderColor: 'border-purple-200 dark:border-purple-800',
      progress: Math.min((userSkills.length / 10) * 100, 100),
    },
  ];

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50/30 to-yellow-50/30 dark:from-zinc-900 dark:via-gray-900 dark:to-orange-950/30 transition-all duration-500">
        {/* Animated background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-orange-400/5 dark:bg-orange-600/5 rounded-full blur-3xl animate-float"></div>
          <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-amber-400/5 dark:bg-amber-600/5 rounded-full blur-3xl animate-float-delayed"></div>
          <div className="absolute top-1/2 left-3/4 w-48 h-48 bg-yellow-400/5 dark:bg-yellow-600/5 rounded-full blur-3xl animate-float-slow"></div>
        </div>

        <div className="relative z-10 py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            
            {/* Enhanced Header Section */}
            <div className="text-center mb-16 relative">
              <div className="absolute inset-0 flex items-center justify-center opacity-5 dark:opacity-10">
                <span className="text-[20rem] font-bold">👤</span>
              </div>
              <div className="relative z-10">
                <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 bg-clip-text text-transparent mb-6 animate-fade-in">
                  My Profile
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-xl max-w-2xl mx-auto leading-relaxed animate-fade-in-delayed">
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
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
                      Your Unique ID
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      Share this ID with organizations to join their workspace
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={user.userId || 'N/A'}
                    readOnly
                    className="flex-1 px-6 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-300/50 dark:border-gray-600/50 rounded-xl font-mono text-lg cursor-not-allowed shadow-inner"
                  />
                  <button
                    onClick={handleCopyUserId}
                    className="group px-8 py-4 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 text-white rounded-xl hover:from-orange-600 hover:via-amber-600 hover:to-yellow-600 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 font-semibold shadow-lg hover:shadow-xl"
                  >
                    <span className="group-hover:animate-pulse">📋</span> Copy
                  </button>
                </div>
              </div>
            </div>

            {/* Demo Progress Buttons (for testing) */}
            {/* <div className="mb-8 max-w-4xl mx-auto">
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-4 text-yellow-800 dark:text-yellow-200">🧪 Demo Progress (for testing)</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => simulateProgress('tasksCompleted')}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                  >
                    Complete Task (+1)
                  </button>
                  <button
                    onClick={() => simulateProgress('organizationsJoined')}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                  >
                    Join Organization (+1)
                  </button>
                  <button
                    onClick={() => simulateProgress('projectsCollaborated')}
                    className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm"
                  >
                    Complete Project (+1)
                  </button>
                  <button
                    onClick={() => simulateProgress('improvementsSuggested')}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm"
                  >
                    Suggest Improvement (+1)
                  </button>
                </div>
              </div>
            </div> */}

            {/* Tab Navigation */}
            <div className="mb-8">
              <div className="flex justify-center">
                <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-2 border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
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
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
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
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-gray-200/50 dark:border-gray-700/50 relative overflow-hidden">
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
                    
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-200 bg-clip-text text-transparent mb-2">
                      {user.name}
                    </h2>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-2 flex items-center justify-center gap-2">
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
                      <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-2xl border border-gray-200 dark:border-gray-600">
                        <p className="text-sm text-gray-700 dark:text-gray-300 italic leading-relaxed">
                          "{bio}"
                        </p>
                      </div>
                    )}

                    <button
                      onClick={() => setShowEditModal(true)}
                      className="mt-8 w-full group px-6 py-4 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 text-white rounded-2xl hover:from-orange-600 hover:via-amber-600 hover:to-yellow-600 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 font-semibold shadow-lg hover:shadow-xl"
                    >
                      <span className="group-hover:animate-pulse">✏️</span> Edit Profile
                    </button>
                  </div>
                </div>
              </div>

              {/* Enhanced Content Area */}
              <div className="lg:col-span-2">
                {activeTab === 'overview' && (
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
                            <div className="text-xs text-gray-500 dark:text-gray-400">Progress</div>
                            <div className="text-sm font-bold text-gray-700 dark:text-gray-300">{Math.round(stat.progress)}%</div>
                          </div>
                        </div>
                        
                        <h3 className="text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">
                          {stat.label}
                        </h3>
                        
                        <p className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
                          {stat.value}
                        </p>
                        
                        {stat.action && (
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-xs text-gray-500 bg-white/80 px-2 py-1 rounded">Click to test</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'skills' && (
                  <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
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
                        <h4 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">No Skills Added Yet</h4>
                        <p className="text-gray-500 dark:text-gray-500 mb-6">Start building your profile by adding your skills and expertise</p>
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
                              <span className="text-gray-700 dark:text-gray-300 font-medium">{skill.name}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-gray-500 dark:text-gray-400 text-sm">{skill.level}%</span>
                                <button
                                  onClick={() => removeSkill(skill.id)}
                                  className="text-red-500 hover:text-red-700 transition-colors p-1"
                                  title="Remove skill"
                                >
                                  ❌
                                </button>
                              </div>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
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
                )}

                {activeTab === 'achievements' && (
                  <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
                    <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
                      🏆 Achievements & Badges
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {achievementDefinitions.map((achievement, index) => {
                        const status = getAchievementStatus(achievement);
                        return (
                          <div 
                            key={achievement.id} 
                            className={`text-center p-4 rounded-2xl border transition-all duration-300 transform hover:scale-105 ${
                              status.isUnlocked
                                ? 'bg-gradient-to-br from-yellow-50 to-orange-100 dark:from-yellow-900/20 dark:to-orange-800/20 border-yellow-200 dark:border-yellow-800 shadow-lg'
                                : 'bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 border-gray-200 dark:border-gray-600 opacity-60'
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
                                ? 'text-gray-800 dark:text-white' 
                                : 'text-gray-500 dark:text-gray-400'
                            }`}>
                              {achievement.title}
                            </h4>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                              {achievement.desc}
                            </p>
                            
                            {/* Progress bar for locked achievements */}
                            {!status.isUnlocked && (
                              <div className="mt-3">
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                  <div 
                                    className="h-full bg-gradient-to-r from-orange-400 to-yellow-500 rounded-full transition-all duration-500"
                                    style={{ width: `${status.percentage}%` }}
                                  ></div>
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
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
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Skills Modal */}
        {showSkillsModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-lg flex justify-center items-center z-50 p-4 animate-fade-in">
            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-3xl w-full max-w-md shadow-2xl border border-gray-200/50 dark:border-gray-700/50 animate-scale-in">
              
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-6 rounded-t-3xl">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <span>🎯</span> Add New Skill
                </h2>
              </div>

              <div className="p-6">
                {/* Skill Name */}
                <div className="mb-4">
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    Skill Name
                  </label>
                  <input
                    type="text"
                    value={newSkill.name}
                    onChange={(e) => setNewSkill({...newSkill, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                    placeholder="e.g. JavaScript, Project Management, Design"
                  />
                </div>

                {/* Skill Level */}
                <div className="mb-4">
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
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
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Beginner</span>
                    <span>Expert</span>
                  </div>
                </div>

                {/* Color Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
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
                    className="flex-1 px-4 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-xl transition-all duration-300 font-medium"
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

        {/* Enhanced Edit Profile Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-lg flex justify-center items-center z-50 p-4 animate-fade-in">
            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200/50 dark:border-gray-700/50 animate-scale-in">
              
              {/* Enhanced Modal Header */}
              <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 p-8 rounded-t-3xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-yellow-400/20 animate-pulse"></div>
                <h2 className="text-3xl font-bold text-white flex items-center gap-3 relative z-10">
                  <span className="animate-bounce">✏️</span> Edit Profile
                </h2>
                <p className="text-orange-100 mt-2 relative z-10">Update your personal information and preferences</p>
              </div>

              <div className="p-8">
                {/* Enhanced Profile Picture Section */}
                <div className="mb-8">
                  <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
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
                    className="w-full px-4 py-3 border-2 border-dashed border-orange-300 dark:border-orange-600 rounded-xl dark:bg-gray-700 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-orange-100 file:text-orange-700 hover:file:bg-orange-200 transition-all duration-300 hover:border-orange-400"
                  />
                </div>

                {/* Enhanced Bio Section */}
                <div className="mb-8">
                  <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
                    <span className="text-lg">📝</span> Bio
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={4}
                    className="w-full px-6 py-4 border border-gray-300 dark:border-gray-600 rounded-2xl dark:bg-gray-700 dark:text-white resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 shadow-inner"
                    placeholder="Tell us about yourself, your interests, and what motivates you..."
                  />
                </div>

                {/* Enhanced Skills Section */}
                <div className="mb-10">
                  <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
                    <span className="text-lg">🎯</span> Job Title / Role
                  </label>
                  <input
                    type="text"
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    className="w-full px-6 py-4 border border-gray-300 dark:border-gray-600 rounded-2xl dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 shadow-inner"
                    placeholder="E.g. Full Stack Developer, UI/UX Designer, Project Manager"
                  />
                </div>

                {/* Enhanced Action Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 px-6 py-4 bg-gray-500 hover:bg-gray-600 text-white rounded-2xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdate}
                    className="flex-1 group px-6 py-4 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-600 hover:via-amber-600 hover:to-yellow-600 text-white rounded-2xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <span className="group-hover:animate-pulse">💾</span> Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  ); // This closes the return statement of the Profile component
}; // This is the correct closing brace for const Profile = () => { ... }

// Enhanced CSS with new animations
const styles = `
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(180deg); }
  }
  
  @keyframes float-delayed {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-30px) rotate(-180deg); }
  }
  
  @keyframes float-slow {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-15px) rotate(90deg); }
  }
  
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes fade-in-delayed {
    0% { opacity: 0; transform: translateY(20px); }
    50% { opacity: 0; transform: translateY(20px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes fade-in-up {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes scale-in {
    from { transform: scale(0.9) translateY(20px); opacity: 0; }
    to { transform: scale(1) translateY(0); opacity: 1; }
  }
  
  @keyframes slide-in-right {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes shine {
    0% { transform: translateX(-100%) skewX(-15deg); }
    100% { transform: translateX(200%) skewX(-15deg); }
  }
  
  .animate-float { animation: float 6s ease-in-out infinite; }
  .animate-float-delayed { animation: float-delayed 8s ease-in-out infinite; }
  .animate-float-slow { animation: float-slow 10s ease-in-out infinite; }
  .animate-fade-in { animation: fade-in 0.6s ease-out; }
  .animate-fade-in-delayed { animation: fade-in-delayed 1s ease-out; }
  .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }
  .animate-scale-in { animation: scale-in 0.4s ease-out; }
  .animate-slide-in-right { animation: slide-in-right 0.3s ease-out; }
  .animate-shine { animation: shine 2s infinite; }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default Profile;