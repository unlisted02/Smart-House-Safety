import React, { useState } from 'react';
import { TextField, Button, Typography } from '@mui/material';
import axios from 'axios';
import { getAccessToken } from '../auth';

const AddDevice = ({ onDeviceAdded }) => {
  const [name, setName] = useState('');
  const [deviceType, setDeviceType] = useState('');
  const [error, setError] = useState(null);

  const handleAddDevice = async (e) => {
    e.preventDefault();
    try {
      const token = getAccessToken();
      const { data } = await axios.post('http://127.0.0.1:5000/mock/devices', {
        name,
        device_type: deviceType,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Device added:', data);
      onDeviceAdded(data);
      setName('');
      setDeviceType('');
    } catch (error) {
      console.error('Error adding device:', error);
      setError(error.response ? error.response.data : 'Unknown error');
    }
  };

  return (
    <div style={{ padding: '20px', marginLeft: '240px' }}>
      <Typography variant="h4" gutterBottom>Add Device</Typography>
      {error && <Typography color="error">Error: {error}</Typography>}
      <form onSubmit={handleAddDevice}>
        <TextField
          label="Device Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Device Type"
          value={deviceType}
          onChange={(e) => setDeviceType(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          style={{ marginTop: '20px' }}
        >
          Add Device
        </Button>
      </form>
    </div>
  );
};

export default AddDevice;