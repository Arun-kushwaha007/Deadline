import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';

const Register = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem(
          'loggedInUser',
          JSON.stringify({
            name: data.name,
            email: data.email,
            userId: result.user.userId,
          })
        );
        navigate('/login');
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
      const response = await fetch('http://localhost:5000/api/auth/google-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });

      const result = await response.json();

      if (response.ok) {
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

  const handleGoogleError = () => {
    alert('Google login failed');
  };

  return (
    <div className="h-screen flex justify-center items-center text-black">
      <div>
        <p className="text-center w-[30vw] bg-purple-300 py-[2vw] px-[1vw] rounded-t-[10px] text-2xl font-[Verdana]">
          Registration Form
        </p>

        <form
          className="text-center flex flex-col mx-auto w-[30vw] py-[2vw] px-[1vw] bg-pink-200 rounded-b-[10px]"
          onSubmit={handleSubmit(onSubmit)}
        >
          <input
            type="text"
            {...register('name')}
            placeholder="Name"
            className="border border-gray-400 rounded-[10px] p-[1vw] outline-none m-[5px]"
          />

          <input
            type="email"
            {...register('email', { required: true })}
            placeholder="Email"
            className="border border-gray-400 rounded-[10px] p-[1vw] outline-none m-[5px]"
          />
          {errors.email && (
            <span className="text-red-600 text-sm mb-2">*Email* is mandatory</span>
          )}

          <input
            type="password"
            {...register('password', { required: true })}
            placeholder="Password"
            className="border border-gray-400 rounded-[10px] p-[1vw] outline-none m-[5px]"
          />
          {errors.password && (
            <span className="text-red-600 text-sm mb-2">*Password* is mandatory</span>
          )}

          {/* Forgot Password Link */}
          <div className="text-right text-sm mb-2 mr-2">
            <Link to="/forgot-password" className="text-blue-600 hover:underline">
              Forgot Password?
            </Link>
          </div>

          <input
            type="submit"
            value="Register"
            className="rounded-[10px] p-[1vw] m-[5px] cursor-pointer"
            style={{ backgroundColor: '#a1eafb' }}
          />

          <p className="mt-4 text-sm">
            Already registered?{' '}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login here
            </Link>
          </p>
        </form>

        <div className="mt-6 w-[30vw] mx-auto text-center">
          <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
        </div>
      </div>
    </div>
  );
};

export default Register;
