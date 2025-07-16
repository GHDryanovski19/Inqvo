import React from 'react'
import { motion } from 'framer-motion'
import Button from '../Button/Button'
import { slideDown } from '../../../utils/animations'
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
      {...slideDown}
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