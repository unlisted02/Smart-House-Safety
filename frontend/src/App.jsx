import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar.jsx';
import Home from './components/Home.jsx';
import Devices from './components/Devices.jsx';
import ParentalControl from './components/ParentalControl.jsx';
import UserDetails from './components/UserDetails.jsx';
import UpdateUser from './components/UpdateUser.jsx';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Temperature from './components/Temperature.jsx';
import Kitchen from './components/Kitchen.jsx'; // Import the Kitchen component
import Bathroom from './components/Bathroom.jsx'; // Import the Bathroom component
import LivingRoom from './components/LivingRoom.jsx'; // Import the Living Room component
import Bedroom from './components/BedRoom.jsx'; // Import the Bedroom component
import AuthWrapper from './AuthWrapper.jsx'; // Import the AuthWrapper component
import AllDeviceLogs from './components/AllDeviceLogs.jsx'; // Import the AllDeviceLogs component


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
              <Route path="/kitchen" element={
                <ProtectedRoute>
                  <Kitchen />
                </ProtectedRoute>
              } />
              <Route path="/bathroom" element={
                <ProtectedRoute>
                  <Bathroom />
                </ProtectedRoute>
              } />
              <Route path="/living-room" element={
                <ProtectedRoute>
                  <LivingRoom />
                </ProtectedRoute>
              } />
              <Route path="/bedroom" element={
                <ProtectedRoute>
                  <Bedroom />
                </ProtectedRoute>
              } />
            
              <Route path="/logs" element={
              <ProtectedRoute>
                <AllDeviceLogs />
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