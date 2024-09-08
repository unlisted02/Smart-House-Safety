import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { setTokens } from '../auth';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/login', { username, password });
      setTokens(response.data.access_token, response.data.refresh_token); // Save tokens
      navigate('/');  // Redirect to home page after successful login
    } catch (err) {
      setError('Invalid credentials, please try again.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Username"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="Password"
          fullWidth
          margin="normal"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Login
        </Button>
      </form>
      <Typography variant="body2" align="center" style={{ marginTop: '1rem' }}>
        Don't have an account? <Link href="/register">Register</Link>
      </Typography>
    </Container>
  );
};

export default Login;