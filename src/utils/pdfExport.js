import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

// PDF Export utility for invoices with Bulgarian legal compliance
export const exportInvoiceToPDF = async (invoice, settings, formatCurrency) => {
  try {
    // Create a simple, clean HTML structure for PDF generation
    const tempDiv = document.createElement('div')
    tempDiv.style.position = 'absolute'
    tempDiv.style.left = '-9999px'
    tempDiv.style.top = '0'
    tempDiv.style.width = '800px'
    tempDiv.style.backgroundColor = 'white'
    tempDiv.style.fontFamily = 'Arial, sans-serif'
    tempDiv.style.fontSize = '12px'
    tempDiv.style.lineHeight = '1.4'
    tempDiv.style.color = '#333'
    tempDiv.style.padding = '20px'
    
    // Generate simple, clean invoice HTML
    tempDiv.innerHTML = generateSimpleInvoiceHTML(invoice, settings, formatCurrency)
    
    // Add to document temporarily
    document.body.appendChild(tempDiv)
    
    // Convert to canvas with basic settings
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

// Generate simple, clean invoice HTML for PDF
const generateSimpleInvoiceHTML = (invoice, settings, formatCurrency) => {
  const totals = calculateInvoiceTotals(
    invoice.items || [], 
    invoice.vatRate || 20, 
    invoice.discountType || 'percentage', 
    invoice.discountValue || 0
  )
  
  // Convert amount to words (Bulgarian)
  const amountInWords = convertToBulgarianWords(totals.total)
  
  // Helper function to extract VAT from EIK
  const extractVATFromEIK = (eik) => {
    if (!eik) return ''
    return eik.replace(/^BG/i, '').replace(/\D/g, '')
  }

  // Helper function to get payment method display text in Bulgarian
  const getPaymentMethodTextBG = (method) => {
    const paymentMethods = {
      'bank_transfer': 'Банков превод',
      'cash': 'В брой',
      'card': 'С карта',
      'check': 'Чек',
      'По сметка': 'Банков превод',
      'В брой': 'В брой',
      'С карта': 'С карта',
      'Чек': 'Чек'
    }
    return paymentMethods[method] || method || 'Банков превод'
  }

  // Helper function to translate city names
  const translateCity = (cityName, language = 'bg') => {
    if (!cityName) return ''
    const cityTranslations = {
      'en': {
        'Sofia': 'Sofia',
        'София': 'Sofia',
        'Burgas': 'Burgas',
        'Бургас': 'Burgas',
        'Varna': 'Varna',
        'Варна': 'Varna',
        'Plovdiv': 'Plovdiv',
        'Пловдив': 'Plovdiv',
        'Ruse': 'Ruse',
        'Русе': 'Ruse',
        'Stara Zagora': 'Stara Zagora',
        'Стара Загора': 'Stara Zagora',
        'Pleven': 'Pleven',
        'Плевен': 'Pleven',
        'Sliven': 'Sliven',
        'Сливен': 'Sliven',
        'Dobrich': 'Dobrich',
        'Добрич': 'Dobrich',
        'Shumen': 'Shumen',
        'Шумен': 'Shumen'
      },
      'bg': {
        'Sofia': 'София',
        'София': 'София',
        'Burgas': 'Бургас',
        'Бургас': 'Бургас',
        'Varna': 'Варна',
        'Варна': 'Варна',
        'Plovdiv': 'Пловдив',
        'Пловдив': 'Пловдив',
        'Ruse': 'Русе',
        'Русе': 'Русе',
        'Stara Zagora': 'Стара Загора',
        'Стара Загора': 'Стара Загора',
        'Pleven': 'Плевен',
        'Плевен': 'Плевен',
        'Sliven': 'Сливен',
        'Сливен': 'Сливен',
        'Dobrich': 'Добрич',
        'Добрич': 'Добрич',
        'Shumen': 'Шумен',
        'Шумен': 'Шумен'
      }
    }
    return cityTranslations[language]?.[cityName] || cityName
  }
  
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 800px; margin: 0 auto; color: #1d1d1f; background: white; line-height: 1.6;">
      
      <!-- Premium Header -->
      <div style="text-align: center; margin-bottom: 40px; padding: 40px 0; background: linear-gradient(135deg, #007AFF 0%, #5856D6 100%); color: white; border-radius: 16px;">
        <h1 style="font-size: 32px; margin: 0 0 8px 0; color: white; font-weight: 600; letter-spacing: -0.5px;">ФАКТУРА</h1>
        <h2 style="font-size: 24px; margin: 0; color: rgba(255, 255, 255, 0.9); font-weight: 400;">№ ${invoice.number}</h2>
        <div style="margin-top: 20px; font-size: 16px; opacity: 0.8;">
          <div style="margin-bottom: 8px;">Дата на издаване: ${formatDate(invoice.issueDate)}</div>
          <div>Дата на плащане: ${formatDate(invoice.dueDate)}</div>
        </div>
      </div>

      <!-- Company Information -->
      <div style="margin-bottom: 40px;">
        <h3 style="font-size: 18px; margin: 0 0 20px 0; color: #1d1d1f; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Издател</h3>
        <div style="background: #f5f5f7; padding: 24px; border-radius: 12px; border-left: 4px solid #007AFF;">
          <h4 style="font-size: 22px; margin: 0 0 16px 0; color: #1d1d1f; font-weight: 600;">${settings.company.name}</h4>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; font-size: 14px; color: #6e6e73;">
            ${settings.company.address ? `<div><strong>Адрес:</strong><br>${settings.company.address}</div>` : ''}
            ${settings.company.city && settings.company.postalCode ? `<div><strong>Град:</strong><br>${settings.company.postalCode} ${settings.company.city}</div>` : ''}
            ${settings.company.country ? `<div><strong>Държава:</strong><br>${settings.company.country}</div>` : ''}
            ${settings.company.vatNumber ? `<div><strong>ДДС номер:</strong><br>${settings.company.vatNumber}</div>` : ''}
            ${settings.company.idNumber ? `<div><strong>ЕИК:</strong><br>${extractVATFromEIK(settings.company.idNumber)}</div>` : ''}
            ${settings.company.manager ? `<div><strong>МОЛ:</strong><br>${settings.company.manager}</div>` : ''}
            ${settings.company.phone ? `<div><strong>Тел:</strong><br>${settings.company.phone}</div>` : ''}
            ${settings.company.bankDetails ? `<div><strong>Банка:</strong><br>${settings.company.bankDetails}</div>` : ''}
          </div>
        </div>
      </div>

      <!-- Client Information -->
      <div style="margin-bottom: 40px;">
        <h3 style="font-size: 18px; margin: 0 0 20px 0; color: #1d1d1f; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Получател</h3>
        <div style="background: #f5f5f7; padding: 24px; border-radius: 12px; border-left: 4px solid #34C759;">
          <h4 style="font-size: 22px; margin: 0 0 16px 0; color: #1d1d1f; font-weight: 600;">${invoice.client?.name || 'Неизвестен клиент'}</h4>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; font-size: 14px; color: #6e6e73;">
            ${invoice.client?.company ? `<div><strong>Компания:</strong><br>${invoice.client.company}</div>` : ''}
            ${invoice.client?.email ? `<div><strong>Email:</strong><br>${invoice.client.email}</div>` : ''}
            ${invoice.client?.phone ? `<div><strong>Тел:</strong><br>${invoice.client.phone}</div>` : ''}
            ${invoice.client?.address ? `<div><strong>Адрес:</strong><br>${invoice.client.address}</div>` : ''}
            ${invoice.client?.city && invoice.client?.postalCode ? `<div><strong>Град:</strong><br>${invoice.client.postalCode} ${invoice.client.city}</div>` : ''}
            ${invoice.client?.country ? `<div><strong>Държава:</strong><br>${invoice.client.country}</div>` : ''}
            ${invoice.client?.vatNumber ? `<div><strong>ДДС номер:</strong><br>${invoice.client.vatNumber}</div>` : ''}
            ${invoice.client?.idNumber ? `<div><strong>ЕИК:</strong><br>${extractVATFromEIK(invoice.client.idNumber)}</div>` : ''}
          </div>
        </div>
      </div>

      <!-- Invoice Items -->
      <div style="margin-bottom: 40px;">
        <h3 style="font-size: 18px; margin: 0 0 20px 0; color: #1d1d1f; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Артикули</h3>
        <div style="border: 1px solid #e5e5e7; border-radius: 12px; overflow: hidden;">
          <div style="background: #f5f5f7; padding: 16px 24px; border-bottom: 1px solid #e5e5e7;">
            <div style="display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 16px; font-weight: 600; color: #1d1d1f; font-size: 14px;">
              <div>Описание</div>
              <div style="text-align: center;">Количество</div>
              <div style="text-align: right;">Единична цена</div>
              <div style="text-align: right;">Сума</div>
            </div>
          </div>
          
          <div>
            ${invoice.items?.map((item, index) => `
              <div style="display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 16px; padding: 16px 24px; border-bottom: 1px solid #e5e5e7; ${index % 2 === 0 ? 'background: #fafafa;' : ''}">
                <div>
                  <div style="font-weight: 500; color: #1d1d1f; margin-bottom: 4px;">${item.description}</div>
                  ${item.unit ? `<div style="font-size: 12px; color: #6e6e73;">за ${item.unit}</div>` : ''}
                </div>
                <div style="text-align: center; color: #1d1d1f;">${item.quantity}</div>
                <div style="text-align: right; color: #1d1d1f;">${formatCurrency(item.rate)}</div>
                <div style="text-align: right; font-weight: 600; color: #1d1d1f;">${formatCurrency(item.quantity * item.rate)}</div>
              </div>
            `).join('') || ''}
          </div>
        </div>
      </div>

      <!-- Invoice Totals -->
      <div style="margin-bottom: 40px;">
        <div style="max-width: 400px; margin-left: auto; background: #f5f5f7; padding: 24px; border-radius: 12px;">
          <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e5e7; font-size: 16px;">
            <span style="color: #6e6e73;">Междинна сума:</span>
            <span style="font-weight: 500; color: #1d1d1f;">${formatCurrency(totals.subtotal)}</span>
          </div>
          
          ${totals.discount > 0 ? `
            <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e5e7; font-size: 16px;">
              <span style="color: #6e6e73;">
                Отстъпка ${totals.discountType === 'percentage' ? `(${totals.discountValue}%)` : ''}:
              </span>
              <span style="color: #FF3B30; font-weight: 500;">-${formatCurrency(totals.discount)}</span>
            </div>
          ` : ''}
          
          <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e5e7; font-size: 16px;">
            <span style="color: #6e6e73;">ДДС (${totals.vatRate}%):</span>
            <span style="font-weight: 500; color: #1d1d1f;">${formatCurrency(totals.vat)}</span>
          </div>
          
          <div style="display: flex; justify-content: space-between; padding: 16px 0; margin-top: 16px; border-top: 2px solid #007AFF;">
            <span style="font-weight: 600; font-size: 20px; color: #1d1d1f;">Обща сума:</span>
            <span style="font-weight: 700; font-size: 20px; color: #007AFF;">${formatCurrency(totals.total)}</span>
          </div>
        </div>
      </div>

      <!-- Amount in Words -->
      <div style="margin-bottom: 40px; padding: 20px; background: linear-gradient(135deg, #f5f5f7 0%, #e5e5e7 100%); border-radius: 12px; border-left: 4px solid #FF9500;">
        <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #1d1d1f;">
          <strong style="color: #FF9500;">Сума с думи:</strong> ${amountInWords}
        </p>
      </div>

      <!-- Payment Method -->
      ${invoice.paymentMethod ? `
        <div style="margin-bottom: 40px;">
          <div style="background: #f5f5f7; padding: 20px; border-radius: 12px;">
            <p style="margin: 0; font-size: 16px; color: #1d1d1f;">
              <strong style="color: #007AFF;">Начин на плащане:</strong> ${getPaymentMethodTextBG(invoice.paymentMethod)}
            </p>
          </div>
        </div>
      ` : ''}

      <!-- Bank Details -->
      <div style="margin-bottom: 40px;">
        <h3 style="font-size: 18px; margin: 0 0 20px 0; color: #1d1d1f; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Банкови детайли</h3>
        <div style="background: #f5f5f7; padding: 24px; border-radius: 12px; border-left: 4px solid #5856D6;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; font-size: 14px; color: #6e6e73;">
            ${settings.company.iban ? `<div><strong>IBAN:</strong><br><span style="font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace; color: #007AFF;">${settings.company.iban}</span></div>` : ''}
            ${settings.company.bank ? `<div><strong>Банка:</strong><br>${settings.company.bank}</div>` : ''}
            ${settings.company.bankCode ? `<div><strong>Банков код:</strong><br>${settings.company.bankCode}</div>` : ''}
          </div>
        </div>
      </div>

      <!-- Place of Issue -->
      ${invoice.place ? `
        <div style="margin-bottom: 40px;">
          <div style="background: #f5f5f7; padding: 20px; border-radius: 12px;">
            <p style="margin: 0; font-size: 16px; color: #1d1d1f;">
              <strong style="color: #007AFF;">Място на издаване:</strong> ${invoice.place}
            </p>
          </div>
        </div>
      ` : ''}

      <!-- Invoice Notes -->
      ${invoice.notes ? `
        <div style="margin-bottom: 40px;">
          <h3 style="font-size: 18px; margin: 0 0 20px 0; color: #1d1d1f; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Бележки</h3>
          <div style="background: #f5f5f7; padding: 24px; border-radius: 12px;">
            <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #1d1d1f;">${invoice.notes}</p>
          </div>
        </div>
      ` : ''}

      <!-- Invoice Terms -->
      ${invoice.terms ? `
        <div style="margin-bottom: 40px;">
          <h3 style="font-size: 18px; margin: 0 0 20px 0; color: #1d1d1f; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Условия</h3>
          <div style="background: #f5f5f7; padding: 24px; border-radius: 12px;">
            <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #1d1d1f;">${invoice.terms}</p>
          </div>
        </div>
      ` : ''}

      <!-- Legal Disclaimer -->
      <div style="margin-top: 60px; padding: 24px; background: linear-gradient(135deg, #f5f5f7 0%, #e5e5e7 100%); border-radius: 12px; text-align: center; border: 1px solid #e5e5e7;">
        <p style="margin: 0; color: #6e6e73; font-size: 14px; line-height: 1.5; font-style: italic;">
          Тази фактура е издадена съгласно Закона за счетоводството и Закона за ДДС. 
          Плащането трябва да бъде извършено в срок до ${formatDate(invoice.dueDate)}.
        </p>
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
    case 'draft': return '#6B7280'
    case 'sent': return '#3B82F6'
    case 'paid': return '#10B981'
    case 'overdue': return '#EF4444'
    case 'cancelled': return '#9CA3AF'
    default: return '#6B7280'
  }
}

// Helper function to format date
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('bg-BG')
}

