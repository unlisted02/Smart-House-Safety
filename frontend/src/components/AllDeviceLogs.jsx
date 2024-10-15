import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

const AllDeviceLogs = () => {
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/logs', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        setLogs(response.data);
      } catch (error) {
        setError('Error fetching all device logs');
        console.error('Error fetching all device logs:', error);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div style={{ padding: '20px', marginLeft: '24px', marginRight: '24px' }}>
      <Typography variant="h4" gutterBottom>All Device Logs</Typography>
      {error && <Typography color="error">Error: {error}</Typography>}
      <Grid container spacing={4}>
        {logs.map((log) => (
          <Grid item key={log.id} xs={12} sm={6} md={4}>
            <Card>
              <CardContent className="bg-slate-200">
                <Typography variant="h6" gutterBottom>Log ID: {log.id}</Typography>
                <Typography gutterBottom>Action: {log.action}</Typography>
                <Typography gutterBottom>Timestamp: {log.timestamp}</Typography>
                <Typography gutterBottom>Device ID: {log.device_id}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default AllDeviceLogs;