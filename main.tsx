import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app/App.tsx'  // если App в папке app — так и пиши
// если App.tsx в корне src — измени на './App.tsx'
import './styles/index.css'      // или твой главный css-файл

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)