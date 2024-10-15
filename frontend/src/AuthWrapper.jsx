import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from './auth'; // Import the isAuthenticated function

const AuthWrapper = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated() && location.pathname !== '/login' && location.pathname !== '/register') {
      navigate('/login');
    }
  }, [navigate, location]);

  return children;
};

export default AuthWrapper;