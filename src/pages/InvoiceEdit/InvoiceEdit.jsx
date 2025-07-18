import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm, useFieldArray } from 'react-hook-form'
import { v4 as uuidv4 } from 'uuid'
import { format } from 'date-fns'
import { 
  FiSave, 
  FiEye, 
  FiPlus, 
  FiTrash2, 
  FiCalendar,
  FiUser,
  FiDollarSign,
  FiArrowLeft
} from 'react-icons/fi'
import { useApp } from '../../contexts/AppContext'
import Button from '../../components/UI/Button/Button'
import Dropdown from '../../components/UI/Dropdown'
import toast from 'react-hot-toast'
import './InvoiceEdit.scss'

const InvoiceEdit = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { 
    invoices, 
    clients, 
    settings, 
    formatCurrency, 
    calculateInvoiceTotals,
    dispatch 
  } = useApp()

  const [selectedClient, setSelectedClient] = useState(null)
  const [showPreview, setShowPreview] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const invoice = invoices.find(inv => inv.id === id)

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting }
  } = useForm()

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items'
  })

  // Initialize form with invoice data
  useEffect(() => {
    if (invoice) {
      reset({
        number: invoice.number,
        issueDate: format(new Date(invoice.issueDate), 'yyyy-MM-dd'),
        dueDate: format(new Date(invoice.dueDate), 'yyyy-MM-dd'),
        status: invoice.status,
        items: invoice.items.length > 0 ? invoice.items : [
          {
            id: uuidv4(),
            description: '',
            quantity: 1,
            rate: 0,
            unit: 'hour'
          }
        ],
        notes: invoice.notes || '',
        vatRate: invoice.vatRate || settings.invoice.vatRate,
        discountType: invoice.discountType || 'percentage',
        discountValue: invoice.discountValue || 0
      })
      
      setSelectedClient(invoice.client)
      setIsLoading(false)
    }
  }, [invoice, reset, settings.invoice.vatRate])

  const watchedItems = watch('items') || []
  const watchedVatRate = watch('vatRate') || 20
  const watchedDiscountType = watch('discountType') || 'percentage'
  const watchedDiscountValue = watch('discountValue') || 0

  // Calculate totals
  const totals = calculateInvoiceTotals(watchedItems, watchedVatRate, watchedDiscountType, watchedDiscountValue)

  const onSubmit = async (data) => {
    try {
      const updatedInvoice = {
        ...invoice,
        ...data,
        client: selectedClient,
        updatedAt: new Date().toISOString()
      }

      dispatch({ type: 'UPDATE_INVOICE', payload: updatedInvoice })
      toast.success('Invoice updated successfully!')
      navigate('/invoices')
    } catch (error) {
      toast.error('Failed to update invoice')
      console.error('Update invoice error:', error)
    }
  }

  const addItem = () => {
    append({
      id: uuidv4(),
      description: '',
      quantity: 1,
      rate: 0,
      unit: 'hour'
    })
  }

  const removeItem = (index) => {
    if (fields.length > 1) {
      remove(index)
    }
  }

  const handleClientSelect = (clientId) => {
    const client = clients.find(c => c.id === clientId)
    setSelectedClient(client)
  }

  if (isLoading) {
    return (
      <div className="invoice-edit">
        <div className="loading-state">
          <h2>Loading invoice...</h2>
        </div>
      </div>
    )
  }

  if (!invoice) {
    return (
      <div className="invoice-edit">
        <div className="error-state">
          <h2>Invoice Not Found</h2>
          <p>The invoice you're trying to edit doesn't exist.</p>
          <Button variant="primary" onClick={() => navigate('/invoices')}>
            <FiArrowLeft />
            Back to Invoices
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="invoice-edit">
      <div className="invoice-edit__header">
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
            <h1>Edit Invoice</h1>
            <p>{invoice.number}</p>
          </div>
        </div>
        <div className="invoice-edit__actions">
          <Button
            variant="outline"
            onClick={() => setShowPreview(!showPreview)}
          >
            <FiEye />
            {showPreview ? 'Hide Preview' : 'Preview'}
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit(onSubmit)}
            loading={isSubmitting}
          >
            <FiSave />
            Update Invoice
          </Button>
        </div>
      </div>

      <div className="invoice-edit__content">
        <div className="invoice-edit__form">
          {/* Invoice Details */}
          <motion.div
            className="form-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2>Invoice Details</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Invoice Number</label>
                <input
                  type="text"
                  {...register('number', { required: 'Invoice number is required' })}
                  className={errors.number ? 'error' : ''}
                />
                {errors.number && <span className="error-message">{errors.number.message}</span>}
              </div>

              <div className="form-group">
                <label>Issue Date</label>
                <div className="input-with-icon">
                  <FiCalendar />
                  <input
                    type="date"
                    {...register('issueDate', { required: 'Issue date is required' })}
                    className={errors.issueDate ? 'error' : ''}
                  />
                </div>
                {errors.issueDate && <span className="error-message">{errors.issueDate.message}</span>}
              </div>

              <div className="form-group">
                <label>Due Date</label>
                <div className="input-with-icon">
                  <FiCalendar />
                  <input
                    type="date"
                    {...register('dueDate', { required: 'Due date is required' })}
                    className={errors.dueDate ? 'error' : ''}
                  />
                </div>
                {errors.dueDate && <span className="error-message">{errors.dueDate.message}</span>}
              </div>

              <div className="form-group">
                <label>Status</label>
                <Dropdown
                  options={[
                    { value: 'draft', label: 'Draft' },
                    { value: 'pending', label: 'Pending' },
                    { value: 'paid', label: 'Paid' },
                    { value: 'overdue', label: 'Overdue' }
                  ]}
                  value={watch('status')}
                  onChange={(value) => setValue('status', value)}
                  className={errors.status ? 'error' : ''}
                />
                {errors.status && <span className="error-message">{errors.status.message}</span>}
              </div>
            </div>
          </motion.div>

          {/* Client Selection */}
          <motion.div
            className="form-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2>Client Information</h2>
            <div className="form-group">
              <label>Select Client</label>
              <Dropdown
                options={[
                  { value: '', label: 'Choose a client...' },
                  ...clients.map(client => ({
                    value: client.id,
                    label: `${client.name} - ${client.email}`
                  }))
                ]}
                value={selectedClient?.id || ''}
                onChange={handleClientSelect}
                placeholder="Choose a client..."
                icon={<FiUser />}
              />
            </div>
            {selectedClient && (
              <div className="selected-client">
                <h4>{selectedClient.name}</h4>
                <p>{selectedClient.email}</p>
                {selectedClient.address && <p>{selectedClient.address}</p>}
                {selectedClient.vatNumber && <p>VAT: {selectedClient.vatNumber}</p>}
              </div>
            )}
          </motion.div>

          {/* Invoice Items */}
          <motion.div
            className="form-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="section-header">
              <h2>Invoice Items</h2>
              <Button variant="outline" size="sm" onClick={addItem}>
                <FiPlus />
                Add Item
              </Button>
            </div>

            <div className="invoice-items">
              <div className="items-header">
                <span>Description</span>
                <span>Quantity</span>
                <span>Rate (€)</span>
                <span>Amount (€)</span>
                <span></span>
              </div>

              {fields.map((field, index) => (
                <motion.div
                  key={field.id}
                  className="invoice-item"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <div className="item-description">
                    <input
                      type="text"
                      placeholder="Item description"
                      {...register(`items.${index}.description`, { 
                        required: 'Description is required' 
                      })}
                      className={errors.items?.[index]?.description ? 'error' : ''}
                    />
                  </div>

                  <div className="item-quantity">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      {...register(`items.${index}.quantity`, { 
                        required: 'Quantity is required',
                        min: { value: 0, message: 'Quantity must be positive' }
                      })}
                      className={errors.items?.[index]?.quantity ? 'error' : ''}
                    />
                  </div>

                  <div className="item-rate">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      {...register(`items.${index}.rate`, { 
                        required: 'Rate is required',
                        min: { value: 0, message: 'Rate must be positive' }
                      })}
                      className={errors.items?.[index]?.rate ? 'error' : ''}
                    />
                  </div>

                  <div className="item-amount">
                    {formatCurrency((watchedItems[index]?.quantity || 0) * (watchedItems[index]?.rate || 0))}
                  </div>

                  <div className="item-actions">
                    {fields.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(index)}
                        className="remove-btn"
                      >
                        <FiTrash2 />
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* VAT and Totals */}
          <motion.div
            className="form-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2>Tax & Totals</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>VAT Rate (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  {...register('vatRate', { 
                    required: 'VAT rate is required',
                    min: { value: 0, message: 'VAT rate must be positive' },
                    max: { value: 100, message: 'VAT rate cannot exceed 100%' }
                  })}
                  className={errors.vatRate ? 'error' : ''}
                />
                {errors.vatRate && <span className="error-message">{errors.vatRate.message}</span>}
              </div>
            </div>

            {/* Discount Section */}
            <div className="discount-section">
              <h3>Discount</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Discount Type</label>
                  <Dropdown
                    options={[
                      { value: 'percentage', label: 'Percentage' },
                      { value: 'fixed', label: 'Fixed Amount' }
                    ]}
                    value={watch('discountType')}
                    onChange={(value) => setValue('discountType', value)}
                    placeholder="Select discount type..."
                  />
                </div>
                <div className="form-group">
                  <label>Discount Value</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    {...register('discountValue', { 
                      min: { value: 0, message: 'Discount must be positive' }
                    })}
                    className={errors.discountValue ? 'error' : ''}
                    placeholder={watchedDiscountType === 'percentage' ? '0.00' : '0.00'}
                  />
                  {errors.discountValue && <span className="error-message">{errors.discountValue.message}</span>}
                </div>
              </div>
            </div>

            <div className="invoice-totals">
              <div className="total-row">
                <span>Subtotal:</span>
                <span>{formatCurrency(totals.subtotal)}</span>
              </div>
              {totals.discount > 0 && (
                <div className="total-row total-row--discount">
                  <span>
                    Discount ({watchedDiscountType === 'percentage' ? `${watchedDiscountValue}%` : formatCurrency(watchedDiscountValue)}):
                  </span>
                  <span>-{formatCurrency(totals.discount)}</span>
                </div>
              )}
              <div className="total-row">
                <span>VAT ({watchedVatRate}%):</span>
                <span>{formatCurrency(totals.vat)}</span>
              </div>
              <div className="total-row total-row--total">
                <span>Total:</span>
                <span>{formatCurrency(totals.total)}</span>
              </div>
            </div>
          </motion.div>

          {/* Notes */}
          <motion.div
            className="form-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2>Additional Notes</h2>
            <div className="form-group">
              <textarea
                placeholder="Add any additional notes or terms..."
                rows="4"
                {...register('notes')}
              />
            </div>
          </motion.div>
        </div>

        {/* Preview Panel */}
        {showPreview && (
          <motion.div
            className="invoice-edit__preview"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2>Invoice Preview</h2>
            <div className="preview-content">
              {/* Preview content will be implemented */}
              <p>Preview functionality will be implemented in the next iteration</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default InvoiceEdit 