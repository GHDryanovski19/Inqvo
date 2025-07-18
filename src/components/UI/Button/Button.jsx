import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { buttonHover } from '../../../utils/animations'
import './Button.scss'

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className = '',
  compact = false,
  fullWidth = false,
  iconOnly = false,
  as,
  to,
  ...props
}) => {
  const baseClass = 'btn'
  const variantClass = `btn--${variant}`
  const sizeClass = `btn--${size}`
  const stateClass = disabled ? 'btn--disabled' : ''
  const loadingClass = loading ? 'btn--loading' : ''
  const compactClass = compact ? 'btn--compact' : ''
  const fullWidthClass = fullWidth ? 'btn--full-width' : ''
  const iconOnlyClass = iconOnly ? 'btn--icon-only' : ''
  
  const buttonClass = `${baseClass} ${variantClass} ${sizeClass} ${stateClass} ${loadingClass} ${compactClass} ${fullWidthClass} ${iconOnlyClass} ${className}`.trim()

  const handleClick = (e) => {
    if (!disabled && !loading && onClick) {
      onClick(e)
    }
  }

  // If as prop is provided and it's Link, render as Link
  if (as === Link && to) {
    return (
      <motion.div
        {...(!disabled && !loading ? buttonHover : {})}
      >
        <Link
          to={to}
          className={buttonClass}
          onClick={handleClick}
          {...props}
        >
          {loading && (
            <span className="btn__loader">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 2V6M12 18V22M4.93 4.93L7.76 7.76M16.24 16.24L19.07 19.07M2 12H6M18 12H22M4.93 19.07L7.76 16.24M16.24 7.76L19.07 4.93"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          )}
          <span className="btn__content">{children}</span>
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.button
      className={buttonClass}
      onClick={handleClick}
      type={type}
      disabled={disabled || loading}
      {...(!disabled && !loading ? buttonHover : {})}
      {...props}
    >
      {loading && (
        <span className="btn__loader">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 2V6M12 18V22M4.93 4.93L7.76 7.76M16.24 16.24L19.07 19.07M2 12H6M18 12H22M4.93 19.07L7.76 16.24M16.24 7.76L19.07 4.93"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      )}
      <span className="btn__content">{children}</span>
    </motion.button>
  )
}

export default Button 