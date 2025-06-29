import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';


const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
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
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
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
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white px-4 dark:bg-gray-900 dark:text-white">
      <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-2xl p-8 space-y-6">
        <h2 className="text-3xl font-bold text-center text-orange-500">
          Create Your Account
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            type="text"
            {...register('name')}
            placeholder="Name"
            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />

          <div>
            <input
              type="email"
              {...register('email', { required: true })}
              placeholder="Email"
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">*Email* is mandatory</p>
            )}
          </div>

          <div className='relative'>
            <input
              type={showPassword ? 'text' : 'password'}  
              {...register('password', { required: true })}
              placeholder="Password"
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
           <div
                         className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-orange-400"
                         onClick={() => setShowPassword(!showPassword)}
                       >
                         {showPassword ? (
                           <EyeSlashIcon className="h-5 w-5" />
                         ) : (
                           <EyeIcon className="h-5 w-5" />
                         )}
                       </div> 
            
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">*Password* is mandatory</p>
            )}
          </div>

          <div className="text-right text-sm">
            <Link to="/forgot-password" className="text-orange-400 hover:underline">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 rounded-lg transition duration-200"
          >
            Register
          </button>
        </form>

        <div className="flex items-center justify-center gap-2">
          <span className="h-px w-20 bg-gray-600"></span>
          <span className="text-sm text-gray-400">or continue with</span>
          <span className="h-px w-20 bg-gray-600"></span>
        </div>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => alert('Google login failed')}
          />
        </div>

        <p className="text-center text-sm text-gray-400">
          Already registered?{' '}
          <Link to="/login" className="text-orange-400 hover:underline font-medium">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;