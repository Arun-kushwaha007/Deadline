import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import DashboardLayout from '../components/organisms/DashboardLayout';
import DefaultAvatar from '../components/common/DefaultAvatar';
import FeedbackModal from '../components/modals/FeedbackModal';
import api from '../utils/api';
import { Folder, MessageSquare, Sparkles, Bug, Rocket, Star, CheckCircle, Trash2, ThumbsUp, Lock, BarChart3, Globe, PenSquare, Calendar, Search, Edit2 } from 'lucide-react';

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
    averageRating: 0,
    totalPublicFeedback: 0 
  });
  const [userFeedbackCount, setUserFeedbackCount] = useState(0); 

  
  const categories = [
    { value: '', label: 'All Categories', icon: <Folder className="w-4 h-4" />, color: 'bg-accent text-foreground' },
    { value: 'general', label: 'General', icon: <MessageSquare className="w-4 h-4" />, color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' },
    { value: 'feature', label: 'Feature Request', icon: <Sparkles className="w-4 h-4" />, color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300' },
    { value: 'bug', label: 'Bug Report', icon: <Bug className="w-4 h-4" />, color: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300' },
    { value: 'improvement', label: 'Improvement', icon: <Rocket className="w-4 h-4" />, color: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' },
    { value: 'testimonial', label: 'Testimonial', icon: <Star className="w-4 h-4 fill-current" />, color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' }
  ];

 
  useEffect(() => {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
      const parsedUser = JSON.parse(loggedInUser);
      setUser(parsedUser);
      // fetchUserFeedbacks will be called by tab change or pagination change if user is set
    } else {
      navigate('/login');
    }
    // fetchPublicFeedbacks will be called by tab change or pagination/filter change
  }, [navigate]);

  // Fetch user's feedback (My Feedback tab)
  const fetchUserFeedbacks = async (page = 1) => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await api.get(`/feedback/myfeedback?page=${page}&limit=${pagination.limit}`);
      if (response && response.data) { 
        setFeedbacks(response.data);
        setPagination(response.pagination);
        setUserFeedbackCount(response.pagination.totalItems || 0);
      } else {
        setFeedbacks([]);
        showNotification('Could not load your feedback.', 'error');
      }
    } catch (error) {
      console.error('Error fetching user feedbacks:', error);
      setFeedbacks([]);
      showNotification(error.message || 'Failed to fetch your feedback.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Fetch public feedbacks/testimonials (Testimonials or All Reviews tab)
  const fetchPublicFeedbacks = async (page = 1) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: page,
        limit: pagination.limit,
        ...(filterCategory && { category: filterCategory }),
        minRating: filterRating,
        sort: sortBy,
        order: sortOrder,
        ...(searchQuery && { q: searchQuery })
      }).toString();

      const endpoint = searchQuery ? 
        `/feedback/search?${queryParams}` : 
        `/feedback/public?${queryParams}`;
      
      const response = await api.get(endpoint);

      if (response && response.data) { 
        setPublicFeedbacks(response.data);
        setPagination(response.pagination);
        if (response.stats) {
          setStats(response.stats);
        }
      } else {
        setPublicFeedbacks([]);
        showNotification('Could not load public feedback.', 'error');
      }
    } catch (error) {
      console.error('Error fetching public feedbacks:', error);
      setPublicFeedbacks([]);
      showNotification(error.message || 'Failed to fetch public feedback.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Effect for fetching data when activeTab or relevant filters/pagination change
  useEffect(() => {
    if (activeTab === 'my-feedback' && user) {
      fetchUserFeedbacks(pagination.currentPage);
    } else if (activeTab === 'testimonials' || activeTab === 'all-reviews') {
      fetchPublicFeedbacks(pagination.currentPage);
    }
  }, [activeTab, user, pagination.currentPage, filterCategory, filterRating, sortBy, sortOrder, searchQuery, pagination.limit]);


  // Handle feedback submission
  const handleFeedbackSubmit = async (feedbackData) => {
    if (!user) {
      showNotification('You must be logged in to submit feedback.', 'error');
      return;
    }
    try {
     
      const response = await api.post('/feedback', feedbackData);
      if (response && response.data) { 
        setFeedbacks(prev => [response.data, ...prev]);
        setUserFeedbackCount(prev => prev + 1);
        toast.success(
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <span>Feedback submitted successfully!</span>
          </div>
        );
        fetchUserFeedbacks(); 
        if (response.data.isPublic && response.data.isApproved) {
             fetchPublicFeedbacks(); 
        }
      } else {
        throw new Error(response.message || 'Failed to submit feedback');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      showNotification(error.message || 'Error submitting feedback.', 'error');
    }
  };

  // Handle feedback update
  const handleFeedbackUpdate = async (feedbackData) => {
    if (!editingFeedback || !user) return;
    try {
      const response = await api.put(`/feedback/${editingFeedback._id}`, feedbackData);
      if (response && response.data) {
        setFeedbacks(prev => prev.map(f => f._id === editingFeedback._id ? response.data : f));
        toast.success(
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <span>Feedback updated successfully!</span>
          </div>
        );
        if (response.data.isPublic && response.data.isApproved) {
            fetchPublicFeedbacks(); 
        } else if (!response.data.isPublic || !response.data.isApproved) {
           
            setPublicFeedbacks(prev => prev.filter(pf => pf._id !== response.data._id));
        }
      } else {
        throw new Error(response.message || 'Failed to update feedback');
      }
    } catch (error) {
      console.error('Error updating feedback:', error);
      showNotification(error.message || 'Error updating feedback.', 'error');
    }
    setEditingFeedback(null);
  };

  // Handle feedback deletion
  const handleDeleteFeedback = async (feedbackId) => {
    if (!user || !window.confirm('Are you sure you want to delete this feedback?')) return;

    try {
      const response = await api.delete(`/feedback/${feedbackId}`);
      if (response && response.success) {
        setFeedbacks(prev => prev.filter(f => f._id !== feedbackId));
        setUserFeedbackCount(prev => prev -1);
        setPublicFeedbacks(prev => prev.filter(pf => pf._id !== feedbackId));
        toast.success(
          <div className="flex items-center gap-2">
            <Trash2 className="w-5 h-5" />
            <span>Feedback deleted successfully!</span>
          </div>
        );
      } else {
        throw new Error(response.message || 'Failed to delete feedback');
      }
    } catch (error) {
      console.error('Error deleting feedback:', error);
      showNotification(error.message || 'Error deleting feedback.', 'error');
    }
  };

  // Handle helpful vote
  const handleHelpfulVote = async (feedbackId) => {
    try {
      const response = await api.post(`/feedback/${feedbackId}/helpful`); 
      if (response && response.data) {
        const updateList = (list) => list.map(f => 
          f._id === feedbackId ? { ...f, helpfulCount: response.data.helpfulCount } : f
        );
        setPublicFeedbacks(updateList);
        if(feedbacks.some(f => f._id === feedbackId)) {
            setFeedbacks(updateList);
        }
        toast.success(
          <div className="flex items-center gap-2">
            <ThumbsUp className="w-5 h-5" />
            <span>Thank you for your vote!</span>
          </div>
        );
      } else {
        throw new Error(response.message || 'Failed to vote helpful');
      }
    } catch (error) {
      console.error('Error voting helpful:', error);
      showNotification(error.message || 'Error voting helpful.', 'error');
    }
  };

  // Show notification
  const showNotification = (message, type = 'info') => {
    if (type === 'success') {
      toast.success(message);
    } else if (type === 'error') {
      toast.error(message);
    } else {
      toast(message);
    }
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
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-muted-foreground'}`} 
      />
    ));
  };

  // DefaultAvatar is now imported from '../components/common/DefaultAvatar'

  if (!user) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="bg-card rounded-xl p-8 shadow-lg text-center max-w-md w-full border border-border">
            <div className="flex justify-center mb-6">
              <Lock className="w-20 h-20 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-foreground">Authentication Required</h2>
            <p className="text-muted-foreground mb-8">
              Please log in to access feedback.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl transition-colors shadow-sm w-full"
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
      <div className="min-h-screen bg-background transition-all duration-500">
        
        
        <div className="relative z-10 py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            
            {/* Header */}
            <div className="text-center mb-16 relative">
              <div className="relative z-10">
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6 animate-fade-in">
                  Feedback Center
                </h1>
                <p className="text-muted-foreground text-xl max-w-2xl mx-auto leading-relaxed animate-fade-in-delayed">
                  Share your thoughts, help us improve, and see what others are saying
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-card border border-border shadow-sm rounded-3xl p-6 text-center">
                <div className="flex justify-center mb-4 text-primary">
                  <BarChart3 className="w-8 h-8" />
                </div>
                <div className="text-2xl font-bold text-primary">{feedbacks.length}</div>
                <div className="text-muted-foreground">Your Feedback</div>
              </div>
              <div className="bg-card border border-border shadow-sm rounded-3xl p-6 text-center">
                <div className="flex justify-center mb-4 text-yellow-500">
                  <Star className="w-8 h-8 fill-current" />
                </div>
                <div className="text-2xl font-bold text-primary">
                  {stats.averageRating || '4.8'}
                </div>
                <div className="text-muted-foreground">Avg Rating</div>
              </div>
              <div className="bg-card border border-border shadow-sm rounded-3xl p-6 text-center">
                <div className="flex justify-center mb-4 text-blue-500">
                  <Globe className="w-8 h-8" />
                </div>
                <div className="text-2xl font-bold text-primary">
                  {stats.totalPublic || publicFeedbacks.length}
                </div>
                <div className="text-muted-foreground">Public Reviews</div>
              </div>
            </div>

            {/* Action Button */}
            <div className="text-center mb-12">
              <button
                onClick={() => setShowFeedbackModal(true)}
                className="group px-8 py-4 bg-primary text-primary-foreground rounded-2xl hover:bg-primary/90 transition-all duration-300 hover:scale-[1.01] hover:-translate-y-1 font-semibold text-lg shadow-md flex items-center justify-center gap-2 mx-auto"
              >
                <Sparkles className="w-5 h-5" /> Share Your Feedback
              </button>
            </div>

            {/* Tabs */}
            <div className="mb-8">
              <div className="flex justify-center">
                <div className="bg-white/50 dark:bg-muted/50 backdrop-blur-sm rounded-2xl p-2 border border-border/50 dark:border-border/50 shadow-lg">
                  {[
                    { id: 'my-feedback', label: 'My Feedback', icon: <PenSquare className="w-4 h-4" /> },
                    { id: 'testimonials', label: 'Testimonials', icon: <Star className="w-4 h-4 fill-current" /> },
                    { id: 'all-reviews', label: 'All Reviews', icon: <MessageSquare className="w-4 h-4" /> },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-6 py-3 rounded-xl transition-all duration-300 font-medium ${
                        activeTab === tab.id
                          ? 'bg-primary text-primary-foreground shadow-md transform scale-105'
                          : 'text-muted-foreground hover:text-foreground dark:hover:text-slate-200 hover:bg-accent'
                      }`}
                    >
                      {tab.icon} {tab.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Filters for public reviews */}
            {activeTab !== 'my-feedback' && (
              <div className="mb-8 bg-white/80 dark:bg-muted/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-border/50 dark:border-border/50">
                <div className="flex flex-wrap gap-4 items-center">
                  {/* Search */}
                  <div className="flex-1 min-w-64">
                    <input
                      type="text"
                      placeholder="Search feedback..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 dark:border-border rounded-xl dark:bg-accent  focus:ring-2 focus:ring-ring focus:border-transparent"
                    />
                  </div>

                  {/* Category Filter */}
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-4 py-3 border border-slate-300 dark:border-border rounded-xl dark:bg-accent  focus:ring-2 focus:ring-ring"
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
                    className="px-4 py-3 border border-slate-300 dark:border-border rounded-xl dark:bg-accent  focus:ring-2 focus:ring-ring"
                  >
                    <option value={1}>★ 1+ Stars</option>
                    <option value={2}>★ 2+ Stars</option>
                    <option value={3}>★ 3+ Stars</option>
                    <option value={4}>★ 4+ Stars</option>
                    <option value={5}>★ 5 Stars</option>
                  </select>

                  {/* Sort */}
                  <select
                    value={`${sortBy}-${sortOrder}`}
                    onChange={(e) => {
                      const [field, order] = e.target.value.split('-');
                      setSortBy(field);
                      setSortOrder(order);
                    }}
                    className="px-4 py-3 border border-slate-300 dark:border-border rounded-xl dark:bg-accent  focus:ring-2 focus:ring-ring"
                  >
                    <option value="createdAt-desc">Newest First</option>
                    <option value="createdAt-asc">Oldest First</option>
                    <option value="rating-desc">Highest Rating</option>
                    <option value="rating-asc">Lowest Rating</option>
                    <option value="helpfulCount-desc">Most Helpful</option>
                  </select>

                  <button
                    onClick={fetchPublicFeedbacks}
                    className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors flex items-center gap-2"
                  >
                    <Search className="w-5 h-5" /> Search
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
                    <p className="text-muted-foreground">Loading your feedback...</p>
                  </div>
                ) : feedbacks.length === 0 ? (
                  <div className="text-center py-16 bg-white/80 dark:bg-muted/80 backdrop-blur-sm rounded-3xl shadow-xl border border-border/50 dark:border-border/50">
                    <div className="flex justify-center mb-6 text-muted-foreground">
                      <PenSquare className="w-20 h-20" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-4">No Feedback Yet</h3>
                    <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                      Start sharing your thoughts and experiences to help us improve our platform.
                    </p>
                    <button
                      onClick={() => setShowFeedbackModal(true)}
                      className="px-8 py-4 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all duration-300 hover:scale-[1.01] font-semibold shadow-md flex items-center justify-center gap-2 mx-auto"
                    >
                      <Rocket className="w-5 h-5" /> Give Your First Feedback
                    </button>
                  </div>
                ) : (
                  feedbacks.map((feedback, index) => (
                    <div
                      key={feedback._id}
                      className="bg-white/80 dark:bg-muted/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-border/50 dark:border-border/50 animate-fade-in-up"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="flex">
                              {renderStars(feedback.rating)}
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {feedback.rating}/5 stars
                            </span>
                            <span className={`px-3 py-1 rounded-full flex items-center gap-1 text-xs font-medium ${
                              categories.find(c => c.value === feedback.category)?.color || 'bg-accent text-foreground'
                            }`}>
                              {categories.find(c => c.value === feedback.category)?.icon} {categories.find(c => c.value === feedback.category)?.label}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold text-foreground mb-2">
                            {feedback.title}
                          </h3>
                          <p className="text-foreground/80 leading-relaxed mb-4">
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
                            className="p-2 text-primary hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors flex items-center justify-center"
                            title="Edit feedback"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteFeedback(feedback._id)}
                            className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors flex items-center justify-center"
                            title="Delete feedback"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm text-muted-foreground border-t border-border pt-4">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {formatDate(feedback.createdAt)}</span>
                          {feedback.isPublic && (
                            <span className="text-green-600 dark:text-green-400 flex items-center gap-1">
                              <Globe className="w-3 h-3" /> Public
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 font-medium bg-muted/50 px-2 py-1 rounded-lg">
                          <ThumbsUp className="w-3 h-3 text-primary" /> {feedback.helpfulCount || 0} helpful
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
                  <div className="text-center py-16 bg-white/80 dark:bg-muted/80 backdrop-blur-sm rounded-3xl shadow-xl border border-border/50 dark:border-border/50">
                    <div className="flex justify-center mb-6 text-yellow-500">
                      <Star className="w-20 h-20 fill-current" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-4">No Public Reviews Yet</h3>
                    <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                      Be the first to share a public testimonial and help others discover our platform.
                    </p>
                  </div>
                ) : (
                  publicFeedbacks
                    .filter(feedback => activeTab === 'testimonials' ? feedback.category === 'testimonial' : true)
                    .map((feedback, index) => (
                      <div
                        key={feedback._id}
                        className="bg-white/80 dark:bg-muted/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-border/50 dark:border-border/50 animate-fade-in-up"
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
                              <h4 className="text-lg font-semibold text-foreground">
                                {feedback.userName}
                              </h4>
                              <div className="flex">
                                {renderStars(feedback.rating)}
                              </div>
                              <span className={`px-3 py-1 flex items-center gap-1 rounded-full text-xs font-medium ${
                                categories.find(c => c.value === feedback.category)?.color || 'bg-accent text-foreground'
                              }`}>
                                {categories.find(c => c.value === feedback.category)?.icon} {categories.find(c => c.value === feedback.category)?.label}
                              </span>
                            </div>
                            
                            <h5 className="text-xl font-bold text-foreground mb-3">
                              {feedback.title}
                            </h5>
                            
                            <p className="text-foreground/80 leading-relaxed mb-4">
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
                            
                            <div className="flex justify-between items-center text-sm text-muted-foreground border-t border-border pt-4">
                              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {formatDate(feedback.createdAt)}</span>
                              <button
                                onClick={() => handleHelpfulVote(feedback._id)}
                                className="flex items-center gap-2 px-3 py-1 hover:bg-accent rounded-lg transition-colors font-medium"
                              >
                                <ThumbsUp className="w-4 h-4 text-primary" /> {feedback.helpfulCount || 0} helpful
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