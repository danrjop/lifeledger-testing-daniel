# LifeLedger Frontend

Next.js frontend for LifeLedger - a document management app that turns screenshots and photos into searchable memory with AI-powered analysis.

## Features

- Upload screenshots, receipts, and documents
- Automatic OCR and text extraction
- Semantic search across all documents
- AI agent for analytical questions (spending, deadlines)
- Related documents panel (similarity-based)
- Radar view for upcoming deadlines and events
- Manual review for failed OCR documents
- Document viewer with zoom and evidence highlights

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Environment Variables

Create a .env.local file:

```
NEXT_PUBLIC_API_URL=https://llapi.click
AWS_COGNITO_REGION=us-west-2
AWS_COGNITO_CLIENT_ID=your-client-id
AWS_COGNITO_CLIENT_SECRET=your-client-secret
```

For local development with the backend:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Project Structure

```
src/
  app/
    page.tsx           - Main dashboard
    search/page.tsx    - Search interface
    radar/page.tsx     - Upcoming deadlines view
    layout.tsx         - Root layout with auth
  components/
    ui/
      DocumentViewer.tsx   - Full document viewer with zoom
      DocumentCard.tsx     - Document thumbnail card
      ReviewModal.tsx      - Manual review dialog
      UploadButton.tsx     - File upload component
  lib/
    api-client.ts      - Backend API functions
    types.ts           - TypeScript interfaces
```

## Key Components

DocumentViewer - Full-screen document viewer with:
- Image zoom on click
- Related documents sidebar
- Line items display for receipts
- Evidence highlight boxes

Search - Semantic search with:
- AI agent toggle for analytical questions
- Document results with similarity scores

Radar - Upcoming events view:
- Deadlines extracted from documents
- Links to source documents

## Deployment

Deployed on Vercel. Push to main branch triggers automatic deployment.

Manual deploy:

```bash
npm run build
vercel --prod
```

## API Integration

The frontend connects to the LifeLedger backend at the URL specified in NEXT_PUBLIC_API_URL.

Key API calls (see src/lib/api-client.ts):
- getDocuments() - List all documents
- uploadDocuments() - Upload new images
- searchDocuments() - Semantic search
- askQuestion() - AI agent queries
- getRelatedDocuments() - Similar documents
- getRadarEvents() - Upcoming deadlines
- reviewDocument() - Submit manual review

## Team

UC Berkeley MIDS Capstone - Spring 2025

Benjamin He, Daniel Wang, Jiayi Ding, Viola Qiu, Umesh Kant
