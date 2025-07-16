import React, { useState } from 'react'
import { Outlet, useLocation, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  FiHome, 
  FiFileText, 
  FiUsers, 
  FiSettings, 
  FiMenu, 
  FiX,
  FiPlus,
  FiDownload,
  FiUpload
} from 'react-icons/fi'
import { useApp } from '../../contexts/AppContext'
import Button from '../UI/Button/Button'
import './Layout.scss'

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const { settings, saveData, loadData } = useApp()

  const navigation = [
    { path: '/', icon: FiHome, label: 'Dashboard' },
    { path: '/invoices', icon: FiFileText, label: 'Invoices' },
    { path: '/clients', icon: FiUsers, label: 'Clients' },
    { path: '/settings', icon: FiSettings, label: 'Settings' }
  ]

  const handleExport = async () => {
    try {
      const data = {
        invoices: [],
        clients: [],
        settings: settings
      }
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `inkblot-invoices-${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Export failed:', error)
    }
  }

  const handleImport = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result)
          // Handle import logic here
          console.log('Import data:', data)
        } catch (error) {
          console.error('Import failed:', error)
        }
      }
      reader.readAsText(file)
    }
  }

  return (
    <div className="layout">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <motion.div
          className="sidebar-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        className={`sidebar ${sidebarOpen ? 'sidebar--open' : ''}`}
        initial={{ x: -280 }}
        animate={{ x: sidebarOpen ? 0 : -280 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="sidebar__header">
          <div className="sidebar__logo">
            <div className="logo">
              <span className="logo__icon">🎨</span>
              <span className="logo__text">Inkblot Studio</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            iconOnly
            onClick={() => setSidebarOpen(false)}
            className="sidebar__close"
          >
            <FiX />
          </Button>
        </div>

        <nav className="sidebar__nav">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`sidebar__nav-item ${isActive ? 'sidebar__nav-item--active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className="sidebar__nav-icon" />
                <span className="sidebar__nav-label">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="sidebar__footer">
          <div className="sidebar__actions">
            <Button
              variant="outline"
              size="md"
              onClick={handleExport}
              className="sidebar__action-btn"
            >
              <FiDownload />
              Export
            </Button>
            <label className="sidebar__action-btn">
              <FiUpload />
              Import
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                style={{ display: 'none' }}
              />
            </label>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="main">
        {/* Header */}
        <header className="header">
          <div className="header__left">
            <Button
              variant="ghost"
              size="sm"
              iconOnly
              onClick={() => setSidebarOpen(true)}
              className="header__menu-btn"
            >
              <FiMenu />
            </Button>
            <h1 className="header__title">
              {navigation.find(item => item.path === location.pathname)?.label || 'Dashboard'}
            </h1>
          </div>

          <div className="header__right">
            {location.pathname === '/invoices' && (
              <Link to="/invoices/create">
                <Button variant="primary" size="md">
                  <FiPlus />
                  New Invoice
                </Button>
              </Link>
            )}
          </div>
        </header>

        {/* Page Content */}
        <div className="content">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </div>
      </main>
    </div>
  )
}

export default Layout 