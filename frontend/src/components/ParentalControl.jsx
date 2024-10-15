// src/components/ParentalControl.js
import React, { useState, useEffect } from 'react';
import { Slider, Typography, Button, FormControl, InputLabel, Select, MenuItem, TextField, Checkbox, FormControlLabel } from '@mui/material';
import api from '../api';

const ParentalControl = () => {
  const [contentFiltering, setContentFiltering] = useState('strict');
  const [timeLimits, setTimeLimits] = useState([8, 20]);
  const [screenTimeLimit, setScreenTimeLimit] = useState(2); // in hours
  const [appRestrictions, setAppRestrictions] = useState([]);
  const [bedtime, setBedtime] = useState([22, 6]); // 10pm to 6am
  const [deviceRestrictions, setDeviceRestrictions] = useState([]);
  const [internetAccessSchedule, setInternetAccessSchedule] = useState([6, 22]); // 6am to 10pm
  const [usageReports, setUsageReports] = useState(false);
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    // Fetch mock IoT devices
    const fetchDevices = async () => {
      try {
        const { data } = await api.get('/mock/devices');
        setDevices(data);
      } catch (error) {
        console.error('Error fetching devices:', error);
      }
    };
    fetchDevices();
  }, []);

  const handleSaveSettings = async () => {
    const settings = {
      content_filtering: contentFiltering,
      time_limits: `${timeLimits[0]}am-${timeLimits[1]}pm`,
      screen_time_limit: screenTimeLimit,
      app_restrictions: appRestrictions,
      bedtime: `${bedtime[0]}pm-${bedtime[1]}am`,
      device_restrictions: deviceRestrictions,
      internet_access_schedule: `${internetAccessSchedule[0]}am-${internetAccessSchedule[1]}pm`,
      usage_reports: usageReports,
    };
    try {
      await api.post('/parental-control/settings', { settings });
      alert('Parental control settings updated!');
    } catch (error) {
      console.error('Error updating parental controls:', error);
    }
  };

  const handleAppRestrictionChange = (app) => {
    setAppRestrictions((prev) =>
      prev.includes(app) ? prev.filter((a) => a !== app) : [...prev, app]
    );
  };

  const handleDeviceRestrictionChange = (device) => {
    setDeviceRestrictions((prev) =>
      prev.includes(device) ? prev.filter((d) => d !== device) : [...prev, device]
    );
  };

  return (
    <div style={{ padding: '20px', marginLeft: '240px' }}>
      <Typography variant="h4" gutterBottom>Parental Controls</Typography>
      
      <FormControl fullWidth style={{ marginBottom: '20px' }}>
        <InputLabel>Content Filtering</InputLabel>
        <Select value={contentFiltering} onChange={(e) => setContentFiltering(e.target.value)}>
          <MenuItem value="strict">Strict</MenuItem>
          <MenuItem value="moderate">Moderate</MenuItem>
          <MenuItem value="none">None</MenuItem>
        </Select>
      </FormControl>
      
      <Typography gutterBottom>Time Limits: {timeLimits[0]}am - {timeLimits[1]}pm</Typography>
      <Slider
        value={timeLimits}
        onChange={(e, newValue) => setTimeLimits(newValue)}
        valueLabelDisplay="auto"
        min={0}
        max={24}
        marks={[
          { value: 0, label: '12am' },
          { value: 8, label: '8am' },
          { value: 20, label: '8pm' },
          { value: 24, label: '12am' },
        ]}
      />
      
      <FormControl fullWidth style={{ marginBottom: '20px', marginTop: '20px' }}>
        <TextField
          label="Daily Screen Time Limit (hours)"
          type="number"
          value={screenTimeLimit}
          onChange={(e) => setScreenTimeLimit(e.target.value)}
        />
      </FormControl>
      
      <Typography gutterBottom>App Restrictions</Typography>
      <FormControlLabel
        control={<Checkbox checked={appRestrictions.includes('YouTube')} onChange={() => handleAppRestrictionChange('YouTube')} />}
        label="YouTube"
      />
      <FormControlLabel
        control={<Checkbox checked={appRestrictions.includes('Facebook')} onChange={() => handleAppRestrictionChange('Facebook')} />}
        label="Facebook"
      />
      <FormControlLabel
        control={<Checkbox checked={appRestrictions.includes('Instagram')} onChange={() => handleAppRestrictionChange('Instagram')} />}
        label="Instagram"
      />
      
      <Typography gutterBottom>Bedtime: {bedtime[0]}pm - {bedtime[1]}am</Typography>
      <Slider
        value={bedtime}
        onChange={(e, newValue) => setBedtime(newValue)}
        valueLabelDisplay="auto"
        min={0}
        max={24}
        marks={[
          { value: 0, label: '12am' },
          { value: 22, label: '10pm' },
          { value: 6, label: '6am' },
          { value: 24, label: '12am' },
        ]}
      />
      
      <Typography gutterBottom>Device Restrictions</Typography>
      {devices.map((device) => (
        <FormControlLabel
          key={device.id}
          control={<Checkbox checked={deviceRestrictions.includes(device.name)} onChange={() => handleDeviceRestrictionChange(device.name)} />}
          label={device.name}
        />
      ))}
      
      <Typography gutterBottom>Internet Access Schedule: {internetAccessSchedule[0]}am - {internetAccessSchedule[1]}pm</Typography>
      <Slider
        value={internetAccessSchedule}
        onChange={(e, newValue) => setInternetAccessSchedule(newValue)}
        valueLabelDisplay="auto"
        min={0}
        max={24}
        marks={[
          { value: 0, label: '12am' },
          { value: 6, label: '6am' },
          { value: 22, label: '10pm' },
          { value: 24, label: '12am' },
        ]}
      />
      
      <FormControlLabel
        control={<Checkbox checked={usageReports} onChange={(e) => setUsageReports(e.target.checked)} />}
        label="Enable Usage Reports"
      />
      
      <Button variant="contained" color="primary" onClick={handleSaveSettings} style={{ marginTop: '20px' }}>
        Save Settings
      </Button>
    </div>
  );
};

export default ParentalControl;