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
  FiRefreshCw
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
import { exportInvoiceToPDF } from '../../utils/pdfExport'
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
      
      // Theme settings
      primaryColor: settings.theme.primaryColor,
      secondaryColor: settings.theme.secondaryColor
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
          currency: 'EUR',
          vatRate: parseFloat(data.invoiceVatRate),
          language: data.invoiceLanguage,
          includeQR: data.invoiceIncludeQR
        },
        theme: {
          primaryColor: data.primaryColor,
          secondaryColor: data.secondaryColor
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
        const result = await exportInvoiceToPDF(invoice, settings, formatCurrency)
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
                <div className="form-grid">
                  <div className="form-group">
                    <label>Invoice Prefix</label>
                    <input
                      type="text"
                      {...register('invoicePrefix')}
                      placeholder="e.g., INV"
                    />
                  </div>

                  <div className="form-group">
                    <label>Next Invoice Number</label>
                    <input
                      type="number"
                      min="1"
                      {...register('invoiceNextNumber', { 
                        required: 'Next number is required',
                        min: { value: 1, message: 'Number must be positive' }
                      })}
                      className={errors.invoiceNextNumber ? 'error' : ''}
                    />
                    {errors.invoiceNextNumber && <span className="error-message">{errors.invoiceNextNumber.message}</span>}
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>Default VAT Rate (%)</label>
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
                    />
                    {errors.invoiceVatRate && <span className="error-message">{errors.invoiceVatRate.message}</span>}
                  </div>

                  <div className="form-group">
                    <label>Language</label>
                    <Dropdown
                      options={[
                        { value: 'en', label: 'English' },
                        { value: 'bg', label: 'Български' }
                      ]}
                      value={watch('invoiceLanguage')}
                      onChange={(value) => setValue('invoiceLanguage', value)}
                      placeholder="Select language..."
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      {...register('invoiceIncludeQR')}
                    />
                    <span>Include QR code for payment</span>
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
                <div className="form-grid">
                  <div className="form-group">
                    <label>Primary Color</label>
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
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Secondary Color</label>
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
                      />
                    </div>
                  </div>
                </div>

                <div className="theme-preview">
                  <h3>Preview</h3>
                  <div className="preview-buttons">
                    <Button variant="primary">Primary Button</Button>
                    <Button variant="secondary">Secondary Button</Button>
                    <Button variant="outline">Outline Button</Button>
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
                <h3>Export Data</h3>
                <p>Download your data for backup or transfer purposes</p>
                
                <div className="data-actions">
                  <Button variant="outline" onClick={handleExportData}>
                    <FiDownload />
                    Export All Data
                  </Button>
                  
                  <Button variant="outline" onClick={handleExportEncryptedData}>
                    <FiLock />
                    Export Encrypted
                  </Button>
                  
                  <Button variant="outline" onClick={handleExportBackup}>
                    <FiDatabase />
                    Create Backup
                  </Button>
                  
                  <Button variant="outline" onClick={handleBulkPDFExport}>
                    <FiDownload />
                    Export All PDFs
                  </Button>
                </div>

                <div className="data-stats">
                  <div className="stat-item">
                    <span className="stat-label">Invoices:</span>
                    <span className="stat-value">{invoices.length}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Clients:</span>
                    <span className="stat-value">{clients.length}</span>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Import Data</h3>
                <p>Import data from a previously exported file</p>
                
                <div className="import-section">
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
                  >
                    <FiUpload />
                    {isImporting ? 'Importing...' : 'Import Data'}
                  </Button>
                  
                  <p className="import-note">
                    Supported formats: JSON files exported from this application
                  </p>
                </div>
              </div>

              <div className="form-section danger-zone">
                <h3>Danger Zone</h3>
                <p>Irreversible actions - use with caution</p>
                
                <div className="danger-actions">
                  <Button variant="outline" onClick={handleClearData} className="danger-button">
                    <FiTrash2 />
                    Clear All Data
                  </Button>
                  
                  <p className="danger-note">
                    This will permanently delete all invoices, clients, and settings.
                  </p>
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