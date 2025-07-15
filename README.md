# Inkblot Invoice Studio

A modern, professional-grade invoice management system designed specifically for Inkblot Studio and other digital agencies operating in Europe. Built with React, optimized for EURO currency, and ready for Bulgaria's transition to the Eurozone in 2025-2026.

## 🚀 Features

### Core Invoice Management
- **Professional Invoice Creation**: Create invoices with hourly-based items, fixed-price services, and predefined templates
- **EURO Currency Support**: Full EURO (€) support with European locale formatting (1 234,56 €)
- **VAT Compliance**: Automatic 20% VAT calculation with toggle support
- **Legal Compliance**: Bulgarian and EU law compliant invoice layout
- **Sequential Numbering**: Year-based invoice numbering system

### Client Management
- **Multi-brand Support**: Support for multiple brands (Inkblot Studio, Heavenly Kingdom, etc.)
- **Client Profiles**: Complete client information including VAT numbers, addresses, and contact details
- **Client Presets**: Save and reuse client information and preferences
- **EU VAT Support**: Optional VAT/EU VAT number fields

### Data Management & Portability
- **Offline-First**: Works completely offline with local storage
- **Data Export/Import**: Export all data as JSON or ZIP files
- **Encrypted Storage**: Local data encryption for security
- **Cloud Backup**: Optional Supabase/PlanetScale integration
- **PWA Ready**: Progressive Web App capabilities

### Professional Features
- **PDF Generation**: Beautiful, printable invoices with custom branding
- **QR Code Support**: Optional QR codes for IBAN + amount
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Modern UI**: Apple-level polish with Framer Motion animations
- **Dark/Light Themes**: Customizable color schemes

## 🛠️ Technology Stack

- **Frontend**: React 18 with Vite
- **Styling**: SCSS modules (no Tailwind)
- **Animations**: Framer Motion
- **Forms**: React Hook Form
- **State Management**: React Context + useReducer
- **Storage**: LocalForage with encryption
- **Icons**: React Icons (Feather icons)
- **Build Tool**: Vite
- **Deployment**: Vercel-ready

## 🎨 Design System

### Colors
- **Primary**: Lime (#98C93C)
- **Secondary**: Green (#2A9245)
- **Text**: Gray (#232323)
- **Background**: White (#FFFFFF)

### Typography
- **Headings**: Outfit font family
- **Body**: Arial Nova (fallback to Arial)

### Spacing & Layout
- Consistent spacing system (4px, 8px, 16px, 24px, 32px, 48px)
- Responsive grid layouts
- Modern border radius and shadows

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/inkblot-invoice-studio.git
   cd inkblot-invoice-studio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 🚀 Deployment

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect the Vite configuration
3. Deploy with zero configuration

### Environment Variables
No environment variables required for basic functionality. The app works entirely offline.

## 📱 Usage

### Creating Invoices
1. Navigate to "Invoices" → "Create Invoice"
2. Fill in invoice details (number, dates, client)
3. Add invoice items with descriptions, quantities, and rates
4. Review totals and VAT calculations
5. Save the invoice

### Managing Clients
1. Go to "Clients" section
2. Add new clients with complete information
3. Edit existing client details
4. Search and filter clients

### Settings Configuration
1. Access "Settings" to configure company information
2. Set default VAT rates and invoice preferences
3. Customize theme colors
4. Configure invoice numbering

## 🔧 Configuration

### Company Settings
- Company name and address
- VAT number and IBAN
- Default invoice settings
- Brand colors and theme

### Invoice Settings
- Invoice prefix (e.g., "INV")
- Next invoice number
- Default VAT rate (20%)
- Language preferences
- QR code inclusion

## 📊 Data Structure

### Invoice Object
```javascript
{
  id: "unique-id",
  number: "INV-2025-0001",
  issueDate: "2025-01-15",
  dueDate: "2025-02-14",
  status: "pending", // draft, pending, paid, overdue
  client: { /* client object */ },
  items: [
    {
      id: "item-id",
      description: "Web Design",
      quantity: 10,
      rate: 50,
      unit: "hour"
    }
  ],
  vatRate: 20,
  notes: "Additional notes",
  createdAt: "2025-01-15T10:00:00Z",
  updatedAt: "2025-01-15T10:00:00Z"
}
```

### Client Object
```javascript
{
  id: "client-id",
  name: "Client Name",
  company: "Company Name",
  email: "client@example.com",
  phone: "+359 888 123 456",
  address: "123 Street",
  city: "Sofia",
  postalCode: "1000",
  country: "Bulgaria",
  vatNumber: "BG123456789",
  notes: "Client notes"
}
```

## 🔒 Security & Privacy

- **Local Storage**: All data stored locally in the browser
- **Encryption**: Data encrypted using CryptoJS
- **No External Dependencies**: Works without external databases
- **GDPR Compliant**: Full data export and deletion capabilities

## 🌍 Internationalization

- **EURO Currency**: Primary currency support
- **European Locale**: Number formatting (1 234,56 €)
- **Multi-language**: Support for English, Bulgarian, German, French
- **VAT Compliance**: European VAT regulations

## 🚀 Future Enhancements

### Planned Features
- **AI Integration**: Auto-describe services via GPT
- **Translation**: AI-powered invoice translation (EN ↔ BG)
- **Predictive Analytics**: Cost prediction based on past projects
- **Smart Presets**: AI-powered service suggestions
- **Cloud Sync**: Optional Supabase/PlanetScale integration

### Advanced Features
- **Time Tracking**: Built-in time tracking for hourly billing
- **Recurring Invoices**: Automated recurring invoice generation
- **Payment Integration**: Direct payment processing
- **Advanced Analytics**: Revenue tracking and reporting
- **Multi-currency**: Support for additional currencies

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation

## 🙏 Acknowledgments

- Built for Inkblot Studio and the European digital agency market
- Designed for Bulgaria's Eurozone transition in 2025-2026
- Inspired by modern SaaS tools but built for specific agency needs
- Special thanks to the React and open-source community

---

**Built with ❤️ for Inkblot Studio** 