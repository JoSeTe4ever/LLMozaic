import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { NylasProvider } from '@nylas/nylas-react';
import './styles/style.scss';

const root = ReactDOM.createRoot(document.getElementById('root'));
const SERVER_URI = import.meta.env.VITE_SERVER_URI || 'http://localhost:9000';

root.render(
  <React.StrictMode>
    <NylasProvider serverBaseUrl={SERVER_URI}>
      <App />
    </NylasProvider>
  </React.StrictMode>
);
