# Cricket Scoring App

A real-time cricket scoreboard application built using NestJS, MongoDB, Redis, Socket.IO, React, and Next.js.

## Features

- Start a cricket match with teams and venue information
- Auto-generated unique 4-digit match ID
- Add ball-by-ball commentary in real-time
- View live match updates through WebSocket communication
- Pause/resume match functionality
- Latest 10 commentary entries stored in Redis cache

## Project Structure

```
cricket-app/
  ├── backend/        # NestJS backend
  └── frontend/       # Next.js frontend
```

## Prerequisites

- Node.js v16+ and npm
- MongoDB running on localhost:27017
- Redis server running on localhost:6379

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the NestJS server:
   ```
   npm run start:dev
   ```
   
The backend will be available at http://localhost:3001.

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the Next.js development server:
   ```
   npm run dev
   ```

The frontend will be available at http://localhost:3000.

## API Endpoints

- `POST /matches/start` - Start a new match
- `POST /matches/:id/commentary` - Add commentary to a match
- `GET /matches/:id` - Get match details
- `POST /matches/:id/pause` - Pause a match
- `POST /matches/:id/resume` - Resume a match

## Technologies Used

- **Backend**: NestJS, TypeScript, MongoDB, Redis, Socket.IO
- **Frontend**: React with Next.js, CSS (no UI libraries)

## Implementation Details

### Auto-incrementing Match ID

The system generates unique 4-digit match IDs using a MongoDB counter collection.

### Real-time Updates

Socket.IO is used for real-time communication between the server and clients. When commentary is added, it's broadcast to all connected clients.

### Redis Caching

The latest 10 commentary entries for each match are stored in Redis for quick access.

## Bonus Features

- Match pause/resume functionality
- Redis cache for the latest 10 commentary entries 