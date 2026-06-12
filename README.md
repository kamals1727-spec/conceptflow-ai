# Infinite Minds - Phase 1 Frontend

A responsive, zero-dependency single-page frontend for adaptive mathematics learning. Each mock assessment contains the required 10 open-answer questions.

## Run locally

Serve this folder with any static server. For example:

```powershell
python -m http.server 8080
```

Then open `http://localhost:8080`.

The app starts in mock mode. Use any valid email address and a password of at least 8 characters.

## Connect the backend

Edit `config.js`:

```js
window.INFINITE_MINDS_CONFIG = {
  API_BASE_URL: "https://api.example.com",
  USE_MOCK_API: false,
};
```

The expected REST endpoints are:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | `/auth/signup` | Create student account |
| POST | `/auth/login` | Authenticate student |
| GET | `/dashboard` | Profile, topics, progress and history |
| GET | `/topics/:id/learn` | AI lesson content |
| GET | `/topics/:id/test?level=Beginner` | Open-answer questions |
| POST | `/topics/:id/test` | Evaluate answers and return weak concepts |

The AI provider API key must only exist on the backend. Never add it to `config.js` or any browser code.

## Main files

- `src/app.js`: screens, navigation and interactions
- `src/api.js`: backend adapter and mock persistence
- `src/data.js`: mock topics, lessons and test questions
- `styles.css`: responsive visual design
