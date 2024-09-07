// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './components/Home';
import Devices from './components/Devices';
import ParentalControl from './components/ParentalControl';
import UserDetails from './components/UserDetails';
import UpdateUser from './components/UpdateUser';
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <main style={{ flexGrow: 1, padding: '20px', marginLeft: '240px' }}>
          <Routes>
            <Route path="/" element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } />
            <Route path="/devices" element={
              <ProtectedRoute>
                <Devices />
              </ProtectedRoute>
            } />
            <Route path="/parental-controls" element={
              <ProtectedRoute>
                <ParentalControl />
              </ProtectedRoute>
            } />
            <Route path="/user-details" element={
              <ProtectedRoute>
                <UserDetails />
              </ProtectedRoute>
            } />
            <Route path="/update-user" element={
              <ProtectedRoute>
                <UpdateUser />
              </ProtectedRoute>
            } />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
