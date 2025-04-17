import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Provider from './Store/context.jsx'
// import {BrowserRouter} from 'react-router'
createRoot(document.getElementById('root')).render(
  <StrictMode>
  
    <Provider>
    <App />
    </Provider>
  
  </StrictMode>,
)
