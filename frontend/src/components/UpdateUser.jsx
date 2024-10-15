// src/components/UpdateUser.js
import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import api from '../api';

const UpdateUser = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleVerifyAndSubmit = async () => {
    try {
      // Verify the current password
      const response = await api.post('/verify-password', { currentPassword });
      if (response.data.success) {
        // If verification is successful, proceed with the update
        await api.put('/update-user', { username, password });
        alert('User details updated successfully');
        handleCloseModal();
      } else {
        alert('Current password is incorrect');
      }
    } catch (error) {
      console.error('Error verifying current password:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleOpenModal();
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Update User Details</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Username"
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ marginBottom: '20px' }}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ marginBottom: '20px' }}
        />
        <Button type="submit" variant="contained" color="primary">Update</Button>
      </form>

      <Dialog open={isModalOpen} onClose={handleCloseModal}>
        <DialogTitle>Verify Current Password</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter your current password to verify your identity.
          </DialogContentText>
          <TextField
            label="Current Password"
            type="password"
            fullWidth
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            style={{ marginTop: '20px' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="secondary">Cancel</Button>
          <Button onClick={handleVerifyAndSubmit} color="primary">Verify</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UpdateUser;