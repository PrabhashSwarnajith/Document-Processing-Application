# Document Processing Application

Invoice document processing application built with React and TypeScript.

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Preview

```bash
npm run preview
```

## Lint

```bash
npm run lint
```

## Features

- Upload invoice documents
- Extract text data
- View results in table format
- Track upload history

## Technologies

- React 19
- TypeScript
- Vite
- Tailwind CSS

## n8n Workflows

This project includes n8n workflow automation for document processing. 

### n8n Setup

1. Install n8n globally:
```bash
npm install -g n8n
```

2. Start n8n:
```bash
n8n
```

3. Access the n8n editor at `http://localhost:5678`

### Available Workflows

**Smart Document Parser for Invoices, Logs or Sensor Reports**
- Location: `n8/PDF_Image_csv_to_Sheet.json`
- Handles PDF, Image, and CSV file formats
- Extracts invoice details using Google Gemini AI:
  - Invoice ID
  - Invoice Date
  - Due Date
  - Customer Name
  - Vendor Name
  - Subtotal
  - Tax Total
  - Total Amount
  - Currency
- Stores extracted data in Google Sheets
- Supports webhook-based file uploads

### Workflow Features

- **Multi-format Support**: Process PDFs, images (JPG, PNG), and CSV files
- **AI-Powered Extraction**: Uses Google Gemini 1.5 Flash for accurate data extraction
- **Google Sheets Integration**: Automatically saves extracted data to Google Sheets
- **Flexible Data Mapping**: Easily customize extracted fields and sheet mappings

### Integration

The frontend communicates with n8n workflows through API endpoints for:
- Processing uploaded documents via webhook
- Retrieving extracted data
- Managing workflow executions
