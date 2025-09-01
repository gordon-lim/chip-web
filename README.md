# CHIP → GPT Web App

A web application that integrates `chip-parser` and provides a user-friendly interface for working with CHIP notation and querying GPT for poker advice.

## Features

- **CHIP Notation Reference**: Collapsible cheat sheet with official CHIP notation reference
- **Live Parsing**: Real-time CHIP notation parsing with graceful error handling
- **GPT Integration**: Get AI-powered poker recommendations based on parsed hand history
- **Two-Column Layout**: Clean separation between CHIP input and GPT interaction
- **Responsive Design**: Works on desktop and mobile devices

## Project Structure

```
chip-web/
├── api/              # Vercel serverless functions
│   ├── parse-chip.js # CHIP notation parsing endpoint
│   ├── ask-gpt.js    # OpenAI GPT integration endpoint
│   └── health.js     # Health check endpoint
├── src/
│   ├── components/
│   │   ├── ChipReference.tsx    # CHIP notation cheat sheet
│   │   ├── ChipInput.tsx        # CHIP input with live parsing
│   │   └── GptInteraction.tsx   # GPT API integration
│   ├── App.tsx       # Main application component
│   └── main.tsx      # React entry point
├── package.json      # All dependencies
└── vite.config.ts    # Vite configuration
```

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- OpenAI API key

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

### Running the Application

**Development:**
```bash
npm run dev
```

This will start the Vite development server on `http://localhost:3000`

**Production build:**
```bash
npm run build
```

**Preview production build:**
```bash
npm run preview
```

### Usage

1. **Open your browser** to `http://localhost:3000`

2. **Review the CHIP Reference** (collapsible cheat sheet at the top)

3. **Enter CHIP Notation** in the left column textarea. Examples:
   ```
   UTG: AhKh
   preflop: r100
   BTN: c
   flop: AhKcQd
   UTG: b50
   ```

4. **View Parsed Output** - automatically updates as you type

5. **Enter your OpenAI API Key** in the right column (stored in memory only)

6. **Customize the System Prompt** if needed

7. **Click "Ask GPT"** to get AI-powered poker advice

## API Endpoints

### Vercel Functions

- `POST /api/parse-chip` - Parse CHIP notation
  ```json
  {
    "chipNotation": "25 50 10 6 6\n12.5k 25k 10k 25k 25k 15k\nf f 150 f c c"
  }
  ```

- `POST /api/ask-gpt` - Get GPT recommendations
  ```json
  {
    "apiKey": "sk-...",
    "systemPrompt": "You are a poker assistant...",
    "parsedChip": { /* parsed hand data */ }
  }
  ```

- `GET /api/health` - Health check

## Security Notes

- **API Key Storage**: OpenAI API keys are never persisted or logged - they're stored in memory only during the session
- **CORS**: Backend is configured to accept requests from the frontend only
- **Input Validation**: All API endpoints validate input parameters

## Development

### Frontend Development
```bash
cd frontend
npm run dev
```

### Backend Development
```bash
cd backend
npm run dev  # Uses nodemon for auto-reload
```

### Building for Production
```bash
npm run build  # Builds frontend only
```

## Dependencies

### Backend
- `express` - Web framework
- `cors` - CORS middleware
- `chip-parser` - CHIP notation parsing
- `openai` - OpenAI API client
- `dotenv` - Environment variables

### Frontend
- `react` - UI framework
- `typescript` - Type safety
- `tailwindcss` - CSS framework
- `axios` - HTTP client
- `vite` - Build tool

## Troubleshooting

### Common Issues

1. **"chip-parser not found"**
   - Make sure you've installed backend dependencies: `cd backend && npm install`

2. **"API connection failed"**
   - Ensure backend is running on port 3001
   - Check that frontend proxy is configured correctly in `vite.config.ts`

3. **"Invalid API key"**
   - Verify your OpenAI API key starts with `sk-`
   - Check your OpenAI account has sufficient credits

4. **Parse errors**
   - CHIP notation is case-sensitive
   - Refer to the built-in reference guide for correct syntax

### Development Tips

- Use browser dev tools to monitor network requests
- Backend logs are shown in the terminal running the server
- Frontend errors appear in browser console

## License

MIT License

