import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiPlus, FiFileText, FiDollarSign, FiClock, FiAlertTriangle, FiTrendingUp, FiUsers, FiCalendar } from 'react-icons/fi'
import { useApp } from '../../contexts/AppContext'
import PageHeader from '../../components/UI/PageHeader'
import { containerVariants, itemVariants, cardHover } from '../../utils/animations'
import styles from './Dashboard.module.scss'

const Dashboard = () => {
  const { t } = useTranslation()
  const { invoices, clients, settings } = useApp()
  const [stats, setStats] = useState({
    totalInvoices: 0,
    totalRevenue: 0,
    pendingInvoices: 0,
    overdueInvoices: 0
  })

  useEffect(() => {
    calculateStats()
  }, [invoices])

  const calculateStats = () => {
    const totalInvoices = invoices.length
    const totalRevenue = invoices
      .filter(invoice => invoice.status === 'paid')
      .reduce((sum, invoice) => sum + (invoice.total || 0), 0)
    const pendingInvoices = invoices.filter(invoice => invoice.status === 'sent').length
    const overdueInvoices = invoices.filter(invoice => {
      if (invoice.status !== 'sent') return false
      const dueDate = new Date(invoice.dueDate)
      return dueDate < new Date()
    }).length

    setStats({
      totalInvoices,
      totalRevenue,
      pendingInvoices,
      overdueInvoices
    })
  }

  const recentInvoices = invoices
    .sort((a, b) => new Date(b.issueDate) - new Date(a.issueDate))
    .slice(0, 5)



  const StatCard = ({ icon: Icon, title, value, color, trend }) => (
    <motion.div
      className={styles.statCard}
      variants={itemVariants}
      {...cardHover}
    >
      <div className={styles.statIcon} style={{ backgroundColor: color }}>
        <Icon />
      </div>
      <div className={styles.statContent}>
        <h3>{title}</h3>
        <p className={styles.statValue}>{value}</p>
        {trend && <span className={styles.trend}>{trend}</span>}
      </div>
    </motion.div>
  )

  const InvoiceCard = ({ invoice }) => (
    <Link to={`/invoice/preview/${invoice.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <motion.div
        className={styles.invoiceCard}
        variants={itemVariants}
        {...cardHover}
      >
        <div className={styles.invoiceHeader}>
          <h4>#{invoice.invoiceNumber}</h4>
          <span className={`${styles.status} ${styles[invoice.status]}`}>
            {t(`invoice.status.${invoice.status}`)}
          </span>
        </div>
        <p className={styles.clientName}>{invoice.client?.name || 'Unknown Client'}</p>
        <div className={styles.invoiceDetails}>
          <span>€{invoice.total?.toFixed(2) || '0.00'}</span>
          <span>{new Date(invoice.issueDate).toLocaleDateString()}</span>
        </div>
      </motion.div>
    </Link>
  )

  return (
    <div className={styles.dashboard}>
      <motion.div
        className={styles.container}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <PageHeader
          title={t('dashboard.welcome')}
          subtitle="Manage your invoices and track your business growth"
          icon={<FiTrendingUp />}
          action={
            <Link to="/invoice/create" className={styles.actionButton}>
              <FiPlus />
              <span>{t('dashboard.createNewInvoice')}</span>
            </Link>
          }
        />

        {/* Stats Grid */}
        <div className={styles.statsGrid}>
          <StatCard
            icon={FiFileText}
            title={t('dashboard.stats.totalInvoices')}
            value={stats.totalInvoices}
            color="#6366f1"
          />
          <StatCard
            icon={FiDollarSign}
            title={t('dashboard.stats.totalRevenue')}
            value={`€${stats.totalRevenue.toFixed(2)}`}
            color="#10b981"
          />
          <StatCard
            icon={FiClock}
            title={t('dashboard.stats.pendingInvoices')}
            value={stats.pendingInvoices}
            color="#f59e0b"
          />
          <StatCard
            icon={FiAlertTriangle}
            title={t('dashboard.stats.overdueInvoices')}
            value={stats.overdueInvoices}
            color="#ef4444"
          />
        </div>

        {/* Quick Actions */}
        <motion.div className={styles.quickActions} variants={itemVariants}>
          <h2>{t('dashboard.quickActions')}</h2>
          <div className={styles.actionButtons}>
            <Link to="/invoice/create" className={styles.actionButton}>
              <FiPlus />
              <span>{t('dashboard.createNewInvoice')}</span>
            </Link>
            <Link to="/clients" className={styles.actionButton}>
              <FiUsers />
              <span>{t('client.title')}</span>
            </Link>
          </div>
        </motion.div>

        {/* Recent Invoices */}
        <motion.div className={styles.recentInvoices} variants={itemVariants}>
          <div className={styles.sectionHeader}>
            <h2>{t('dashboard.recentInvoices')}</h2>
            <Link to="/invoices" className={styles.viewAll}>
              {t('dashboard.viewAllInvoices')}
            </Link>
          </div>
          
          {recentInvoices.length > 0 ? (
            <div className={styles.invoicesGrid}>
              {recentInvoices.map((invoice) => (
                <InvoiceCard key={invoice.id} invoice={invoice} />
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <FiFileText />
              <h3>{t('invoice.list.noInvoices')}</h3>
              <p>{t('invoice.list.createFirst')}</p>
              <Link to="/invoice/create" className={styles.createButton}>
                {t('dashboard.createNewInvoice')}
              </Link>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Dashboard 