// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Make sure your CSS file exists
import App from './App';

// React 18+ method to create a root
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
