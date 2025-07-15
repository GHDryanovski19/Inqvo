import React, { useState } from 'react'
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
  FiFileText
} from 'react-icons/fi'
import { useApp } from '../../contexts/AppContext'
import Button from '../../components/UI/Button/Button'
import toast from 'react-hot-toast'
import './Settings.scss'

const Settings = () => {
  const { settings, dispatch } = useApp()
  const [activeTab, setActiveTab] = useState('company')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      // Company settings
      companyName: settings.company.name,
      companyAddress: settings.company.address,
      companyCity: settings.company.city,
      companyPostalCode: settings.company.postalCode,
      companyCountry: settings.company.country,
      companyVatNumber: settings.company.vatNumber,
      companyIban: settings.company.iban,
      
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

  const onSubmit = async (data) => {
    try {
      const updatedSettings = {
        company: {
          name: data.companyName,
          address: data.companyAddress,
          city: data.companyCity,
          postalCode: data.companyPostalCode,
          country: data.companyCountry,
          vatNumber: data.companyVatNumber,
          iban: data.companyIban,
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
      toast.success('Settings saved successfully!')
    } catch (error) {
      toast.error('Failed to save settings')
      console.error('Save settings error:', error)
    }
  }

  const tabs = [
    { id: 'company', label: 'Company', icon: FiBriefcase },
    { id: 'invoice', label: 'Invoice', icon: FiFileText },
    { id: 'theme', label: 'Theme', icon: FiDroplet }
  ]

  return (
    <div className="settings">
      <div className="settings__header">
        <div>
          <h1>Settings</h1>
          <p>Configure your company information and application preferences</p>
        </div>
        <Button
          variant="primary"
          size="lg"
          onClick={handleSubmit(onSubmit)}
          loading={isSubmitting}
        >
          <FiSave />
          Save Settings
        </Button>
      </div>

      <div className="settings__content">
        {/* Tabs */}
        <div className="settings__tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon />
                {tab.label}
              </button>
            )
          })}
        </div>

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
                    <select
                      {...register('companyCountry', { required: 'Country is required' })}
                      className={errors.companyCountry ? 'error' : ''}
                    >
                      <option value="">Select country</option>
                      <option value="Bulgaria">Bulgaria</option>
                      <option value="Germany">Germany</option>
                      <option value="France">France</option>
                      <option value="Italy">Italy</option>
                      <option value="Spain">Spain</option>
                      <option value="Netherlands">Netherlands</option>
                      <option value="Belgium">Belgium</option>
                      <option value="Austria">Austria</option>
                      <option value="Switzerland">Switzerland</option>
                      <option value="United Kingdom">United Kingdom</option>
                    </select>
                    {errors.companyCountry && <span className="error-message">{errors.companyCountry.message}</span>}
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
                    <label>VAT Number</label>
                    <input
                      type="text"
                      {...register('companyVatNumber')}
                      placeholder="Enter VAT number"
                    />
                  </div>

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
                    <select {...register('invoiceLanguage')}>
                      <option value="en">English</option>
                      <option value="bg">Bulgarian</option>
                      <option value="de">German</option>
                      <option value="fr">French</option>
                    </select>
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
        </div>
      </div>
    </div>
  )
}

export default Settings 