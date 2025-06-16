import React from 'react';
import DashboardLayout from '../components/organisms/DashboardLayout';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
const Help = () => {
  const navigate = useNavigate();
      
        useEffect(() => {
          const token = localStorage.getItem('token');
          if (!token) {
            navigate('/login');
          }
        }, [navigate]);
  return (
    
    <DashboardLayout>
    <div className="flex items-center justify-center h-screen bg-black-600">
      <h1 className="text-4xl font-bold animate-bounce text-white-800">
        Coming Soon
      </h1>
    </div>
    </DashboardLayout>
  );
};

export default Help;