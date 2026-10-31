import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import '@fontsource-variable/bricolage-grotesque/opsz.css' // weight + optical size, for crisper display headings
import '@fontsource-variable/figtree'
import './styles.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
