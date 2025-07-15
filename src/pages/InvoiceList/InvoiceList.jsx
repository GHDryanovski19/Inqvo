import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  FiPlus, 
  FiSearch, 
  FiFilter, 
  FiEye, 
  FiEdit, 
  FiTrash2,
  FiDownload,
  FiCalendar,
  FiUser,
  FiDollarSign,
  FiFileText
} from 'react-icons/fi'
import { useApp } from '../../contexts/AppContext'
import { format } from 'date-fns'
import Button from '../../components/UI/Button/Button'
import toast from 'react-hot-toast'
import './InvoiceList.scss'

const InvoiceList = () => {
  const { invoices, clients, formatCurrency, calculateInvoiceTotals, dispatch } = useApp()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('date')
  const [sortOrder, setSortOrder] = useState('desc')

  // Filter and sort invoices
  const filteredInvoices = useMemo(() => {
    let filtered = invoices.filter(invoice => {
      const matchesSearch = 
        invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.client?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.client?.email.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter
      
      return matchesSearch && matchesStatus
    })

    // Sort invoices
    filtered.sort((a, b) => {
      let aValue, bValue

      switch (sortBy) {
        case 'date':
          aValue = new Date(a.issueDate)
          bValue = new Date(b.issueDate)
          break
        case 'number':
          aValue = a.number
          bValue = b.number
          break
        case 'client':
          aValue = a.client?.name || ''
          bValue = b.client?.name || ''
          break
        case 'amount':
          const aTotals = calculateInvoiceTotals(a.items, a.vatRate)
          const bTotals = calculateInvoiceTotals(b.items, b.vatRate)
          aValue = aTotals.total
          bValue = bTotals.total
          break
        default:
          aValue = new Date(a.issueDate)
          bValue = new Date(b.issueDate)
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return filtered
  }, [invoices, searchTerm, statusFilter, sortBy, sortOrder, calculateInvoiceTotals])

  const handleDeleteInvoice = (invoiceId) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      dispatch({ type: 'DELETE_INVOICE', payload: invoiceId })
      toast.success('Invoice deleted successfully')
    }
  }

  const handleExportInvoice = (invoice) => {
    // Export functionality will be implemented
    toast.success('Export functionality coming soon!')
  }

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'draft', label: 'Draft' },
    { value: 'pending', label: 'Pending' },
    { value: 'paid', label: 'Paid' },
    { value: 'overdue', label: 'Overdue' }
  ]

  const sortOptions = [
    { value: 'date', label: 'Date' },
    { value: 'number', label: 'Number' },
    { value: 'client', label: 'Client' },
    { value: 'amount', label: 'Amount' }
  ]

  return (
    <div className="invoice-list">
      <div className="invoice-list__header">
        <div>
          <h1>Invoices</h1>
          <p>Manage and track all your invoices</p>
        </div>
        <Link to="/invoices/create">
          <Button variant="primary" size="lg">
            <FiPlus />
            Create Invoice
          </Button>
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="invoice-list__filters">
        <div className="filters-left">
          <div className="search-box">
            <FiSearch />
            <input
              type="text"
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="filters-right">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                Sort by {option.label}
              </option>
            ))}
          </select>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </Button>
        </div>
      </div>

      {/* Invoice Stats */}
      <div className="invoice-list__stats">
        <div className="stat-item">
          <FiFileText />
          <div>
            <span className="stat-value">{invoices.length}</span>
            <span className="stat-label">Total Invoices</span>
          </div>
        </div>
        <div className="stat-item">
          <FiDollarSign />
          <div>
            <span className="stat-value">
              {formatCurrency(
                invoices.reduce((sum, invoice) => {
                  const totals = calculateInvoiceTotals(invoice.items, invoice.vatRate)
                  return sum + totals.total
                }, 0)
              )}
            </span>
            <span className="stat-label">Total Revenue</span>
          </div>
        </div>
        <div className="stat-item">
          <FiCalendar />
          <div>
            <span className="stat-value">
              {invoices.filter(invoice => invoice.status === 'pending').length}
            </span>
            <span className="stat-label">Pending</span>
          </div>
        </div>
        <div className="stat-item">
          <FiUser />
          <div>
            <span className="stat-value">{clients.length}</span>
            <span className="stat-label">Active Clients</span>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="invoice-list__content">
        {filteredInvoices.length > 0 ? (
          <div className="invoices-table">
            <div className="table-header">
              <div className="header-cell">Invoice</div>
              <div className="header-cell">Client</div>
              <div className="header-cell">Date</div>
              <div className="header-cell">Due Date</div>
              <div className="header-cell">Amount</div>
              <div className="header-cell">Status</div>
              <div className="header-cell">Actions</div>
            </div>

            {filteredInvoices.map((invoice, index) => {
              const totals = calculateInvoiceTotals(invoice.items, invoice.vatRate)
              return (
                <motion.div
                  key={invoice.id}
                  className="table-row"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ backgroundColor: 'var(--color-gray-light)' }}
                >
                  <div className="table-cell invoice-number">
                    <strong>{invoice.number}</strong>
                  </div>
                  
                  <div className="table-cell client-info">
                    <div className="client-name">{invoice.client?.name || 'Unknown Client'}</div>
                    <div className="client-email">{invoice.client?.email}</div>
                  </div>
                  
                  <div className="table-cell">
                    {format(new Date(invoice.issueDate), 'MMM dd, yyyy')}
                  </div>
                  
                  <div className="table-cell">
                    {format(new Date(invoice.dueDate), 'MMM dd, yyyy')}
                  </div>
                  
                  <div className="table-cell amount">
                    <strong>{formatCurrency(totals.total)}</strong>
                  </div>
                  
                  <div className="table-cell">
                    <span className={`status-badge status--${invoice.status}`}>
                      {invoice.status}
                    </span>
                  </div>
                  
                  <div className="table-cell actions">
                    <div className="action-buttons">
                      <Link to={`/invoices/${invoice.id}/preview`}>
                        <Button variant="ghost" size="sm" title="Preview">
                          <FiEye />
                        </Button>
                      </Link>
                      
                      <Link to={`/invoices/${invoice.id}`}>
                        <Button variant="ghost" size="sm" title="Edit">
                          <FiEdit />
                        </Button>
                      </Link>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleExportInvoice(invoice)}
                        title="Export"
                      >
                        <FiDownload />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteInvoice(invoice.id)}
                        title="Delete"
                        className="delete-btn"
                      >
                        <FiTrash2 />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        ) : (
          <div className="empty-state">
            <FiFileText size={64} />
            <h3>No invoices found</h3>
            <p>
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Create your first invoice to get started'
              }
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <Link to="/invoices/create">
                <Button variant="primary">
                  <FiPlus />
                  Create Invoice
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default InvoiceList 