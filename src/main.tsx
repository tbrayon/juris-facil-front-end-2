import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Corrigido para não usar a extensão .tsx na importação
import './styles/global.css'; // CORRIGIDO: Usa o alias que aponta para src/styles/

// Esta função localiza o elemento <div id="root"> no seu index.html
// e injeta toda a sua aplicação React ali.
ReactDOM.createRoot(document.getElementById('root')!).render(
  // React.StrictMode ajuda a identificar problemas e práticas não recomendadas
  // durante o desenvolvimento.
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
