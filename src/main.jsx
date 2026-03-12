import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';

const rootElement = document.getElementById('root') ?? (() => {
  const fallback = document.createElement('div');
  fallback.id = 'root';
  document.body.appendChild(fallback);
  return fallback;
})();

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
