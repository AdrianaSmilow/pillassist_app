// import CSS z Bootstrapu
import 'bootstrap/dist/css/bootstrap.min.css';
// import CSS ikonek z Bootstrap Icons
import 'bootstrap-icons/font/bootstrap-icons.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Měření výkonnosti
reportWebVitals();

