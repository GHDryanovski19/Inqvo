import React from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowLeft } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import Button from '../../components/UI/Button/Button'

const InvoiceEdit = () => {
  const { id } = useParams()

  return (
    <div className="invoice-edit">
      <div className="invoice-edit__header">
        <Link to="/invoices">
          <Button variant="ghost" size="sm">
            <FiArrowLeft />
            Back to Invoices
          </Button>
        </Link>
        <h1>Edit Invoice</h1>
      </div>
      
      <div className="invoice-edit__content">
        <motion.div
          className="placeholder"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2>Invoice Edit Page</h2>
          <p>This page will allow editing of invoice {id}</p>
          <p>Similar functionality to the Create Invoice page, but pre-populated with existing data.</p>
        </motion.div>
      </div>
    </div>
  )
}

export default InvoiceEdit 