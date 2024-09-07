// src/components/Devices.js
import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Button } from '@mui/material';
import api from '../api';

const Devices = () => {
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const { data } = await api.get('/mock/devices');
        setDevices(data.devices);
      } catch (error) {
        console.error('Error fetching devices:', error);
      }
    };
    fetchDevices();
  }, []);

  return (
    <div style={{ padding: '20px', marginLeft: '240px' }}>
      <Typography variant="h4">Devices</Typography>
      <Grid container spacing={4}>
        {devices.map((device) => (
          <Grid item key={device.id} xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">{device.name}</Typography>
                <Typography>Type: {device.device_type}</Typography>
                <Typography>Status: {device.status}</Typography>
                <Button variant="contained" color="primary" style={{ marginTop: '10px' }}>
                  Control Device
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Devices;
