// src/pages/ForgotPassword.jsx
import React from 'react';
import { useForm } from 'react-hook-form';

const ForgotPassword = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async ({ email }) => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      alert(data.message);
    } catch (err) {
      alert('Something went wrong');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto mt-10">
      <h2 className="text-xl mb-4">Forgot Password</h2>
      <input
        type="email"
        placeholder="Enter your registered email"
        {...register('email', { required: true })}
        className="border p-2 w-full"
      />
      {errors.email && <span className="text-red-600">Email is required</span>}
      <button type="submit" className="bg-blue-500 text-white p-2 mt-4 w-full">
        Send Reset Link
      </button>
    </form>
  );
};

export default ForgotPassword;
