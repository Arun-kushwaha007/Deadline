import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Team from './pages/Team';
import Login from './pages/Login';
import Register from './pages/Register';
import ToDoList from './pages/ToDoList';
import Help from './pages/Help';
import Profile from './pages/Profile';

// import CreateOrganization from './pages/Organization/CreateOrganization';
import JoinOrganization from './pages/Organization/JoinOrganization';
import OrganizationDashboard from './components/Organization/OrganiationDashboard';
import AddMember from './pages/Organization/AddMember';
import EditOrganization from './pages/Organization/EditOrganization';
import OrganizationDetails from './pages/Organization/OrganizationDetails';
import CreateOrganization from './pages/Organization/CreateOrganization';
import ForgotPassword from './pages/ForgetPassword';
import ResetPassword from './pages/ResetPassword';
import Terms from './pages/Terms'; 
import Privacy from './pages/Privacy'; 
// import Setting from './pages/Setting'; 
import Setting from './pages/Setting';

const AllApiRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/tasks" element={<Tasks />} />
      <Route path="/team" element={<Team />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/todo" element={<ToDoList />} />
      <Route path="/help" element={<Help />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/create_Organization" element={<CreateOrganization />} />
      <Route path="/join_Organization" element={<JoinOrganization />} />
      <Route path="/organizations" element={<OrganizationDashboard />} />
      <Route path="/organizations/:id" element={<OrganizationDetails />} />
      <Route path="/organizations/:id/add-member" element={<AddMember />} />
      <Route path="/organizations/:id/edit" element={<EditOrganization />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/settings" element={<Setting />} />
      
      {/* Catch-all route for 404 Not Found */}
      <Route path="*" element={<div>404 Not Found</div>} />



      
    </Routes>
  );
};

export default AllApiRoutes;
