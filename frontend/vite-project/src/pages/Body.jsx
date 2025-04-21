


import React from 'react';
import Navbar from '../pages/Navbar';
import { Outlet } from 'react-router-dom';

const Body = () => {
  return (
    <div className="min-h-screen w-screen flex flex-col">
      <Navbar />
      <div className="flex-grow">
        <Outlet />
      </div>
    </div>
  );
};

export default Body;

