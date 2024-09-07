// src/api.js
import axios from 'axios';
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from './auth';

const api = axios.create({
  baseURL: 'http://127.0.0.1:5000', // Flask backend base URL
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

api.interceptors.response.use((response) => response, async (error) => {
  const originalRequest = error.config;

  if (error.response.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;

    const refreshToken = getRefreshToken();
    if (refreshToken) {
      try {
        const { data } = await axios.post('http://127.0.0.1:5000/refresh', {}, {
          headers: { Authorization: `Bearer ${refreshToken}` },
        });
        const { accessToken } = data;
        setTokens(accessToken, refreshToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (err) {
        clearTokens();
      }
    }
  }

  return Promise.reject(error);
});

export default api;
