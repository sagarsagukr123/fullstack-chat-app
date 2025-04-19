import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <App />
    </BrowserRouter>
    
  
  </StrictMode>
)//to allow application use react router components
// it shows socket connection 2 times in console useefectin app.jsx calling twice
// // should be used in development mode only to detect unexpected side effects in the application
 // it should not be used in production mode as it can cause issues with the application

