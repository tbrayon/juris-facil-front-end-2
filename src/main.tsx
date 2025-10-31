import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // 1. Você já tem isso
import App from './App';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* 2. É PRECISO ADICIONAR O BROWSERROUTER AQUI */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);