import React, { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { 
  FiSave, 
  FiBriefcase, 
  FiMapPin, 
  FiGlobe, 
  FiCreditCard,
  FiSettings,
  FiDroplet,
  FiFileText,
  FiDownload,
  FiUpload,
  FiDatabase,
  FiLock,
  FiUnlock,
  FiTrash2,
  FiRefreshCw,
  FiHash,
  FiDollarSign,
  FiCalendar,
  FiUsers,
  FiAlertTriangle,
  FiCheck
} from 'react-icons/fi'
import { useApp } from '../../contexts/AppContext'
import Button from '../../components/UI/Button/Button'
import Dropdown from '../../components/UI/Dropdown'
import PageHeader from '../../components/UI/PageHeader'
import Tabs from '../../components/UI/Tabs/Tabs'
import toast from 'react-hot-toast'
import { 
  exportData, 
  exportEncryptedData, 
  importData, 
  generateBackupFilename,
  validateImportedData 
} from '../../utils/dataExport'
import { exportInvoiceToPDFSmart } from '../../utils/pdfExport'
import { applyTheme, applyPresetTheme } from '../../utils/theme'
import './Settings.scss'

const Settings = () => {
  const { settings, dispatch, invoices, clients, generateBICFromIBAN } = useApp()
  const [activeTab, setActiveTab] = useState('company')
  const [isImporting, setIsImporting] = useState(false)
  const fileInputRef = useRef(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue
  } = useForm({
    defaultValues: {
      // Company settings
      companyName: settings.company.name,
      companyAddress: settings.company.address,
      companyCity: settings.company.city,
      companyPostalCode: settings.company.postalCode,
      companyCountry: settings.company.country,
      companyVatNumber: settings.company.vatNumber,
      companyIdNumber: settings.company.idNumber || '',
      companyManager: settings.company.manager || '',
      companyPhone: settings.company.phone || '',
      companyIban: settings.company.iban,
      companyBank: settings.company.bank || '',
      companyBankCode: settings.company.bankCode || '',
      
      // Invoice settings
      invoicePrefix: settings.invoice.prefix,
      invoiceNextNumber: settings.invoice.nextNumber,
      invoiceVatRate: settings.invoice.vatRate,
      invoiceLanguage: settings.invoice.language,
      invoiceIncludeQR: settings.invoice.includeQR,
      invoiceCurrency: settings.invoice.currency || 'EUR',
      invoicePaymentTerms: settings.invoice.paymentTerms || 30,
      invoiceAutoNumber: settings.invoice.autoNumber || false,
      invoiceShowTaxBreakdown: settings.invoice.showTaxBreakdown || false,
      
      // Theme settings
      primaryColor: settings.theme.primaryColor,
      secondaryColor: settings.theme.secondaryColor,
      successColor: settings.theme.successColor || '#10b981',
      warningColor: settings.theme.warningColor || '#f59e0b',
      errorColor: settings.theme.errorColor || '#ef4444',
      infoColor: settings.theme.infoColor || '#3b82f6'
    }
  })

  // Watch IBAN for auto-generation of BIC
  const watchedIban = watch('companyIban')
  const watchedBankCode = watch('companyBankCode')

  // Auto-generate BIC when IBAN changes and bank code is empty
  React.useEffect(() => {
    if (watchedIban && !watchedBankCode) {
      const bic = generateBICFromIBAN(watchedIban)
      if (bic) {
        setValue('companyBankCode', bic)
        toast.success('Bank code auto-generated from IBAN! 🏦')
      }
    }
  }, [watchedIban, watchedBankCode, generateBICFromIBAN, setValue])

  // Apply theme changes when theme values change
  React.useEffect(() => {
    const currentTheme = {
      primaryColor: watch('primaryColor'),
      secondaryColor: watch('secondaryColor'),
      successColor: watch('successColor'),
      warningColor: watch('warningColor'),
      errorColor: watch('errorColor'),
      infoColor: watch('infoColor')
    }
    
    // Only apply if we have at least one color value
    if (Object.values(currentTheme).some(color => color)) {
      applyTheme(currentTheme)
    }
  }, [
    watch('primaryColor'),
    watch('secondaryColor'),
    watch('successColor'),
    watch('warningColor'),
    watch('errorColor'),
    watch('infoColor')
  ])

  const onSubmit = async (data) => {
    try {
      // Auto-generate BIC from IBAN if not provided
      let bankCode = data.companyBankCode
      if (data.companyIban && !data.companyBankCode) {
        bankCode = generateBICFromIBAN(data.companyIban)
      }

      const updatedSettings = {
        company: {
          name: data.companyName,
          address: data.companyAddress,
          city: data.companyCity,
          postalCode: data.companyPostalCode,
          country: data.companyCountry,
          vatNumber: data.companyVatNumber,
          idNumber: data.companyIdNumber,
          manager: data.companyManager,
          phone: data.companyPhone,
          iban: data.companyIban,
          bank: data.companyBank,
          bankCode: bankCode,
          logo: settings.company.logo
        },
        invoice: {
          prefix: data.invoicePrefix,
          nextNumber: parseInt(data.invoiceNextNumber),
          currency: data.invoiceCurrency,
          vatRate: parseFloat(data.invoiceVatRate),
          language: data.invoiceLanguage,
          includeQR: data.invoiceIncludeQR,
          paymentTerms: parseInt(data.invoicePaymentTerms) || 30,
          autoNumber: data.invoiceAutoNumber,
          showTaxBreakdown: data.invoiceShowTaxBreakdown
        },
        theme: {
          primaryColor: data.primaryColor,
          secondaryColor: data.secondaryColor,
          successColor: data.successColor,
          warningColor: data.warningColor,
          errorColor: data.errorColor,
          infoColor: data.infoColor
        }
      }

      dispatch({ type: 'UPDATE_SETTINGS', payload: updatedSettings })
      toast.success('Settings saved successfully! 🎉')
    } catch (error) {
      toast.error('Failed to save settings')
      console.error('Save settings error:', error)
    }
  }

  // Data management functions
  const handleExportData = () => {
    const result = exportData({ invoices, clients, settings })
    if (result.success) {
      toast.success(result.message)
    } else {
      toast.error(result.message)
    }
  }

  const handleExportEncryptedData = () => {
    const result = exportEncryptedData({ invoices, clients, settings })
    if (result.success) {
      toast.success(result.message)
    } else {
      toast.error(result.message)
    }
  }

  const handleExportBackup = () => {
    const filename = generateBackupFilename()
    const result = exportData({ invoices, clients, settings }, filename)
    if (result.success) {
      toast.success('Backup created successfully!')
    } else {
      toast.error(result.message)
    }
  }

  const handleImportData = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    setIsImporting(true)
    try {
      const result = await importData(file)
      
      if (result.success) {
        // Validate the imported data
        const validation = validateImportedData(result.data)
        
        if (validation.valid) {
          // Update the app state with imported data
          if (result.data.invoices) {
            dispatch({ type: 'IMPORT_INVOICES', payload: result.data.invoices })
          }
          if (result.data.clients) {
            dispatch({ type: 'IMPORT_CLIENTS', payload: result.data.clients })
          }
          if (result.data.settings) {
            dispatch({ type: 'UPDATE_SETTINGS', payload: result.data.settings })
          }
          
          toast.success(result.message)
        } else {
          toast.error(`Import validation failed: ${validation.errors.join(', ')}`)
        }
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error('Failed to import data')
      console.error('Import error:', error)
    } finally {
      setIsImporting(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      dispatch({ type: 'CLEAR_ALL_DATA' })
      toast.success('All data cleared successfully')
    }
  }

  const handleBulkPDFExport = async () => {
    if (invoices.length === 0) {
      toast.error('No invoices to export')
      return
    }

    try {
      toast.loading('Generating PDFs...', { id: 'bulk-export' })
      
      for (let i = 0; i < invoices.length; i++) {
        const invoice = invoices[i]
        const result = await exportInvoiceToPDFSmart(invoice, settings, formatCurrency)
        if (result.success) {
          console.log(`Exported: ${result.filename}`)
        }
        
        // Update progress
        toast.loading(`Generating PDFs... (${i + 1}/${invoices.length})`, { id: 'bulk-export' })
      }
      
      toast.success(`Successfully exported ${invoices.length} invoices`, { id: 'bulk-export' })
    } catch (error) {
      toast.error('Bulk export failed', { id: 'bulk-export' })
      console.error('Bulk export error:', error)
    }
  }

  const tabs = [
    { id: 'company', label: 'Company', icon: FiBriefcase },
    { id: 'invoice', label: 'Invoice', icon: FiFileText },
    { id: 'theme', label: 'Theme', icon: FiDroplet },
    { id: 'data', label: 'Data Management', icon: FiDatabase }
  ]

  return (
    <div className="settings">
      <PageHeader
        title="Settings"
        subtitle="Configure your company information and application preferences"
        icon={<FiSettings />}
        action={
          <Button
            variant="primary"
            size="md"
            onClick={handleSubmit(onSubmit)}
            loading={isSubmitting}
          >
            <FiSave />
            Save Settings
          </Button>
        }
      />

      <div className="settings__content">
        {/* Tabs */}
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          variant="default"
          className="settings__tabs"
        />

        {/* Tab Content */}
        <div className="settings__tab-content">
          {activeTab === 'company' && (
            <motion.div
              className="tab-panel"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h2>Company Information</h2>
              <p>Configure your company details that will appear on invoices</p>

              <div className="form-section">
                <div className="form-grid">
                  <div className="form-group">
                    <label>
                      <FiBriefcase />
                      Company Name *
                    </label>
                    <input
                      type="text"
                      {...register('companyName', { required: 'Company name is required' })}
                      className={errors.companyName ? 'error' : ''}
                      placeholder="Enter company name"
                    />
                    {errors.companyName && <span className="error-message">{errors.companyName.message}</span>}
                  </div>

                  <div className="form-group">
                    <label>
                      <FiGlobe />
                      Country *
                    </label>
                    <Dropdown
                      options={[
                        { value: '', label: 'Select country' },
                        { value: 'Bulgaria', label: 'Bulgaria' },
                        { value: 'Germany', label: 'Germany' },
                        { value: 'France', label: 'France' },
                        { value: 'Italy', label: 'Italy' },
                        { value: 'Spain', label: 'Spain' },
                        { value: 'Netherlands', label: 'Netherlands' },
                        { value: 'Belgium', label: 'Belgium' },
                        { value: 'Austria', label: 'Austria' },
                        { value: 'Switzerland', label: 'Switzerland' },
                        { value: 'United Kingdom', label: 'United Kingdom' }
                      ]}
                      value={watch('companyCountry')}
                      onChange={(value) => setValue('companyCountry', value)}
                      placeholder="Select country"
                      error={errors.companyCountry?.message}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>
                    <FiMapPin />
                    Address
                  </label>
                  <input
                    type="text"
                    {...register('companyAddress')}
                    placeholder="Enter company address"
                  />
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      {...register('companyCity')}
                      placeholder="Enter city"
                    />
                  </div>

                  <div className="form-group">
                    <label>Postal Code</label>
                    <input
                      type="text"
                      {...register('companyPostalCode')}
                      placeholder="Enter postal code"
                    />
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>ДДС номер (VAT Number)</label>
                    <input
                      type="text"
                      {...register('companyVatNumber')}
                      placeholder="e.g., BG123456789"
                    />
                  </div>

                  <div className="form-group">
                    <label>ЕИК (ID Number)</label>
                    <input
                      type="text"
                      {...register('companyIdNumber')}
                      placeholder="Enter company ID number (without BG prefix)"
                    />
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>МОЛ (Manager)</label>
                    <input
                      type="text"
                      {...register('companyManager')}
                      placeholder="Enter manager name"
                    />
                  </div>

                  <div className="form-group">
                    <label>Телефон (Phone)</label>
                    <input
                      type="text"
                      {...register('companyPhone')}
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>
                      <FiCreditCard />
                      IBAN
                    </label>
                    <input
                      type="text"
                      {...register('companyIban')}
                      placeholder="Enter IBAN"
                    />
                  </div>

                  <div className="form-group">
                    <label>Банка (Bank)</label>
                    <input
                      type="text"
                      {...register('companyBank')}
                      placeholder="e.g., Банка ДСК"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Банков код (Bank Code)</label>
                  <input
                    type="text"
                    {...register('companyBankCode')}
                    placeholder="e.g., STSABGSF (auto-generated from IBAN)"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'invoice' && (
            <motion.div
              className="tab-panel"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h2>Invoice Settings</h2>
              <p>Configure default invoice settings and preferences</p>

              <div className="form-section">
                <h3>Invoice Numbering</h3>
                <p>Set up how your invoices are numbered and formatted</p>
                
                <div className="form-grid">
                  <div className="form-group">
                    <label>
                      <FiHash />
                      Invoice Prefix
                    </label>
                    <input
                      type="text"
                      {...register('invoicePrefix')}
                      placeholder="e.g., INV"
                      maxLength={10}
                    />
                    <small>Prefix for invoice numbers (e.g., INV-2024-001)</small>
                  </div>

                  <div className="form-group">
                    <label>
                      <FiHash />
                      Next Invoice Number
                    </label>
                    <input
                      type="number"
                      min="1"
                      {...register('invoiceNextNumber', { 
                        required: 'Next number is required',
                        min: { value: 1, message: 'Number must be positive' }
                      })}
                      className={errors.invoiceNextNumber ? 'error' : ''}
                      placeholder="1"
                    />
                    {errors.invoiceNextNumber && <span className="error-message">{errors.invoiceNextNumber.message}</span>}
                    <small>Next sequential number to use</small>
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>
                      <FiDollarSign />
                      Default VAT Rate (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      {...register('invoiceVatRate', { 
                        required: 'VAT rate is required',
                        min: { value: 0, message: 'VAT rate must be positive' },
                        max: { value: 100, message: 'VAT rate cannot exceed 100%' }
                      })}
                      className={errors.invoiceVatRate ? 'error' : ''}
                      placeholder="20"
                    />
                    {errors.invoiceVatRate && <span className="error-message">{errors.invoiceVatRate.message}</span>}
                    <small>Default VAT rate applied to new invoices</small>
                  </div>

                  <div className="form-group">
                    <label>
                      <FiGlobe />
                      Invoice Language
                    </label>
                    <Dropdown
                      options={[
                        { value: 'en', label: 'English' },
                        { value: 'bg', label: 'Български' }
                      ]}
                      value={watch('invoiceLanguage')}
                      onChange={(value) => setValue('invoiceLanguage', value)}
                      placeholder="Select language..."
                    />
                    <small>Language used for invoice templates</small>
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>
                      <FiCreditCard />
                      Currency
                    </label>
                    <Dropdown
                      options={[
                        { value: 'EUR', label: 'Euro (€)' },
                        { value: 'USD', label: 'US Dollar ($)' },
                        { value: 'BGN', label: 'Bulgarian Lev (лв)' },
                        { value: 'GBP', label: 'British Pound (£)' }
                      ]}
                      value={watch('invoiceCurrency') || 'EUR'}
                      onChange={(value) => setValue('invoiceCurrency', value)}
                      placeholder="Select currency..."
                    />
                    <small>Default currency for invoices</small>
                  </div>

                  <div className="form-group">
                    <label>
                      <FiCalendar />
                      Payment Terms (Days)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="365"
                      {...register('invoicePaymentTerms', { 
                        min: { value: 1, message: 'Must be at least 1 day' },
                        max: { value: 365, message: 'Cannot exceed 365 days' }
                      })}
                      placeholder="30"
                    />
                    <small>Default payment terms in days</small>
                  </div>
                </div>

                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      {...register('invoiceIncludeQR')}
                    />
                    <span>Include QR code for payment</span>
                    <small>Add QR codes to invoices for easy payment</small>
                  </label>
                </div>

                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      {...register('invoiceAutoNumber')}
                    />
                    <span>Auto-increment invoice numbers</span>
                    <small>Automatically increment the next invoice number after saving</small>
                  </label>
                </div>

                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      {...register('invoiceShowTaxBreakdown')}
                    />
                    <span>Show detailed tax breakdown</span>
                    <small>Display individual tax components on invoices</small>
                  </label>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'theme' && (
            <motion.div
              className="tab-panel"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h2>Theme Settings</h2>
              <p>Customize the appearance of your application</p>

              <div className="form-section">
                <h3>Color Scheme</h3>
                <p>Choose colors that represent your brand</p>
                
                <div className="form-grid">
                  <div className="form-group">
                    <label>
                      <FiDroplet />
                      Primary Color
                    </label>
                    <div className="color-input">
                      <input
                        type="color"
                        {...register('primaryColor')}
                        className="color-picker"
                      />
                      <input
                        type="text"
                        {...register('primaryColor')}
                        placeholder="#98C93C"
                        className="color-text"
                        pattern="^#[0-9A-Fa-f]{6}$"
                      />
                    </div>
                    <small>Main brand color used throughout the app</small>
                  </div>

                  <div className="form-group">
                    <label>
                      <FiDroplet />
                      Secondary Color
                    </label>
                    <div className="color-input">
                      <input
                        type="color"
                        {...register('secondaryColor')}
                        className="color-picker"
                      />
                      <input
                        type="text"
                        {...register('secondaryColor')}
                        placeholder="#2A9245"
                        className="color-text"
                        pattern="^#[0-9A-Fa-f]{6}$"
                      />
                    </div>
                    <small>Accent color for highlights and secondary elements</small>
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>
                      <FiDroplet />
                      Success Color
                    </label>
                    <div className="color-input">
                      <input
                        type="color"
                        {...register('successColor')}
                        className="color-picker"
                      />
                      <input
                        type="text"
                        {...register('successColor')}
                        placeholder="#10b981"
                        className="color-text"
                        pattern="^#[0-9A-Fa-f]{6}$"
                      />
                    </div>
                    <small>Color for success states and positive actions</small>
                  </div>

                  <div className="form-group">
                    <label>
                      <FiDroplet />
                      Warning Color
                    </label>
                    <div className="color-input">
                      <input
                        type="color"
                        {...register('warningColor')}
                        className="color-picker"
                      />
                      <input
                        type="text"
                        {...register('warningColor')}
                        placeholder="#f59e0b"
                        className="color-text"
                        pattern="^#[0-9A-Fa-f]{6}$"
                      />
                    </div>
                    <small>Color for warnings and caution states</small>
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>
                      <FiDroplet />
                      Error Color
                    </label>
                    <div className="color-input">
                      <input
                        type="color"
                        {...register('errorColor')}
                        className="color-picker"
                      />
                      <input
                        type="text"
                        {...register('errorColor')}
                        placeholder="#ef4444"
                        className="color-text"
                        pattern="^#[0-9A-Fa-f]{6}$"
                      />
                    </div>
                    <small>Color for errors and destructive actions</small>
                  </div>

                  <div className="form-group">
                    <label>
                      <FiDroplet />
                      Info Color
                    </label>
                    <div className="color-input">
                      <input
                        type="color"
                        {...register('infoColor')}
                        className="color-picker"
                      />
                      <input
                        type="text"
                        {...register('infoColor')}
                        placeholder="#3b82f6"
                        className="color-text"
                        pattern="^#[0-9A-Fa-f]{6}$"
                      />
                    </div>
                    <small>Color for informational messages and links</small>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Theme Preview</h3>
                <p>See how your color choices look in the interface</p>
                
                <div className="theme-preview">
                  <div className="preview-section">
                    <h4>Buttons</h4>
                    <div className="preview-buttons">
                      <Button variant="primary">Primary Button</Button>
                      <Button variant="secondary">Secondary Button</Button>
                      <Button variant="outline">Outline Button</Button>
                      <Button variant="ghost">Ghost Button</Button>
                    </div>
                  </div>
                  
                  <div className="preview-section">
                    <h4>Status Indicators</h4>
                    <div className="preview-status">
                      <span className="status-badge status--success">Success</span>
                      <span className="status-badge status--warning">Warning</span>
                      <span className="status-badge status--error">Error</span>
                      <span className="status-badge status--info">Info</span>
                    </div>
                  </div>
                  
                  <div className="preview-section">
                    <h4>Form Elements</h4>
                    <div className="preview-form">
                      <input type="text" placeholder="Sample input field" />
                      <Button variant="primary" size="sm">Submit</Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Preset Themes</h3>
                <p>Quick apply predefined color schemes</p>
                
                <div className="theme-presets">
                  <div className="theme-preset-grid">
                    <div className="theme-preset-card" onClick={() => {
                      const theme = applyPresetTheme('modernGreen')
                      if (theme) {
                        setValue('primaryColor', theme.primaryColor)
                        setValue('secondaryColor', theme.secondaryColor)
                        setValue('successColor', theme.successColor)
                        setValue('warningColor', theme.warningColor)
                        setValue('errorColor', theme.errorColor)
                        setValue('infoColor', theme.infoColor)
                        toast.success('Modern Green theme applied! 🎨')
                      }
                    }}>
                      <div className="theme-preview">
                        <div className="color-swatch primary" style={{ backgroundColor: '#10b981' }}></div>
                        <div className="color-swatch secondary" style={{ backgroundColor: '#059669' }}></div>
                        <div className="color-swatch accent" style={{ backgroundColor: '#3b82f6' }}></div>
                      </div>
                      <div className="theme-info">
                        <h4>Modern Green</h4>
                        <p>Clean and professional</p>
                      </div>
                    </div>
                    
                    <div className="theme-preset-card" onClick={() => {
                      const theme = applyPresetTheme('professionalBlue')
                      if (theme) {
                        setValue('primaryColor', theme.primaryColor)
                        setValue('secondaryColor', theme.secondaryColor)
                        setValue('successColor', theme.successColor)
                        setValue('warningColor', theme.warningColor)
                        setValue('errorColor', theme.errorColor)
                        setValue('infoColor', theme.infoColor)
                        toast.success('Professional Blue theme applied! 🎨')
                      }
                    }}>
                      <div className="theme-preview">
                        <div className="color-swatch primary" style={{ backgroundColor: '#3b82f6' }}></div>
                        <div className="color-swatch secondary" style={{ backgroundColor: '#1d4ed8' }}></div>
                        <div className="color-swatch accent" style={{ backgroundColor: '#6366f1' }}></div>
                      </div>
                      <div className="theme-info">
                        <h4>Professional Blue</h4>
                        <p>Trustworthy and corporate</p>
                      </div>
                    </div>
                    
                    <div className="theme-preset-card" onClick={() => {
                      const theme = applyPresetTheme('elegantPurple')
                      if (theme) {
                        setValue('primaryColor', theme.primaryColor)
                        setValue('secondaryColor', theme.secondaryColor)
                        setValue('successColor', theme.successColor)
                        setValue('warningColor', theme.warningColor)
                        setValue('errorColor', theme.errorColor)
                        setValue('infoColor', theme.infoColor)
                        toast.success('Elegant Purple theme applied! 🎨')
                      }
                    }}>
                      <div className="theme-preview">
                        <div className="color-swatch primary" style={{ backgroundColor: '#8b5cf6' }}></div>
                        <div className="color-swatch secondary" style={{ backgroundColor: '#7c3aed' }}></div>
                        <div className="color-swatch accent" style={{ backgroundColor: '#3b82f6' }}></div>
                      </div>
                      <div className="theme-info">
                        <h4>Elegant Purple</h4>
                        <p>Creative and sophisticated</p>
                      </div>
                    </div>
                    
                    <div className="theme-preset-card" onClick={() => {
                      const theme = applyPresetTheme('corporateGray')
                      if (theme) {
                        setValue('primaryColor', theme.primaryColor)
                        setValue('secondaryColor', theme.secondaryColor)
                        setValue('successColor', theme.successColor)
                        setValue('warningColor', theme.warningColor)
                        setValue('errorColor', theme.errorColor)
                        setValue('infoColor', theme.infoColor)
                        toast.success('Corporate Gray theme applied! 🎨')
                      }
                    }}>
                      <div className="theme-preview">
                        <div className="color-swatch primary" style={{ backgroundColor: '#6b7280' }}></div>
                        <div className="color-swatch secondary" style={{ backgroundColor: '#4b5563' }}></div>
                        <div className="color-swatch accent" style={{ backgroundColor: '#3b82f6' }}></div>
                      </div>
                      <div className="theme-info">
                        <h4>Corporate Gray</h4>
                        <p>Neutral and balanced</p>
                      </div>
                    </div>
                    
                    <div className="theme-preset-card" onClick={() => {
                      const theme = applyPresetTheme('vibrantTeal')
                      if (theme) {
                        setValue('primaryColor', theme.primaryColor)
                        setValue('secondaryColor', theme.secondaryColor)
                        setValue('successColor', theme.successColor)
                        setValue('warningColor', theme.warningColor)
                        setValue('errorColor', theme.errorColor)
                        setValue('infoColor', theme.infoColor)
                        toast.success('Vibrant Teal theme applied! 🎨')
                      }
                    }}>
                      <div className="theme-preview">
                        <div className="color-swatch primary" style={{ backgroundColor: '#14b8a6' }}></div>
                        <div className="color-swatch secondary" style={{ backgroundColor: '#0d9488' }}></div>
                        <div className="color-swatch accent" style={{ backgroundColor: '#3b82f6' }}></div>
                      </div>
                      <div className="theme-info">
                        <h4>Vibrant Teal</h4>
                        <p>Modern and energetic</p>
                      </div>
                    </div>
                    
                    <div className="theme-preset-card" onClick={() => {
                      const theme = applyPresetTheme('warmAmber')
                      if (theme) {
                        setValue('primaryColor', theme.primaryColor)
                        setValue('secondaryColor', theme.secondaryColor)
                        setValue('successColor', theme.successColor)
                        setValue('warningColor', theme.warningColor)
                        setValue('errorColor', theme.errorColor)
                        setValue('infoColor', theme.infoColor)
                        toast.success('Warm Amber theme applied! 🎨')
                      }
                    }}>
                      <div className="theme-preview">
                        <div className="color-swatch primary" style={{ backgroundColor: '#f59e0b' }}></div>
                        <div className="color-swatch secondary" style={{ backgroundColor: '#d97706' }}></div>
                        <div className="color-swatch accent" style={{ backgroundColor: '#3b82f6' }}></div>
                      </div>
                      <div className="theme-info">
                        <h4>Warm Amber</h4>
                        <p>Friendly and approachable</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'data' && (
            <motion.div
              className="tab-panel"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h2>Data Management</h2>
              <p>Export, import, and manage your application data</p>

              <div className="form-section">
                <h3>Data Overview</h3>
                <p>Current data statistics and storage information</p>
                
                <div className="data-overview">
                  <div className="data-stats-grid">
                    <div className="stat-card">
                      <div className="stat-icon">
                        <FiFileText />
                      </div>
                      <div className="stat-content">
                        <span className="stat-value">{invoices.length}</span>
                        <span className="stat-label">Total Invoices</span>
                      </div>
                    </div>
                    
                    <div className="stat-card">
                      <div className="stat-icon">
                        <FiUsers />
                      </div>
                      <div className="stat-content">
                        <span className="stat-value">{clients.length}</span>
                        <span className="stat-label">Active Clients</span>
                      </div>
                    </div>
                    
                    <div className="stat-card">
                      <div className="stat-icon">
                        <FiDatabase />
                      </div>
                      <div className="stat-content">
                        <span className="stat-value">
                          {Math.round((JSON.stringify({ invoices, clients, settings }).length / 1024) * 100) / 100}
                        </span>
                        <span className="stat-label">Data Size (KB)</span>
                      </div>
                    </div>
                    
                    <div className="stat-card">
                      <div className="stat-icon">
                        <FiCalendar />
                      </div>
                      <div className="stat-content">
                        <span className="stat-value">
                          {invoices.length > 0 ? new Date(invoices[0].createdAt).toLocaleDateString() : 'N/A'}
                        </span>
                        <span className="stat-label">Last Activity</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Export Data</h3>
                <p>Download your data for backup or transfer purposes</p>
                
                <div className="export-options">
                  <div className="export-card">
                    <div className="export-header">
                      <FiDownload />
                      <h4>Export All Data</h4>
                    </div>
                    <p>Complete backup including invoices, clients, and settings</p>
                    <Button variant="outline" onClick={handleExportData} fullWidth>
                      Export JSON
                    </Button>
                  </div>
                  
                  <div className="export-card">
                    <div className="export-header">
                      <FiLock />
                      <h4>Encrypted Export</h4>
                    </div>
                    <p>Password-protected backup for enhanced security</p>
                    <Button variant="outline" onClick={handleExportEncryptedData} fullWidth>
                      Export Encrypted
                    </Button>
                  </div>
                  
                  <div className="export-card">
                    <div className="export-header">
                      <FiDatabase />
                      <h4>Create Backup</h4>
                    </div>
                    <p>Timestamped backup with automatic naming</p>
                    <Button variant="outline" onClick={handleExportBackup} fullWidth>
                      Create Backup
                    </Button>
                  </div>
                  
                  <div className="export-card">
                    <div className="export-header">
                      <FiFileText />
                      <h4>Export All PDFs</h4>
                    </div>
                    <p>Generate PDF versions of all invoices</p>
                    <Button variant="outline" onClick={handleBulkPDFExport} fullWidth>
                      Export PDFs
                    </Button>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Import Data</h3>
                <p>Import data from a previously exported file</p>
                
                <div className="import-section">
                  <div className="import-card">
                    <div className="import-header">
                      <FiUpload />
                      <h4>Import from File</h4>
                    </div>
                    <p>Restore data from a backup or transfer from another installation</p>
                    
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".json"
                      onChange={handleImportData}
                      style={{ display: 'none' }}
                    />
                    
                    <Button 
                      variant="outline" 
                      onClick={() => fileInputRef.current?.click()}
                      loading={isImporting}
                      fullWidth
                    >
                      <FiUpload />
                      {isImporting ? 'Importing...' : 'Choose File'}
                    </Button>
                    
                    <div className="import-info">
                      <h5>Supported Formats:</h5>
                      <ul>
                        <li>JSON files exported from this application</li>
                        <li>Encrypted JSON files with password</li>
                        <li>Backup files with timestamp</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Data Maintenance</h3>
                <p>Keep your data organized and optimized</p>
                
                <div className="maintenance-actions">
                  <div className="maintenance-card">
                    <div className="maintenance-header">
                      <FiRefreshCw />
                      <h4>Data Validation</h4>
                    </div>
                    <p>Check data integrity and fix any inconsistencies</p>
                    <Button variant="outline" fullWidth>
                      Validate Data
                    </Button>
                  </div>
                  
                  <div className="maintenance-card">
                    <div className="maintenance-header">
                      <FiTrash2 />
                      <h4>Cleanup</h4>
                    </div>
                    <p>Remove duplicate entries and orphaned data</p>
                    <Button variant="outline" fullWidth>
                      Clean Data
                    </Button>
                  </div>
                </div>
              </div>

              <div className="form-section danger-zone">
                <h3>
                  <FiAlertTriangle />
                  Danger Zone
                </h3>
                <p>Irreversible actions - use with extreme caution</p>
                
                <div className="danger-actions">
                  <div className="danger-card">
                    <div className="danger-header">
                      <FiTrash2 />
                      <h4>Clear All Data</h4>
                    </div>
                    <p>Permanently delete all invoices, clients, and settings. This action cannot be undone.</p>
                    
                    <div className="danger-confirmation">
                      <label className="checkbox-label">
                        <input type="checkbox" id="confirm-delete" />
                        <span>I understand this will permanently delete all data</span>
                      </label>
                      
                      <Button 
                        variant="danger" 
                        onClick={handleClearData}
                        disabled={!document.getElementById('confirm-delete')?.checked}
                        fullWidth
                      >
                        <FiTrash2 />
                        Clear All Data
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Settings 