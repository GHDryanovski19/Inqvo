import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { 
  FiPlus, 
  FiSearch, 
  FiEdit, 
  FiTrash2,
  FiUser,
  FiMail,
  FiMapPin,
  FiGlobe
} from 'react-icons/fi'
import { useApp } from '../../contexts/AppContext'
import Button from '../../components/UI/Button/Button'
import ClientModal from './ClientModal'
import toast from 'react-hot-toast'
import './Clients.scss'

const Clients = () => {
  const { clients, dispatch } = useApp()
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingClient, setEditingClient] = useState(null)

  // Filter clients
  const filteredClients = useMemo(() => {
    return clients.filter(client => 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.company?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [clients, searchTerm])

  const handleAddClient = () => {
    setEditingClient(null)
    setShowModal(true)
  }

  const handleEditClient = (client) => {
    setEditingClient(client)
    setShowModal(true)
  }

  const handleDeleteClient = (clientId) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      dispatch({ type: 'DELETE_CLIENT', payload: clientId })
      toast.success('Client deleted successfully')
    }
  }

  const handleSaveClient = (clientData) => {
    if (editingClient) {
      dispatch({ type: 'UPDATE_CLIENT', payload: { ...clientData, id: editingClient.id } })
      toast.success('Client updated successfully')
    } else {
      dispatch({ type: 'ADD_CLIENT', payload: { ...clientData, id: Date.now().toString() } })
      toast.success('Client added successfully')
    }
    setShowModal(false)
    setEditingClient(null)
  }

  return (
    <div className="clients">
      <div className="clients__header">
        <div>
          <h1>Clients</h1>
          <p>Manage your client relationships and information</p>
        </div>
        <Button variant="primary" size="lg" onClick={handleAddClient}>
          <FiPlus />
          Add Client
        </Button>
      </div>

      {/* Search */}
      <div className="clients__search">
        <div className="search-box">
          <FiSearch />
          <input
            type="text"
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="clients__stats">
        <div className="stat-item">
          <FiUser />
          <div>
            <span className="stat-value">{clients.length}</span>
            <span className="stat-label">Total Clients</span>
          </div>
        </div>
        <div className="stat-item">
          <FiGlobe />
          <div>
            <span className="stat-value">
              {new Set(clients.map(client => client.country)).size}
            </span>
            <span className="stat-label">Countries</span>
          </div>
        </div>
        <div className="stat-item">
          <FiMail />
          <div>
            <span className="stat-value">
              {clients.filter(client => client.email).length}
            </span>
            <span className="stat-label">With Email</span>
          </div>
        </div>
      </div>

      {/* Clients Grid */}
      <div className="clients__content">
        {filteredClients.length > 0 ? (
          <div className="clients-grid">
            {filteredClients.map((client, index) => (
              <motion.div
                key={client.id}
                className="client-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -5, boxShadow: 'var(--shadow-lg)' }}
              >
                <div className="client-card__header">
                  <div className="client-avatar">
                    {client.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="client-actions">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditClient(client)}
                      title="Edit"
                    >
                      <FiEdit />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClient(client.id)}
                      title="Delete"
                      className="delete-btn"
                    >
                      <FiTrash2 />
                    </Button>
                  </div>
                </div>

                <div className="client-card__content">
                  <h3 className="client-name">{client.name}</h3>
                  {client.company && (
                    <p className="client-company">{client.company}</p>
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
                        <FiUser />
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
                      <strong>VAT:</strong> {client.vatNumber}
                    </div>
                  )}
                </div>

                {client.notes && (
                  <div className="client-card__notes">
                    <p>{client.notes}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <FiUser size={64} />
            <h3>No clients found</h3>
            <p>
              {searchTerm 
                ? 'Try adjusting your search'
                : 'Add your first client to get started'
              }
            </p>
            {!searchTerm && (
              <Button variant="primary" onClick={handleAddClient}>
                <FiPlus />
                Add Client
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Client Modal */}
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
    </div>
  )
}

export default Clients 