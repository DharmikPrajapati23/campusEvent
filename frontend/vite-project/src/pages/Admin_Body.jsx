
import React from 'react';
import Admin_Navbar from '../pages/Admin_Navbar';
import { Outlet } from 'react-router-dom';

const Admin_Body = () => {
  return (
    <div className="min-h-screen w-screen flex flex-col">
      <Admin_Navbar />
      <div className="flex-grow">
        <Outlet />
      </div>
    </div>
  );
};

export default Admin_Body;

