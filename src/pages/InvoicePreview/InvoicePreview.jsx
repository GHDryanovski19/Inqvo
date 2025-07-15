import React from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowLeft, FiDownload, FiPrinter } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import Button from '../../components/UI/Button/Button'

const InvoicePreview = () => {
  const { id } = useParams()

  return (
    <div className="invoice-preview">
      <div className="invoice-preview__header">
        <Link to="/invoices">
          <Button variant="ghost" size="sm">
            <FiArrowLeft />
            Back to Invoices
          </Button>
        </Link>
        <div className="invoice-preview__actions">
          <Button variant="outline" size="sm">
            <FiPrinter />
            Print
          </Button>
          <Button variant="primary" size="sm">
            <FiDownload />
            Download PDF
          </Button>
        </div>
      </div>
      
      <div className="invoice-preview__content">
        <motion.div
          className="invoice-document"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="invoice-header">
            <h1>INVOICE</h1>
            <div className="invoice-number">INV-2025-0001</div>
          </div>
          
          <div className="invoice-details">
            <div className="company-info">
              <h3>Inkblot Studio</h3>
              <p>123 Creative Street</p>
              <p>Sofia, Bulgaria</p>
              <p>VAT: BG123456789</p>
            </div>
            
            <div className="client-info">
              <h3>Client Name</h3>
              <p>Client Company</p>
              <p>Client Address</p>
              <p>Client City, Country</p>
            </div>
          </div>
          
          <div className="invoice-items">
            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Quantity</th>
                  <th>Rate</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Web Design Services</td>
                  <td>10 hours</td>
                  <td>€50.00</td>
                  <td>€500.00</td>
                </tr>
                <tr>
                  <td>UI/UX Design</td>
                  <td>5 hours</td>
                  <td>€60.00</td>
                  <td>€300.00</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="invoice-totals">
            <div className="total-row">
              <span>Subtotal:</span>
              <span>€800.00</span>
            </div>
            <div className="total-row">
              <span>VAT (20%):</span>
              <span>€160.00</span>
            </div>
            <div className="total-row total">
              <span>Total:</span>
              <span>€960.00</span>
            </div>
          </div>
          
          <div className="invoice-footer">
            <p>Payment Terms: 30 days</p>
            <p>Thank you for your business!</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default InvoicePreview 