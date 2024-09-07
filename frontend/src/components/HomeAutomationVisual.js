// src/components/HomeAutomationVisual.js
import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import api from '../api';
import { Typography, Grid, Card, CardContent } from '@mui/material';

const HomeAutomationVisual = () => {
  const [deviceData, setDeviceData] = useState([]);
  const [temperatureData, setTemperatureData] = useState([]);

  useEffect(() => {
    const fetchDeviceData = async () => {
      try {
        const response = await api.get('/mock/devices');
        const devices = response.data.devices;

        const onDevices = devices.filter(device => device.status === 'on').length;
        const offDevices = devices.filter(device => device.status === 'off').length;

        setDeviceData([
          { name: 'On', value: onDevices },
          { name: 'Off', value: offDevices }
        ]);

        setTemperatureData([
          { time: '10am', temperature: 22 },
          { time: '12pm', temperature: 24 },
          { time: '2pm', temperature: 26 },
          { time: '4pm', temperature: 25 },
          { time: '6pm', temperature: 23 },
        ]);
      } catch (error) {
        console.error('Error fetching devices:', error);
      }
    };
    fetchDeviceData();
  }, []);

  const COLORS = ['#00C49F', '#FF8042'];

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Home Automation Overview
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Device Status
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={deviceData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label
                  >
                    {deviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Temperature Control (Thermostats)
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={temperatureData}>
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="temperature" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default HomeAutomationVisual;
