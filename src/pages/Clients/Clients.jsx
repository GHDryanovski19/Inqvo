import React, { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiPlus, 
  FiSearch, 
  FiEdit, 
  FiTrash2,
  FiUser,
  FiMail,
  FiMapPin,
  FiGlobe,
  FiPhone,
  FiBriefcase,
  FiFilter,
  FiGrid,
  FiList,
  FiDownload,
  FiUpload,
  FiEye,
  FiMoreVertical
} from 'react-icons/fi'
import { useApp } from '../../contexts/AppContext'
import Button from '../../components/UI/Button/Button'
import Dropdown from '../../components/UI/Dropdown'
import PageHeader from '../../components/UI/PageHeader'

import ClientModal from './ClientModal'
import toast from 'react-hot-toast'
import './Clients.scss'

const Clients = () => {
  const { t } = useTranslation()
  const { clients, dispatch } = useApp()
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingClient, setEditingClient] = useState(null)
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const [filterStatus, setFilterStatus] = useState('all') // 'all', 'active', 'inactive'
  const [sortBy, setSortBy] = useState('name') // 'name', 'company', 'date'

  // Filter and sort clients
  const filteredClients = useMemo(() => {
    let filtered = clients.filter(client => {
      const matchesSearch = 
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.phone?.includes(searchTerm) ||
        client.vatNumber?.includes(searchTerm)
      
      const matchesFilter = filterStatus === 'all' || 
        (filterStatus === 'active' && client.status !== 'inactive') ||
        (filterStatus === 'inactive' && client.status === 'inactive')
      
      return matchesSearch && matchesFilter
    })

    // Sort clients
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'company':
          return (a.company || '').localeCompare(b.company || '')
        case 'date':
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        default:
          return 0
      }
    })

    return filtered
  }, [clients, searchTerm, filterStatus, sortBy])

  const handleAddClient = () => {
    setEditingClient(null)
    setShowModal(true)
  }

  const handleEditClient = (client) => {
    setEditingClient(client)
    setShowModal(true)
  }

  const handleDeleteClient = (clientId) => {
    if (window.confirm(t('client.deleteConfirm'))) {
      dispatch({ type: 'DELETE_CLIENT', payload: clientId })
      toast.success(t('client.deleted'))
    }
  }

  const handleSaveClient = (clientData) => {
    if (editingClient) {
      dispatch({ type: 'UPDATE_CLIENT', payload: { ...clientData, id: editingClient.id } })
      toast.success(t('client.updated'))
    } else {
      dispatch({ 
        type: 'ADD_CLIENT', 
        payload: { 
          ...clientData, 
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          status: 'active'
        } 
      })
      toast.success(t('client.added'))
    }
    setShowModal(false)
    setEditingClient(null)
  }

  const handleExportClients = () => {
    try {
      const data = clients.map(client => ({
        name: client.name,
        company: client.company,
        email: client.email,
        phone: client.phone,
        address: client.address,
        city: client.city,
        country: client.country,
        vatNumber: client.vatNumber,
        notes: client.notes
      }))
      
      const csv = [
        Object.keys(data[0]).join(','),
        ...data.map(row => Object.values(row).map(value => `"${value || ''}"`).join(','))
      ].join('\n')
      
      const blob = new Blob([csv], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `clients-${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      URL.revokeObjectURL(url)
      toast.success(t('client.exported'))
    } catch (error) {
      toast.error(t('client.exportError'))
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.3
      }
    }
  }

  const ClientCard = ({ client, index }) => (
    <motion.div
      className="client-card"
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay: index * 0.05 }}
      whileHover={{ 
        y: -4,
        transition: { duration: 0.2 }
      }}
      layout
    >
      <div className="client-card__header">
        <div className="client-avatar">
          <span>{client.name.charAt(0).toUpperCase()}</span>
          <div className={`status-indicator ${client.status || 'active'}`} />
        </div>
        <div className="client-actions">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEditClient(client)}
            title={t('client.edit')}
            className="action-btn"
          >
            <FiEdit />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteClient(client.id)}
            title={t('client.delete')}
            className="action-btn delete-btn"
          >
            <FiTrash2 />
          </Button>
        </div>
      </div>

      <div className="client-card__content">
        <h3 className="client-name">{client.name}</h3>
        {client.company && (
          <p className="client-company">
            <FiBriefcase />
            {client.company}
          </p>
        )}
        
        <div className="client-info">
          {client.email && (
            <div className="info-item">
              <FiMail />
              <span>{client.email}</span>
            </div>
          )}
          
          {client.phone && (
            <div className="info-item">
              <FiPhone />
              <span>{client.phone}</span>
            </div>
          )}
          
          {client.address && (
            <div className="info-item">
              <FiMapPin />
              <span>{client.address}</span>
            </div>
          )}
          
          {client.country && (
            <div className="info-item">
              <FiGlobe />
              <span>{client.country}</span>
            </div>
          )}
        </div>

        {client.vatNumber && (
          <div className="client-vat">
            <strong>{t('client.vat')}:</strong> {client.vatNumber}
          </div>
        )}
      </div>

      {client.notes && (
        <div className="client-card__notes">
          <p>{client.notes}</p>
        </div>
      )}

      <div className="client-card__footer">
        <span className="client-date">
          {client.createdAt ? new Date(client.createdAt).toLocaleDateString() : 'N/A'}
        </span>
        <div className="client-tags">
          {client.status && (
            <span className={`tag tag--${client.status}`}>
              {t(`client.status.${client.status}`)}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )

  const ClientListItem = ({ client, index }) => (
    <motion.div
      className="client-list-item"
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay: index * 0.05 }}
      whileHover={{ 
        backgroundColor: 'var(--color-surface-hover)',
        transition: { duration: 0.2 }
      }}
      layout
    >
      <div className="client-list-item__avatar">
        <span>{client.name.charAt(0).toUpperCase()}</span>
        <div className={`status-indicator ${client.status || 'active'}`} />
      </div>
      
      <div className="client-list-item__info">
        <div className="client-list-item__main">
          <h3>{client.name}</h3>
          {client.company && <p className="company">{client.company}</p>}
        </div>
        
        <div className="client-list-item__contact">
          {client.email && (
            <div className="contact-item">
              <FiMail />
              <span>{client.email}</span>
            </div>
          )}
          {client.phone && (
            <div className="contact-item">
              <FiPhone />
              <span>{client.phone}</span>
            </div>
          )}
        </div>
        
        <div className="client-list-item__location">
          {client.address && (
            <div className="location-item">
              <FiMapPin />
              <span>{client.address}</span>
            </div>
          )}
          {client.country && (
            <div className="location-item">
              <FiGlobe />
              <span>{client.country}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="client-list-item__actions">
        {client.vatNumber && (
          <div className="vat-info">
            <strong>{t('client.vat')}:</strong> {client.vatNumber}
          </div>
        )}
        <div className="action-buttons">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEditClient(client)}
            title={t('client.edit')}
          >
            <FiEdit />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteClient(client.id)}
            title={t('client.delete')}
            className="delete-btn"
          >
            <FiTrash2 />
          </Button>
        </div>
      </div>
    </motion.div>
  )

  return (
    <motion.div 
      className="clients"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <PageHeader
        title={t('client.title')}
        subtitle={t('client.subtitle')}
        icon={<FiUser />}
        action={
          <div className="btn-row">
            <Button
              variant="outline"
              size="md"
              onClick={handleExportClients}
              title={t('client.export')}
            >
              <FiDownload />
              {t('client.export')}
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleAddClient}
            >
              <FiPlus />
              {t('client.addClient')}
            </Button>
          </div>
        }
      />

      {/* Stats Section */}
      <motion.div className="clients__stats" variants={itemVariants}>
        <div className="stat-item">
          <div className="stat-icon">
            <FiUser />
          </div>
          <div className="stat-content">
            <span className="stat-value">{clients.length}</span>
            <span className="stat-label">{t('client.stats.total')}</span>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon">
            <FiBriefcase />
          </div>
          <div className="stat-content">
            <span className="stat-value">
              {new Set(clients.map(client => client.company).filter(Boolean)).size}
            </span>
            <span className="stat-label">{t('client.stats.companies')}</span>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon">
            <FiGlobe />
          </div>
          <div className="stat-content">
            <span className="stat-value">
              {new Set(clients.map(client => client.country).filter(Boolean)).size}
            </span>
            <span className="stat-label">{t('client.stats.countries')}</span>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon">
            <FiMail />
          </div>
          <div className="stat-content">
            <span className="stat-value">
              {clients.filter(client => client.email).length}
            </span>
            <span className="stat-label">{t('client.stats.withEmail')}</span>
          </div>
        </div>
      </motion.div>

      {/* Controls Section */}
      <div className="clients__controls">
        <div className="controls-left">
          <div className="search-box">
            <FiSearch />
            <input
              type="text"
              placeholder={t('client.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="filter-controls">
            <Dropdown
              options={[
                { value: 'all', label: t('client.filters.all') },
                { value: 'active', label: t('client.filters.active') },
                { value: 'inactive', label: t('client.filters.inactive') }
              ]}
              value={filterStatus}
              onChange={setFilterStatus}
              placeholder={t('client.filters.all')}
              size="sm"
            />
            
            <Dropdown
              options={[
                { value: 'name', label: t('client.sort.name') },
                { value: 'company', label: t('client.sort.company') },
                { value: 'date', label: t('client.sort.date') }
              ]}
              value={sortBy}
              onChange={setSortBy}
              placeholder={t('client.sort.name')}
              size="sm"
            />
          </div>
        </div>
        
        <div className="controls-right">
          <div className="view-toggle">
            <Button
              variant={viewMode === 'grid' ? 'primary' : 'ghost'}
              size="sm"
              iconOnly
              onClick={() => setViewMode('grid')}
              title={t('client.view.grid')}
            >
              <FiGrid />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'primary' : 'ghost'}
              size="sm"
              iconOnly
              onClick={() => setViewMode('list')}
              title={t('client.view.list')}
            >
              <FiList />
            </Button>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <motion.div className="clients__content" variants={itemVariants}>
        <AnimatePresence mode="wait">
          {filteredClients.length > 0 ? (
            viewMode === 'grid' ? (
              <motion.div
                key="grid"
                className="clients-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {filteredClients.map((client, index) => (
                  <ClientCard key={client.id} client={client} index={index} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="list"
                className="clients-list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {filteredClients.map((client, index) => (
                  <ClientListItem key={client.id} client={client} index={index} />
                ))}
              </motion.div>
            )
          ) : (
            <motion.div
              className="empty-state"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="empty-icon">
                <FiUser />
              </div>
              <h3>{t('client.noClients')}</h3>
              <p>
                {searchTerm 
                  ? t('client.searchNoResults')
                  : t('client.createFirst')
                }
              </p>
              {!searchTerm && (
                <Button variant="primary" onClick={handleAddClient}>
                  <FiPlus />
                  {t('client.addClient')}
                </Button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Client Modal */}
      <AnimatePresence>
        {showModal && (
          <ClientModal
            client={editingClient}
            onSave={handleSaveClient}
            onClose={() => {
              setShowModal(false)
              setEditingClient(null)
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default Clients 