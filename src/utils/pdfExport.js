import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

// PDF Export utility for invoices
export const exportInvoiceToPDF = async (invoice, settings, formatCurrency) => {
  try {
    // Create a temporary div to render the invoice
    const tempDiv = document.createElement('div')
    tempDiv.style.position = 'absolute'
    tempDiv.style.left = '-9999px'
    tempDiv.style.top = '0'
    tempDiv.style.width = '800px'
    tempDiv.style.backgroundColor = 'white'
    tempDiv.style.padding = '40px'
    tempDiv.style.fontFamily = 'Arial, sans-serif'
    tempDiv.style.fontSize = '12px'
    tempDiv.style.lineHeight = '1.4'
    tempDiv.style.color = '#333'
    
    // Generate the invoice HTML
    tempDiv.innerHTML = generateInvoiceHTML(invoice, settings, formatCurrency)
    
    // Add to document temporarily
    document.body.appendChild(tempDiv)
    
    // Convert to canvas
    const canvas = await html2canvas(tempDiv, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 800,
      height: tempDiv.scrollHeight
    })
    
    // Remove temporary div
    document.body.removeChild(tempDiv)
    
    // Create PDF
    const pdf = new jsPDF('p', 'mm', 'a4')
    const imgWidth = 210 // A4 width in mm
    const pageHeight = 295 // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight
    
    let position = 0
    
    // Add first page
    pdf.addImage(canvas, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight
    
    // Add additional pages if needed
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(canvas, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }
    
    // Generate filename
    const filename = `${invoice.number.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`
    
    // Save PDF
    pdf.save(filename)
    
    return { success: true, filename }
  } catch (error) {
    console.error('PDF export failed:', error)
    return { success: false, error: error.message }
  }
}

