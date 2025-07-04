import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { EyeIcon, EyeSlashIcon, UserPlusIcon, UserIcon, LockClosedIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      const response = await fetch(`${backendUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        // Store token if registration returns one
        if (result.token) {
          localStorage.setItem('token', result.token);
        }
        
        localStorage.setItem(
          'loggedInUser',
          JSON.stringify({
            name: result.user?.name || data.name,
            email: result.user?.email || data.email,
            userId: result.user.userId,
          })
        );

        // Navigate to home if token exists, otherwise to login
        navigate(result.token ? '/' : '/login');
      } else {
        alert(`❌ Registration failed: ${result.message}`);
      }
    } catch (error) {
      console.error('❌ Error registering:', error);
      alert('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    try {
      // Decode the Google credential to extract user info
      const decoded = jwtDecode(credentialResponse.credential);

      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      const response = await fetch(`${backendUrl}/api/auth/google-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: decoded.name,
          email: decoded.email,
          googleId: decoded.sub,
          picture: decoded.picture,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem('token', result.token);
        localStorage.setItem(
          'loggedInUser',
          JSON.stringify({
            name: result.user.name,
            email: result.user.email,
            userId: result.user.userId,
          })
        );
        navigate('/');
      } else {
        alert(`Google login failed: ${result.message}`);
      }
    } catch (error) {
      console.error('Google login error:', error);
      alert('Google login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-gray-800 to-zinc-900 text-white px-4 relative overflow-hidden">
      {/* Background Decoration - Same as Login */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-500/20 to-red-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-500/20 to-purple-600/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Welcome Header - Orange/Red Theme */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl">
            <UserPlusIcon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent mb-2">
            Join CollabNest
          </h1>
          <p className="text-gray-400">Create your account to get started</p>
        </div>

        {/* Register Card */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-8 space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  {...register('name', { 
                    required: 'Full name is required',
                    minLength: {
                      value: 2,
                      message: 'Name must be at least 2 characters'
                    }
                  })}
                  placeholder="Enter your full name"
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-800/50 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                />
              </div>
              {errors.name && (
                <p className="text-red-400 text-sm flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Email Address</label>
              <div className="relative">
                <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: 'Please enter a valid email'
                    }
                  })}
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-800/50 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-sm flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Password</label>
              <div className="relative">
                <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}  
                  {...register('password', { 
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                  placeholder="Create a strong password"
                  className="w-full pl-10 pr-12 py-3 rounded-lg bg-gray-800/50 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-orange-400 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-sm flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Terms and Privacy */}
            <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700">
              <p className="text-xs text-gray-400 leading-relaxed">
                By creating an account, you agree to our{' '}
                <Link to="/terms" className="text-orange-400 hover:text-orange-300 underline">
                  Terms of Service
                </Link>
                {' '}and{' '}
                <Link to="/privacy" className="text-orange-400 hover:text-orange-300 underline">
                  Privacy Policy
                </Link>
              </p>
            </div>

            {/* Register Button - Orange/Red Theme */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Creating Account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-gray-800/50 text-gray-400">Or continue with</span>
            </div>
          </div>

          {/* Google Login */}
          <div className="flex justify-center">
            <div className="bg-white rounded-lg p-1 shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => alert('Google registration failed')}
                theme="outline"
                size="large"
                width="300"
              />
            </div>
          </div>

          {/* Login Link - Orange Theme */}
          <div className="text-center pt-4 border-t border-gray-600">
            <p className="text-gray-400">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-orange-400 hover:text-orange-300 font-semibold transition-colors hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            Protected by industry-standard security
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;