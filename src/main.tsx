// Local: src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import 'react-phone-input-2/lib/style.css'; // <<< Adicionado para o estilo do campo de telefone
import { Toaster } from './components/ui/sonner.tsx';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    <Toaster />
  </React.StrictMode>
);