import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'
const options = {
    position: 'top center',
    timeout: 5000,
    offset: '30px',
    transition: 'scale',
    type:'error'
  }
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <AlertProvider template={AlertTemplate} {...options}>
    <App />
  </AlertProvider>
);


