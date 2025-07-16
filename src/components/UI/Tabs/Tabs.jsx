import React from 'react'
import { motion } from 'framer-motion'
import { FiCheck } from 'react-icons/fi'
import './Tabs.scss'

const Tabs = ({
  tabs = [],
  activeTab,
  onTabChange,
  variant = 'default', // 'default', 'progress'
  className = '',
  ...props
}) => {
  const handleTabClick = (tabId) => {
    if (onTabChange) {
      onTabChange(tabId)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: -5 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <motion.div
      className={`tabs tabs--${variant} ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      {...props}
    >
      {tabs.map((tab, index) => {
        const Icon = tab.icon
        const isActive = activeTab === tab.id
        const isCompleted = variant === 'progress' && activeTab > tab.id
        
        return (
          <motion.div
            key={tab.id}
            className={`tab ${isActive ? 'tab--active' : ''} ${isCompleted ? 'tab--completed' : ''}`}
            onClick={() => handleTabClick(tab.id)}
            variants={itemVariants}
          >
            <div className="tab__icon">
              {isCompleted ? <FiCheck /> : <Icon />}
            </div>
            <span className="tab__title">{tab.label}</span>
            {variant === 'progress' && (
              <div className="tab__progress">
                <div className="tab__progress-line" />
              </div>
            )}
          </motion.div>
        )
      })}
    </motion.div>
  )
}

export default Tabs 