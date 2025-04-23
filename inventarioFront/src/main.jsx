import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

// Asegúrate de que el elemento "root" existe
const root = ReactDOM.createRoot(document.getElementById('root'));
/*if (import.meta.env.DEV) {
  import('./mocks/browser').then(({ worker }) => {
    worker.start();
  });
}*/
root.render(
  
  <React.StrictMode>
    <App />
  </React.StrictMode>
);