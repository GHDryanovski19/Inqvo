import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { FiGlobe, FiChevronDown, FiHome, FiFileText, FiSettings, FiUsers } from 'react-icons/fi'
import { slideDown, dropdownMenu } from '../../utils/animations'
import Button from '../UI/Button/Button'
import styles from './Header.module.scss'

const Header = ({ onLanguageChange }) => {
  const { t, i18n } = useTranslation()
  const location = useLocation()
  const [isLanguageOpen, setIsLanguageOpen] = useState(false)
  const languageRef = useRef(null)

  const navigation = [
    { path: '/', label: t('nav.dashboard'), icon: FiHome },
    { path: '/invoices', label: t('nav.invoices'), icon: FiFileText },
    { path: '/clients', label: t('nav.clients'), icon: FiUsers },
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
          <div className={styles.languageSwitcher} ref={languageRef}>
            <Button
              variant="ghost"
              size="md"
              onClick={() => setIsLanguageOpen(!isLanguageOpen)}
              aria-label={t('header.changeLanguage')}
              className={styles.languageButton}
            >
              <FiGlobe />
              <span className={styles.currentLanguage}>
                {currentLanguage.flag} {currentLanguage.code.toUpperCase()}
              </span>
              <FiChevronDown className={`${styles.chevron} ${isLanguageOpen ? styles.rotated : ''}`} />
            </Button>

            <AnimatePresence>
              {isLanguageOpen && (
                <motion.div
                  className={styles.languageDropdown}
                  {...dropdownMenu}
                >
                {languages.map((lang) => (
                  <Button
                    key={lang.code}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`${styles.languageOption} ${lang.code === i18n.language ? styles.active : ''}`}
                  >
                    <span className={styles.flag}>{lang.flag}</span>
                    <span className={styles.name}>{lang.name}</span>
                  </Button>
                ))}
              </motion.div>
            )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.header>
  )
}

export default Header 