import React from 'react'
import { useForm } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiUser, FiMail, FiPhone, FiMapPin, FiGlobe, FiBriefcase } from 'react-icons/fi'
import Button from '../../components/UI/Button/Button'
import './ClientModal.scss'

const ClientModal = ({ client, onSave, onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
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
      notes: client?.notes || ''
    }
  })

  const onSubmit = (data) => {
    onSave(data)
  }

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="client-modal"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            <h2>{client ? 'Edit Client' : 'Add New Client'}</h2>
            <button className="close-btn" onClick={onClose}>
              <FiX />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="modal-form">
            <div className="form-section">
              <h3>Basic Information</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>
                    <FiUser />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    {...register('name', { required: 'Name is required' })}
                    className={errors.name ? 'error' : ''}
                    placeholder="Enter full name"
                  />
                  {errors.name && <span className="error-message">{errors.name.message}</span>}
                </div>

                <div className="form-group">
                  <label>
                    <FiBriefcase />
                    Company
                  </label>
                  <input
                    type="text"
                    {...register('company')}
                    placeholder="Enter company name"
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Contact Information</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>
                    <FiMail />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    className={errors.email ? 'error' : ''}
                    placeholder="Enter email address"
                  />
                  {errors.email && <span className="error-message">{errors.email.message}</span>}
                </div>

                <div className="form-group">
                  <label>
                    <FiPhone />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    {...register('phone')}
                    placeholder="Enter phone number"
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Address Information</h3>
              <div className="form-group">
                <label>
                  <FiMapPin />
                  Address
                </label>
                <input
                  type="text"
                  {...register('address')}
                  placeholder="Enter street address"
                />
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    {...register('city')}
                    placeholder="Enter city"
                  />
                </div>

                <div className="form-group">
                  <label>Postal Code</label>
                  <input
                    type="text"
                    {...register('postalCode')}
                    placeholder="Enter postal code"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>
                  <FiGlobe />
                  Country
                </label>
                <select {...register('country')}>
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
                  <option value="United States">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-section">
              <h3>Business Information</h3>
              <div className="form-group">
                <label>VAT Number</label>
                <input
                  type="text"
                  {...register('vatNumber')}
                  placeholder="Enter VAT number"
                />
              </div>

              <div className="form-group">
                <label>Notes</label>
                <textarea
                  {...register('notes')}
                  rows="3"
                  placeholder="Add any additional notes about this client..."
                />
              </div>
            </div>

            <div className="modal-actions">
              <Button variant="outline" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {client ? 'Update Client' : 'Add Client'}
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default ClientModal 