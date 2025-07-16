import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

// PDF Export utility for invoices with Bulgarian legal compliance
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

// Generate invoice HTML for PDF with Bulgarian legal compliance
const generateInvoiceHTML = (invoice, settings, formatCurrency) => {
  const totals = calculateInvoiceTotals(
    invoice.items || [], 
    invoice.vatRate || 20, 
    invoice.discountType || 'percentage', 
    invoice.discountValue || 0
  )
  
  // Convert amount to words (Bulgarian)
  const amountInWords = convertToBulgarianWords(totals.total)
  
  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 800px; margin: 0 auto; color: #2c3e50; background: white; padding: 40px; box-shadow: 0 0 30px rgba(0,0,0,0.1);">
      
      <!-- Premium Header with Gradient -->
      <div style="background: linear-gradient(135deg, #98C93C 0%, #7ba32e 100%); color: white; padding: 30px; border-radius: 15px; margin-bottom: 30px; text-align: center; position: relative; overflow: hidden;">
        <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');"></div>
        <div style="position: relative; z-index: 1;">
          <h1 style="margin: 0 0 5px 0; font-size: 36px; font-weight: 800; letter-spacing: 2px; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">
            ФАКТУРА
          </h1>
          <h2 style="margin: 0 0 20px 0; font-size: 18px; font-weight: 400; opacity: 0.9; text-transform: uppercase; letter-spacing: 1px;">
            Оригинал
          </h2>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 20px;">
            <div style="text-align: left;">
              <p style="margin: 5px 0; font-weight: 600; font-size: 16px;">Номер: ${invoice.number}</p>
            </div>
            <div style="text-align: right;">
              <p style="margin: 5px 0; font-weight: 600; font-size: 16px;">Дата: ${formatDate(invoice.issueDate)}</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Parties Information with Premium Cards -->
      <div style="display: flex; gap: 25px; margin-bottom: 35px;">
        <!-- Recipient Card -->
        <div style="flex: 1; background: linear-gradient(145deg, #f8f9fa 0%, #e9ecef 100%); border: 2px solid #dee2e6; border-radius: 15px; padding: 20px; box-shadow: 0 8px 25px rgba(0,0,0,0.08); position: relative; overflow: hidden;">
          <div style="position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, #98C93C 0%, #7ba32e 100%);"></div>
          <h3 style="margin: 0 0 20px 0; font-size: 16px; font-weight: 700; text-transform: uppercase; color: #495057; letter-spacing: 1px; border-bottom: 2px solid #98C93C; padding-bottom: 8px;">
            Получател
          </h3>
          <div style="font-size: 13px; line-height: 1.8;">
            <p style="margin: 8px 0; font-weight: 700; color: #2c3e50; font-size: 15px;">${invoice.client?.company || invoice.client?.name || 'N/A'}</p>
            ${invoice.client?.vatNumber ? `<p style="margin: 8px 0; color: #495057;"><strong>ДДС №:</strong> ${invoice.client.vatNumber}</p>` : ''}
            ${invoice.client?.idNumber ? `<p style="margin: 8px 0; color: #495057;"><strong>Идент. №:</strong> ${invoice.client.idNumber}</p>` : ''}
            ${invoice.client?.city ? `<p style="margin: 8px 0; color: #495057;"><strong>Град:</strong> ${invoice.client.city}</p>` : ''}
            ${invoice.client?.address ? `<p style="margin: 8px 0; color: #495057;"><strong>Адрес:</strong> ${invoice.client.address}</p>` : ''}
            ${invoice.client?.manager ? `<p style="margin: 8px 0; color: #495057;"><strong>МОЛ:</strong> ${invoice.client.manager}</p>` : ''}
            <p style="margin: 8px 0; color: #495057;"><strong>Телефон:</strong> ${invoice.client?.phone || ''}</p>
          </div>
        </div>
        
        <!-- Supplier Card -->
        <div style="flex: 1; background: linear-gradient(145deg, #f8f9fa 0%, #e9ecef 100%); border: 2px solid #dee2e6; border-radius: 15px; padding: 20px; box-shadow: 0 8px 25px rgba(0,0,0,0.08); position: relative; overflow: hidden;">
          <div style="position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, #98C93C 0%, #7ba32e 100%);"></div>
          <h3 style="margin: 0 0 20px 0; font-size: 16px; font-weight: 700; text-transform: uppercase; color: #495057; letter-spacing: 1px; border-bottom: 2px solid #98C93C; padding-bottom: 8px;">
            Доставчик
          </h3>
          <div style="font-size: 13px; line-height: 1.8;">
            <p style="margin: 8px 0; font-weight: 700; color: #2c3e50; font-size: 15px;">${settings.company.name}</p>
            ${settings.company.vatNumber ? `<p style="margin: 8px 0; color: #495057;"><strong>ДДС №:</strong> ${settings.company.vatNumber}</p>` : ''}
            ${settings.company.idNumber ? `<p style="margin: 8px 0; color: #495057;"><strong>Идент. №:</strong> ${settings.company.idNumber}</p>` : ''}
            ${settings.company.city ? `<p style="margin: 8px 0; color: #495057;"><strong>Град:</strong> ${settings.company.city}</p>` : ''}
            ${settings.company.address ? `<p style="margin: 8px 0; color: #495057;"><strong>Адрес:</strong> ${settings.company.address}</p>` : ''}
            ${settings.company.manager ? `<p style="margin: 8px 0; color: #495057;"><strong>МОЛ:</strong> ${settings.company.manager}</p>` : ''}
            <p style="margin: 8px 0; color: #495057;"><strong>Телефон:</strong> ${settings.company.phone || ''}</p>
          </div>
        </div>
      </div>
      
      <!-- Premium Invoice Items Table -->
      <div style="margin-bottom: 35px; border-radius: 15px; overflow: hidden; box-shadow: 0 8px 25px rgba(0,0,0,0.08);">
        <table style="width: 100%; border-collapse: collapse; background: white;">
          <thead>
            <tr style="background: linear-gradient(135deg, #98C93C 0%, #7ba32e 100%); color: white;">
              <th style="padding: 15px 10px; text-align: center; font-weight: 700; font-size: 12px; border: none;">№</th>
              <th style="padding: 15px 10px; text-align: center; font-weight: 700; font-size: 12px; border: none;">Код</th>
              <th style="padding: 15px 10px; text-align: left; font-weight: 700; font-size: 12px; border: none;">Наименование на стоката/услугата</th>
              <th style="padding: 15px 10px; text-align: center; font-weight: 700; font-size: 12px; border: none;">Мярка</th>
              <th style="padding: 15px 10px; text-align: center; font-weight: 700; font-size: 12px; border: none;">Количество</th>
              <th style="padding: 15px 10px; text-align: right; font-weight: 700; font-size: 12px; border: none;">Цена</th>
              <th style="padding: 15px 10px; text-align: right; font-weight: 700; font-size: 12px; border: none;">Сума</th>
            </tr>
          </thead>
          <tbody>
            ${invoice.items?.map((item, index) => `
              <tr style="border-bottom: 1px solid #e9ecef; transition: background-color 0.2s ease;">
                <td style="padding: 12px 10px; text-align: center; font-size: 12px; color: #495057; font-weight: 600;">${index + 1}</td>
                <td style="padding: 12px 10px; text-align: center; font-size: 12px; color: #6c757d;">${item.code || ''}</td>
                <td style="padding: 12px 10px; text-align: left; font-size: 12px; color: #2c3e50; font-weight: 500;">${item.description}</td>
                <td style="padding: 12px 10px; text-align: center; font-size: 12px; color: #495057;">${item.unit || 'бр.'}</td>
                <td style="padding: 12px 10px; text-align: center; font-size: 12px; color: #495057; font-weight: 600;">${item.quantity}</td>
                <td style="padding: 12px 10px; text-align: right; font-size: 12px; color: #495057; font-weight: 600;">${formatCurrency(item.rate)}</td>
                <td style="padding: 12px 10px; text-align: right; font-size: 12px; color: #2c3e50; font-weight: 700;">${formatCurrency(item.quantity * item.rate)}</td>
              </tr>
            `).join('') || ''}
          </tbody>
        </table>
      </div>
      
      <!-- Premium Summary Section -->
      <div style="display: flex; justify-content: space-between; margin-bottom: 35px; gap: 30px;">
        <!-- Amount in Words -->
        <div style="flex: 1; background: linear-gradient(145deg, #f8f9fa 0%, #e9ecef 100%); border: 2px solid #dee2e6; border-radius: 15px; padding: 20px; box-shadow: 0 8px 25px rgba(0,0,0,0.08);">
          <h4 style="margin: 0 0 15px 0; font-size: 14px; font-weight: 700; color: #495057; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #98C93C; padding-bottom: 8px;">
            Сума с думи
          </h4>
          <p style="margin: 0; font-weight: 600; color: #2c3e50; font-size: 14px; line-height: 1.6;">${amountInWords}</p>
        </div>
        
        <!-- Totals -->
        <div style="width: 350px; background: linear-gradient(145deg, #f8f9fa 0%, #e9ecef 100%); border: 2px solid #dee2e6; border-radius: 15px; padding: 20px; box-shadow: 0 8px 25px rgba(0,0,0,0.08);">
          <h4 style="margin: 0 0 15px 0; font-size: 14px; font-weight: 700; color: #495057; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #98C93C; padding-bottom: 8px;">
            Обобщение
          </h4>
          <div style="margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-weight: 600; color: #495057; font-size: 13px;">Данъчна основа ${invoice.vatRate}%:</span>
            <span style="font-weight: 700; color: #2c3e50; font-size: 13px;">${formatCurrency(totals.subtotalAfterDiscount)}</span>
          </div>
          <div style="margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-weight: 600; color: #495057; font-size: 13px;">ДДС ${invoice.vatRate}%:</span>
            <span style="font-weight: 700; color: #2c3e50; font-size: 13px;">${formatCurrency(totals.vat)}</span>
          </div>
          <div style="border-top: 2px solid #98C93C; padding-top: 12px; margin-top: 12px; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-weight: 700; color: #2c3e50; font-size: 16px;">Сума за плащане:</span>
            <span style="font-weight: 800; color: #98C93C; font-size: 18px;">${formatCurrency(totals.total)}</span>
          </div>
        </div>
      </div>
      
      <!-- Premium Payment Details Box -->
      <div style="border: 3px dashed #98C93C; border-radius: 15px; padding: 25px; margin-bottom: 35px; background: linear-gradient(145deg, #f8f9fa 0%, #e9ecef 100%); box-shadow: 0 8px 25px rgba(0,0,0,0.08);">
        <h4 style="margin: 0 0 20px 0; font-size: 16px; font-weight: 700; color: #495057; text-transform: uppercase; letter-spacing: 1px; text-align: center; border-bottom: 2px solid #98C93C; padding-bottom: 10px;">
          Детайли за плащане
        </h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; font-size: 13px;">
          <div>
            <p style="margin: 8px 0; color: #495057;"><strong>Дата на данъчно събитие:</strong> ${formatDate(invoice.issueDate)}</p>
            <p style="margin: 8px 0; color: #495057;"><strong>Основание на сделката:</strong> ${invoice.transactionBasis || ''}</p>
            <p style="margin: 8px 0; color: #495057;"><strong>Описание на сделката:</strong> ${invoice.transactionDescription || ''}</p>
            <p style="margin: 8px 0; color: #495057;"><strong>Място на сделката:</strong> ${invoice.transactionPlace || settings.company.city || 'СОФИЯ'}</p>
            <p style="margin: 8px 0; color: #495057;"><strong>Получил:</strong> ${invoice.client?.manager || invoice.client?.name || ''}</p>
          </div>
          <div>
            <p style="margin: 8px 0; color: #495057;"><strong>Плащане:</strong> ${invoice.paymentMethod || 'По сметка'}</p>
            ${settings.company.iban ? `<p style="margin: 8px 0; color: #495057;"><strong>IBAN:</strong> ${settings.company.iban}</p>` : ''}
            ${settings.company.bank ? `<p style="margin: 8px 0; color: #495057;"><strong>Банка:</strong> ${settings.company.bank}</p>` : ''}
            ${settings.company.bankCode ? `<p style="margin: 8px 0; color: #495057;"><strong>Банков код:</strong> ${settings.company.bankCode}</p>` : ''}
            <p style="margin: 8px 0; color: #495057;"><strong>Съставил:</strong> ${settings.company.manager || settings.company.name}</p>
          </div>
        </div>
      </div>
      
      <!-- Premium Legal Disclaimer -->
      <div style="text-align: center; margin-top: 35px; padding: 20px; background: linear-gradient(145deg, #f8f9fa 0%, #e9ecef 100%); border-radius: 15px; color: #6c757d; font-size: 11px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
        <p style="margin: 0; line-height: 1.6; font-style: italic;">
          Съгласно чл. 6, ал. 1 от Закона за счетоводството, чл. 114 от ЗДДС и чл. 78 от ППЗДДС печатът и подписът не са задължителни реквизити във фактурата.
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
      
      tempDiv.innerHTML = generateInvoiceHTML(invoice, settings, formatCurrency)
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