import React, { useState } from 'react';
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
import Temperature from './components/Temperature.jsx';
import AuthWrapper from './AuthWrapper'; // Import the AuthWrapper component

function App() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleOpenForm = () => {
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  return (
    <Router>
      <AuthWrapper>
        <div className="flex">
          <Sidebar onDevicesClick={handleOpenForm} />
          <main className="flex-grow ml-0">
            <Routes>
              <Route path="/" element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } />
              <Route path="/temperature" element={
                <ProtectedRoute>
                  <Temperature />
                </ProtectedRoute>
              } />
              <Route path="/devices" element={
                <ProtectedRoute>
                  <Devices isFormOpen={isFormOpen} handleCloseForm={handleCloseForm} />
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
      </AuthWrapper>
    </Router>
  );
}

export default App;