// Helper function to convert number to Bulgarian words
export const convertToBulgarianWords = (amount) => {
  const units = ['', 'един', 'два', 'три', 'четири', 'пет', 'шест', 'седем', 'осем', 'девет']
  const teens = ['десет', 'единадесет', 'дванадесет', 'тринадесет', 'четиринадесет', 'петнадесет', 'шестнадесет', 'седемнадесет', 'осемнадесет', 'деветнадесет']
  const tens = ['', '', 'двадесет', 'тридесет', 'четиридесет', 'петдесет', 'шестдесет', 'седемдесет', 'осемдесет', 'деветдесет']
  const hundreds = ['', 'сто', 'двеста', 'триста', 'четиристотин', 'петстотин', 'шестстотин', 'седемстотин', 'осемстотин', 'деветстотин']
  
  let num = Math.floor(amount)
  const decimal = Math.round((amount - num) * 100)
  
  if (num === 0) return 'нула евро'
  
  let result = ''
  
  // Convert integer part
  if (num >= 1000000) {
    const millions = Math.floor(num / 1000000)
    result += convertToBulgarianWords(millions).replace(' евро', '') + ' милион'
    if (millions > 1) result += 'а'
    result += ' '
    num = num % 1000000
  }
  
  if (num >= 1000) {
    const thousands = Math.floor(num / 1000)
    if (thousands === 1) {
      result += 'хиляда '
    } else {
      result += convertToBulgarianWords(thousands).replace(' евро', '') + ' хиляди '
    }
    num = num % 1000
  }
  
  if (num >= 100) {
    result += hundreds[Math.floor(num / 100)] + ' '
    num = num % 100
  }
  
  if (num >= 20) {
    result += tens[Math.floor(num / 10)] + ' '
    num = num % 10
  } else if (num >= 10) {
    result += teens[num - 10] + ' '
    num = 0
  }
  
  if (num > 0) {
    result += units[num] + ' '
  }
  
  result += 'евро'
  
  // Add decimal part
  if (decimal > 0) {
    result += ' и ' + convertToBulgarianWords(decimal).replace(' евро', '') + ' цента'
  }
  
  return result
}

