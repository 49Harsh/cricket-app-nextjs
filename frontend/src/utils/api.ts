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

// Match Statistics Calculation
export interface Commentary {
  over: number;
  ball: number;
  eventType: string;
  runs?: number;
  batsman?: string;
  bowler?: string;
  description?: string;
  timestamp: string;
}

export interface PlayerStats {
  name: string;
  runs: number;
  ballsFaced: number;
  fours: number;
  sixes: number;
}

export interface BowlerStats {
  name: string;
  overs: number;
  runs: number;
  wickets: number;
  ballsBowled: number;
}

export interface MatchStats {
  totalRuns: number;
  batsmen: PlayerStats[];
  bowlers: BowlerStats[];
  currentBowler: BowlerStats | null;
}

export const calculateMatchStatistics = (commentary: Commentary[]): MatchStats => {
  let totalRuns = 0;
  const batsmenMap: Record<string, PlayerStats> = {};
  const bowlersMap: Record<string, BowlerStats> = {};
  
  // Find the current over to determine current bowler
  const maxOver = commentary.length > 0 ? Math.max(...commentary.map(item => item.over)) : 0;
  const maxBall = commentary.length > 0 ? 
    Math.max(...commentary.filter(item => item.over === maxOver).map(item => item.ball)) : 0;
  
  let currentBowlerName: string | null = null;

  // Process each commentary event
  commentary.forEach(item => {
    // Handle runs
    if (item.eventType === 'run' && item.runs !== undefined) {
      totalRuns += item.runs;
      
      // Track batsman stats
      if (item.batsman) {
        if (!batsmenMap[item.batsman]) {
          batsmenMap[item.batsman] = {
            name: item.batsman,
            runs: 0,
            ballsFaced: 0,
            fours: 0,
            sixes: 0
          };
        }
        
        batsmenMap[item.batsman].runs += item.runs;
        batsmenMap[item.batsman].ballsFaced += 1;
        
        // Track boundaries
        if (item.runs === 4) batsmenMap[item.batsman].fours += 1;
        if (item.runs === 6) batsmenMap[item.batsman].sixes += 1;
      }
      
      // Track bowler stats
      if (item.bowler) {
        if (!bowlersMap[item.bowler]) {
          bowlersMap[item.bowler] = {
            name: item.bowler,
            overs: 0,
            runs: 0,
            wickets: 0,
            ballsBowled: 0
          };
        }
        
        bowlersMap[item.bowler].runs += item.runs;
        bowlersMap[item.bowler].ballsBowled += 1;
        
        // Update overs count for bowler (starting from 0)
        // For example: 1 over and 2 balls is displayed as 1.2
        bowlersMap[item.bowler].overs = Math.floor(bowlersMap[item.bowler].ballsBowled / 6) + 
          (bowlersMap[item.bowler].ballsBowled % 6) / 10;
        
        // Check if this is the current bowler
        if (item.over === maxOver) {
          currentBowlerName = item.bowler;
        }
      }
    }
    
    // Handle extras
    if ((item.eventType === 'wide' || item.eventType === 'no_ball') && item.bowler) {
      totalRuns += 1; // Default 1 run for wide/no ball
      
      if (!bowlersMap[item.bowler]) {
        bowlersMap[item.bowler] = {
          name: item.bowler,
          overs: 0,
          runs: 0,
          wickets: 0,
          ballsBowled: 0
        };
      }
      
      bowlersMap[item.bowler].runs += 1;
      
      // No ball counts as a ball bowled, wide does not
      if (item.eventType === 'no_ball') {
        bowlersMap[item.bowler].ballsBowled += 1;
        
        // Update overs count for bowler
        bowlersMap[item.bowler].overs = Math.floor(bowlersMap[item.bowler].ballsBowled / 6) + 
          (bowlersMap[item.bowler].ballsBowled % 6) / 10;
      }
      
      // Check if this is the current bowler
      if (item.over === maxOver) {
        currentBowlerName = item.bowler;
      }
    }
    
    // Handle wickets
    if (item.eventType === 'wicket' && item.bowler) {
      if (!bowlersMap[item.bowler]) {
        bowlersMap[item.bowler] = {
          name: item.bowler,
          overs: 0,
          runs: 0,
          wickets: 0,
          ballsBowled: 0
        };
      }
      
      bowlersMap[item.bowler].wickets += 1;
      bowlersMap[item.bowler].ballsBowled += 1;
      
      // Update overs count for bowler
      bowlersMap[item.bowler].overs = Math.floor(bowlersMap[item.bowler].ballsBowled / 6) + 
        (bowlersMap[item.bowler].ballsBowled % 6) / 10;
      
      // Check if this is the current bowler
      if (item.over === maxOver) {
        currentBowlerName = item.bowler;
      }
      
      // Track batsman stats
      if (item.batsman) {
        if (!batsmenMap[item.batsman]) {
          batsmenMap[item.batsman] = {
            name: item.batsman,
            runs: 0,
            ballsFaced: 0,
            fours: 0,
            sixes: 0
          };
        }
        
        batsmenMap[item.batsman].ballsFaced += 1;
      }
    }
    
    // Handle byes and leg byes
    if ((item.eventType === 'bye' || item.eventType === 'leg_bye') && item.runs !== undefined) {
      totalRuns += item.runs;
      
      // Track bowler stats (ball bowled but no runs against bowler)
      if (item.bowler) {
        if (!bowlersMap[item.bowler]) {
          bowlersMap[item.bowler] = {
            name: item.bowler,
            overs: 0,
            runs: 0,
            wickets: 0,
            ballsBowled: 0
          };
        }
        
        bowlersMap[item.bowler].ballsBowled += 1;
        
        // Update overs count for bowler
        bowlersMap[item.bowler].overs = Math.floor(bowlersMap[item.bowler].ballsBowled / 6) + 
          (bowlersMap[item.bowler].ballsBowled % 6) / 10;
        
        // Check if this is the current bowler
        if (item.over === maxOver) {
          currentBowlerName = item.bowler;
        }
      }
      
      // These count as balls faced by batsman but no runs credited
      if (item.batsman) {
        if (!batsmenMap[item.batsman]) {
          batsmenMap[item.batsman] = {
            name: item.batsman,
            runs: 0,
            ballsFaced: 0,
            fours: 0,
            sixes: 0
          };
        }
        
        batsmenMap[item.batsman].ballsFaced += 1;
      }
    }
  });
  
  // Convert maps to arrays
  const batsmen = Object.values(batsmenMap);
  const bowlers = Object.values(bowlersMap);
  
  // Get current bowler
  const currentBowler = currentBowlerName ? bowlersMap[currentBowlerName] : null;
  
  return {
    totalRuns,
    batsmen,
    bowlers,
    currentBowler
  };
}; 