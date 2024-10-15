import React, { useState, useEffect } from 'react';
import { Typography, Button, Container } from '@mui/material';
import axios from 'axios';
import { getAccessToken } from '../auth';

const UserDetails = () => {
  const [user, setUser] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = getAccessToken(); // Retrieve the stored access token
        const { data } = await axios.get('http://127.0.0.1:5000/users/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUser(data);
      } catch (error) {
        console.error('Error fetching user details:', error);
        setError(error.response ? error.response.data : 'Unknown error');
      }
    };
    fetchUserDetails();
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>User Details</Typography>
      {error && <Typography color="error">Error: {error}</Typography>}
      <Typography variant="body1">Username: {user.username}</Typography>
      <Button variant="contained" color="primary" href="/update-user" style={{ marginTop: '20px' }}>
        Update Details
      </Button>
    </Container>
  );
};

export default UserDetails;