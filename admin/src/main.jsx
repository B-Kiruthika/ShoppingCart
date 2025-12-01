import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
<<<<<<< HEAD
import {BrowserRouter} from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter><App />
    </BrowserRouter>
    
=======

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
>>>>>>> 5de0e901bae7ffefd72478c75a3c44d83e6ea8d6
  </StrictMode>,
)
