
# Analytical Dashboard — CausalFunnel Assignment

A full-stack web analytics application that tracks page views and clicks, stores events in MongoDB, and visualizes session activity through an interactive dashboard.

## Features

- **Event tracking:** Captures page views and clicks from a demo website.
- **Session analytics:** Groups events by session and summarizes page views, clicks, and recent activity.
- **User journey:** Displays session events in chronological order.
- **Click heatmap:** Visualizes recorded click coordinates by page.
- **Event validation:** Validates incoming event payloads before storing them.
- **Demo website:** Allows the complete tracking workflow to be tested locally.

## Tech Stack

- **Frontend:** React, Vite, JavaScript, CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Tracking:** Vanilla JavaScript

## Project Structure

```text
Analytical-Dashboard/
├── backend/
│   ├── models/
│   │   └── Event.js
│   ├── routes/
│   │   ├── events.js
│   │   ├── sessions.js
│   │   └── heatmap.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   │   ├── demo.html
│   │   └── tracker.js
│   ├── src/
│   │   ├── App.jsx
│   │   └── App.css
│   └── package.json
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

- Node.js and npm
- MongoDB Atlas or a local MongoDB instance
- Git

### 1. Clone the repository

```bash
git clone https://github.com/Manvender20/Analytical-Dashboard.git
cd Analytical-Dashboard
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
```

Replace the placeholder with your own MongoDB connection string. Never commit your `.env` file.

Start the backend:

```bash
npm run dev
```

The backend runs at `http://localhost:5000`.

### 3. Set up the frontend

Open a second terminal from the project root:

```bash
cd frontend
npm install
npm run dev
```

Open the Vite development URL, normally `http://localhost:5173`.

### 4. Try the demo

1. Open `http://localhost:5173/demo.html`.
2. Refresh the page and click the demo elements.
3. Open `http://localhost:5173` to view the analytics dashboard.
4. Explore session summaries, individual user journeys, and click heatmaps.

## API Endpoints

Base URL: `http://localhost:5000`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | API health check |
| POST | `/api/events` | Ingest and validate an event |
| GET | `/api/sessions` | Retrieve session summaries |
| GET | `/api/sessions/:id/events` | Retrieve a session's event timeline |
| GET | `/api/heatmap/pages` | List pages with recorded events |
| GET | `/api/heatmap/clicks?pageUrl=<encoded-url>` | Retrieve click coordinates for a page |

### Example event payload

Page view:

```json
{
  "session_id": "example-session",
  "event_type": "page_view",
  "page_url": "http://localhost:5173/demo.html"
}
```

Click:

```json
{
  "session_id": "example-session",
  "event_type": "click",
  "page_url": "http://localhost:5173/demo.html",
  "click": {
    "x": 250,
    "y": 180
  }
}
```

The backend validates required fields and accepted event types. Event timestamps are assigned by the backend.

## Testing

The local workflow has been verified for:

- Page-view and click event ingestion
- Session summaries and event counts
- Chronological user journeys
- Heatmap page and click retrieval
- Rejection of invalid event types

## Current Limitations

- Session IDs persist in browser `localStorage`; automatic inactivity-based session expiration is not implemented.
- Heatmap positioning can vary with viewport size because click coordinates are viewport-relative.
- The tracking script currently uses a localhost API URL and requires configuration for a deployed environment.
- Production deployment and automated test coverage are not included.

## Future Improvements

- Session expiration and lifecycle management
- Page-aligned heatmap overlays
- Date-range filters and additional analytics
- Environment-based tracking endpoint configuration
- Automated backend and frontend tests

## Author

**Manvender Pratap Singh**

GitHub: [@Manvender20](https://github.com/Manvender20)