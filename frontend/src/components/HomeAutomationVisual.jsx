import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Button, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';
import { getAccessToken } from '../auth';

const HomeAutomationVisual = () => {
  const [devices, setDevices] = useState([]);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    device_type: '',
    location: ''
  });

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const token = getAccessToken(); // Retrieve the stored access token
        console.log('Using token:', token);
        const { data } = await axios.get('http://127.0.0.1:5000/mock/devices', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('Devices fetched:', data);
        setDevices(data);
      } catch (error) {
        console.error('Error fetching devices:', error);
        setError(error.response ? error.response.data : 'Unknown error');
      }
    };
    fetchDevices();
  }, []);

  const handleToggleDevice = async (deviceId, currentStatus) => {
    try {
      const token = getAccessToken();
      const action = currentStatus === "on" ? "turn_off" : "turn_on";
      const { data } = await axios.post(`http://127.0.0.1:5000/mock/devices/${deviceId}/control`, { action }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setDevices(devices.map(device => device.id === deviceId ? { ...device, status: data.status, last_action: data.last_action } : device));
    } catch (error) {
      console.error('Error toggling device status:', error);
      setError(error.response ? error.response.data : 'Unknown error');
    }
  };

  const handleDeleteDevice = async (deviceId) => {
    try {
      const token = getAccessToken();
      await axios.delete(`http://127.0.0.1:5000/mock/devices/${deviceId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setDevices(devices.filter(device => device.id !== deviceId));
    } catch (error) {
      setError(error.response ? error.response.data : 'Unknown error');
    }
  };

  const handleOpenUpdateForm = (device) => {
    setSelectedDevice(device);
    setFormData({
      name: device.name,
      device_type: device.device_type,
      location: device.location
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedDevice(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleUpdateDevice = async () => {
    try {
      const token = getAccessToken();
      const { data } = await axios.put(`http://127.0.0.1:5000/mock/devices/${selectedDevice.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setDevices(devices.map(device => device.id === selectedDevice.id ? data.device : device));
      handleClose();
      alert('Device updated successfully');
    } catch (error) {
      console.error('Error updating device:', error);
      setError(error.response ? error.response.data : 'Unknown error');
    }
  };

  return (
    <div style={{ padding: '20px', marginLeft: '24px', marginRight: '24px' }}>
      <Typography variant="h4" gutterBottom>Devices</Typography>
      {error && <Typography color="error">Error: {error}</Typography>}
      <Grid container spacing={4}>
        {devices.map((device) => (
          <Grid item key={device.id} xs={12} sm={6} md={4}>
            <Card>
              <CardContent className="bg-slate-200">
                <Typography variant="h6" gutterBottom>{device.name}</Typography>
                <Typography gutterBottom>Type: {device.device_type}</Typography>
                <Typography gutterBottom>Status: {device.status}</Typography>
                <Box display="flex" justifyContent="space-between" mt={2}>
                  <Button
                    variant="contained"
                    className={`text-white ${device.status === 'on' ? 'bg-green-500' : 'bg-purple-200'}`}
                    onClick={() => handleToggleDevice(device.id, device.status)}
                  >
                    {device.status === 'on' ? 'Turn Off' : 'Turn On'}
                  </Button>
                  <Button
                    variant="contained"
                    className="bg-gradient-to-r from-orange-600 to-orange-900 text-white"
                    onClick={() => handleOpenUpdateForm(device)}
                  >
                    Update Device
                  </Button>
                  <Button
                    variant="contained"
                    className="bg-gray-500 text-white hover:bg-red-500"
                    onClick={() => handleDeleteDevice(device.id)}
                  >
                    <DeleteIcon />
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Update Device</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Update the details of the device.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Device Name"
            type="text"
            fullWidth
            value={formData.name}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="device_type"
            label="Device Type"
            type="text"
            fullWidth
            value={formData.device_type}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="location"
            label="Location"
            type="text"
            fullWidth
            value={formData.location}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUpdateDevice} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default HomeAutomationVisual;