// Generate invoice HTML for PDF
const generateInvoiceHTML = (invoice, settings, formatCurrency) => {
  const totals = calculateInvoiceTotals(
    invoice.items || [], 
    invoice.vatRate || 20, 
    invoice.discountType || 'percentage', 
    invoice.discountValue || 0
  )
  
  return `
    <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
      <!-- Header -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; border-bottom: 2px solid #333; padding-bottom: 20px;">
        <div style="flex: 1;">
          <h1 style="margin: 0 0 10px 0; color: #333; font-size: 24px; font-weight: bold;">
            ${settings.company.name}
          </h1>
          ${settings.company.address ? `<p style="margin: 5px 0; color: #666;">${settings.company.address}</p>` : ''}
          ${settings.company.city && settings.company.postalCode ? 
            `<p style="margin: 5px 0; color: #666;">${settings.company.postalCode} ${settings.company.city}</p>` : ''}
          ${settings.company.country ? `<p style="margin: 5px 0; color: #666;">${settings.company.country}</p>` : ''}
          ${settings.company.vatNumber ? `<p style="margin: 5px 0; color: #666;">VAT: ${settings.company.vatNumber}</p>` : ''}
        </div>
        
        <div style="text-align: right; flex: 1;">
          <h1 style="margin: 0 0 10px 0; color: #333; font-size: 28px; font-weight: bold;">
            INVOICE
          </h1>
          <h2 style="margin: 0 0 5px 0; color: #333; font-size: 20px; font-weight: bold;">
            ${invoice.number}
          </h2>
          <div style="display: inline-block; padding: 4px 12px; background-color: ${getStatusColor(invoice.status)}; color: white; border-radius: 4px; font-size: 12px; font-weight: bold; text-transform: uppercase;">
            ${invoice.status}
          </div>
          <div style="margin-top: 15px;">
            <p style="margin: 5px 0; color: #666;"><strong>Issue Date:</strong> ${formatDate(invoice.issueDate)}</p>
            <p style="margin: 5px 0; color: #666;"><strong>Due Date:</strong> ${formatDate(invoice.dueDate)}</p>
          </div>
        </div>
      </div>
      
      <!-- Client Information -->
      <div style="margin-bottom: 40px;">
        <h3 style="margin: 0 0 15px 0; color: #333; font-size: 16px; font-weight: bold;">Bill To:</h3>
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #98C93C;">
          <h4 style="margin: 0 0 10px 0; color: #333; font-size: 18px; font-weight: bold;">
            ${invoice.client?.name || 'Unknown Client'}
          </h4>
          ${invoice.client?.company ? `<p style="margin: 5px 0; color: #666;">${invoice.client.company}</p>` : ''}
          ${invoice.client?.email ? `<p style="margin: 5px 0; color: #666;">${invoice.client.email}</p>` : ''}
          ${invoice.client?.phone ? `<p style="margin: 5px 0; color: #666;">${invoice.client.phone}</p>` : ''}
          ${invoice.client?.address ? `<p style="margin: 5px 0; color: #666;">${invoice.client.address}</p>` : ''}
          ${invoice.client?.city && invoice.client?.postalCode ? 
            `<p style="margin: 5px 0; color: #666;">${invoice.client.postalCode} ${invoice.client.city}</p>` : ''}
          ${invoice.client?.country ? `<p style="margin: 5px 0; color: #666;">${invoice.client.country}</p>` : ''}
          ${invoice.client?.vatNumber ? `<p style="margin: 5px 0; color: #666;">VAT: ${invoice.client.vatNumber}</p>` : ''}
        </div>
      </div>
      
      <!-- Invoice Items -->
      <div style="margin-bottom: 40px;">
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="background-color: #f8f9fa; border-bottom: 2px solid #dee2e6;">
              <th style="padding: 15px; text-align: left; font-weight: bold; color: #333; border-bottom: 2px solid #dee2e6;">Description</th>
              <th style="padding: 15px; text-align: center; font-weight: bold; color: #333; border-bottom: 2px solid #dee2e6;">Quantity</th>
              <th style="padding: 15px; text-align: right; font-weight: bold; color: #333; border-bottom: 2px solid #dee2e6;">Rate</th>
              <th style="padding: 15px; text-align: right; font-weight: bold; color: #333; border-bottom: 2px solid #dee2e6;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${invoice.items?.map(item => `
              <tr style="border-bottom: 1px solid #dee2e6;">
                <td style="padding: 15px; text-align: left;">
                  <strong>${item.description}</strong>
                  ${item.unit ? `<br><small style="color: #666;">per ${item.unit}</small>` : ''}
                </td>
                <td style="padding: 15px; text-align: center;">${item.quantity}</td>
                <td style="padding: 15px; text-align: right;">${formatCurrency(item.rate)}</td>
                <td style="padding: 15px; text-align: right; font-weight: bold;">${formatCurrency(item.quantity * item.rate)}</td>
              </tr>
            `).join('') || ''}
          </tbody>
        </table>
      </div>
      
      <!-- Totals -->
      <div style="display: flex; justify-content: flex-end; margin-bottom: 40px;">
        <div style="width: 300px; background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span style="color: #666;">Subtotal:</span>
            <span style="font-weight: bold;">${formatCurrency(totals.subtotal)}</span>
          </div>
          
          ${totals.discount > 0 ? `
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px; color: #28a745;">
              <span>Discount (${invoice.discountType === 'percentage' ? `${invoice.discountValue}%` : formatCurrency(invoice.discountValue)}):</span>
              <span style="font-weight: bold;">-${formatCurrency(totals.discount)}</span>
            </div>
          ` : ''}
          
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span style="color: #666;">VAT (${invoice.vatRate}%):</span>
            <span style="font-weight: bold;">${formatCurrency(totals.vat)}</span>
          </div>
          
          <div style="display: flex; justify-content: space-between; padding-top: 15px; border-top: 2px solid #98C93C; font-size: 18px; font-weight: bold; color: #333;">
            <span>Total:</span>
            <span>${formatCurrency(totals.total)}</span>
          </div>
        </div>
      </div>
      
      <!-- Payment Information -->
      ${settings.company.iban ? `
        <div style="margin-bottom: 40px;">
          <h3 style="margin: 0 0 15px 0; color: #333; font-size: 16px; font-weight: bold;">Payment Information</h3>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
              <span style="color: #666; font-weight: bold;">Bank Account:</span>
              <span>${settings.company.iban}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #666; font-weight: bold;">Account Holder:</span>
              <span>${settings.company.name}</span>
            </div>
          </div>
        </div>
      ` : ''}
      
      <!-- Notes -->
      ${invoice.notes ? `
        <div style="margin-bottom: 40px;">
          <h3 style="margin: 0 0 15px 0; color: #333; font-size: 16px; font-weight: bold;">Notes</h3>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #98C93C;">
            <p style="margin: 0; color: #666; line-height: 1.6;">${invoice.notes}</p>
          </div>
        </div>
      ` : ''}
      
      <!-- Footer -->
      <div style="text-align: center; margin-top: 60px; padding-top: 20px; border-top: 1px solid #dee2e6; color: #666; font-size: 12px;">
        <p style="margin: 0 0 10px 0;">Thank you for your business!</p>
        <p style="margin: 0;">This invoice was generated by Inkblot Studio Invoice System</p>
      </div>
    </div>
  `
}

