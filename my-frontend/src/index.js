import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Jeśli chcesz mierzyć wydajność swojej aplikacji, prześlij funkcję do logowania wyników (np. reportWebVitals(console.log))
// lub wyślij dane do endpointu analitycznego.
reportWebVitals();
