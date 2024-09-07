// src/components/Home.js
import React from 'react';
import { Grid, Card, CardContent, Typography } from '@mui/material';
import { Devices, Lock, Settings } from '@mui/icons-material';
import HomeAutomationVisual from './HomeAutomationVisual';

const Home = () => {
  return (
    <div style={{ padding: '20px', marginLeft: '240px' }}>
      <Typography variant="h4" gutterBottom>
        Dashboard Overview
      </Typography>

      <HomeAutomationVisual />

      <Grid container spacing={4} style={{ marginTop: '30px' }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Devices style={{ fontSize: 40 }} />
              <Typography variant="h5" gutterBottom>
                Devices
              </Typography>
              <Typography variant="body2">
                Manage your connected smart home devices here.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Lock style={{ fontSize: 40 }} />
              <Typography variant="h5" gutterBottom>
                Parental Controls
              </Typography>
              <Typography variant="body2">
                Configure and manage parental control settings.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Settings style={{ fontSize: 40 }} />
              <Typography variant="h5" gutterBottom>
                System Settings
              </Typography>
              <Typography variant="body2">
                Manage your smart home system settings.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default Home;
