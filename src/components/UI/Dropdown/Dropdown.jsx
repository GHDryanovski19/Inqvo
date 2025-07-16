import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiChevronDown, FiCheck } from 'react-icons/fi'
import './Dropdown.scss'

const Dropdown = ({
  options = [],
  value = '',
  onChange,
  placeholder = 'Select an option...',
  disabled = false,
  error = false,
  className = '',
  size = 'md', // 'sm', 'md', 'lg'
  variant = 'default', // 'default', 'outline', 'filled'
  icon,
  label,
  required = false,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState(null)
  const [menuPosition, setMenuPosition] = useState('bottom')
  const dropdownRef = useRef(null)

  // Find selected option
  useEffect(() => {
    const option = options.find(opt => opt.value === value)
    setSelectedOption(option)
  }, [value, options])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  // Calculate menu position to prevent clipping
  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const menuHeight = 240 // max-height from CSS
      const spaceBelow = viewportHeight - rect.bottom
      const spaceAbove = rect.top
      
      // If there's not enough space below but enough space above, position above
      if (spaceBelow < menuHeight && spaceAbove > menuHeight) {
        setMenuPosition('top')
      } else {
        setMenuPosition('bottom')
      }
    }
  }, [isOpen])

  const handleSelect = (option) => {
    setSelectedOption(option)
    onChange?.(option.value)
    setIsOpen(false)
  }

  const handleKeyDown = (event) => {
    if (disabled) return

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault()
        setIsOpen(!isOpen)
        break
      case 'ArrowDown':
        event.preventDefault()
        if (!isOpen) {
          setIsOpen(true)
        }
        break
      case 'ArrowUp':
        event.preventDefault()
        if (isOpen) {
          setIsOpen(false)
        }
        break
    }
  }

  const dropdownVariants = {
    hidden: { 
      opacity: 0, 
      y: menuPosition === 'top' ? 10 : -10,
      transformOrigin: menuPosition === 'top' ? 'bottom' : 'top'
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.15,
        ease: 'easeOut'
      }
    },
    exit: { 
      opacity: 0, 
      y: menuPosition === 'top' ? 10 : -10,
      transition: {
        duration: 0.1,
        ease: 'easeIn'
      }
    }
  }

  return (
    <div 
      className={`dropdown-container ${className}`}
      ref={dropdownRef}
    >
      {label && (
        <label className={`dropdown-label ${required ? 'required' : ''}`}>
          {label}
        </label>
      )}
      
      <div
        className={`
          dropdown
          dropdown--${size}
          dropdown--${variant}
          ${disabled ? 'dropdown--disabled' : ''}
          ${error ? 'dropdown--error' : ''}
          ${isOpen ? 'dropdown--open' : ''}
        `}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={handleKeyDown}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={label || placeholder}
        {...props}
      >
        <div className="dropdown__content">
          {icon && (
            <div className="dropdown__icon">
              {icon}
            </div>
          )}
          
          <div className="dropdown__text">
            {selectedOption ? (
              <span className="dropdown__value">
                {selectedOption.icon && (
                  <span className="dropdown__option-icon">
                    {selectedOption.icon}
                  </span>
                )}
                {selectedOption.label}
              </span>
            ) : (
              <span className="dropdown__placeholder">
                {placeholder}
              </span>
            )}
          </div>
          
          <div className="dropdown__arrow">
            <FiChevronDown />
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="dropdown__menu"
              data-position={menuPosition}
              variants={dropdownVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              role="listbox"
            >
              {options.length === 0 ? (
                <div className="dropdown__empty">
                  No options available
                </div>
              ) : (
                options.map((option, index) => (
                  <div
                    key={option.value || index}
                    className={`
                      dropdown__option
                      ${option.value === value ? 'dropdown__option--selected' : ''}
                      ${option.disabled ? 'dropdown__option--disabled' : ''}
                    `}
                    onClick={() => !option.disabled && handleSelect(option)}
                    role="option"
                    aria-selected={option.value === value}
                    tabIndex={-1}
                  >
                    <div className="dropdown__option-content">
                      {option.icon && (
                        <span className="dropdown__option-icon">
                          {option.icon}
                        </span>
                      )}
                      <span className="dropdown__option-label">
                        {option.label}
                      </span>
                    </div>
                    
                    {option.value === value && (
                      <div className="dropdown__option-check">
                        <FiCheck />
                      </div>
                    )}
                  </div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {error && (
        <div className="dropdown__error">
          {error}
        </div>
      )}
    </div>
  )
}

export default Dropdown 