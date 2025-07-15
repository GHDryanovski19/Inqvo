import CryptoJS from 'crypto-js'

// Encryption key (should match the one in AppContext)
const ENCRYPTION_KEY = 'inkblot-studio-2025'

// Export data to JSON file
export const exportData = (data, filename = 'inkblot-invoice-data.json') => {
  try {
    // Create a clean export object
    const exportData = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      data: {
        invoices: data.invoices || [],
        clients: data.clients || [],
        settings: data.settings || {}
      }
    }

    // Convert to JSON string
    const jsonString = JSON.stringify(exportData, null, 2)
    
    // Create blob and download
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    // Clean up
    URL.revokeObjectURL(url)
    
    return { success: true, message: 'Data exported successfully' }
  } catch (error) {
    console.error('Export failed:', error)
    return { success: false, message: 'Failed to export data' }
  }
}

// Export encrypted data
export const exportEncryptedData = (data, filename = 'inkblot-invoice-data-encrypted.json') => {
  try {
    // Create a clean export object
    const exportData = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      encrypted: true,
      data: {
        invoices: data.invoices || [],
        clients: data.clients || [],
        settings: data.settings || {}
      }
    }

    // Encrypt the data
    const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(exportData), ENCRYPTION_KEY).toString()
    
    // Create the final export object
    const finalExport = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      encrypted: true,
      data: encryptedData
    }

    // Convert to JSON string
    const jsonString = JSON.stringify(finalExport, null, 2)
    
    // Create blob and download
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    // Clean up
    URL.revokeObjectURL(url)
    
    return { success: true, message: 'Encrypted data exported successfully' }
  } catch (error) {
    console.error('Encrypted export failed:', error)
    return { success: false, message: 'Failed to export encrypted data' }
  }
}

// Import data from JSON file
export const importData = async (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const content = e.target.result
        const importedData = JSON.parse(content)
        
        // Validate the import structure
        if (!importedData.data || !importedData.version) {
          resolve({ 
            success: false, 
            message: 'Invalid file format. Please select a valid export file.' 
          })
          return
        }
        
        // Check if data is encrypted
        if (importedData.encrypted && importedData.data) {
          try {
            // Decrypt the data
            const bytes = CryptoJS.AES.decrypt(importedData.data, ENCRYPTION_KEY)
            const decryptedString = bytes.toString(CryptoJS.enc.Utf8)
            const decryptedData = JSON.parse(decryptedString)
            
            resolve({
              success: true,
              data: decryptedData.data,
              message: 'Encrypted data imported successfully'
            })
          } catch (decryptError) {
            resolve({
              success: false,
              message: 'Failed to decrypt data. The file may be corrupted or use a different encryption key.'
            })
          }
        } else {
          // Regular JSON import
          resolve({
            success: true,
            data: importedData.data,
            message: 'Data imported successfully'
          })
        }
      } catch (parseError) {
        resolve({
          success: false,
          message: 'Failed to parse file. Please select a valid JSON file.'
        })
      }
    }
    
    reader.onerror = () => {
      resolve({
        success: false,
        message: 'Failed to read file. Please try again.'
      })
    }
    
    reader.readAsText(file)
  })
}

// Export specific data types
export const exportInvoices = (invoices, filename = 'inkblot-invoices.json') => {
  return exportData({ invoices }, filename)
}

export const exportClients = (clients, filename = 'inkblot-clients.json') => {
  return exportData({ clients }, filename)
}

export const exportSettings = (settings, filename = 'inkblot-settings.json') => {
  return exportData({ settings }, filename)
}

// Generate backup filename with timestamp
export const generateBackupFilename = (prefix = 'inkblot-backup') => {
  const now = new Date()
  const timestamp = now.toISOString().slice(0, 19).replace(/:/g, '-')
  return `${prefix}-${timestamp}.json`
}

// Validate imported data structure
export const validateImportedData = (data) => {
  const errors = []
  
  if (!data) {
    errors.push('No data provided')
    return { valid: false, errors }
  }
  
  // Validate invoices
  if (data.invoices && Array.isArray(data.invoices)) {
    data.invoices.forEach((invoice, index) => {
      if (!invoice.id) errors.push(`Invoice ${index + 1}: Missing ID`)
      if (!invoice.number) errors.push(`Invoice ${index + 1}: Missing number`)
      if (!invoice.items || !Array.isArray(invoice.items)) {
        errors.push(`Invoice ${index + 1}: Invalid items structure`)
      }
    })
  }
  
  // Validate clients
  if (data.clients && Array.isArray(data.clients)) {
    data.clients.forEach((client, index) => {
      if (!client.id) errors.push(`Client ${index + 1}: Missing ID`)
      if (!client.name) errors.push(`Client ${index + 1}: Missing name`)
      if (!client.email) errors.push(`Client ${index + 1}: Missing email`)
    })
  }
  
  // Validate settings
  if (data.settings) {
    if (!data.settings.company) errors.push('Settings: Missing company information')
    if (!data.settings.invoice) errors.push('Settings: Missing invoice settings')
  }
  
  return {
    valid: errors.length === 0,
    errors
  }
} 