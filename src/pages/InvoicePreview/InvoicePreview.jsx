import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { 
  FiArrowLeft, 
  FiDownload, 
  FiEdit, 
  FiPrinter,
  FiMail,
  FiShare2
} from 'react-icons/fi'
import { useApp } from '../../contexts/AppContext'
import Button from '../../components/UI/Button/Button'
import './InvoicePreview.scss'

const InvoicePreview = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { invoices, clients, settings, formatCurrency, calculateInvoiceTotals } = useApp()
  
  const invoice = invoices.find(inv => inv.id === id)
  
  if (!invoice) {
    return (
      <div className="invoice-preview">
        <div className="error-state">
          <h2>Invoice Not Found</h2>
          <p>The invoice you're looking for doesn't exist.</p>
          <Button variant="primary" onClick={() => navigate('/invoices')}>
            <FiArrowLeft />
            Back to Invoices
          </Button>
        </div>
      </div>
    )
  }

  const totals = calculateInvoiceTotals(
    invoice.items || [], 
    invoice.vatRate || 20, 
    invoice.discountType || 'percentage', 
    invoice.discountValue || 0
  )

  const handlePrint = () => {
    window.print()
  }

  const handleExport = () => {
    // PDF export functionality will be implemented
    console.log('Export to PDF')
  }

  const handleShare = () => {
    // Share functionality will be implemented
    console.log('Share invoice')
  }

  const handleSendEmail = () => {
    // Email functionality will be implemented
    console.log('Send via email')
  }

  return (
    <div className="invoice-preview">
      {/* Header */}
      <div className="invoice-preview__header">
        <div className="header-left">
          <Button
            variant="ghost"
            onClick={() => navigate('/invoices')}
            className="back-btn"
          >
            <FiArrowLeft />
            Back to Invoices
          </Button>
          <div>
            <h1>Invoice Preview</h1>
            <p>{invoice.number}</p>
          </div>
        </div>
        
        <div className="header-actions">
          <Button variant="outline" onClick={handlePrint}>
            <FiPrinter />
            Print
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <FiDownload />
            Export PDF
          </Button>
          <Button variant="outline" onClick={handleSendEmail}>
            <FiMail />
            Send Email
          </Button>
          <Button variant="outline" onClick={handleShare}>
            <FiShare2 />
            Share
          </Button>
          <Button variant="primary" onClick={() => navigate(`/invoices/${id}/edit`)}>
            <FiEdit />
            Edit Invoice
          </Button>
        </div>
      </div>

      {/* Invoice Document */}
      <motion.div
        className="invoice-document"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Invoice Header */}
        <div className="invoice-header">
          <div className="company-info">
            <div className="company-logo">
              {settings.company.logo ? (
                <img src={settings.company.logo} alt={settings.company.name} />
              ) : (
                <div className="logo-placeholder">
                  {settings.company.name.charAt(0)}
                </div>
              )}
            </div>
            <div className="company-details">
              <h2>{settings.company.name}</h2>
              {settings.company.address && <p>{settings.company.address}</p>}
              {settings.company.city && settings.company.postalCode && (
                <p>{settings.company.postalCode} {settings.company.city}</p>
              )}
              {settings.company.country && <p>{settings.company.country}</p>}
              {settings.company.vatNumber && <p>VAT: {settings.company.vatNumber}</p>}
            </div>
          </div>
          
          <div className="invoice-meta">
            <div className="invoice-number">
              <h1>{invoice.number}</h1>
              <span className={`status-badge status--${invoice.status}`}>
                {invoice.status}
              </span>
            </div>
            <div className="invoice-dates">
              <div className="date-item">
                <label>Issue Date:</label>
                <span>{format(new Date(invoice.issueDate), 'dd MMM yyyy')}</span>
              </div>
              <div className="date-item">
                <label>Due Date:</label>
                <span>{format(new Date(invoice.dueDate), 'dd MMM yyyy')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Client Information */}
        <div className="client-section">
          <h3>Bill To:</h3>
          <div className="client-info">
            <h4>{invoice.client?.name || 'Unknown Client'}</h4>
            {invoice.client?.company && <p>{invoice.client.company}</p>}
            {invoice.client?.email && <p>{invoice.client.email}</p>}
            {invoice.client?.phone && <p>{invoice.client.phone}</p>}
            {invoice.client?.address && <p>{invoice.client.address}</p>}
            {invoice.client?.city && invoice.client?.postalCode && (
              <p>{invoice.client.postalCode} {invoice.client.city}</p>
            )}
            {invoice.client?.country && <p>{invoice.client.country}</p>}
            {invoice.client?.vatNumber && <p>VAT: {invoice.client.vatNumber}</p>}
          </div>
        </div>

        {/* Invoice Items */}
        <div className="invoice-items">
          <div className="items-header">
            <div className="item-description">Description</div>
            <div className="item-quantity">Qty</div>
            <div className="item-rate">Rate</div>
            <div className="item-amount">Amount</div>
          </div>
          
          {invoice.items.map((item, index) => (
            <div key={item.id || index} className="invoice-item">
              <div className="item-description">
                <strong>{item.description}</strong>
                {item.unit && <span className="item-unit">per {item.unit}</span>}
              </div>
              <div className="item-quantity">{item.quantity}</div>
              <div className="item-rate">{formatCurrency(item.rate)}</div>
              <div className="item-amount">{formatCurrency((item.quantity || 0) * (item.rate || 0))}</div>
            </div>
          ))}
        </div>

        {/* Invoice Totals */}
        <div className="invoice-totals">
          <div className="totals-table">
            <div className="total-row">
              <span>Subtotal:</span>
              <span>{formatCurrency(totals.subtotal)}</span>
            </div>
            
            {totals.discount > 0 && (
              <div className="total-row discount-row">
                <span>
                  Discount ({invoice.discountType === 'percentage' ? `${invoice.discountValue}%` : formatCurrency(invoice.discountValue)}):
                </span>
                <span>-{formatCurrency(totals.discount)}</span>
              </div>
            )}
            
            <div className="total-row">
              <span>VAT ({invoice.vatRate}%):</span>
              <span>{formatCurrency(totals.vat)}</span>
            </div>
            
            <div className="total-row total-row--final">
              <span>Total:</span>
              <span>{formatCurrency(totals.total)}</span>
            </div>
          </div>
        </div>

        {/* Payment Information */}
        {settings.company.iban && (
          <div className="payment-info">
            <h3>Payment Information</h3>
            <div className="payment-details">
              <div className="payment-item">
                <label>Bank Account:</label>
                <span>{settings.company.iban}</span>
              </div>
              <div className="payment-item">
                <label>Account Holder:</label>
                <span>{settings.company.name}</span>
              </div>
            </div>
          </div>
        )}

        {/* Notes */}
        {invoice.notes && (
          <div className="invoice-notes">
            <h3>Notes</h3>
            <p>{invoice.notes}</p>
          </div>
        )}

        {/* Footer */}
        <div className="invoice-footer">
          <p>Thank you for your business!</p>
          <p className="footer-note">
            This invoice was generated by Inkblot Studio Invoice System
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default InvoicePreview 