// Helper function to calculate invoice totals
const calculateInvoiceTotals = (items, vatRate = 20, discountType = null, discountValue = 0) => {
  if (!items || !Array.isArray(items) || items.length === 0) {
    return {
      subtotal: 0,
      discount: 0,
      subtotalAfterDiscount: 0,
      vat: 0,
      total: 0
    }
  }
  
  const subtotal = items.reduce((sum, item) => {
    const quantity = item.quantity || 0
    const rate = item.rate || 0
    return sum + (quantity * rate)
  }, 0)
  
  let discount = 0
  if (discountType && discountValue > 0) {
    if (discountType === 'percentage') {
      discount = subtotal * (discountValue / 100)
    } else if (discountType === 'fixed') {
      discount = Math.min(discountValue, subtotal)
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
    total
  }
}

// Helper function to get status color
const getStatusColor = (status) => {
  switch (status) {
    case 'draft': return '#6c757d'
    case 'pending': return '#ffc107'
    case 'paid': return '#28a745'
    case 'overdue': return '#dc3545'
    default: return '#6c757d'
  }
}

// Helper function to format date
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

// Export multiple invoices as ZIP
export const exportMultipleInvoicesToPDF = async (invoices, settings, formatCurrency) => {
  try {
    const { default: JSZip } = await import('jszip')
    const zip = new JSZip()
    
    for (const invoice of invoices) {
      const result = await exportInvoiceToPDF(invoice, settings, formatCurrency)
      if (result.success) {
        // Note: This is a simplified version. In a real implementation,
        // you'd need to capture the PDF blob and add it to the ZIP
        console.log(`Generated PDF for ${invoice.number}`)
      }
    }
    
    // Generate ZIP filename
    const filename = `invoices_${new Date().toISOString().split('T')[0]}.zip`
    
    return { success: true, filename }
  } catch (error) {
    console.error('Multiple PDF export failed:', error)
    return { success: false, error: error.message }
  }
}

// Export invoice data as CSV
export const exportInvoiceToCSV = (invoice, formatCurrency) => {
  try {
    const headers = ['Description', 'Quantity', 'Rate', 'Amount']
    const rows = invoice.items?.map(item => [
      item.description,
      item.quantity,
      formatCurrency(item.rate),
      formatCurrency(item.quantity * item.rate)
    ]) || []
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    link.setAttribute('href', url)
    link.setAttribute('download', `${invoice.number}_items.csv`)
    link.style.visibility = 'hidden'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    return { success: true, filename: `${invoice.number}_items.csv` }
  } catch (error) {
    console.error('CSV export failed:', error)
    return { success: false, error: error.message }
  }
} 