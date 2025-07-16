import React from 'react';
import { motion } from 'framer-motion';
import { IoChevronUp, IoChevronDown } from 'react-icons/io5';
import './SortDirectionButton.scss';

const SortDirectionButton = ({ 
  direction = 'asc', 
  onToggle, 
  className = '', 
  variant = 'arrow' // 'arrow' or 'chevron'
}) => {
  const handleClick = () => {
    onToggle(direction === 'asc' ? 'desc' : 'asc');
  };

  const isAscending = direction === 'asc';

  if (variant === 'chevron') {
    return (
      <motion.button
        className={`sort-direction-button sort-direction-button--chevron ${className}`}
        onClick={handleClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          className="sort-direction-button__icon-wrapper"
          animate={{ rotate: isAscending ? 0 : 180 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <IoChevronUp className="sort-direction-button__icon" />
        </motion.div>
      </motion.button>
    );
  }

  return (
    <motion.button
      className={`sort-direction-button sort-direction-button--arrow ${className}`}
      onClick={handleClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="sort-direction-button__icon-wrapper"
        animate={{ rotate: isAscending ? 0 : 180 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <span className="sort-direction-button__arrow">
          {isAscending ? '↑' : '↓'}
        </span>
      </motion.div>
    </motion.button>
  );
};

export default SortDirectionButton; 