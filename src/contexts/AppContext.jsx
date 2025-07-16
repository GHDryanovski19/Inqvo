import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { format } from 'date-fns'
import localforage from 'localforage'
import CryptoJS from 'crypto-js'

// Initialize localForage
localforage.config({
  name: 'inkblot-invoice-studio',
  storeName: 'invoices'
})

// Initial state
const initialState = {
  invoices: [],
  clients: [],
  settings: {
    company: {
      name: 'Inkblot Studio',
      address: '',
      city: 'София',
      postalCode: '',
      country: 'Bulgaria',
      vatNumber: '',
      idNumber: '',
      manager: '',
      phone: '',
      iban: '',
      bank: '',
      bankCode: '',
      logo: null
    },
    invoice: {
      prefix: 'INV',
      nextNumber: 1,
      currency: 'EUR',
      vatRate: 20,
      language: 'en',
      includeQR: true
    },
    theme: {
      primaryColor: '#98C93C',
      secondaryColor: '#2A9245'
    }
  },
  loading: false,
  error: null
}

// Action types
const ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  LOAD_DATA: 'LOAD_DATA',
  ADD_INVOICE: 'ADD_INVOICE',
  UPDATE_INVOICE: 'UPDATE_INVOICE',
  DELETE_INVOICE: 'DELETE_INVOICE',
  ADD_CLIENT: 'ADD_CLIENT',
  UPDATE_CLIENT: 'UPDATE_CLIENT',
  DELETE_CLIENT: 'DELETE_CLIENT',
  UPDATE_SETTINGS: 'UPDATE_SETTINGS',
  CLEAR_DATA: 'CLEAR_DATA',
  IMPORT_INVOICES: 'IMPORT_INVOICES',
  IMPORT_CLIENTS: 'IMPORT_CLIENTS',
  CLEAR_ALL_DATA: 'CLEAR_ALL_DATA'
}

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload }
    
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false }
    
    case ACTIONS.LOAD_DATA:
      return { 
        ...state, 
        invoices: action.payload.invoices || [],
        clients: action.payload.clients || [],
        settings: { ...state.settings, ...action.payload.settings },
        loading: false 
      }
    
    case ACTIONS.ADD_INVOICE:
      return { 
        ...state, 
        invoices: [...state.invoices, action.payload],
        settings: {
          ...state.settings,
          invoice: {
            ...state.settings.invoice,
            nextNumber: state.settings.invoice.nextNumber + 1
          }
        }
      }
    
    case ACTIONS.UPDATE_INVOICE:
      return {
        ...state,
        invoices: state.invoices.map(invoice =>
          invoice.id === action.payload.id ? action.payload : invoice
        )
      }
    
    case ACTIONS.DELETE_INVOICE:
      return {
        ...state,
        invoices: state.invoices.filter(invoice => invoice.id !== action.payload)
      }
    
    case ACTIONS.ADD_CLIENT:
      return { ...state, clients: [...state.clients, action.payload] }
    
    case ACTIONS.UPDATE_CLIENT:
      return {
        ...state,
        clients: state.clients.map(client =>
          client.id === action.payload.id ? action.payload : client
        )
      }
    
    case ACTIONS.DELETE_CLIENT:
      return {
        ...state,
        clients: state.clients.filter(client => client.id !== action.payload)
      }
    
    case ACTIONS.UPDATE_SETTINGS:
      return {
        ...state,
        settings: { ...state.settings, ...action.payload }
      }
    
    case ACTIONS.CLEAR_DATA:
      return { ...initialState }
    
    case ACTIONS.IMPORT_INVOICES:
      return {
        ...state,
        invoices: action.payload
      }
    
    case ACTIONS.IMPORT_CLIENTS:
      return {
        ...state,
        clients: action.payload
      }
    
    case ACTIONS.CLEAR_ALL_DATA:
      return {
        ...state,
        invoices: [],
        clients: [],
        settings: {
          company: {
            name: 'Inkblot Studio',
            address: '',
            city: 'София',
            postalCode: '',
            country: 'Bulgaria',
            vatNumber: '',
            idNumber: '',
            manager: '',
            phone: '',
            iban: '',
            bank: '',
            bankCode: '',
            logo: null
          },
          invoice: {
            prefix: 'INV',
            nextNumber: 1,
            currency: 'EUR',
            vatRate: 20,
            language: 'en',
            includeQR: false
          },
          theme: {
            primaryColor: '#98C93C',
            secondaryColor: '#2A9245'
          }
        }
      }
    
    default:
      return state
  }
}

