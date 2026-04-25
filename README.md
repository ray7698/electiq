# ElectIQ — AI-Powered Election Education Assistant

### Built for PromptWars Hackathon @ promptwars.in

---

## Chosen Vertical

**Election Process Education** — An interactive AI assistant that helps citizens understand democratic processes, election timelines, and their civic rights.

---

## Solution Overview

ElectIQ is a full-stack web application that makes election education accessible to every citizen through:

- Interactive step-by-step election timelines (India, USA, UK)
- Gemini AI-powered chat assistant for civic questions
- Dynamic AI-generated quiz with scoring
- Google Maps polling station locator
- Firebase-backed conversation history

---

## Google Services Integration

```
User Browser
     │
     ▼
Cloud Run (Express Server)
     │
     ├──► Gemini API ──► AI chat answers + quiz generation
     │
     ├──► Firebase Realtime DB ──► Store conversations & scores
     │
     └──► Google Maps JS API ──► Polling station locator (frontend)
```

| Service                             | Usage                                                           |
| ----------------------------------- | --------------------------------------------------------------- |
| **Gemini API** (`gemini-2.0-flash`) | Powers the election chat assistant and generates quiz questions |
| **Firebase Realtime Database**      | Stores chat history and quiz scores persistently                |
| **Google Maps JavaScript API**      | Interactive polling station locator map                         |
| **Google Cloud Run**                | Serverless deployment of the Node.js backend                    |

---

## Architecture

```
electiq/
├── index.html          # Single-page entry
├── css/style.css       # Responsive styles with dark mode
├── js/                 # Modular Frontend (ES6)
│   ├── main.js         # Entry point
│   ├── ui.js           # UI & Translation logic
│   ├── chat.js         # AI Assistant
│   ├── quiz.js         # Interactive Quiz
│   └── ...             # state, data, timeline, map
├── src/                # Modular Backend (Node.js)
│   ├── app.js          # Express app setup
│   ├── config/         # Strict env validation (Joi)
│   ├── controllers/    # API logic (AppError integration)
│   ├── services/       # External API integrations
│   └── utils/          # Logger, Sanitizer, AppError
├── server.js           # Server entry point
├── Dockerfile          # Cloud Run deployment
└── tests/              # Jest test suite (39+ tests)
```

---

## Setup & Run

1. **Install Dependencies**:
```bash
npm install
```

2. **Configure Environment**:
Create a `.env` file (see `.env.example`):
```bash
GEMINI_API_KEY=your_key
FIREBASE_SERVICE_ACCOUNT='{"type":"service_account",...}'
MAPS_API_KEY=your_key
```

3. **Run Development Server**:
```bash
npm run dev
```

4. **Lint & Format**:
```bash
npm run lint    # Check for errors
npm run format  # Auto-fix formatting
```

5. **Run Tests**:
```bash
npm test
npm run test:coverage
```

---

## Deploy to Cloud Run

```bash
gcloud run deploy electiq \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars "GEMINI_API_KEY=...,FIREBASE_SERVICE_ACCOUNT=..."
```

---

## Environment Variables

> [!IMPORTANT]
> ElectIQ uses **Fail-Fast** validation. The server will not start if required variables are missing.

| Variable                   | Required | Description                         |
| -------------------------- | -------- | ----------------------------------- |
| `GEMINI_API_KEY`           | **Yes**  | Google AI Studio API key            |
| `FIREBASE_SERVICE_ACCOUNT` | **Yes**  | Firebase Admin SDK JSON string      |
| `MAPS_API_KEY`             | No       | Google Maps JavaScript API key      |
| `PORT`                     | No       | Server port (default: 8080)         |

---

## Assumptions Made

- Polling station locations are mock data for demonstration.
- Election timeline data is informational; exact dates vary by cycle.
- **Fail-Fast Policy**: Backend requires Gemini and Firebase for a stable experience.
- Quiz questions are AI-generated; quality depends on Gemini's knowledge base.