// Export multiple invoices to PDF
export const exportMultipleInvoicesToPDF = async (invoices, settings, formatCurrency) => {
  try {
    const pdf = new jsPDF('p', 'mm', 'a4')
    
    for (let i = 0; i < invoices.length; i++) {
      if (i > 0) {
        pdf.addPage()
      }
      
      const invoice = invoices[i]
      const tempDiv = document.createElement('div')
      tempDiv.style.position = 'absolute'
      tempDiv.style.left = '-9999px'
      tempDiv.style.width = '800px'
      tempDiv.style.backgroundColor = 'white'
      tempDiv.style.padding = '40px'
      tempDiv.style.fontFamily = 'Arial, sans-serif'
      tempDiv.style.fontSize = '12px'
      tempDiv.style.lineHeight = '1.4'
      tempDiv.style.color = '#333'
      
      tempDiv.innerHTML = generateSimpleInvoiceHTML(invoice, settings, formatCurrency)
      document.body.appendChild(tempDiv)
      
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 800,
        height: tempDiv.scrollHeight
      })
      
      document.body.removeChild(tempDiv)
      
      const imgWidth = 210
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      pdf.addImage(canvas, 'PNG', 0, 0, imgWidth, imgHeight)
    }
    
    const filename = `invoices_${new Date().toISOString().split('T')[0]}.pdf`
    pdf.save(filename)
    
    return { success: true, filename }
  } catch (error) {
    console.error('Multiple PDF export failed:', error)
    return { success: false, error: error.message }
  }
}

// Export invoice to CSV
export const exportInvoiceToCSV = (invoice, formatCurrency) => {
  try {
    const headers = ['Description', 'Quantity', 'Unit', 'Rate', 'Amount']
    const rows = invoice.items?.map(item => [
      item.description,
      item.quantity,
      item.unit,
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
    link.setAttribute('download', `${invoice.number}_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    return { success: true, filename: `${invoice.number}_${new Date().toISOString().split('T')[0]}.csv` }
  } catch (error) {
    console.error('CSV export failed:', error)
    return { success: false, error: error.message }
  }
} 

// Smart PDF export that uses the simple, reliable html2canvas method
export const exportInvoiceToPDFSmart = async (invoice, settings, formatCurrency) => {
  try {
    // Use the simple, reliable html2canvas method
    return await exportInvoiceToPDF(invoice, settings, formatCurrency)
  } catch (error) {
    console.error('PDF export failed:', error)
    return { success: false, error: error.message }
  }
} 