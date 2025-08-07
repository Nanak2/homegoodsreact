// client/src/main.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx'; // Your code is in App.js
import '../assets/css/main.css'; // if you're using external CSS

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
