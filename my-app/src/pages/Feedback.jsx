import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/organisms/DashboardLayout';
import FeedbackModal from '../components/modals/FeedbackModal';

const Feedback = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [publicFeedbacks, setPublicFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [editingFeedback, setEditingFeedback] = useState(null);
  const [activeTab, setActiveTab] = useState('my-feedback');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterRating, setFilterRating] = useState(1);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 10
  });
  const [stats, setStats] = useState({
    totalFeedback: 0,
    averageRating: 0,
    totalPublic: 0
  });

  // Categories with icons and colors
  const categories = [
    { value: '', label: 'All Categories', icon: '📂', color: 'bg-gray-100 text-gray-800' },
    { value: 'general', label: 'General', icon: '💬', color: 'bg-blue-100 text-blue-800' },
    { value: 'feature', label: 'Feature Request', icon: '✨', color: 'bg-purple-100 text-purple-800' },
    { value: 'bug', label: 'Bug Report', icon: '🐛', color: 'bg-red-100 text-red-800' },
    { value: 'improvement', label: 'Improvement', icon: '🚀', color: 'bg-green-100 text-green-800' },
    { value: 'testimonial', label: 'Testimonial', icon: '⭐', color: 'bg-yellow-100 text-yellow-800' }
  ];

  // Load user and initial data
  useEffect(() => {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
      const parsedUser = JSON.parse(loggedInUser);
      setUser(parsedUser);
      fetchUserFeedbacks(parsedUser.userId);
    } else {
      navigate('/login');
    }
    fetchPublicFeedbacks();
  }, [navigate]);

  // Fetch user's feedback
  const fetchUserFeedbacks = async (userId) => {
    try {
      setLoading(true);
      // Replace with actual API call
      const response = await fetch(`/api/feedback/user/${userId}?page=${pagination.currentPage}&limit=${pagination.limit}`, {
        headers: {
          'user-id': userId
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setFeedbacks(data.data);
        setPagination(data.pagination);
      } else {
        // Fallback to localStorage for demo
        const savedFeedbacks = localStorage.getItem(`userFeedbacks_${userId}`) || '[]';
        setFeedbacks(JSON.parse(savedFeedbacks));
      }
    } catch (error) {
      console.error('Error fetching user feedbacks:', error);
      // Fallback to localStorage
      const savedFeedbacks = localStorage.getItem(`userFeedbacks_${userId}`) || '[]';
      setFeedbacks(JSON.parse(savedFeedbacks));
    } finally {
      setLoading(false);
    }
  };

  // Fetch public feedbacks/testimonials
  const fetchPublicFeedbacks = async () => {
    try {
      const queryParams = new URLSearchParams({
        page: pagination.currentPage,
        limit: pagination.limit,
        ...(filterCategory && { category: filterCategory }),
        minRating: filterRating,
        sort: sortBy,
        order: sortOrder,
        ...(searchQuery && { q: searchQuery })
      });

      const endpoint = searchQuery ? 
        `/api/feedback/search?${queryParams}` : 
        `/api/feedback/public?${queryParams}`;

      const response = await fetch(endpoint);
      
      if (response.ok) {
        const data = await response.json();
        setPublicFeedbacks(data.data);
        setPagination(data.pagination);
        if (data.stats) {
          setStats(data.stats);
        }
      } else {
        // Fallback to demo data
        setPublicFeedbacks(getDemoPublicFeedbacks());
      }
    } catch (error) {
      console.error('Error fetching public feedbacks:', error);
      setPublicFeedbacks(getDemoPublicFeedbacks());
    }
  };

  // Demo public feedbacks
  const getDemoPublicFeedbacks = () => [
    {
      _id: '1',
      userName: 'John Doe',
      userAvatar: null,
      rating: 5,
      title: 'Amazing Platform!',
      message: 'This platform has revolutionized how our team manages deadlines. The interface is intuitive and the features are exactly what we needed.',
      category: 'testimonial',
      tags: ['user-friendly', 'efficient', 'innovative'],
      helpfulCount: 15,
      createdAt: new Date().toISOString(),
      isPublic: true,
      isApproved: true
    },
    {
      _id: '2',
      userName: 'Sarah Smith',
      userAvatar: null,
      rating: 4,
      title: 'Great for Team Collaboration',
      message: 'Love how easy it is to track project progress and collaborate with team members. Would recommend to any organization.',
      category: 'testimonial',
      tags: ['collaboration', 'professional', 'reliable'],
      helpfulCount: 12,
      createdAt: new Date().toISOString(),
      isPublic: true,
      isApproved: true
    }
  ];

  // Handle feedback submission
  const handleFeedbackSubmit = async (feedbackData) => {
    try {
      const payload = {
        userId: user.userId,
        userName: user.name,
        userEmail: user.email,
        userAvatar: user.profilePic,
        ...feedbackData
      };

      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'user-id': user.userId
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const result = await response.json();
        setFeedbacks(prev => [result.data, ...prev]);
        showNotification('🎉 Feedback submitted successfully!', 'success');
      } else {
        throw new Error('Failed to submit feedback');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      // Fallback to localStorage
      const newFeedback = {
        _id: Date.now().toString(),
        userId: user.userId,
        userName: user.name,
        userEmail: user.email,
        userAvatar: user.profilePic,
        ...feedbackData,
        createdAt: new Date().toISOString(),
        helpfulCount: 0
      };
      
      const updatedFeedbacks = [newFeedback, ...feedbacks];
      setFeedbacks(updatedFeedbacks);
      localStorage.setItem(`userFeedbacks_${user.userId}`, JSON.stringify(updatedFeedbacks));
      
      showNotification('🎉 Feedback saved locally!', 'success');
    }
  };

  // Handle feedback update
  const handleFeedbackUpdate = async (feedbackData) => {
    try {
      const response = await fetch(`/api/feedback/${editingFeedback._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'user-id': user.userId
        },
        body: JSON.stringify(feedbackData)
      });

      if (response.ok) {
        const result = await response.json();
        setFeedbacks(prev => prev.map(f => f._id === editingFeedback._id ? result.data : f));
        showNotification('✅ Feedback updated successfully!', 'success');
      } else {
        throw new Error('Failed to update feedback');
      }
    } catch (error) {
      console.error('Error updating feedback:', error);
      // Fallback to localStorage update
      const updatedFeedbacks = feedbacks.map(f => 
        f._id === editingFeedback._id ? { ...f, ...feedbackData, updatedAt: new Date().toISOString() } : f
      );
      setFeedbacks(updatedFeedbacks);
      localStorage.setItem(`userFeedbacks_${user.userId}`, JSON.stringify(updatedFeedbacks));
      
      showNotification('✅ Feedback updated locally!', 'success');
    }
    setEditingFeedback(null);
  };

  // Handle feedback deletion
  const handleDeleteFeedback = async (feedbackId) => {
    if (!window.confirm('Are you sure you want to delete this feedback?')) return;

    try {
      const response = await fetch(`/api/feedback/${feedbackId}`, {
        method: 'DELETE',
        headers: {
          'user-id': user.userId
        }
      });

      if (response.ok) {
        setFeedbacks(prev => prev.filter(f => f._id !== feedbackId));
        showNotification('🗑️ Feedback deleted successfully!', 'success');
      } else {
        throw new Error('Failed to delete feedback');
      }
    } catch (error) {
      console.error('Error deleting feedback:', error);
      // Fallback to localStorage
      const updatedFeedbacks = feedbacks.filter(f => f._id !== feedbackId);
      setFeedbacks(updatedFeedbacks);
      localStorage.setItem(`userFeedbacks_${user.userId}`, JSON.stringify(updatedFeedbacks));
      
      showNotification('🗑️ Feedback deleted locally!', 'success');
    }
  };

  // Handle helpful vote
  const handleHelpfulVote = async (feedbackId) => {
    try {
      const response = await fetch(`/api/feedback/${feedbackId}/helpful`, {
        method: 'POST'
      });

      if (response.ok) {
        const result = await response.json();
        setPublicFeedbacks(prev => 
          prev.map(f => f._id === feedbackId ? { ...f, helpfulCount: result.data.helpfulCount } : f)
        );
        showNotification('👍 Thank you for your vote!', 'success');
      }
    } catch (error) {
      console.error('Error voting helpful:', error);
      // Optimistic update
      setPublicFeedbacks(prev => 
        prev.map(f => f._id === feedbackId ? { ...f, helpfulCount: (f.helpfulCount || 0) + 1 } : f)
      );
      showNotification('👍 Vote counted!', 'success');
    }
  };

  // Show notification
  const showNotification = (message, type = 'info') => {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 px-6 py-3 rounded-xl shadow-lg z-50 animate-slide-in-right ${
      type === 'success' ? 'bg-green-500' : 
      type === 'error' ? 'bg-red-500' : 
      'bg-blue-500'
    } text-white font-medium`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 5000);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Render stars
  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'}>
        ⭐
      </span>
    ));
  };

  // Default avatar component
  const DefaultAvatar = ({ size = 12, name = 'User' }) => (
    <div 
      className={`w-${size} h-${size} bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg`}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );

  if (!user) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg text-center">
            <div className="text-6xl mb-4">🔐</div>
            <h2 className="text-xl font-bold mb-2">Authentication Required</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Please log in to access feedback.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
            >
              Go to Login
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50/30 to-yellow-50/30 dark:from-zinc-900 dark:via-gray-900 dark:to-orange-950/30 transition-all duration-500">
        
        {/* Background Effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-orange-400/5 dark:bg-orange-600/5 rounded-full blur-3xl animate-float"></div>
          <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-amber-400/5 dark:bg-amber-600/5 rounded-full blur-3xl animate-float-delayed"></div>
          <div className="absolute top-1/2 left-3/4 w-48 h-48 bg-yellow-400/5 dark:bg-yellow-600/5 rounded-full blur-3xl animate-float-slow"></div>
        </div>

        <div className="relative z-10 py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            
            {/* Header */}
            <div className="text-center mb-16 relative">
              <div className="absolute inset-0 flex items-center justify-center opacity-5 dark:opacity-10">
                <span className="text-[20rem] font-bold">💬</span>
              </div>
              <div className="relative z-10">
                <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 bg-clip-text text-transparent mb-6 animate-fade-in">
                  Feedback Center
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-xl max-w-2xl mx-auto leading-relaxed animate-fade-in-delayed">
                  Share your thoughts, help us improve, and see what others are saying
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-200/50 dark:border-blue-800/50 rounded-3xl p-6 text-center">
                <div className="text-3xl mb-2">📊</div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{feedbacks.length}</div>
                <div className="text-gray-600 dark:text-gray-400">Your Feedback</div>
              </div>
              <div className="bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-200/50 dark:border-green-800/50 rounded-3xl p-6 text-center">
                <div className="text-3xl mb-2">⭐</div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {stats.averageRating || '4.8'}
                </div>
                <div className="text-gray-600 dark:text-gray-400">Avg Rating</div>
              </div>
              <div className="bg-gradient-to-r from-purple-500/10 to-purple-600/10 border border-purple-200/50 dark:border-purple-800/50 rounded-3xl p-6 text-center">
                <div className="text-3xl mb-2">🌐</div>
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {stats.totalPublic || publicFeedbacks.length}
                </div>
                <div className="text-gray-600 dark:text-gray-400">Public Reviews</div>
              </div>
            </div>

            {/* Action Button */}
            <div className="text-center mb-12">
              <button
                onClick={() => setShowFeedbackModal(true)}
                className="group px-8 py-4 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 text-white rounded-2xl hover:from-orange-600 hover:via-amber-600 hover:to-yellow-600 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 font-semibold text-lg shadow-xl"
              >
                <span className="group-hover:animate-pulse">✨</span> Share Your Feedback
              </button>
            </div>

            {/* Tabs */}
            <div className="mb-8">
              <div className="flex justify-center">
                <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-2 border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
                  {[
                    { id: 'my-feedback', label: '📝 My Feedback', icon: '📝' },
                    { id: 'testimonials', label: '⭐ Testimonials', icon: '⭐' },
                    { id: 'all-reviews', label: '💬 All Reviews', icon: '💬' },
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

            {/* Filters for public reviews */}
            {activeTab !== 'my-feedback' && (
              <div className="mb-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-gray-200/50 dark:border-gray-700/50">
                <div className="flex flex-wrap gap-4 items-center">
                  {/* Search */}
                  <div className="flex-1 min-w-64">
                    <input
                      type="text"
                      placeholder="Search feedback..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  {/* Category Filter */}
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-orange-500"
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.icon} {cat.label}
                      </option>
                    ))}
                  </select>

                  {/* Rating Filter */}
                  <select
                    value={filterRating}
                    onChange={(e) => setFilterRating(parseInt(e.target.value))}
                    className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-orange-500"
                  >
                    <option value={1}>⭐ 1+ Stars</option>
                    <option value={2}>⭐ 2+ Stars</option>
                    <option value={3}>⭐ 3+ Stars</option>
                    <option value={4}>⭐ 4+ Stars</option>
                    <option value={5}>⭐ 5 Stars</option>
                  </select>

                  {/* Sort */}
                  <select
                    value={`${sortBy}-${sortOrder}`}
                    onChange={(e) => {
                      const [field, order] = e.target.value.split('-');
                      setSortBy(field);
                      setSortOrder(order);
                    }}
                    className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="createdAt-desc">📅 Newest First</option>
                    <option value="createdAt-asc">📅 Oldest First</option>
                    <option value="rating-desc">⭐ Highest Rating</option>
                    <option value="rating-asc">⭐ Lowest Rating</option>
                    <option value="helpfulCount-desc">👍 Most Helpful</option>
                  </select>

                  <button
                    onClick={fetchPublicFeedbacks}
                    className="px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors"
                  >
                    🔍 Search
                  </button>
                </div>
              </div>
            )}

            {/* Content based on active tab */}
            {activeTab === 'my-feedback' && (
              <div className="space-y-6">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="inline-block w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading your feedback...</p>
                  </div>
                ) : feedbacks.length === 0 ? (
                  <div className="text-center py-16 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-700/50">
                    <div className="text-8xl mb-6">📝</div>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">No Feedback Yet</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                      Start sharing your thoughts and experiences to help us improve our platform.
                    </p>
                    <button
                      onClick={() => setShowFeedbackModal(true)}
                      className="px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all duration-300 transform hover:scale-105 font-semibold shadow-lg"
                    >
                      🚀 Give Your First Feedback
                    </button>
                  </div>
                ) : (
                  feedbacks.map((feedback, index) => (
                    <div
                      key={feedback._id}
                      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-200/50 dark:border-gray-700/50 animate-fade-in-up"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="flex">
                              {renderStars(feedback.rating)}
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {feedback.rating}/5 stars
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              categories.find(c => c.value === feedback.category)?.color || 'bg-gray-100 text-gray-800'
                            }`}>
                              {categories.find(c => c.value === feedback.category)?.icon} {feedback.category}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                            {feedback.title}
                          </h3>
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                            {feedback.message}
                          </p>
                          {feedback.tags && feedback.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {feedback.tags.map((tag) => (
                                <span key={tag} className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-xs">
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => {
                              setEditingFeedback(feedback);
                              setShowFeedbackModal(true);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                            title="Edit feedback"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDeleteFeedback(feedback._id)}
                            className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                            title="Delete feedback"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-4">
                        <div className="flex items-center gap-4">
                          <span>📅 {formatDate(feedback.createdAt)}</span>
                          {feedback.isPublic && (
                            <span className="text-green-600 dark:text-green-400 flex items-center gap-1">
                              🌐 Public
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          👍 {feedback.helpfulCount || 0} helpful
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {(activeTab === 'testimonials' || activeTab === 'all-reviews') && (
              <div className="space-y-6">
                {publicFeedbacks.length === 0 ? (
                  <div className="text-center py-16 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-700/50">
                    <div className="text-8xl mb-6">⭐</div>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">No Public Reviews Yet</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                      Be the first to share a public testimonial and help others discover our platform.
                    </p>
                  </div>
                ) : (
                  publicFeedbacks
                    .filter(feedback => activeTab === 'testimonials' ? feedback.category === 'testimonial' : true)
                    .map((feedback, index) => (
                      <div
                        key={feedback._id}
                        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-200/50 dark:border-gray-700/50 animate-fade-in-up"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex items-start gap-6">
                          <div className="flex-shrink-0">
                            {feedback.userAvatar ? (
                              <img
                                src={feedback.userAvatar}
                                alt={feedback.userName}
                                className="w-16 h-16 rounded-full object-cover border-2 border-orange-400"
                              />
                            ) : (
                              <DefaultAvatar size={16} name={feedback.userName} />
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-4 mb-4">
                              <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
                                {feedback.userName}
                              </h4>
                              <div className="flex">
                                {renderStars(feedback.rating)}
                              </div>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                categories.find(c => c.value === feedback.category)?.color || 'bg-gray-100 text-gray-800'
                              }`}>
                                {categories.find(c => c.value === feedback.category)?.icon} {feedback.category}
                              </span>
                            </div>
                            
                            <h5 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
                              {feedback.title}
                            </h5>
                            
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                              {feedback.message}
                            </p>
                            
                            {feedback.tags && feedback.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-4">
                                {feedback.tags.map((tag) => (
                                  <span key={tag} className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-xs">
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            )}
                            
                            <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-4">
                              <span>📅 {formatDate(feedback.createdAt)}</span>
                              <button
                                onClick={() => handleHelpfulVote(feedback._id)}
                                className="flex items-center gap-2 px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                              >
                                👍 {feedback.helpfulCount || 0} helpful
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Feedback Modal */}
        <FeedbackModal
          isOpen={showFeedbackModal}
          onClose={() => {
            setShowFeedbackModal(false);
            setEditingFeedback(null);
          }}
          onSubmit={editingFeedback ? handleFeedbackUpdate : handleFeedbackSubmit}
          initialData={editingFeedback}
        />
      </div>
    </DashboardLayout>
  );
};

export default Feedback;