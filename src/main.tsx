import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

console.log('Mounting NBA Application...');

const rootElement = document.getElementById('root');
if (!rootElement) {
  const msg = 'Fatal: Root element #root not found in DOM.';
  console.error(msg);
  document.body.innerHTML = `<div style="padding: 20px; color: red;">${msg}</div>`;
} else {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
  console.log('Mounting successful.');
}
