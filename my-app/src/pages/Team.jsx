import { useState, useEffect } from 'react';
import DashboardLayout from '../components/organisms/DashboardLayout';
import axios from 'axios';

const Team = () => {
 

  return (
    <DashboardLayout>
     <div className="flex items-center justify-center h-screen bg-black-500">
      <h1 className="text-6xl font-bold animate-bounce text-white-900">
        Coming Soon
      </h1>
    </div>
    </DashboardLayout>
  );
};

export default Team;
