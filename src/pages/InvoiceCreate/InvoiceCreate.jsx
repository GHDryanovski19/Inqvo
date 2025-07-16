import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
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
  FiDollarSign,
  FiArrowLeft,
  FiCheck,
  FiX,
  FiEdit3,
  FiCopy
} from 'react-icons/fi'
import { useApp } from '../../contexts/AppContext'
import { 
  pageTransition, 
  slideDown, 
  containerVariants, 
  itemVariants,
  fadeIn,
  slideUp
} from '../../utils/animations'
import Button from '../../components/UI/Button/Button'
import Dropdown from '../../components/UI/Dropdown'
import toast from 'react-hot-toast'
import './InvoiceCreate.scss'

const InvoiceCreate = () => {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const { 
    clients, 
    settings, 
    generateInvoiceNumber, 
    formatCurrency, 
    calculateInvoiceTotals,
    translateCity,
    dispatch 
  } = useApp()

  const [selectedClient, setSelectedClient] = useState(null)
  const [showPreview, setShowPreview] = useState(false)
  const [activeStep, setActiveStep] = useState(1)
  const [isSaving, setIsSaving] = useState(false)

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
    setIsSaving(true)
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
    } finally {
      setIsSaving(false)
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

  const duplicateItem = (index) => {
    const item = watchedItems[index]
    append({
      id: uuidv4(),
      description: item.description,
      quantity: item.quantity,
      rate: item.rate,
      unit: item.unit
    })
  }

  const steps = [
    { id: 1, title: t('invoice.create.basicInfo'), icon: FiEdit3 },
    { id: 2, title: t('invoice.create.clientInfo'), icon: FiUser },
    { id: 3, title: t('invoice.create.items'), icon: FiDollarSign },
    { id: 4, title: t('invoice.create.totals'), icon: FiCheck }
  ]

  return (
    <motion.div 
      className="invoice-create"
      {...pageTransition}
    >
      {/* Header */}
      <motion.div 
        className="invoice-create__header"
        {...slideDown}
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
            <h1>Create New Invoice</h1>
            <p>Quick and easy invoice creation</p>
          </div>
        </div>
        
        <div className="header-actions">
          <Button
            variant="outline"
            onClick={() => setShowPreview(!showPreview)}
            className="preview-btn"
          >
            <FiEye />
            <span>{showPreview ? 'Hide Preview' : 'Preview'}</span>
          </Button>
          
          <Button
            variant="primary"
            onClick={handleSubmit(onSubmit)}
            loading={isSaving}
            className="save-btn"
          >
            <FiSave />
            <span>Save Invoice</span>
          </Button>
        </div>
      </motion.div>

      {/* Progress Steps */}
      <motion.div 
        className="progress-steps"
        {...fadeIn}
      >
        {steps.map((step, index) => (
          <div 
            key={step.id} 
            className={`step ${activeStep >= step.id ? 'active' : ''} ${activeStep > step.id ? 'completed' : ''}`}
            onClick={() => setActiveStep(step.id)}
          >
            <div className="step-icon">
              {activeStep > step.id ? <FiCheck /> : <step.icon />}
            </div>
            <span className="step-title">{step.title}</span>
          </div>
        ))}
      </motion.div>

      <div className="invoice-create__content">
        <div className="invoice-create__form">
          {/* Step 1: Basic Information */}
          <AnimatePresence mode="wait">
            {activeStep === 1 && (
              <motion.div
                key="step1"
                className="form-step"
                {...slideUp}
              >
                <div className="step-header">
                  <h2>{t('invoice.create.basicInfo')}</h2>
                  <p>{t('invoice.create.invoiceDetails')}</p>
                </div>
                
                <div className="form-grid">
                  <div className="form-group">
                    <label>{t('invoice.form.invoiceNumber')}</label>
                    <input
                      type="text"
                      {...register('number', { required: 'Invoice number is required' })}
                      className={errors.number ? 'error' : ''}
                      placeholder="INV-2024-001"
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
                    <label>{t('invoice.form.status')}</label>
                    <Dropdown
                      options={[
                        { value: 'draft', label: t('invoice.status.draft') },
                        { value: 'sent', label: t('invoice.status.sent') },
                        { value: 'paid', label: t('invoice.status.paid') },
                        { value: 'overdue', label: t('invoice.status.overdue') }
                      ]}
                      value={watch('status')}
                      onChange={(value) => setValue('status', value)}
                      placeholder={t('invoice.form.statusPlaceholder')}
                    />
                  </div>
                </div>
                
                <div className="step-actions">
                  <Button 
                    variant="primary" 
                    onClick={() => setActiveStep(2)}
                    disabled={!watch('number') || !watch('issueDate') || !watch('dueDate')}
                  >
                    Next: Select Client
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Client Selection */}
            {activeStep === 2 && (
              <motion.div
                key="step2"
                className="form-step"
                {...slideUp}
              >
                <div className="step-header">
                  <h2>{t('invoice.create.clientSelection')}</h2>
                  <p>{t('invoice.create.clientInfo')}</p>
                </div>
                
                <div className="client-selection">
                  <div className="form-group">
                    <label>{t('invoice.form.selectClient')}</label>
                    <Dropdown
                      options={[
                        { value: '', label: t('invoice.form.selectClientPlaceholder') },
                        ...clients.map(client => ({
                          value: client.id,
                          label: `${client.name} - ${client.email}`
                        }))
                      ]}
                      value={selectedClient?.id || ''}
                      onChange={handleClientSelect}
                      placeholder={t('invoice.form.selectClientPlaceholder')}
                    />
                  </div>
                  
                  {selectedClient && (
                    <motion.div 
                      className="selected-client-card"
                      {...fadeIn}
                    >
                      <div className="client-info">
                        <h3>{selectedClient.name}</h3>
                        <p className="client-email">{selectedClient.email}</p>
                        {selectedClient.company && <p className="client-company">{selectedClient.company}</p>}
                        {selectedClient.address && <p className="client-address">{selectedClient.address}</p>}
                        {selectedClient.vatNumber && <p className="client-vat">VAT: {selectedClient.vatNumber}</p>}
                      </div>
                    </motion.div>
                  )}
                </div>
                
                <div className="step-actions">
                  <Button variant="outline" onClick={() => setActiveStep(1)}>
                    Back
                  </Button>
                  <Button 
                    variant="primary" 
                    onClick={() => setActiveStep(3)}
                    disabled={!selectedClient}
                  >
                    Next: Add Items
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Invoice Items */}
            {activeStep === 3 && (
              <motion.div
                key="step3"
                className="form-step"
                {...slideUp}
              >
                <div className="step-header">
                  <h2>{t('invoice.create.invoiceItems')}</h2>
                  <p>{t('invoice.create.items')}</p>
                </div>
                
                <div className="items-section">
                  <div className="items-header">
                    <Button variant="outline" onClick={addItem} className="add-item-btn">
                      <FiPlus />
                      Add Item
                    </Button>
                  </div>
                  
                  <motion.div 
                    className="items-list"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <AnimatePresence>
                      {fields.map((field, index) => (
                        <motion.div
                          key={field.id}
                          className="item-row"
                          variants={itemVariants}
                          exit="exit"
                        >
                          <div className="item-description">
                            <input
                              {...register(`items.${index}.description`)}
                              placeholder="Item description"
                              className="item-input"
                            />
                          </div>
                          
                          <div className="item-quantity">
                            <input
                              type="number"
                              {...register(`items.${index}.quantity`)}
                              placeholder="Qty"
                              className="item-input"
                            />
                          </div>
                          
                          <div className="item-rate">
                            <input
                              type="number"
                              step="0.01"
                              {...register(`items.${index}.rate`)}
                              placeholder="Rate"
                              className="item-input"
                            />
                          </div>
                          
                          <div className="item-unit">
                            <Dropdown
                              options={[
                                { value: 'hour', label: t('common.hours') },
                                { value: 'day', label: t('common.days') },
                                { value: 'week', label: t('common.weeks') },
                                { value: 'month', label: t('common.months') },
                                { value: 'piece', label: t('common.pieces') },
                                { value: 'service', label: t('common.services') }
                              ]}
                              value={watch(`items.${index}.unit`)}
                              onChange={(value) => setValue(`items.${index}.unit`, value)}
                              placeholder={t('invoice.form.itemUnitPlaceholder')}
                              size="sm"
                            />
                          </div>
                          
                          <div className="item-total">
                            {formatCurrency((watchedItems[index]?.quantity || 0) * (watchedItems[index]?.rate || 0))}
                          </div>
                          
                          <div className="item-actions">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => duplicateItem(index)}
                              title="Duplicate"
                            >
                              <FiCopy />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem(index)}
                              disabled={fields.length === 1}
                              title="Remove"
                            >
                              <FiTrash2 />
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>
                </div>
                
                <div className="step-actions">
                  <Button variant="outline" onClick={() => setActiveStep(2)}>
                    Back
                  </Button>
                  <Button 
                    variant="primary" 
                    onClick={() => setActiveStep(4)}
                    disabled={!watchedItems.some(item => item.description && item.rate > 0)}
                  >
                    Next: Review & Save
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Review & Save */}
            {activeStep === 4 && (
              <motion.div
                key="step4"
                className="form-step"
                {...slideUp}
              >
                <div className="step-header">
                  <h2>{t('invoice.create.totalsSection')}</h2>
                  <p>{t('invoice.create.totals')}</p>
                </div>
                
                <div className="review-section">
                  <div className="review-summary">
                    <div className="summary-item">
                      <span className="label">Invoice Number:</span>
                      <span className="value">{watch('number')}</span>
                    </div>
                    <div className="summary-item">
                      <span className="label">Client:</span>
                      <span className="value">{selectedClient?.name}</span>
                    </div>
                    <div className="summary-item">
                      <span className="label">Items:</span>
                      <span className="value">{watchedItems.filter(item => item.description).length} items</span>
                    </div>
                    <div className="summary-item">
                      <span className="label">Total:</span>
                      <span className="value total">{formatCurrency(totals.total)}</span>
                    </div>
                  </div>
                  
                  {/* Bulgarian Legal Fields */}
                  <div className="legal-fields">
                    <h3>{t('invoice.form.legalInfo')}</h3>
                    <div className="form-grid">
                      <div className="form-group">
                        <label>{t('invoice.form.transactionBasis')}</label>
                        <input
                          type="text"
                          {...register('transactionBasis')}
                          placeholder={t('invoice.form.transactionBasisPlaceholder')}
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>{t('invoice.form.transactionDescription')}</label>
                        <input
                          type="text"
                          {...register('transactionDescription')}
                          placeholder={t('invoice.form.transactionDescriptionPlaceholder')}
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>{t('invoice.form.transactionPlace')}</label>
                        <input
                          type="text"
                          {...register('transactionPlace')}
                          placeholder={translateCity(settings.company.city, i18n.language)}
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>{t('invoice.form.paymentMethod')}</label>
                        <Dropdown
                          options={[
                            { value: 'bank_transfer', label: t('common.paymentMethods.bankTransfer') },
                            { value: 'cash', label: t('common.paymentMethods.cash') },
                            { value: 'card', label: t('common.paymentMethods.card') },
                            { value: 'check', label: t('common.paymentMethods.check') }
                          ]}
                          value={watch('paymentMethod')}
                          onChange={(value) => setValue('paymentMethod', value)}
                          placeholder={t('invoice.form.paymentMethodPlaceholder')}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>{t('invoice.form.notes')} ({t('common.optional')})</label>
                    <textarea
                      {...register('notes')}
                      placeholder={t('invoice.form.notesPlaceholder')}
                      rows={3}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>{t('invoice.form.terms')} ({t('common.optional')})</label>
                    <textarea
                      {...register('terms')}
                      placeholder={t('invoice.form.termsPlaceholder')}
                      rows={3}
                    />
                  </div>
                </div>
                
                <div className="step-actions">
                  <Button variant="outline" onClick={() => setActiveStep(3)}>
                    Back
                  </Button>
                  <Button 
                    variant="primary" 
                    onClick={handleSubmit(onSubmit)}
                    loading={isSaving}
                  >
                    <FiSave />
                    Save Invoice
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Preview Panel */}
        {showPreview && (
          <motion.div 
            className="invoice-create__preview"
            {...slideUp}
          >
            <div className="preview-header">
              <h3>Invoice Preview</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPreview(false)}
              >
                <FiX />
              </Button>
            </div>
            
            <div className="preview-content">
              <div className="preview-invoice">
                <div className="preview-header-section">
                  <div className="preview-company">
                    <h2>{settings.company.name}</h2>
                    <p>{settings.company.address}</p>
                  </div>
                  <div className="preview-invoice-info">
                    <h1>INVOICE</h1>
                    <p>{watch('number')}</p>
                  </div>
                </div>
                
                <div className="preview-client">
                  <h3>Bill To:</h3>
                  {selectedClient && (
                    <div>
                      <h4>{selectedClient.name}</h4>
                      <p>{selectedClient.email}</p>
                      {selectedClient.address && <p>{selectedClient.address}</p>}
                    </div>
                  )}
                </div>
                
                <div className="preview-items">
                  {watchedItems.filter(item => item.description).map((item, index) => (
                    <div key={index} className="preview-item">
                      <span>{item.description}</span>
                      <span>{item.quantity} x {formatCurrency(item.rate)}</span>
                      <span>{formatCurrency(item.quantity * item.rate)}</span>
                    </div>
                  ))}
                </div>
                
                <div className="preview-totals">
                  <div className="total-row">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(totals.subtotal)}</span>
                  </div>
                  {totals.discount > 0 && (
                    <div className="total-row discount">
                      <span>Discount:</span>
                      <span>-{formatCurrency(totals.discount)}</span>
                    </div>
                  )}
                  <div className="total-row">
                    <span>VAT ({totals.vatRate}%):</span>
                    <span>{formatCurrency(totals.vat)}</span>
                  </div>
                  <div className="total-row grand-total">
                    <span>Total:</span>
                    <span>{formatCurrency(totals.total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default InvoiceCreate 