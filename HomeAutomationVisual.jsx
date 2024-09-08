import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Button, Box } from '@mui/material';
import axios from 'axios';
import { getAccessToken } from '../auth';

const HomeAutomationVisual = () => {
  const [devices, setDevices] = useState([]);
  const [error, setError] = useState(null);

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
      console.log('Device status toggled:', data);
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
      console.log('Device deleted:', deviceId);
      setDevices(devices.filter(device => device.id !== deviceId));
    } catch (error) {
      console.error('Error deleting device:', error);
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
                    style={{
                      backgroundColor: device.status === 'on' ? 'green' : 'purple',
                      color: 'white'
                    }}
                    onClick={() => handleToggleDevice(device.id, device.status)}
                  >
                    {device.status === 'on' ? 'Turn Off' : 'Turn On'}
                  </Button>
                  <Button
                    variant="contained"
                    style={{ backgroundColor: 'gray-500', color: 'white' }}
                    onClick={() => handleDeleteDevice(device.id)}
                  >
                    Delete Device
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default HomeAutomationVisual;