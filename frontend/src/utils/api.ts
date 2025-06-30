import { io, Socket } from 'socket.io-client';

const API_URL = 'http://localhost:3001';

// API functions
export const fetchMatches = async () => {
  const response = await fetch(`${API_URL}/matches`);
  if (!response.ok) {
    throw new Error('Failed to fetch matches');
  }
  return response.json();
};

export const fetchMatchById = async (id: string) => {
  const response = await fetch(`${API_URL}/matches/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch match');
  }
  return response.json();
};

export const startMatch = async (matchData: any) => {
  const response = await fetch(`${API_URL}/matches/start`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(matchData),
  });
  
  if (!response.ok) {
    throw new Error('Failed to start match');
  }
  
  return response.json();
};

export const addCommentary = async (id: string, commentary: any) => {
  const response = await fetch(`${API_URL}/matches/${id}/commentary`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(commentary),
  });
  
  if (!response.ok) {
    throw new Error('Failed to add commentary');
  }
  
  return response.json();
};

export const pauseMatch = async (id: string) => {
  const response = await fetch(`${API_URL}/matches/${id}/pause`, {
    method: 'POST',
  });
  
  if (!response.ok) {
    throw new Error('Failed to pause match');
  }
  
  return response.json();
};

export const resumeMatch = async (id: string) => {
  const response = await fetch(`${API_URL}/matches/${id}/resume`, {
    method: 'POST',
  });
  
  if (!response.ok) {
    throw new Error('Failed to resume match');
  }
  
  return response.json();
};

// Socket.IO client
let socket: Socket | null = null;

export const getSocket = () => {
  if (!socket) {
    socket = io(API_URL);
  }
  return socket;
};

export const joinMatchRoom = (matchId: string) => {
  const socket = getSocket();
  socket.emit('joinMatch', matchId);
};

export const leaveMatchRoom = (matchId: string) => {
  const socket = getSocket();
  socket.emit('leaveMatch', matchId);
}; 