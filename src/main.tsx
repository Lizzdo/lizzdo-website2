import { StrictMode } from 'react';
import { hydrateRoot, createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';

const rootElement = document.getElementById('root')!;

const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

const hasSSRContent = Array.from(rootElement.childNodes).some(
  (node) => node.nodeType === Node.ELEMENT_NODE
);

if (hasSSRContent) {
  hydrateRoot(rootElement, app);
} else {
  createRoot(rootElement).render(app);
}
