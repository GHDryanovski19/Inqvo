// Email Export utility for invoices
export const generateInvoiceEmail = (invoice, settings, formatCurrency) => {
  const totals = calculateInvoiceTotals(
    invoice.items || [], 
    invoice.vatRate || 20, 
    invoice.discountType || 'percentage', 
    invoice.discountValue || 0
  )

  const subject = `Invoice ${invoice.number} from ${settings.company.name}`

  const body = `
Dear ${invoice.client?.name || 'Valued Client'},

Please find attached invoice ${invoice.number} for the services provided.

Invoice Details:
- Invoice Number: ${invoice.number}
- Issue Date: ${formatDate(invoice.issueDate)}
- Due Date: ${formatDate(invoice.dueDate)}
- Total Amount: ${formatCurrency(totals.total)}

${invoice.items?.map(item => `- ${item.description}: ${item.quantity} x ${formatCurrency(item.rate)} = ${formatCurrency(item.quantity * item.rate)}`).join('\n') || ''}

${totals.discount > 0 ? `Discount: ${formatCurrency(totals.discount)}\n` : ''}
VAT (${invoice.vatRate}%): ${formatCurrency(totals.vat)}
Total: ${formatCurrency(totals.total)}

${settings.company.iban ? `Payment Details:\nBank Account: ${settings.company.iban}\nAccount Holder: ${settings.company.name}\n` : ''}

${invoice.notes ? `\nNotes:\n${invoice.notes}\n` : ''}

Thank you for your business!

Best regards,
${settings.company.name}
${settings.company.email || ''}
${settings.company.phone || ''}
  `.trim()

  return { subject, body }
}

// Generate email content for multiple invoices
export const generateBulkInvoiceEmail = (invoices, settings, formatCurrency) => {
  const subject = `Invoices from ${settings.company.name} - ${new Date().toLocaleDateString()}`

  const body = `
Dear Valued Client,

Please find attached ${invoices.length} invoice(s) for the services provided.

Invoice Summary:
${invoices.map(invoice => {
  const totals = calculateInvoiceTotals(
    invoice.items || [], 
    invoice.vatRate || 20, 
    invoice.discountType || 'percentage', 
    invoice.discountValue || 0
  )
  return `- ${invoice.number}: ${formatCurrency(totals.total)} (Due: ${formatDate(invoice.dueDate)})`
}).join('\n')}

Total Outstanding: ${formatCurrency(invoices.reduce((sum, invoice) => {
  const totals = calculateInvoiceTotals(
    invoice.items || [], 
    invoice.vatRate || 20, 
    invoice.discountType || 'percentage', 
    invoice.discountValue || 0
  )
  return sum + totals.total
}, 0))}

${settings.company.iban ? `Payment Details:\nBank Account: ${settings.company.iban}\nAccount Holder: ${settings.company.name}\n` : ''}

Thank you for your business!

Best regards,
${settings.company.name}
${settings.company.email || ''}
${settings.company.phone || ''}
  `.trim()

  return { subject, body }
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

// Helper function to format date
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

// Generate email template for invoice reminders
export const generateInvoiceReminder = (invoice, settings, formatCurrency) => {
  const totals = calculateInvoiceTotals(
    invoice.items || [], 
    invoice.vatRate || 20, 
    invoice.discountType || 'percentage', 
    invoice.discountValue || 0
  )

  const daysOverdue = Math.max(0, Math.floor((new Date() - new Date(invoice.dueDate)) / (1000 * 60 * 60 * 24)))

  const subject = `Payment Reminder - Invoice ${invoice.number}`

  const body = `
Dear ${invoice.client?.name || 'Valued Client'},

This is a friendly reminder that invoice ${invoice.number} for ${formatCurrency(totals.total)} is ${daysOverdue > 0 ? `${daysOverdue} day(s) overdue` : 'due soon'}.

Invoice Details:
- Invoice Number: ${invoice.number}
- Issue Date: ${formatDate(invoice.issueDate)}
- Due Date: ${formatDate(invoice.dueDate)}
- Amount Due: ${formatCurrency(totals.total)}

${settings.company.iban ? `Payment Details:\nBank Account: ${settings.company.iban}\nAccount Holder: ${settings.company.name}\n` : ''}

If you have already made the payment, please disregard this reminder. If you have any questions or need to discuss payment arrangements, please don't hesitate to contact us.

Thank you for your prompt attention to this matter.

Best regards,
${settings.company.name}
${settings.company.email || ''}
${settings.company.phone || ''}
  `.trim()

  return { subject, body }
}

// Generate email template for invoice receipts
export const generateInvoiceReceipt = (invoice, settings, formatCurrency) => {
  const totals = calculateInvoiceTotals(
    invoice.items || [], 
    invoice.vatRate || 20, 
    invoice.discountType || 'percentage', 
    invoice.discountValue || 0
  )

  const subject = `Payment Received - Invoice ${invoice.number}`

  const body = `
Dear ${invoice.client?.name || 'Valued Client'},

Thank you for your payment of ${formatCurrency(totals.total)} for invoice ${invoice.number}.

Payment Confirmation:
- Invoice Number: ${invoice.number}
- Amount Paid: ${formatCurrency(totals.total)}
- Payment Date: ${formatDate(new Date())}

We appreciate your business and look forward to working with you again in the future.

Best regards,
${settings.company.name}
${settings.company.email || ''}
${settings.company.phone || ''}
  `.trim()

  return { subject, body }
} 