import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fortawesome/fontawesome-free/css/all.min.css';
import './index.css'
import App from './App.jsx'
import "../axios-config.js"
import SecureScreen from './Secure/SecureScreen.jsx';



createRoot(document.getElementById('root')).render(
  <StrictMode>

    <App />
    <SecureScreen/>
  </StrictMode>,
)
