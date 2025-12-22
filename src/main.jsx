// Main Application Entry Point
// Sets up React with Redux Provider and Router

import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './store';
import App from './App.jsx';
import './index.css';

// Create root and render the app
// Provider makes Redux store available to all components
createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
);
