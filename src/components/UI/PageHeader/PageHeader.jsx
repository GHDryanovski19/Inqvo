import React from 'react'
import { motion } from 'framer-motion'
import Button from '../Button/Button'
import './PageHeader.scss'

const PageHeader = ({ 
  title, 
  subtitle, 
  action, 
  icon,
  className = '',
  children 
}) => {
  return (
    <motion.div 
      className={`page-header ${className}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="page-header__content">
        <div className="page-header__info">
          {icon && (
            <div className="page-header__icon">
              {icon}
            </div>
          )}
          <div className="page-header__text">
            <h1 className="page-header__title">{title}</h1>
            {subtitle && <p className="page-header__subtitle">{subtitle}</p>}
          </div>
        </div>
        
        {action && (
          <div className="page-header__action">
            {action}
          </div>
        )}
      </div>
      
      {children && (
        <div className="page-header__children">
          {children}
        </div>
      )}
    </motion.div>
  )
}

export default PageHeader 