import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App'
import { AppProvider } from './contexts/AppContext'
import './styles/global.scss'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#232323',
              color: '#FFFFFF',
              borderRadius: '8px',
              fontSize: '14px',
            },
          }}
        />
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>
) 