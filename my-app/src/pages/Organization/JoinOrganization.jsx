import React from 'react'
import DashboardLayout from "../../components/organisms/DashboardLayout"
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const JoinOrganization = () => {
  const navigate = useNavigate();
      
        useEffect(() => {
          const token = localStorage.getItem('token');
          if (!token) {
            navigate('/login');
          }
        }, [navigate]);
  return (
    <DashboardLayout>
    <div>Join Organization</div>
    </DashboardLayout>
  )
}

export default JoinOrganization;