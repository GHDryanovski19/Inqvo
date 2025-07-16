import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { FiGlobe, FiHome, FiFileText, FiSettings, FiUsers } from 'react-icons/fi'
import { slideDown } from '../../utils/animations'
import Dropdown from '../UI/Dropdown/Dropdown'
import styles from './Header.module.scss'

const Header = ({ onLanguageChange }) => {
  const { t, i18n } = useTranslation()
  const location = useLocation()

  const navigation = [
    { path: '/', label: t('nav.dashboard'), icon: FiHome },
    { path: '/invoices', label: t('nav.invoices'), icon: FiFileText },
    { path: '/clients', label: t('nav.clients'), icon: FiUsers },
    { path: '/settings', label: t('nav.settings'), icon: FiSettings },
  ]

  const languages = [
    { value: 'en', label: 'English', icon: '🇺🇸' },
    { value: 'bg', label: 'Български', icon: '🇧🇬' },
  ]

  const handleLanguageChange = (langCode) => {
    onLanguageChange(langCode)
  }

  return (
    <motion.header 
      className={styles.header}
      {...slideDown}
    >
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link to="/">
            <h1>Inqvo</h1>
            <span className={styles.tagline}>{t('header.tagline')}</span>
          </Link>
        </div>

        <nav className={styles.navigation}>
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`${styles.navLink} ${isActive ? styles.active : ''}`}
              >
                <Icon />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className={styles.actions}>
          <Dropdown
            options={languages}
            value={i18n.language}
            onChange={handleLanguageChange}
            placeholder="Select language"
            size="sm"
            variant="default"
            icon={<FiGlobe />}
            className={styles.languageDropdown}
          />
        </div>
      </div>
    </motion.header>
  )
}

export default Header 