# AI Study Tracker

AI Study Tracker is a full-stack study productivity application. It combines study-session tracking, focus monitoring, goals, AI-assisted learning, generated quizzes, and a personalised learner profile in one dashboard.

## Highlights

- Secure registration, login, logout, and protected pages using JWTs.
- Study workspace with a live timer, session goals, notes, pause tracking, and focus score.
- Browser-based focus monitoring using webcam, face/head-pose detection, object detection, and microphone activity detection.
- Automatic quiz generation when a completed study session is saved.
- Quiz taking, server-side answer checking, result summaries, and review pages.
- Goal creation, editing, sorting, filtering, milestones, progress, and deadline insights.
- AI assistant chat with optional PDF/text study-document upload for contextual answers.
- Editable user profile, preferences, social links, and compressed profile-photo uploads.
- Responsive dark dashboard interface built with Tailwind CSS and Framer Motion.

## Tech stack

| Area | Technologies |
| --- | --- |
| Frontend | React 19, Vite, React Router, Tailwind CSS, Framer Motion, Axios |
| UI and charts | Lucide React, React Icons, Recharts, React Circular Progressbar, React Hot Toast |
| Focus features | MediaPipe Tasks Vision, ONNX Runtime Web, React Webcam |
| Backend | Node.js, Express 5, Mongoose, JWT, bcryptjs |
| Data | MongoDB |
| AI | Google Gemini API; Tavily is used by the AI tooling when configured |
| File processing | Multer and PDF Parse |

## Project structure

```text
ai-study-tracker/
├── client/                       # React + Vite application
│   └── src/
│       ├── pages/                # Dashboard, Study, Goals, Profile, AI, Quiz pages
│       ├── components/           # Feature-based reusable components
│       ├── hooks/                # Auth, face, voice, and object-detection hooks
│       ├── api/                  # Axios API clients
│       ├── context/              # Authentication state
│       └── utils/                # Quiz and focus-score helpers
├── server/                       # Express API
│   ├── config/                   # MongoDB and AI configuration
│   ├── controllers/              # Request handlers
│   ├── middleware/               # JWT authentication middleware
│   ├── models/                   # MongoDB schemas
│   ├── routes/                   # API route definitions
│   ├── services/                 # AI, quiz, RAG, and scoring services
│   └── utils/                    # Token and parsing helpers
└── README.md
```

## Prerequisites

- Node.js 18 or newer
- npm 9 or newer
- A MongoDB database (local MongoDB or MongoDB Atlas)
- A Google Gemini API key for AI chat and quiz generation

## Installation

Clone the repository, then install the client and server packages separately.

```bash
git clone <your-repository-url>
cd ai-study-tracker

cd server
npm install

cd ../client
npm install
```

## Environment variables

Create `server/.env` with the following values:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>/<database>
JWT_SECRET=replace-with-a-long-random-secret
GEMINI_API_KEY=your-google-gemini-api-key

# Optional: enables the Tavily-powered AI search/tooling features.
TAVILY_API_KEY=your-tavily-api-key

# Optional
NODE_ENV=development
```

Never commit `.env` files or API keys to source control.

## Running locally

Start the API server in one terminal:

```bash
cd server
npm run dev
```

Start the client in another terminal:

```bash
cd client
npm run dev
```

Open the URL shown by Vite, normally `http://localhost:5173`.

The client is configured to call `http://localhost:5000/api`. The server CORS configuration currently allows `http://localhost:5173`; update both values when deploying or changing ports.

## Available scripts

| Directory | Command | Purpose |
| --- | --- | --- |
| `client` | `npm run dev` | Start the Vite development server |
| `client` | `npm run build` | Create a production frontend build |
| `client` | `npm run preview` | Serve the production build locally |
| `client` | `npm run lint` | Run Oxlint |
| `server` | `npm run dev` | Start the Express server with Nodemon |
| `server` | `npm start` | Start the Express server with Node.js |

## Application flow

1. Register an account or log in.
2. Create a study session by entering a subject, topic, and goal.
3. Start the timer and grant camera/microphone permissions if focus monitoring is required.
4. Pause or finish the session. On completion, its notes and focus metrics are saved and a quiz is generated.
5. Answer the quiz, then use the result and review pages to inspect performance.
6. Add learning goals and milestones to track progress across sessions.
7. Use the AI Assistant to ask study questions or upload a PDF/text document (up to 8 MB) for context.

## API overview

All routes except registration and login require an `Authorization: Bearer <token>` header.

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/auth/register` | Create an account |
| POST | `/api/auth/login` | Log in and receive a JWT |
| POST | `/api/auth/logout` | Log out response endpoint |
| GET | `/api/auth/me` | Fetch the current user |
| PUT | `/api/auth/profile` | Update profile fields, preferences, links, or profile image |
| GET/POST | `/api/study` | List or create study sessions |
| GET/PUT/DELETE | `/api/study/:id` | Read, update, or delete a study session |
| GET/POST | `/api/goals` | List or create goals |
| GET/PUT/DELETE | `/api/goals/:id` | Read, update, or delete a goal |
| POST | `/api/quiz/generate` | Generate a quiz for a study session |
| GET | `/api/quiz/completed` | List completed quizzes |
| GET | `/api/quiz/:studyId` | Fetch a study session's quiz |
| POST | `/api/quiz/:studyId/submit` | Submit and evaluate quiz answers |
| POST | `/api/ai/chat` | Send a message to the AI assistant |
| POST | `/api/ai/documents` | Upload a PDF or text study document |

## Profile images and request limits

Profile photos are resized to a maximum of 512 px and compressed in the browser before being sent to the API. The Express JSON parser accepts payloads up to 2 MB, which prevents normal compressed profile images from causing `PayloadTooLargeError`. The source image selector rejects files larger than 10 MB.

## Browser permissions

The Study page may request:

- **Camera access** for face and object detection.
- **Microphone access** for voice activity detection.

The application remains usable without these permissions, but live focus-monitoring metrics will be limited.

## Security notes

- Passwords are hashed using bcrypt before storage.
- JWT middleware protects user-specific API routes.
- Study sessions, goals, quizzes, profile updates, and AI documents are scoped to the authenticated user.
- Correct quiz answers are withheld until the quiz is submitted.
- Do not expose MongoDB credentials, JWT secrets, or AI keys in frontend code.

## Production checklist

- Set `NODE_ENV=production` and use strong, unique environment secrets.
- Replace the development CORS origin with the deployed frontend URL.
- Update the Axios API base URL in `client/src/api/axios.js` to the deployed API URL.
- Use HTTPS, secure environment-variable storage, and a managed MongoDB deployment.
- Consider moving profile images to object storage (such as Cloudinary or S3) instead of storing Base64 data in MongoDB as usage grows.
- Run `npm run build` in `client` before deploying the frontend.

## Troubleshooting

| Problem | Resolution |
| --- | --- |
| API server cannot connect to MongoDB | Confirm `MONGO_URI` is correct and your Atlas IP/network access allows the connection. |
| AI responses or quizzes fail | Confirm `GEMINI_API_KEY` is valid and has access to the selected Gemini model. |
| `PayloadTooLargeError` on profile save | Restart the API after updating it; use an image below the 10 MB selector limit. The client compresses images automatically. |
| Camera/microphone monitoring does not start | Allow permissions in the browser and use `localhost` or HTTPS. |
| Client cannot call the API | Ensure the server is running on port 5000 and the allowed CORS origin matches Vite's URL. |

## License

No license is currently declared. Add a `LICENSE` file before publishing or distributing this project.
