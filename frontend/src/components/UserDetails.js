// src/components/UserDetails.js
import React, { useState, useEffect } from 'react';
import { Typography, Button, Container } from '@mui/material';
import api from '../.api';

const UserDetails = () => {
  const [user, setUser] = useState({});

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const { data } = await api.get('/user-details');
        setUser(data);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };
    fetchUserDetails();
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>User Details</Typography>
      <Typography variant="body1">Username: {user.username}</Typography>
      <Typography variant="body1">Email: {user.email}</Typography>
      <Button variant="contained" color="primary" href="/update-user" style={{ marginTop: '20px' }}>
        Update Details
      </Button>
    </Container>
  );
};

export default UserDetails;
