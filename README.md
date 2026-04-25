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
├── index.html          # Single-page frontend
├── css/style.css       # Responsive styles with dark mode
├── js/app.js           # Frontend logic (timeline, chat, quiz, maps)
├── server.js           # Express backend + all API endpoints
├── package.json        # Dependencies and scripts
├── Dockerfile          # Cloud Run deployment
├── tests/              # Jest test suite
│   ├── unit.test.js
│   ├── api.test.js
│   ├── security.test.js
│   └── integration.test.js
└── tests/helpers.js    # Shared test utilities
```

---

## Setup & Run

```bash
git clone https://github.com/YOUR_USERNAME/electiq
cd electiq
npm install
```

Create a `.env` file:

```
GEMINI_API_KEY=your_gemini_key
MAPS_API_KEY=your_maps_key
FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}
PORT=8080
```

```bash
node server.js
# Visit http://localhost:8080
```

Run tests:

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
  --env-vars-file env.yaml
```

---

## Environment Variables

| Variable                   | Required    | Description                         |
| -------------------------- | ----------- | ----------------------------------- |
| `GEMINI_API_KEY`           | Yes         | Google AI Studio API key            |
| `MAPS_API_KEY`             | Yes         | Google Maps JavaScript API key      |
| `FIREBASE_SERVICE_ACCOUNT` | Recommended | Firebase Admin SDK JSON (as string) |
| `PORT`                     | No          | Server port (default: 8080)         |

---

## Assumptions Made

- Polling station locations are mock data for demonstration; production would use real ECI/government APIs
- Election timeline data is informational; exact dates vary by election cycle
- Firebase gracefully degrades — app works without it
- Quiz questions are AI-generated; quality depends on Gemini's knowledge
