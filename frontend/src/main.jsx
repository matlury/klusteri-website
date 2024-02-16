import React from 'react';
import { createRoot } from 'react-dom/client';
import { ContextProvider } from './context/ContextProvider';
import App from './App';

// Use createRoot instead of ReactDOM.render
createRoot(document.getElementById('root')).render(
  <ContextProvider>
    <App />
  </ContextProvider>
);
