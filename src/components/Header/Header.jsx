import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { FiGlobe, FiChevronDown, FiHome, FiFileText, FiSettings } from 'react-icons/fi'
import styles from './Header.module.scss'

const Header = ({ onLanguageChange }) => {
  const { t, i18n } = useTranslation()
  const location = useLocation()
  const [isLanguageOpen, setIsLanguageOpen] = useState(false)
  const languageRef = useRef(null)

  const navigation = [
    { path: '/', label: t('nav.dashboard'), icon: FiHome },
    { path: '/invoices', label: t('nav.invoices'), icon: FiFileText },
    { path: '/invoice/create', label: t('nav.createInvoice'), icon: FiFileText },
    { path: '/settings', label: t('nav.settings'), icon: FiSettings },
  ]

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'bg', name: 'Български', flag: '🇧🇬' },
  ]

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0]

  const handleLanguageChange = (langCode) => {
    onLanguageChange(langCode)
    setIsLanguageOpen(false)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (languageRef.current && !languageRef.current.contains(event.target)) {
        setIsLanguageOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <motion.header 
      className={styles.header}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
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
          <div className={styles.languageSwitcher} ref={languageRef}>
            <button
              className={styles.languageButton}
              onClick={() => setIsLanguageOpen(!isLanguageOpen)}
              aria-label={t('header.changeLanguage')}
            >
              <FiGlobe />
              <span className={styles.currentLanguage}>
                {currentLanguage.flag} {currentLanguage.code.toUpperCase()}
              </span>
              <FiChevronDown className={`${styles.chevron} ${isLanguageOpen ? styles.rotated : ''}`} />
            </button>

            {isLanguageOpen && (
              <motion.div
                className={styles.languageDropdown}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    className={`${styles.languageOption} ${lang.code === i18n.language ? styles.active : ''}`}
                    onClick={() => handleLanguageChange(lang.code)}
                  >
                    <span className={styles.flag}>{lang.flag}</span>
                    <span className={styles.name}>{lang.name}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  )
}

export default Header 