# 🎨 Inkblot Studio Invoice System

A modern, professional-grade web application for generating and managing invoices for Inkblot Studio, a digital agency based in Bulgaria operating across Europe.

## ✨ Features

### 🧾 **Invoice Management**
- **Create Invoices**: Professional invoice creation with dynamic line items
- **Edit Invoices**: Full editing capabilities for existing invoices
- **Preview Invoices**: Beautiful invoice preview with print-ready formatting
- **Invoice List**: Comprehensive list view with filtering and search
- **Status Tracking**: Draft, Pending, Paid, and Overdue statuses
- **Discount Support**: Percentage and fixed amount discounts
- **VAT Calculation**: Automatic VAT calculation with configurable rates

### 👥 **Client Management**
- **Client Database**: Store and manage client information
- **Client Modal**: Quick client creation and editing
- **Client Details**: Complete contact and business information
- **VAT Numbers**: Support for EU VAT registration

### ⚙️ **Settings & Configuration**
- **Company Information**: Complete business profile setup
- **Invoice Settings**: Customizable invoice numbering and defaults
- **Theme Customization**: Brand color customization
- **Multi-language Support**: English, Bulgarian, German, French

### 💾 **Data Management**
- **Export Data**: JSON export with encryption support
- **Import Data**: Secure data import with validation
- **Backup System**: Automated backup creation
- **Data Encryption**: AES encryption for sensitive data
- **Clear Data**: Safe data clearing with confirmation

### 📄 **Export Features**
- **PDF Export**: Professional, print-ready PDF invoices
- **CSV Export**: Invoice items as CSV for accounting
- **Bulk PDF Export**: Export all invoices at once
- **Email Integration**: Generate email content with mailto links
- **Share Functionality**: Web Share API with clipboard fallback

### 🎨 **Modern UI/UX**
- **Responsive Design**: Mobile-first responsive layout
- **Framer Motion**: Smooth animations and transitions
- **SCSS Modules**: Organized and maintainable styling
- **Professional Design**: Clean, modern interface
- **Print Styles**: Optimized for printing invoices

### 🔧 **Technical Features**
- **React 18**: Latest React with modern hooks
- **Vite**: Fast development and build tooling
- **Local Storage**: Offline-capable with localforage
- **Form Validation**: Comprehensive form validation
- **Error Handling**: Robust error handling and user feedback

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Inqvo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout/         # Main layout components
│   ├── UI/            # Basic UI components (Button, Modal, etc.)
│   └── Navigation/    # Navigation components
├── contexts/          # React contexts
│   └── AppContext.jsx # Main application state
├── pages/             # Page components
│   ├── Dashboard/     # Dashboard page
│   ├── InvoiceCreate/ # Invoice creation
│   ├── InvoiceEdit/   # Invoice editing
│   ├── InvoiceList/   # Invoice listing
│   ├── InvoicePreview/# Invoice preview
│   ├── Clients/       # Client management
│   └── Settings/      # Application settings
├── styles/            # Global styles and design tokens
│   ├── variables.scss # CSS custom properties
│   ├── mixins.scss    # SCSS mixins
│   └── globals.scss   # Global styles
├── utils/             # Utility functions
│   └── dataExport.js  # Data export/import utilities
└── App.jsx           # Main application component
```

## 🎯 Usage Guide

### Creating an Invoice

1. Navigate to **Invoices** → **Create Invoice**
2. Fill in invoice details (number, dates, client)
3. Add line items with descriptions, quantities, and rates
4. Configure VAT rate and optional discounts
5. Add notes if needed
6. Save the invoice

### Managing Clients

1. Go to **Clients** page
2. Click **Add Client** to create new clients
3. Fill in client information (name, email, address, VAT)
4. Save client details

### Exporting Data

1. Navigate to **Settings** → **Data Management**
2. Choose export option:
   - **Export All Data**: Standard JSON export
   - **Export Encrypted**: AES-encrypted export
   - **Create Backup**: Timestamped backup file

### Importing Data

1. Go to **Settings** → **Data Management**
2. Click **Import Data**
3. Select a previously exported JSON file
4. Data will be validated and imported automatically

### Exporting Invoices

#### PDF Export
1. **Single Invoice**: Go to invoice preview and click "Export PDF"
2. **Bulk Export**: Go to Settings → Data Management → "Export All PDFs"
3. **From List**: Click the download icon in the invoice list

#### CSV Export
1. Go to invoice preview and click "Export CSV"
2. Download invoice items as CSV for accounting software

#### Email Integration
1. Go to invoice preview and click "Send Email"
2. Opens default email client with pre-filled content
3. Attach the generated PDF manually

#### Sharing
1. Go to invoice preview and click "Share"
2. Uses Web Share API on mobile devices
3. Falls back to clipboard copy on desktop

## 🎨 Customization

### Theme Colors

1. Go to **Settings** → **Theme**
2. Customize primary and secondary colors
3. Preview changes in real-time
4. Save settings

### Company Information

1. Navigate to **Settings** → **Company**
2. Update company details
3. Configure VAT number and IBAN
4. Set default invoice settings

## 🔒 Security Features

- **Data Encryption**: All stored data is AES-encrypted
- **Secure Export**: Encrypted export options available
- **Data Validation**: Import validation prevents corrupted data
- **Safe Deletion**: Confirmation dialogs for destructive actions

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop**: Full-featured experience
- **Tablet**: Touch-optimized interface
- **Mobile**: Streamlined mobile experience

## 🖨️ Print Support

Invoices are optimized for printing with:
- Clean, professional layout
- Proper page breaks
- Print-specific CSS
- High-quality output

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues

### Code Style

- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **SCSS Modules**: Organized styling
- **TypeScript-like**: JSDoc comments for type safety

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Deploy automatically on push

### Other Platforms

The application can be deployed to any static hosting platform:
- Netlify
- GitHub Pages
- AWS S3
- Firebase Hosting

## 📊 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Contact the development team
- Check the documentation

## 🔄 Version History

### v1.0.0 (2025-01-XX)
- Initial release
- Complete invoice management system
- Client management
- Data export/import
- Professional UI/UX
- Responsive design
- Print optimization

---

**Built with ❤️ for Inkblot Studio** 