// src/pages/ResetPassword.jsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async ({ password }) => {
    try {
      const res = await fetch(`http://localhost:5000/api/auth/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      alert(data.message);
      if (res.ok) navigate('/login');
    } catch (err) {
      alert('Something went wrong');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto mt-10">
      <h2 className="text-xl mb-4">Reset Password</h2>
      <input
        type="password"
        placeholder="Enter new password"
        {...register('password', { required: true, minLength: 6 })}
        className="border p-2 w-full"
      />
      {errors.password && <span className="text-red-600">Password is required (min 6 characters)</span>}
      <button type="submit" className="bg-green-500 text-white p-2 mt-4 w-full">
        Reset Password
      </button>
    </form>
  );
};

export default ResetPassword;
