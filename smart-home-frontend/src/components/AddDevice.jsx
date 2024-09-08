import React, { useState } from 'react';
import { TextField, Button, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import axios from 'axios';
import { getAccessToken } from '../auth';

const AddDevice = ({ onDeviceAdded }) => {
  const [name, setName] = useState('');
  const [deviceType, setDeviceType] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState(null);

  const handleAddDevice = async (e) => {
    e.preventDefault();
    try {
      const token = getAccessToken();
      const { data } = await axios.post('http://127.0.0.1:5000/mock/devices', {
        name,
        device_type: deviceType,
        location,  // Include location in the request payload
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Device added:', data);
      onDeviceAdded(data);
      setName('');
      setDeviceType('');
      setLocation('');
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
        <FormControl fullWidth margin="normal">
          <InputLabel>Location</InputLabel>
          <Select value={location} onChange={(e) => setLocation(e.target.value)}>
            <MenuItem value="livingroom">Living Room</MenuItem>
            <MenuItem value="kitchen">Kitchen</MenuItem>
            <MenuItem value="bathroom">Bathroom</MenuItem>
            <MenuItem value="hallway">Hallway</MenuItem>
            <MenuItem value="corridor">Corridor</MenuItem>
            <MenuItem value="veranda">Veranda</MenuItem>
          </Select>
        </FormControl>
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