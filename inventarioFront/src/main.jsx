import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Asegúrate de que el elemento "root" existe
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);