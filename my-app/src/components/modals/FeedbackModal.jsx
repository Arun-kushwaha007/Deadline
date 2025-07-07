import React, { useState, useEffect } from 'react';

const FeedbackModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const [formData, setFormData] = useState({
    rating: 5,
    title: '',
    message: '',
    category: 'general',
    isPublic: false,
    tags: []
  });
  const [currentTag, setCurrentTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const categories = [
    { value: 'general', label: '💬 General Feedback', desc: 'Overall experience and thoughts' },
    { value: 'feature', label: '✨ Feature Request', desc: 'Suggest new features or improvements' },
    { value: 'bug', label: '🐛 Bug Report', desc: 'Report issues or problems' },
    { value: 'improvement', label: '🚀 Improvement', desc: 'Suggest enhancements to existing features' },
    { value: 'testimonial', label: '⭐ Testimonial', desc: 'Share your success story' }
  ];

  // Predefined tags for quick selection
  const predefinedTags = [
    'user-friendly', 'fast', 'reliable', 'helpful', 'innovative',
    'efficient', 'professional', 'responsive', 'intuitive', 'valuable'
  ];


  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData(initialData);
      } else {
        setFormData({
          rating: 5,
          title: '',
          message: '',
          category: 'general',
          isPublic: false,
          tags: []
        });
      }
      setErrors({});
    }
  }, [isOpen, initialData]);

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

 const addTag = (tag) => {
    const tagToAdd = tag || currentTag.trim();
    if (tagToAdd && !formData.tags.includes(tagToAdd)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagToAdd]
      }));
      setCurrentTag('');
    }
  };


  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };


  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.length > 1000) {
      newErrors.message = 'Message must be less than 1000 characters';
    }

    if (formData.rating < 1 || formData.rating > 5) {
      newErrors.rating = 'Rating must be between 1 and 5';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
      onClose();
      
      // Success notification
      showNotification('🎉 Thank you for your feedback!', 'success');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      showNotification('❌ Failed to submit feedback. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show notification
  const showNotification = (message, type) => {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in-right ${
      type === 'success' ? 'bg-green-500' : 'bg-red-500'
    } text-white`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 5000);
  };


  const renderStars = () => {
    return [...Array(5)].map((_, index) => (
      <button
        key={index}
        type="button"
        onClick={() => handleInputChange('rating', index + 1)}
        className={`text-3xl transition-all duration-200 transform hover:scale-110 ${
          index < formData.rating
            ? 'text-yellow-400 hover:text-yellow-500'
            : 'text-gray-300 hover:text-gray-400'
        }`}
      >
        ⭐
      </button>
    ));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-lg flex justify-center items-center z-50 p-4 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200/50 dark:border-gray-700/50 animate-scale-in">
        

        <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 p-6 rounded-t-3xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-yellow-400/20 animate-pulse"></div>
          <div className="relative z-10 flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                <span className="animate-bounce">💬</span> Share Your Feedback
              </h2>
              <p className="text-orange-100 mt-2">Help us improve your experience</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-orange-200 transition-colors p-2 hover:bg-white/10 rounded-full"
            >
              <span className="text-2xl">✕</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          
    
          <div>
            <label className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
              <span className="text-xl">⭐</span> Rating
            </label>
            <div className="flex items-center gap-2 mb-2">
              {renderStars()}
              <span className="ml-4 text-gray-600 dark:text-gray-400 font-medium">
                {formData.rating} out of 5 stars
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Click on stars to rate your experience
            </p>
            {errors.rating && <p className="text-red-500 text-sm mt-1">{errors.rating}</p>}
          </div>

          {/* Category Selection */}
          <div>
            <label className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
              <span className="text-xl">📂</span> Category
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {categories.map((category) => (
                <button
                  key={category.value}
                  type="button"
                  onClick={() => handleInputChange('category', category.value)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                    formData.category === category.value
                      ? 'border-orange-400 bg-orange-50 dark:bg-orange-900/20 shadow-lg'
                      : 'border-gray-200 dark:border-gray-600 hover:border-orange-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="font-semibold text-gray-800 dark:text-white mb-1">
                    {category.label}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {category.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
              <span className="text-xl">📝</span> Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={`w-full px-6 py-4 border-2 rounded-2xl dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 ${
                errors.title ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="Give your feedback a title..."
              maxLength={100}
            />
            <div className="flex justify-between mt-2">
              {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
              <p className="text-sm text-gray-500 dark:text-gray-400 ml-auto">
                {formData.title.length}/100
              </p>
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
              <span className="text-xl">💭</span> Message
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              rows={6}
              className={`w-full px-6 py-4 border-2 rounded-2xl dark:bg-gray-700 dark:text-white resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 ${
                errors.message ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="Share your detailed feedback, suggestions, or experience..."
              maxLength={1000}
            />
            <div className="flex justify-between mt-2">
              {errors.message && <p className="text-red-500 text-sm">{errors.message}</p>}
              <p className="text-sm text-gray-500 dark:text-gray-400 ml-auto">
                {formData.message.length}/1000
              </p>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
              <span className="text-xl">🏷️</span> Tags (Optional)
            </label>
            
            {/* Tag Input */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                placeholder="Add custom tags..."
              />
              <button
                type="button"
                onClick={() => addTag()}
                className="px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors font-medium"
              >
                Add
              </button>
            </div>

            {/* Predefined Tags */}
            <div className="mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Quick tags:</p>
              <div className="flex flex-wrap gap-2">
                {predefinedTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => addTag(tag)}
                    disabled={formData.tags.includes(tag)}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                      formData.tags.includes(tag)
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Tags */}
            {formData.tags.length > 0 && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Selected tags:</p>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500 text-white rounded-full text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-orange-200 transition-colors"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Public Feedback Option */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-4">
              <input
                type="checkbox"
                id="isPublic"
                checked={formData.isPublic}
                onChange={(e) => handleInputChange('isPublic', e.target.checked)}
                className="mt-1 w-5 h-5 text-orange-500 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 focus:ring-2"
              />
              <div className="flex-1">
                <label htmlFor="isPublic" className="text-lg font-bold text-gray-700 dark:text-gray-300 cursor-pointer flex items-center gap-2">
                  <span className="text-xl">🌐</span> Make this feedback public
                </label>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Allow us to use your feedback as a testimonial on our website. Your name and rating will be displayed, but your email will remain private.
                </p>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-4 bg-gray-500 hover:bg-gray-600 text-white rounded-2xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 group px-6 py-4 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-600 hover:via-amber-600 hover:to-yellow-600 text-white rounded-2xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Submitting...
                </span>
              ) : (
                <span className="group-hover:animate-pulse">🚀 Submit Feedback</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackModal;