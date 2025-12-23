# Document Processing Application - Invoice to Text

A modern React + TypeScript + Vite application for processing invoice documents and extracting text data.

## Features

- **Document Upload**: Easy file upload interface for invoice processing
- **Data Extraction**: Automated text extraction from uploaded documents
- **Response Management**: View extracted data in structured table format
- **Upload History**: Track and manage previously processed documents
- **Modern UI**: Built with React, TypeScript, and Tailwind CSS
- **Type-Safe**: Full TypeScript support with strict type checking
- **Fast Development**: Vite for instant HMR and optimized builds

## Tech Stack

- **Frontend**: React 19, TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 4
- **Linting**: ESLint with TypeScript support
- **Package Manager**: npm

## Project Structure

```
src/
├── components/          # Reusable React components
│   ├── FileUpload.tsx
│   ├── ResponseTable.tsx
│   └── UploadHistory.tsx
├── pages/              # Page-level components
│   └── DocumentUploadPage.tsx
├── services/           # API and service calls
│   └── uploadService.ts
├── hooks/              # Custom React hooks
│   └── useUpload.ts
├── types/              # TypeScript definitions
│   └── index.ts
└── assets/             # Static assets
```

## Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation

1. Clone the repository
```bash
git clone https://github.com/PrabhashSwarnajith/Document-Processing-Application.git
cd invoice-to-text
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Usage

1. Open the application in your browser
2. Upload an invoice document using the file upload interface
3. Wait for the document to be processed
4. View the extracted data in the response table
5. Check upload history to access previous documents

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Support

For issues or questions, please open an issue on GitHub.
