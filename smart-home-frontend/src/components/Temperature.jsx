import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Button } from '@mui/material';
import axios from 'axios';
import { getAccessToken } from '../auth';

const Temperature = () => {
  const [temperature, setTemperature] = useState(null);
  const [currentConsumption, setCurrentConsumption] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [error, setError] = useState(null);

  const fetchTemperature = async () => {
    try {
      const token = getAccessToken();
      const { data } = await axios.get('http://127.0.0.1:5000/temperature', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setTemperature(data.temperature);
    } catch (error) {
      console.error('Error fetching temperature:', error);
      setError(error.response ? error.response.data : 'Unknown error');
    }
  };

  const fetchCurrentConsumption = () => {
    // Simulate fetching current consumption with a random value
    const randomCurrent = (Math.random() * 10).toFixed(2); // Random value between 0 and 10
    setCurrentConsumption(randomCurrent);
  };

  const fetchHumidity = () => {
    // Simulate fetching humidity with a random value
    const randomHumidity = (Math.random() * 100).toFixed(2); // Random value between 0 and 100
    setHumidity(randomHumidity);
  };

  useEffect(() => {
    fetchTemperature();
    fetchCurrentConsumption();
    fetchHumidity();

    const interval = setInterval(() => {
      fetchCurrentConsumption();
      fetchHumidity();
    }, 300000); // Update every 5 minutes

    return () => clearInterval(interval);
  }, []);

  return (
    <Grid container spacing={4} className="px-12 ml-6">
      <Grid item xs={12} sm={4} className="ml-6 ">
        <Card className="h-full">
          <CardContent className='bg-slate-200'>
            <Typography variant="h5" gutterBottom>Temperature</Typography>
            {error && <Typography color="error">Error: {error}</Typography>}
            {temperature !== null ? (
              <Typography variant="h6">Current Temperature: {temperature}°C</Typography>
            ) : (
              <Typography variant="h6">Loading temperature...</Typography>
            )}
            <Button
              variant="contained"
              color="primary"
              style={{ marginTop: '20px' }}
              onClick={fetchTemperature}
            >
              Refresh Temperature
            </Button>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={4} className="ml-6 ">
        <Card className="h-full ">
          <CardContent className='bg-slate-200'>
            <Typography variant="h5 font-bold text-gray-800" gutterBottom>Current Consumption</Typography>
            {currentConsumption !== null ? (
              <Typography variant="h6"> {currentConsumption} KWH</Typography>
            ) : (
              <Typography variant="h6 bg-slate-200">Loading current consumption...</Typography>
            )}
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={4} className="ml-6 ">
        <Card className="h-full">
          <CardContent className='bg-slate-200'>
            <Typography variant=" font-bold text-gray-900" gutterBottom>Humidity</Typography>
            {humidity !== null ? (
              <Typography variant="h6">{humidity} %</Typography>
            ) : (
              <Typography variant="h6">Loading humidity...</Typography>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Temperature;