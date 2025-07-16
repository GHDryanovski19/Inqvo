import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import { 
  FiArrowLeft, 
  FiDownload, 
  FiEdit, 
  FiPrinter,
  FiMail,
  FiShare2,
  FiEye,
  FiCopy,
  FiCheck,
  FiX
} from 'react-icons/fi'
import { useApp } from '../../contexts/AppContext'
import Button from '../../components/UI/Button/Button'
import { exportInvoiceToPDF, exportInvoiceToCSV, convertToBulgarianWords } from '../../utils/pdfExport'
import { generateInvoiceEmail } from '../../utils/emailExport'
import toast from 'react-hot-toast'
import './InvoicePreview.scss'

const InvoicePreview = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { invoices, clients, settings, formatCurrency, calculateInvoiceTotals } = useApp()
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  
  const invoice = invoices.find(inv => inv.id === id)
  
  if (!invoice) {
    return (
      <div className="invoice-preview">
        <div className="error-state">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="error-content"
          >
            <div className="error-icon">📄</div>
            <h2>Invoice Not Found</h2>
            <p>The invoice you're looking for doesn't exist or has been removed.</p>
            <Button 
              variant="primary" 
              onClick={() => navigate('/invoices')}
              className="back-button"
            >
              <FiArrowLeft />
              Back to Invoices
            </Button>
          </motion.div>
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

  const handleExport = async () => {
    setIsLoading(true)
    try {
      const result = await exportInvoiceToPDF(invoice, settings, formatCurrency)
      if (result.success) {
        toast.success(`PDF exported successfully: ${result.filename}`)
      } else {
        toast.error(`Export failed: ${result.error}`)
      }
    } catch (error) {
      toast.error('Failed to export PDF')
      console.error('Export error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Invoice ${invoice.number}`,
          text: `Invoice ${invoice.number} from ${settings.company.name}`,
          url: window.location.href
        })
        toast.success('Invoice shared successfully')
      } else {
        await navigator.clipboard.writeText(window.location.href)
        setCopied(true)
        toast.success('Invoice link copied to clipboard')
        setTimeout(() => setCopied(false), 2000)
      }
    } catch (error) {
      toast.error('Failed to share invoice')
      console.error('Share error:', error)
    }
  }

  const handleSendEmail = () => {
    try {
      const { subject, body } = generateInvoiceEmail(invoice, settings, formatCurrency)
      const mailtoLink = `mailto:${invoice.client?.email || ''}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
      window.open(mailtoLink, '_blank')
      toast.success('Email client opened with invoice details')
    } catch (error) {
      toast.error('Failed to generate email')
      console.error('Email generation error:', error)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'draft': return '#6B7280'
      case 'sent': return '#3B82F6'
      case 'paid': return '#10B981'
      case 'overdue': return '#EF4444'
      case 'cancelled': return '#9CA3AF'
      default: return '#6B7280'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'draft': return '📝'
      case 'sent': return '📤'
      case 'paid': return '✅'
      case 'overdue': return '⚠️'
      case 'cancelled': return '❌'
      default: return '📄'
    }
  }

  return (
    <div className="invoice-preview">
      {/* Modern Header */}
      <motion.div 
        className="invoice-preview__header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="header-left">
          <Button
            variant="ghost"
            onClick={() => navigate('/invoices')}
            className="back-btn"
          >
            <FiArrowLeft />
            <span>Back to Invoices</span>
          </Button>
          
          <div className="header-info">
            <h1>Invoice Preview</h1>
            <div className="invoice-meta">
              <span className="invoice-number">{invoice.number}</span>
              <div className="status-indicator" style={{ backgroundColor: getStatusColor(invoice.status) }}>
                <span className="status-icon">{getStatusIcon(invoice.status)}</span>
                <span className="status-text">{invoice.status}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="header-actions">
          <div className="action-group">
            <Button 
              variant="outline" 
              onClick={handlePrint}
              className="action-btn"
              title="Print Invoice"
            >
              <FiPrinter />
              <span>Print</span>
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleExport}
              className="action-btn"
              loading={isLoading}
              title="Export as PDF"
            >
              <FiDownload />
              <span>PDF</span>
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => {
                try {
                  const result = exportInvoiceToCSV(invoice, formatCurrency)
                  if (result.success) {
                    toast.success(`CSV exported successfully: ${result.filename}`)
                  } else {
                    toast.error(`Export failed: ${result.error}`)
                  }
                } catch (error) {
                  toast.error('Failed to export CSV')
                  console.error('CSV export error:', error)
                }
              }}
              className="action-btn"
              title="Export as CSV"
            >
              <FiDownload />
              <span>CSV</span>
            </Button>
          </div>
          
          <div className="action-group">
            <Button 
              variant="outline" 
              onClick={handleSendEmail}
              className="action-btn"
              title="Send via Email"
            >
              <FiMail />
              <span>Email</span>
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleShare}
              className="action-btn"
              title="Share Invoice"
            >
              {copied ? <FiCheck /> : <FiShare2 />}
              <span>{copied ? 'Copied' : 'Share'}</span>
            </Button>
          </div>
          
          <Button 
            variant="primary" 
            onClick={() => navigate(`/invoice/edit/${id}`)}
            className="edit-btn"
          >
            <FiEdit />
            <span>Edit Invoice</span>
          </Button>
        </div>
      </motion.div>

      {/* Invoice Document */}
      <motion.div
        className="invoice-document"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {/* Company & Invoice Header */}
        <div className="document-header">
          <div className="company-section">
            <div className="company-logo">
              {settings.company.logo ? (
                <img src={settings.company.logo} alt={settings.company.name} />
              ) : (
                <div className="logo-placeholder">
                  <span>{settings.company.name.charAt(0)}</span>
                </div>
              )}
            </div>
            
            <div className="company-details">
              <h2 className="company-name">{settings.company.name}</h2>
              <div className="company-address">
                {settings.company.address && <p>{settings.company.address}</p>}
                {settings.company.city && settings.company.postalCode && (
                  <p>{settings.company.postalCode} {settings.company.city}</p>
                )}
                {settings.company.country && <p>{settings.company.country}</p>}
                {settings.company.vatNumber && <p className="vat-number">ДДС номер: {settings.company.vatNumber}</p>}
                {settings.company.idNumber && <p className="id-number">ЕГН/Булстат: {settings.company.idNumber}</p>}
                {settings.company.manager && <p className="manager">Мениджър: {settings.company.manager}</p>}
                {settings.company.phone && <p className="phone">Тел: {settings.company.phone}</p>}
                {settings.company.bankDetails && <p className="bank-details">Банка: {settings.company.bankDetails}</p>}
              </div>
            </div>
          </div>
          
          <div className="invoice-details">
            <div className="invoice-title">
              <h1>ФАКТУРА</h1>
              <div className="invoice-number-display">№ {invoice.number}</div>
            </div>
            
            <div className="invoice-dates">
              <div className="date-row">
                <span className="date-label">Дата на издаване:</span>
                <span className="date-value">{format(new Date(invoice.issueDate), 'dd.MM.yyyy')}</span>
              </div>
              <div className="date-row">
                <span className="date-label">Дата на плащане:</span>
                <span className="date-value">{format(new Date(invoice.dueDate), 'dd.MM.yyyy')}</span>
              </div>
              {invoice.transactionBasis && (
                <div className="date-row">
                  <span className="date-label">Основание за сделката:</span>
                  <span className="date-value">{invoice.transactionBasis}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Client Information */}
        <div className="client-section">
          <h3 className="section-title">Получател:</h3>
          <div className="client-card">
            <h4 className="client-name">{invoice.client?.name || 'Неизвестен клиент'}</h4>
            <div className="client-details">
              {invoice.client?.company && <p className="client-company">{invoice.client.company}</p>}
              {invoice.client?.email && <p className="client-email">{invoice.client.email}</p>}
              {invoice.client?.phone && <p className="client-phone">{invoice.client.phone}</p>}
              {invoice.client?.address && <p className="client-address">{invoice.client.address}</p>}
              {invoice.client?.city && invoice.client?.postalCode && (
                <p className="client-location">{invoice.client.postalCode} {invoice.client.city}</p>
              )}
              {invoice.client?.country && <p className="client-country">{invoice.client.country}</p>}
              {invoice.client?.vatNumber && <p className="client-vat">ДДС номер: {invoice.client.vatNumber}</p>}
              {invoice.client?.idNumber && <p className="client-id">ЕГН/Булстат: {invoice.client.idNumber}</p>}
            </div>
          </div>
        </div>

        {/* Invoice Items Table */}
        <div className="invoice-items-section">
          <div className="items-table">
            <div className="table-header">
              <div className="header-cell description">Описание</div>
              <div className="header-cell quantity">Количество</div>
              <div className="header-cell rate">Единична цена</div>
              <div className="header-cell amount">Сума</div>
            </div>
            
            <div className="table-body">
              {invoice.items.map((item, index) => (
                <motion.div 
                  key={item.id || index} 
                  className="table-row"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="table-cell description">
                    <div className="item-info">
                      <span className="item-name">{item.description}</span>
                      {item.unit && <span className="item-unit">за {item.unit}</span>}
                    </div>
                  </div>
                  <div className="table-cell quantity">
                    <span>{item.quantity}</span>
                  </div>
                  <div className="table-cell rate">
                    <span>{formatCurrency(item.rate)}</span>
                  </div>
                  <div className="table-cell amount">
                    <span className="item-total">{formatCurrency(item.quantity * item.rate)}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Invoice Totals */}
        <div className="invoice-totals">
          <div className="totals-table">
            <div className="total-row subtotal">
              <span className="total-label">Междинна сума:</span>
              <span className="total-value">{formatCurrency(totals.subtotal)}</span>
            </div>
            
            {totals.discount > 0 && (
              <div className="total-row discount">
                <span className="total-label">
                  Отстъпка {totals.discountType === 'percentage' ? `(${totals.discountValue}%)` : ''}:
                </span>
                <span className="total-value discount-value">-{formatCurrency(totals.discount)}</span>
              </div>
            )}
            
            <div className="total-row vat">
              <span className="total-label">ДДС ({totals.vatRate}%):</span>
              <span className="total-value">{formatCurrency(totals.vat)}</span>
            </div>
            
            <div className="total-row grand-total">
              <span className="total-label">Обща сума:</span>
              <span className="total-value">{formatCurrency(totals.total)}</span>
            </div>
          </div>
        </div>

        {/* Amount in Words */}
        <div className="amount-in-words">
          <p><strong>Сума с думи:</strong> {convertToBulgarianWords(totals.total)}</p>
        </div>

        {/* Payment Method */}
        {invoice.paymentMethod && (
          <div className="payment-method">
            <p><strong>Начин на плащане:</strong> {invoice.paymentMethod}</p>
          </div>
        )}

        {/* Bank Details */}
        <div className="bank-details-section">
          <h4>Банкови детайли:</h4>
          <div className="bank-details-grid">
            {settings.company.iban && (
              <div className="bank-detail">
                <span className="label">IBAN:</span>
                <span className="value">{settings.company.iban}</span>
              </div>
            )}
            {settings.company.bank && (
              <div className="bank-detail">
                <span className="label">Банка:</span>
                <span className="value">{settings.company.bank}</span>
              </div>
            )}
            {settings.company.bankCode && (
              <div className="bank-detail">
                <span className="label">Банков код:</span>
                <span className="value">{settings.company.bankCode}</span>
              </div>
            )}
          </div>
        </div>

        {/* Place of Issue */}
        {invoice.place && (
          <div className="place-of-issue">
            <p><strong>Място на издаване:</strong> {invoice.place}</p>
          </div>
        )}

        {/* Invoice Notes */}
        {invoice.notes && (
          <div className="invoice-notes">
            <h4>Бележки:</h4>
            <p>{invoice.notes}</p>
          </div>
        )}

        {/* Invoice Terms */}
        {invoice.terms && (
          <div className="invoice-terms">
            <h4>Условия:</h4>
            <p>{invoice.terms}</p>
          </div>
        )}

        {/* Legal Disclaimer */}
        <div className="legal-disclaimer">
          <p><small>
            Тази фактура е издадена съгласно Закона за счетоводството и Закона за ДДС. 
            Плащането трябва да бъде извършено в срок до {format(new Date(invoice.dueDate), 'dd.MM.yyyy')}.
          </small></p>
        </div>
      </motion.div>
    </div>
  )
}

export default InvoicePreview 