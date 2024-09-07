// src/components/UpdateUser.js
import React, { useState } from 'react';
import { TextField, Button, Typography, Container } from '@mui/material';
import api from '../.api';

const UpdateUser = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put('/update-user', { email });
      alert('User details updated successfully');
    } catch (error) {
      console.error('Error updating user details:', error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Update User Details</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ marginBottom: '20px' }}
        />
        <Button type="submit" variant="contained" color="primary">Update</Button>
      </form>
    </Container>
  );
};

export default UpdateUser;
