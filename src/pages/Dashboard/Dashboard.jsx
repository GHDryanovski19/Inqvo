import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  FiFileText, 
  FiUsers, 
  FiDollarSign, 
  FiTrendingUp,
  FiPlus,
  FiEye,
  FiEdit
} from 'react-icons/fi'
import { useApp } from '../../contexts/AppContext'
import { format } from 'date-fns'
import Button from '../../components/UI/Button/Button'
import './Dashboard.scss'

const Dashboard = () => {
  const { invoices, clients, formatCurrency, calculateInvoiceTotals } = useApp()

  // Calculate dashboard stats
  const totalInvoices = invoices.length
  const totalClients = clients.length
  
  const totalRevenue = invoices.reduce((sum, invoice) => {
    const totals = calculateInvoiceTotals(invoice.items, invoice.vatRate)
    return sum + totals.total
  }, 0)

  const pendingInvoices = invoices.filter(invoice => invoice.status === 'pending')
  const pendingAmount = pendingInvoices.reduce((sum, invoice) => {
    const totals = calculateInvoiceTotals(invoice.items, invoice.vatRate)
    return sum + totals.total
  }, 0)

  // Recent invoices
  const recentInvoices = invoices
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)

  // Recent clients
  const recentClients = clients
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3)

  const stats = [
    {
      title: 'Total Invoices',
      value: totalInvoices,
      icon: FiFileText,
      color: 'var(--color-lime)',
      link: '/invoices'
    },
    {
      title: 'Total Clients',
      value: totalClients,
      icon: FiUsers,
      color: 'var(--color-green)',
      link: '/clients'
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(totalRevenue),
      icon: FiDollarSign,
      color: 'var(--color-success)',
      link: '/invoices'
    },
    {
      title: 'Pending Amount',
      value: formatCurrency(pendingAmount),
      icon: FiTrendingUp,
      color: 'var(--color-warning)',
      link: '/invoices'
    }
  ]

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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div className="dashboard">
      <motion.div
        className="dashboard__header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1>Welcome to Inkblot Studio</h1>
          <p>Manage your invoices and clients with ease</p>
        </div>
        <Link to="/invoices/create">
          <Button variant="primary" size="lg">
            <FiPlus />
            Create Invoice
          </Button>
        </Link>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        className="dashboard__stats"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.title}
              className="stat-card"
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <Link to={stat.link} className="stat-card__link">
                <div className="stat-card__icon" style={{ backgroundColor: stat.color }}>
                  <Icon />
                </div>
                <div className="stat-card__content">
                  <h3 className="stat-card__value">{stat.value}</h3>
                  <p className="stat-card__title">{stat.title}</p>
                </div>
              </Link>
            </motion.div>
          )
        })}
      </motion.div>

      <div className="dashboard__content">
        {/* Recent Invoices */}
        <motion.div
          className="dashboard__section"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="section-header">
            <h2>Recent Invoices</h2>
            <Link to="/invoices">
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          </div>
          
          <div className="invoices-list">
            {recentInvoices.length > 0 ? (
              recentInvoices.map((invoice) => {
                const totals = calculateInvoiceTotals(invoice.items, invoice.vatRate)
                return (
                  <motion.div
                    key={invoice.id}
                    className="invoice-item"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="invoice-item__info">
                      <h4>{invoice.number}</h4>
                      <p>{invoice.client?.name || 'Unknown Client'}</p>
                      <span className="invoice-item__date">
                        {format(new Date(invoice.issueDate), 'MMM dd, yyyy')}
                      </span>
                    </div>
                    <div className="invoice-item__amount">
                      <span className="amount">{formatCurrency(totals.total)}</span>
                      <span className={`status status--${invoice.status}`}>
                        {invoice.status}
                      </span>
                    </div>
                    <div className="invoice-item__actions">
                      <Link to={`/invoices/${invoice.id}/preview`}>
                        <Button variant="ghost" size="sm">
                          <FiEye />
                        </Button>
                      </Link>
                      <Link to={`/invoices/${invoice.id}`}>
                        <Button variant="ghost" size="sm">
                          <FiEdit />
                        </Button>
                      </Link>
                    </div>
                  </motion.div>
                )
              })
            ) : (
              <div className="empty-state">
                <FiFileText size={48} />
                <h3>No invoices yet</h3>
                <p>Create your first invoice to get started</p>
                <Link to="/invoices/create">
                  <Button variant="primary">
                    <FiPlus />
                    Create Invoice
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </motion.div>

        {/* Recent Clients */}
        <motion.div
          className="dashboard__section"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="section-header">
            <h2>Recent Clients</h2>
            <Link to="/clients">
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          </div>
          
          <div className="clients-list">
            {recentClients.length > 0 ? (
              recentClients.map((client) => (
                <motion.div
                  key={client.id}
                  className="client-item"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="client-item__avatar">
                    {client.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="client-item__info">
                    <h4>{client.name}</h4>
                    <p>{client.email}</p>
                    <span className="client-item__country">{client.country}</span>
                  </div>
                  <Link to={`/clients/${client.id}`}>
                    <Button variant="ghost" size="sm">
                      <FiEdit />
                    </Button>
                  </Link>
                </motion.div>
              ))
            ) : (
              <div className="empty-state">
                <FiUsers size={48} />
                <h3>No clients yet</h3>
                <p>Add your first client to get started</p>
                <Link to="/clients">
                  <Button variant="primary">
                    <FiPlus />
                    Add Client
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard 