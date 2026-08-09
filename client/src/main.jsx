import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.jsx';
import './index.css';

/* ==========================================
   CLIENT ANALYTICS DROP-ZONE
   Place Google Analytics (gtag) or Meta Pixel setup code here:
   
   // Example:
   // window.dataLayer = window.dataLayer || [];
   // function gtag(){dataLayer.push(arguments);}
   // gtag('js', new Date());
   // gtag('config', 'G-XXXXXXXXXX');
   ========================================== */

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>
);
