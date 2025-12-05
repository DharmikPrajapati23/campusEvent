import "./App.css";

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';


import Body from './pages/Body';
import Home from './pages/Home';
import Admin_Body from './pages/Admin_Body';

import AddWebinar from "./admin_pages/AddWebinar";
import ManageWebinar from "./admin_pages/ManageWebinar";





const App = () => {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Body />}>
            <Route index element={<Home />} />
            {/* <Route path="addwebinar" element={<AddWebinar />} />
            <Route path="managewebinar" element={<ManageWebinar />} /> */}
          </Route>
         
          <Route path="/admin" element={<Admin_Body />}>
            <Route path="addwebinar" element={<AddWebinar />} />
            <Route path="managewebinar" element={<ManageWebinar />} />
          </Route>

        </Routes>
      </BrowserRouter>
    // </Provider>
  );
};

export default App;
