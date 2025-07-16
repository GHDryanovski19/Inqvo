import React from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiUser, FiMail, FiPhone, FiMapPin, FiGlobe, FiBriefcase, FiHash, FiFileText } from 'react-icons/fi'
import Button from '../../components/UI/Button/Button'
import './ClientModal.scss'

const ClientModal = ({ client, onSave, onClose }) => {
  const { t } = useTranslation()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue
  } = useForm({
    defaultValues: {
      name: client?.name || '',
      company: client?.company || '',
      email: client?.email || '',
      phone: client?.phone || '',
      address: client?.address || '',
      city: client?.city || '',
      postalCode: client?.postalCode || '',
      country: client?.country || '',
      vatNumber: client?.vatNumber || '',
      notes: client?.notes || '',
      status: client?.status || 'active'
    }
  })

  const watchedValues = watch()

  const onSubmit = (data) => {
    onSave(data)
  }

  const handleVatNumberChange = (e) => {
    const value = e.target.value
    // Auto-format VAT number (remove spaces, add formatting)
    const formatted = value.replace(/\s/g, '').replace(/(\d{2})(\d{3})(\d{3})(\d{3})/, '$1 $2 $3 $4')
    setValue('vatNumber', formatted)
  }

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.9, 
      y: 20,
      transition: {
        duration: 0.2
      }
    }
  }

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  }

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={onClose}
      >
        <motion.div
          className="client-modal"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            <div className="header-content">
              <div className="header-icon">
                <FiUser />
              </div>
              <div>
                <h2>{client ? t('client.editClient') : t('client.addNewClient')}</h2>
                <p>{client ? t('client.editDescription') : t('client.addDescription')}</p>
              </div>
            </div>
            <button className="close-btn" onClick={onClose} aria-label={t('common.close')}>
              <FiX />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="modal-form">
            <div className="form-sections">
              {/* Basic Information */}
              <div className="form-section">
                <div className="section-header">
                  <FiUser />
                  <h3>{t('client.form.basicInfo')}</h3>
                </div>
                
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="name">
                      {t('client.form.name')} *
                    </label>
                    <div className="input-with-icon">
                      <FiUser />
                      <input
                        id="name"
                        type="text"
                        placeholder={t('client.form.namePlaceholder')}
                        {...register('name', { 
                          required: t('client.form.nameRequired'),
                          minLength: { value: 2, message: t('client.form.nameMinLength') }
                        })}
                        className={errors.name ? 'error' : ''}
                      />
                    </div>
                    {errors.name && <span className="error-message">{errors.name.message}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="company">
                      {t('client.form.company')}
                    </label>
                    <div className="input-with-icon">
                      <FiBriefcase />
                      <input
                        id="company"
                        type="text"
                        placeholder={t('client.form.companyPlaceholder')}
                        {...register('company')}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">
                      {t('client.form.email')}
                    </label>
                    <div className="input-with-icon">
                      <FiMail />
                      <input
                        id="email"
                        type="email"
                        placeholder={t('client.form.emailPlaceholder')}
                        {...register('email', {
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: t('client.form.emailInvalid')
                          }
                        })}
                        className={errors.email ? 'error' : ''}
                      />
                    </div>
                    {errors.email && <span className="error-message">{errors.email.message}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">
                      {t('client.form.phone')}
                    </label>
                    <div className="input-with-icon">
                      <FiPhone />
                      <input
                        id="phone"
                        type="tel"
                        placeholder={t('client.form.phonePlaceholder')}
                        {...register('phone')}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="form-section">
                <div className="section-header">
                  <FiMapPin />
                  <h3>{t('client.form.addressInfo')}</h3>
                </div>
                
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label htmlFor="address">
                      {t('client.form.address')}
                    </label>
                    <div className="input-with-icon">
                      <FiMapPin />
                      <input
                        id="address"
                        type="text"
                        placeholder={t('client.form.addressPlaceholder')}
                        {...register('address')}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="city">
                      {t('client.form.city')}
                    </label>
                    <input
                      id="city"
                      type="text"
                      placeholder={t('client.form.cityPlaceholder')}
                      {...register('city')}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="postalCode">
                      {t('client.form.postalCode')}
                    </label>
                    <input
                      id="postalCode"
                      type="text"
                      placeholder={t('client.form.postalCodePlaceholder')}
                      {...register('postalCode')}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="country">
                      {t('client.form.country')}
                    </label>
                    <div className="input-with-icon">
                      <FiGlobe />
                      <input
                        id="country"
                        type="text"
                        placeholder={t('client.form.countryPlaceholder')}
                        {...register('country')}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Information */}
              <div className="form-section">
                <div className="section-header">
                  <FiHash />
                  <h3>{t('client.form.businessInfo')}</h3>
                </div>
                
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="vatNumber">
                      {t('client.form.vatNumber')}
                    </label>
                    <div className="input-with-icon">
                      <FiHash />
                      <input
                        id="vatNumber"
                        type="text"
                        placeholder={t('client.form.vatNumberPlaceholder')}
                        {...register('vatNumber')}
                        onChange={handleVatNumberChange}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="status">
                      {t('client.form.status')}
                    </label>
                    <select
                      id="status"
                      {...register('status')}
                    >
                      <option value="active">{t('client.status.active')}</option>
                      <option value="inactive">{t('client.status.inactive')}</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="form-section">
                <div className="section-header">
                  <FiFileText />
                  <h3>{t('client.form.notes')}</h3>
                </div>
                
                <div className="form-group">
                  <label htmlFor="notes">
                    {t('client.form.notesLabel')}
                  </label>
                  <textarea
                    id="notes"
                    rows={4}
                    placeholder={t('client.form.notesPlaceholder')}
                    {...register('notes')}
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <div className="footer-actions">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  {t('common.cancel')}
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  loading={isSubmitting}
                >
                  {client ? t('client.form.updateClient') : t('client.form.addClient')}
                </Button>
              </div>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default ClientModal 