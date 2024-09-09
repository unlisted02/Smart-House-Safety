import React from 'react';
import { Grid, Typography } from '@mui/material';
import Kitchen from './Kitchen';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import HomeAutomationVisual from './HomeAutomationVisual';
import Temperature from './Temperature';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Home = () => {
  // Dummy data for the graphs
  const powerConsumptionData = {
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    datasets: [
      {
        label: 'Power Consumption (kWh)',
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        backgroundColor: '#65a30d', // Tailwind blue-500
        borderColor: '#65a30d', // Tailwind blue-500
        tension: 0.4, // Smooth the line
      },
    ],
  };

  const devicesStatusData = {
    labels: ['On', 'Off'],
    datasets: [
      {
        label: 'Devices Status',
        data: [300, 50],
        backgroundColor: ['#7e22ce', '#a21caf'], // Tailwind yellow-400 and green-500
        borderColor: ['#7e22ce', '#a21caf'], // Tailwind yellow-400 and green-500
        borderWidth: 1,
      },
    ],
  };

  const humidityTemperatureData = {
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    datasets: [
      {
        label: 'Humidity (%)',
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        backgroundColor: '#22c55e', // Tailwind purple-500
        borderColor: '#8B5CF6', // Tailwind purple-500
      },
      {
        label: 'Temperature (°C)',
        data: [28, 25, 30, 32, 27, 26, 24],
        fill: false,
        backgroundColor: '#8b5cf6', // Tailwind red-500
        borderColor: '#22c55e', // Tailwind red-500
      },
    ],
  };


  const commonOptions = {
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="ml-0">
      <div className="flex items-center justify-between">
        <Typography variant="h4 font-bold text-3xl" gutterBottom>
          Dashboard Home-Control
        </Typography>
        <div className="flex space-x-4 font-bold text-2xl">
          <a href="/living-room" className="px-4 py-2 border border-gray-300 rounded-lg text-gray-900 hover:text-gray-500 hover:bg-indigo-500 transition">Living Room</a>
          <a href="/kitchen" className="px-4 py-2 border border-gray-300 rounded-lg text-gray-900 hover:text-gray-500 hover:bg-indigo-500 transition">Kitchen</a>
          <a href="/bedroom" className="px-4 py-2 border border-gray-300 rounded-lg text-gray-900 hover:text-gray-500 hover:bg-indigo-500 transition">Bedroom</a>
          <a href="/bathroom" className="px-4 py-2 border border-gray-300 rounded-lg text-gray-900 hover:text-gray-500 hover:bg-indigo-500 transition">Bathroom</a>
        </div>
      </div>

      <HomeAutomationVisual />

      <Grid container spacing={4} className="mt-8">
        <Grid item xs={12}>
          <Temperature />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <div className="p-4" style={{ height: '300px', width: '100%' }}>
            <Typography variant="h6" gutterBottom>Power Consumption Over Time</Typography>
            <Line data={powerConsumptionData} options={commonOptions} />
          </div>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <div className="p-4" style={{ height: '300px', width: '100%' }}>
            <Typography variant="h6" gutterBottom>Devices Status</Typography>
            <Doughnut data={devicesStatusData} options={{ maintainAspectRatio: false }} />
          </div>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <div className="p-4" style={{ height: '300px', width: '100%' }}>
            <Typography variant="h6" gutterBottom>Humidity vs Temperature</Typography>
            <Bar data={humidityTemperatureData} options={commonOptions} />
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default Home;