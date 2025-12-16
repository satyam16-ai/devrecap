# DevRecap

Your developer journey, summarized.

## Setup

### Prerequisites
- Node.js
- GitHub OAuth App (Client ID/Secret)

### Environment Variables

**Backend (.env)**
```
PORT=5000
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
GITHUB_REDIRECT_URI=http://localhost:3000/callback
```

### Installation

1. **Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

2. **Backend**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

3. **Open Browser**
   Go to `http://localhost:3000`

## Architecture
- **Frontend**: Next.js 14, TailwindCSS
- **Backend**: Express, TypeScript, GitHub GraphQL API
