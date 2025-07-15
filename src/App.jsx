import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AppProvider } from './contexts/AppContext'
import { useTranslation } from 'react-i18next'
import Header from './components/Header/Header'
import Dashboard from './pages/Dashboard/Dashboard'
import InvoiceList from './pages/InvoiceList/InvoiceList'
import InvoiceCreate from './pages/InvoiceCreate/InvoiceCreate'
import InvoiceEdit from './pages/InvoiceEdit/InvoiceEdit'
import InvoicePreview from './pages/InvoicePreview/InvoicePreview'
import Settings from './pages/Settings/Settings'
import './styles/global.scss'

function AppContent() {
  const { i18n } = useTranslation()

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng)
  }

  return (
    <Router>
      <div className="app">
        <Header onLanguageChange={changeLanguage} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/invoices" element={<InvoiceList />} />
            <Route path="/invoice/create" element={<InvoiceCreate />} />
            <Route path="/invoice/edit/:id" element={<InvoiceEdit />} />
            <Route path="/invoice/preview/:id" element={<InvoicePreview />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}

export default App 