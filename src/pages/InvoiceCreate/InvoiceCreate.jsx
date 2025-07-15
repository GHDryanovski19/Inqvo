import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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
  FiDollarSign
} from 'react-icons/fi'
import { useApp } from '../../contexts/AppContext'
import Button from '../../components/UI/Button/Button'
import toast from 'react-hot-toast'
import './InvoiceCreate.scss'

const InvoiceCreate = () => {
  const navigate = useNavigate()
  const { 
    clients, 
    settings, 
    generateInvoiceNumber, 
    formatCurrency, 
    calculateInvoiceTotals,
    dispatch 
  } = useApp()

  const [selectedClient, setSelectedClient] = useState(null)
  const [showPreview, setShowPreview] = useState(false)

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      number: generateInvoiceNumber(),
      issueDate: format(new Date(), 'yyyy-MM-dd'),
      dueDate: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
      status: 'draft',
      items: [
        {
          id: uuidv4(),
          description: '',
          quantity: 1,
          rate: 0,
          unit: 'hour'
        }
      ],
      notes: '',
      vatRate: settings.invoice.vatRate,
      discountType: 'percentage',
      discountValue: 0
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items'
  })

  const watchedItems = watch('items') || []
  const watchedVatRate = watch('vatRate') || 20
  const watchedDiscountType = watch('discountType') || 'percentage'
  const watchedDiscountValue = watch('discountValue') || 0

  // Calculate totals
  const totals = calculateInvoiceTotals(watchedItems, watchedVatRate, watchedDiscountType, watchedDiscountValue)

  const onSubmit = async (data) => {
    try {
      const invoice = {
        id: uuidv4(),
        ...data,
        client: selectedClient,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      dispatch({ type: 'ADD_INVOICE', payload: invoice })
      toast.success('Invoice created successfully!')
      navigate('/invoices')
    } catch (error) {
      toast.error('Failed to create invoice')
      console.error('Create invoice error:', error)
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

  return (
    <div className="invoice-create">
      <div className="invoice-create__header">
        <div>
          <h1>Create New Invoice</h1>
          <p>Fill in the details below to create a professional invoice</p>
        </div>
        <div className="invoice-create__actions">
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
            Save Invoice
          </Button>
        </div>
      </div>

      <div className="invoice-create__content">
        <div className="invoice-create__form">
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
                <select {...register('status')}>
                  <option value="draft">Draft</option>
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                </select>
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
              <div className="input-with-icon">
                <FiUser />
                <select
                  onChange={(e) => handleClientSelect(e.target.value)}
                  value={selectedClient?.id || ''}
                >
                  <option value="">Choose a client...</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>
                      {client.name} - {client.email}
                    </option>
                  ))}
                </select>
              </div>
              {selectedClient && (
                <div className="selected-client">
                  <h4>{selectedClient.name}</h4>
                  <p>{selectedClient.email}</p>
                  {selectedClient.address && <p>{selectedClient.address}</p>}
                  {selectedClient.vatNumber && <p>VAT: {selectedClient.vatNumber}</p>}
                </div>
              )}
            </div>
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
                  <select {...register('discountType')}>
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (€)</option>
                  </select>
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
            className="invoice-create__preview"
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

export default InvoiceCreate 