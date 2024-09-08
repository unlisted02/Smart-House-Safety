// src/components/ParentalControl.js
import React, { useState } from 'react';
import { Slider, Typography, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import api from '../api';

const ParentalControl = () => {
  const [contentFiltering, setContentFiltering] = useState('strict');
  const [timeLimits, setTimeLimits] = useState([8, 20]);

  const handleSaveSettings = async () => {
    const settings = {
      content_filtering: contentFiltering,
      time_limits: `${timeLimits[0]}am-${timeLimits[1]}pm`,
    };
    try {
      await api.post('/parental-control/settings', { settings });
      alert('Parental control settings updated!');
    } catch (error) {
      console.error('Error updating parental controls:', error);
    }
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
      <Button variant="contained" color="primary" onClick={handleSaveSettings} style={{ marginTop: '20px' }}>
        Save Settings
      </Button>
    </div>
  );
};

export default ParentalControl;