// Create context
const AppContext = createContext()

// Provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState)

  // Encryption key (in production, this should be more secure)
  const ENCRYPTION_KEY = 'inkblot-studio-2025'

  // Encrypt data
  const encryptData = (data) => {
    return CryptoJS.AES.encrypt(JSON.stringify(data), ENCRYPTION_KEY).toString()
  }

  // Decrypt data
  const decryptData = (encryptedData) => {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY)
      return JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
    } catch (error) {
      console.error('Decryption failed:', error)
      return null
    }
  }

  // Save data to storage
  const saveData = async (data) => {
    try {
      const encryptedData = encryptData(data)
      await localforage.setItem('app-data', encryptedData)
    } catch (error) {
      console.error('Failed to save data:', error)
      dispatch({ type: ACTIONS.SET_ERROR, payload: 'Failed to save data' })
    }
  }

  // Load data from storage
  const loadData = async () => {
    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true })
      const encryptedData = await localforage.getItem('app-data')
      
      if (encryptedData) {
        const decryptedData = decryptData(encryptedData)
        if (decryptedData) {
          dispatch({ type: ACTIONS.LOAD_DATA, payload: decryptedData })
        }
      }
    } catch (error) {
      console.error('Failed to load data:', error)
      dispatch({ type: ACTIONS.SET_ERROR, payload: 'Failed to load data' })
    }
  }

  // Auto-save when state changes
  useEffect(() => {
    if (!state.loading) {
      const dataToSave = {
        invoices: state.invoices,
        clients: state.clients,
        settings: state.settings
      }
      saveData(dataToSave)
    }
  }, [state.invoices, state.clients, state.settings])

  // Apply theme colors dynamically
  useEffect(() => {
    const applyThemeColors = () => {
      const root = document.documentElement
      const { primaryColor, secondaryColor } = state.settings.theme
      
      // Convert hex to RGB for CSS custom properties
      const hexToRgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
        return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : null
      }
      
      const primaryRgb = hexToRgb(primaryColor)
      const secondaryRgb = hexToRgb(secondaryColor)
      
      if (primaryRgb) {
        root.style.setProperty('--primary-color', primaryColor)
        root.style.setProperty('--primary-rgb', primaryRgb)
      }
      
      if (secondaryRgb) {
        root.style.setProperty('--secondary-color', secondaryColor)
        root.style.setProperty('--secondary-rgb', secondaryRgb)
      }
    }
    
    applyThemeColors()
  }, [state.settings.theme])

  // Load data on mount
  useEffect(() => {
    loadData()
  }, [])

  // Helper functions
  const generateInvoiceNumber = () => {
    const year = new Date().getFullYear()
    const number = state.settings.invoice.nextNumber.toString().padStart(4, '0')
    return `${state.settings.invoice.prefix}-${year}-${number}`
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
    }).format(amount)
  }

  const calculateInvoiceTotals = (items, vatRate = 20, discountType = null, discountValue = 0) => {
    // Ensure items is an array and has valid data
    if (!items || !Array.isArray(items) || items.length === 0) {
      return {
        subtotal: 0,
        discount: 0,
        subtotalAfterDiscount: 0,
        vat: 0,
        total: 0,
        vatRate,
        discountType,
        discountValue
      }
    }
    
    const subtotal = items.reduce((sum, item) => {
      const quantity = item.quantity || 0
      const rate = item.rate || 0
      return sum + (quantity * rate)
    }, 0)
    
    // Calculate discount
    let discount = 0
    if (discountType && discountValue > 0) {
      if (discountType === 'percentage') {
        discount = subtotal * (discountValue / 100)
      } else if (discountType === 'fixed') {
        discount = Math.min(discountValue, subtotal) // Don't discount more than subtotal
      }
    }
    
    const subtotalAfterDiscount = subtotal - discount
    const vat = subtotalAfterDiscount * (vatRate / 100)
    const total = subtotalAfterDiscount + vat
    
    return {
      subtotal,
      discount,
      subtotalAfterDiscount,
      vat,
      total,
      vatRate,
      discountType,
      discountValue
    }
  }

  // Generate BIC/SWIFT code from IBAN
  const generateBICFromIBAN = (iban) => {
    if (!iban || iban.length < 8) return ''
    
    // Extract country code and bank code from IBAN
    const countryCode = iban.substring(0, 2).toUpperCase()
    const bankCode = iban.substring(4, 8).toUpperCase()
    
    // Bulgarian banks mapping
    const bulgarianBanks = {
      'BG': {
        'STSA': 'STSABGSF', // DSK Bank
        'BNPA': 'BNPABGSF', // BNP Paribas
        'UNCR': 'UNCRBGSF', // UniCredit Bulbank
        'RZBA': 'RZBABGSF', // Raiffeisen Bank
        'CITI': 'CITIBGSF', // Citibank
        'UBBS': 'UBBSBGSF', // UBB
        'PIRB': 'PIRBBGSF', // Piraeus Bank
        'TEXI': 'TEXIBGSF', // Texim Bank
        'DEMI': 'DEMIBGSF', // Demir Bank
        'FIBB': 'FIBBBGSF', // First Investment Bank
        'CCPA': 'CCPABGSF', // Central Cooperative Bank
        'BULB': 'BULBBGSF', // Bulgarian Development Bank
        'BULG': 'BULGBGSF', // Bulgarian National Bank
        'BULS': 'BULSBGSF', // Bulgarian-American Credit Bank
        'BULV': 'BULVBGSF', // Bulgarian Post Bank
        'BULX': 'BULXBGSF', // Bulgarian Agricultural Bank
        'BULY': 'BULYBGSF', // Bulgarian Export-Import Bank
        'BULZ': 'BULZBGSF', // Bulgarian Industrial Bank
        'BULA': 'BULABGSF', // Bulgarian Commercial Bank
        'BULC': 'BULCBGSF', // Bulgarian Cooperative Bank
        'BULD': 'BULDBGSF', // Bulgarian Savings Bank
        'BULE': 'BULEBGSF', // Bulgarian Investment Bank
        'BULF': 'BULFBGSF', // Bulgarian Mortgage Bank
        'BULH': 'BULHBGSF', // Bulgarian Housing Bank
        'BULI': 'BULIBGSF', // Bulgarian Insurance Bank
        'BULJ': 'BULJBGSF', // Bulgarian Pension Bank
        'BULK': 'BULKBGSF', // Bulgarian Social Bank
        'BULL': 'BULLBGSF', // Bulgarian Municipal Bank
        'BULM': 'BULMBGSF', // Bulgarian Regional Bank
        'BULN': 'BULNBGSF', // Bulgarian District Bank
        'BULO': 'BULOBGSF', // Bulgarian City Bank
        'BULP': 'BULPBGSF', // Bulgarian Town Bank
        'BULQ': 'BULQBGSF', // Bulgarian Village Bank
        'BULR': 'BULRBGSF', // Bulgarian Community Bank
        'BULT': 'BULTBGSF', // Bulgarian Local Bank
        'BULU': 'BULUBGSF', // Bulgarian State Bank
        'BULW': 'BULWBGSF', // Bulgarian Public Bank
        'BULX': 'BULXBGSF', // Bulgarian Private Bank
        'BULY': 'BULYBGSF', // Bulgarian Foreign Bank
        'BULZ': 'BULZBGSF', // Bulgarian International Bank
      }
    }
    
    // Return mapped BIC or generate generic one
    if (bulgarianBanks[countryCode] && bulgarianBanks[countryCode][bankCode]) {
      return bulgarianBanks[countryCode][bankCode]
    }
    
    // Generate generic BIC if not found in mapping
    return `${bankCode}${countryCode}SF`
  }

  // Extract VAT number from EIK (remove BG prefix if present)
  const extractVATFromEIK = (eik) => {
    if (!eik) return ''
    // Remove BG prefix if present and return only numbers
    return eik.replace(/^BG/i, '').replace(/\D/g, '')
  }

  // Generate EIK from VAT number (add BG prefix)
  const generateEIKFromVAT = (vat) => {
    if (!vat) return ''
    // Add BG prefix if not present
    return vat.startsWith('BG') ? vat : `BG${vat}`
  }

  // Simple translation function (can be enhanced with API later)
  const translateText = async (text, targetLang = 'bg') => {
    if (!text) return text
    
    // Simple mapping for common terms (can be replaced with API call)
    const translations = {
      'en': {
        'Invoice': 'Фактура',
        'Original': 'Оригинал',
        'Recipient': 'Получател',
        'Supplier': 'Доставчик',
        'Description': 'Описание',
        'Quantity': 'Количество',
        'Unit Price': 'Единична цена',
        'Amount': 'Сума',
        'Subtotal': 'Междинна сума',
        'VAT': 'ДДС',
        'Total': 'Обща сума',
        'Amount in words': 'Сума с думи',
        'Payment method': 'Начин на плащане',
        'Bank details': 'Банкови детайли',
        'Notes': 'Бележки',
        'Terms': 'Условия',
        'Date of issue': 'Дата на издаване',
        'Due date': 'Дата на плащане',
        'Transaction basis': 'Основание на сделката',
        'Transaction description': 'Описание на сделката',
        'Place of transaction': 'Място на сделката',
        'Received by': 'Получил',
        'Payment': 'Плащане',
        'Prepared by': 'Съставил',
        'VAT Number': 'ДДС номер',
        'ID Number': 'Идент. номер',
        'Manager': 'МОЛ',
        'Phone': 'Телефон',
        'Address': 'Адрес',
        'City': 'Град',
        'Country': 'Държава',
        'Bank': 'Банка',
        'Bank Code': 'Банков код'
      },
      'bg': {
        'Фактура': 'Invoice',
        'Оригинал': 'Original',
        'Получател': 'Recipient',
        'Доставчик': 'Supplier',
        'Описание': 'Description',
        'Количество': 'Quantity',
        'Единична цена': 'Unit Price',
        'Сума': 'Amount',
        'Междинна сума': 'Subtotal',
        'ДДС': 'VAT',
        'Обща сума': 'Total',
        'Сума с думи': 'Amount in words',
        'Начин на плащане': 'Payment method',
        'Банкови детайли': 'Bank details',
        'Бележки': 'Notes',
        'Условия': 'Terms',
        'Дата на издаване': 'Date of issue',
        'Дата на плащане': 'Due date',
        'Основание на сделката': 'Transaction basis',
        'Описание на сделката': 'Transaction description',
        'Място на сделката': 'Place of transaction',
        'Получил': 'Received by',
        'Плащане': 'Payment',
        'Съставил': 'Prepared by',
        'ДДС номер': 'VAT Number',
        'Идент. номер': 'ID Number',
        'МОЛ': 'Manager',
        'Телефон': 'Phone',
        'Адрес': 'Address',
        'Град': 'City',
        'Държава': 'Country',
        'Банка': 'Bank',
        'Банков код': 'Bank Code'
      }
    }
    
    // Return translation if available, otherwise return original text
    return translations[targetLang]?.[text] || text
  }

  const value = {
    ...state,
    dispatch,
    generateInvoiceNumber,
    formatCurrency,
    calculateInvoiceTotals,
    generateBICFromIBAN,
    extractVATFromEIK,
    generateEIKFromVAT,
    translateText,
    saveData,
    loadData
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

// Custom hook to use the context
export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
} 