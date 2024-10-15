import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

const Bathroom = () => {
  const [devices, setDevices] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/mock/devices/location/bathroom', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        setDevices(response.data);
      } catch (error) {
        setError('Error fetching bathroom devices');
        console.error('Error fetching bathroom devices:', error);
      }
    };

    fetchDevices();
  }, []);

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
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Bathroom;