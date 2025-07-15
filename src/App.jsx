import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Layout from './components/Layout/Layout'
import Dashboard from './pages/Dashboard/Dashboard'
import InvoiceList from './pages/InvoiceList/InvoiceList'
import InvoiceCreate from './pages/InvoiceCreate/InvoiceCreate'
import InvoiceEdit from './pages/InvoiceEdit/InvoiceEdit'
import InvoicePreview from './pages/InvoicePreview/InvoicePreview'
import Clients from './pages/Clients/Clients'
import Settings from './pages/Settings/Settings'
import './App.scss'

const App = () => {
  return (
    <div className="app">
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="invoices" element={<InvoiceList />} />
            <Route path="invoices/create" element={<InvoiceCreate />} />
            <Route path="invoices/:id/edit" element={<InvoiceEdit />} />
            <Route path="invoices/:id/preview" element={<InvoicePreview />} />
            <Route path="clients" element={<Clients />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </AnimatePresence>
    </div>
  )
}

export default App 