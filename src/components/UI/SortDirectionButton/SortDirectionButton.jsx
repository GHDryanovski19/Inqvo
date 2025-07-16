import React from 'react'
import { FiChevronUp, FiChevronDown } from 'react-icons/fi'
import './SortDirectionButton.scss'

const SortDirectionButton = ({ 
  direction = 'desc', 
  onChange, 
  size = 'sm',
  variant = 'outline',
  className = '',
  title = 'Toggle sort direction'
}) => {
  const handleClick = () => {
    const newDirection = direction === 'asc' ? 'desc' : 'asc'
    onChange?.(newDirection)
  }

  return (
    <button
      className={`sort-direction-btn sort-direction-btn--${size} sort-direction-btn--${variant} ${className}`}
      onClick={handleClick}
      title={title}
      type="button"
    >
      {direction === 'asc' ? <FiChevronUp /> : <FiChevronDown />}
    </button>
  )
}

export default SortDirectionButton 