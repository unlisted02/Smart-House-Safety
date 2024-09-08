import axios from 'axios';

export const setTokens = (accessToken, refreshToken) => {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

export const getAccessToken = () => {
  return localStorage.getItem('accessToken');
};

export const getRefreshToken = () => {
  return localStorage.getItem('refreshToken');
};

export const clearTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

export const isAuthenticated = () => {
  return !!getAccessToken();  // Returns true if there's an access token
};

export const logout = async () => {
  const token = getAccessToken();
  try {
    await axios.delete('http://127.0.0.1:5000/logout', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    clearTokens();
    window.location.href = '/login'; // Redirect to login page
  } catch (error) {
    console.error('Error logging out:', error);
  }
};