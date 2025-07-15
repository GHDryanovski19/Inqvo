import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm, useFieldArray } from 'react-hook-form'
import { v4 as uuidv4 } from 'uuid'
import { format } from 'date-fns'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation()
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
          <h1>{t('invoice.create.title')}</h1>
          <p>Fill in the details below to create a professional invoice</p>
        </div>
        <div className="invoice-create__actions">
          <Button
            variant="outline"
            onClick={() => setShowPreview(!showPreview)}
          >
            <FiEye />
            {showPreview ? t('common.hide') : t('common.preview')}
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit(onSubmit)}
            loading={isSubmitting}
          >
            <FiSave />
            {t('invoice.create.saveInvoice')}
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
            <h2>{t('invoice.create.invoiceDetails')}</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>{t('invoice.form.invoiceNumber')}</label>
                <input
                  type="text"
                  {...register('number', { required: 'Invoice number is required' })}
                  className={errors.number ? 'error' : ''}
                />
                {errors.number && <span className="error-message">{errors.number.message}</span>}
              </div>

              <div className="form-group">
                <label>{t('invoice.form.issueDate')}</label>
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
                <label>{t('invoice.form.dueDate')}</label>
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
                <label>{t('common.status')}</label>
                <select {...register('status')}>
                  <option value="draft">{t('invoice.status.draft')}</option>
                  <option value="pending">{t('invoice.status.pending')}</option>
                  <option value="paid">{t('invoice.status.paid')}</option>
                  <option value="overdue">{t('invoice.status.overdue')}</option>
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
            <h2>{t('client_information')}</h2>
            <div className="form-group">
              <label>{t('select_client')}</label>
              <div className="input-with-icon">
                <FiUser />
                <select
                  onChange={(e) => handleClientSelect(e.target.value)}
                  value={selectedClient?.id || ''}
                >
                  <option value="">{t('choose_client')}</option>
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
                  {selectedClient.vatNumber && <p>{t('vat')}: {selectedClient.vatNumber}</p>}
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
              <h2>{t('invoice_items')}</h2>
              <Button variant="outline" size="sm" onClick={addItem}>
                <FiPlus />
                {t('add_item')}
              </Button>
            </div>

            <div className="invoice-items">
              <div className="items-header">
                <span>{t('description')}</span>
                <span>{t('quantity')}</span>
                <span>{t('rate')}</span>
                <span>{t('amount')}</span>
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
                      placeholder={t('item_description')}
                      {...register(`items.${index}.description`, { 
                        required: t('description_required') 
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
                        required: t('quantity_required'),
                        min: { value: 0, message: t('quantity_must_be_positive') }
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
                        required: t('rate_required'),
                        min: { value: 0, message: t('rate_must_be_positive') }
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
            <h2>{t('tax_totals')}</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>{t('vat_rate')}</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  {...register('vatRate', { 
                    required: t('vat_rate_required'),
                    min: { value: 0, message: t('vat_rate_must_be_positive') },
                    max: { value: 100, message: t('vat_rate_cannot_exceed_100') }
                  })}
                  className={errors.vatRate ? 'error' : ''}
                />
                {errors.vatRate && <span className="error-message">{errors.vatRate.message}</span>}
              </div>
            </div>

            {/* Discount Section */}
            <div className="discount-section">
              <h3>{t('discount')}</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>{t('discount_type')}</label>
                  <select {...register('discountType')}>
                    <option value="percentage">{t('percentage')}</option>
                    <option value="fixed">{t('fixed_amount')}</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>{t('discount_value')}</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    {...register('discountValue', { 
                      min: { value: 0, message: t('discount_must_be_positive') }
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
                <span>{t('subtotal')}:</span>
                <span>{formatCurrency(totals.subtotal)}</span>
              </div>
              {totals.discount > 0 && (
                <div className="total-row total-row--discount">
                  <span>
                    {t('discount_message', {
                      type: watchedDiscountType === 'percentage' ? t('percentage') : t('fixed_amount'),
                      value: watchedDiscountType === 'percentage' ? `${watchedDiscountValue}%` : formatCurrency(watchedDiscountValue)
                    })}
                  </span>
                  <span>-{formatCurrency(totals.discount)}</span>
                </div>
              )}
              <div className="total-row">
                <span>{t('vat_message', { rate: watchedVatRate })}:</span>
                <span>{formatCurrency(totals.vat)}</span>
              </div>
              <div className="total-row total-row--total">
                <span>{t('total')}:</span>
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
            <h2>{t('additional_notes')}</h2>
            <div className="form-group">
              <textarea
                placeholder={t('add_notes_or_terms')}
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
            <h2>{t('invoice_preview')}</h2>
            <div className="preview-content">
              {/* Preview content will be implemented */}
              <p>{t('preview_functionality_will_be_implemented')}</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default InvoiceCreate 