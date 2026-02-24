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
    watch,
    formState: { errors },
  } = useForm();

  const passwordValue = watch('password', '');

  const getPasswordStrength = (password) => {
    if (!password) return { score: 0, label: '', color: 'bg-gray-600' };
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-destructive' };
    if (score === 2) return { score: 2, label: 'Fair', color: 'bg-orange-500' };
    if (score === 3) return { score: 3, label: 'Good', color: 'bg-yellow-500' };
    if (score >= 4) return { score: 4, label: 'Strong', color: 'bg-green-500' };
    return { score: 0, label: '', color: 'bg-gray-600' };
  };

  const passwordStrength = getPasswordStrength(passwordValue);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'|| 'https://deadline-pobb.onrender.com';
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

      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'|| 'https://deadline-pobb.onrender.com';
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
    <div className="min-h-screen flex items-center justify-center bg-background text-white px-4 relative overflow-hidden">

      <div className="relative w-full max-w-md">
        {/* Welcome Header - Orange/Red Theme */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-muted border border-border rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <UserPlusIcon className="w-10 h-10 text-foreground" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Join CollabNest
          </h1>
          <p className="text-muted-foreground">Create your account to get started</p>
        </div>

        {/* Register Card */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-8 space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-muted-foreground">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
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
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-muted border border-border text-white placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
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
              <label className="block text-sm font-medium text-muted-foreground">Email Address</label>
              <div className="relative">
                <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
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
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-muted border border-border text-white placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
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
              <label className="block text-sm font-medium text-muted-foreground">Password</label>
              <div className="relative">
                <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
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
                  className="w-full pl-10 pr-12 py-3 rounded-lg bg-muted border border-border text-white placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
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

              {/* Password Strength Indicator */}
              {passwordValue && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                          passwordStrength.score >= level
                            ? passwordStrength.color
                            : 'bg-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs font-medium ${
                    passwordStrength.score <= 1 ? 'text-red-400' :
                    passwordStrength.score === 2 ? 'text-orange-400' :
                    passwordStrength.score === 3 ? 'text-yellow-400' :
                    'text-green-400'
                  }`}>
                    {passwordStrength.label}
                  </p>
                </div>
              )}
            </div>

            {/* Terms and Privacy */}
            <div className="bg-muted/50 rounded-lg p-4 border border-slate-700">
              <p className="text-xs text-muted-foreground leading-relaxed">
                By creating an account, you agree to our{' '}
                <Link to="/terms" className="text-primary hover:text-primary/80 underline">
                  Terms of Service
                </Link>
                {' '}and{' '}
                <Link to="/privacy" className="text-primary hover:text-primary/80 underline">
                  Privacy Policy
                </Link>
              </p>
            </div>

            {/* Register Button - Orange/Red Theme */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-lg transition-all duration-200 hover:scale-[1.01] shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-muted text-muted-foreground">Or continue with</span>
            </div>
          </div>

          {/* Google Login */}
          <div className="flex justify-center">
            <div className="bg-white rounded-lg p-1 shadow-lg hover:shadow-xl transition-all hover:scale-[1.01]">
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
          <div className="text-center pt-4 border-t border-border">
            <p className="text-muted-foreground">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-primary hover:text-primary/80 font-semibold transition-colors hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-muted-foreground text-sm">
            Protected by industry-standard security
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;