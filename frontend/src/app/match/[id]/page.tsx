'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchMatchById, getSocket, joinMatchRoom, leaveMatchRoom, pauseMatch, resumeMatch } from '@/utils/api';
import CommentaryList from '@/components/CommentaryList';
import AddCommentaryForm from '@/components/AddCommentaryForm';
import '../../styles.css';

interface Match {
  matchId: string;
  team1: string;
  team2: string;
  venue: string;
  startTime: string;
  isPaused: boolean;
  commentary: any[];
}

export default function MatchDetail() {
  const params = useParams();
  const router = useRouter();
  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMatch = async () => {
    try {
      const data = await fetchMatchById(params.id as string);
      setMatch(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load match data');
      setLoading(false);
    }
  };

  const handleCommentaryAdded = () => {
    fetchMatch();
  };

  const handlePauseResume = async () => {
    if (!match) return;
    
    try {
      if (match.isPaused) {
        await resumeMatch(match.matchId);
      } else {
        await pauseMatch(match.matchId);
      }
      fetchMatch();
    } catch (err) {
      setError(`Failed to ${match.isPaused ? 'resume' : 'pause'} match`);
    }
  };

  useEffect(() => {
    const matchId = params.id as string;
    fetchMatch();
    
    // Set up socket connection
    const socket = getSocket();
    joinMatchRoom(matchId);
    
    socket.on('commentary', (newCommentary) => {
      setMatch((prevMatch) => {
        if (!prevMatch) return null;
        return {
          ...prevMatch,
          commentary: [...prevMatch.commentary, newCommentary],
        };
      });
    });
    
    socket.on('matchUpdate', (updatedMatch) => {
      setMatch(updatedMatch);
    });
    
    return () => {
      leaveMatchRoom(matchId);
      socket.off('commentary');
      socket.off('matchUpdate');
    };
  }, [params.id]);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  if (loading) {
    return (
      <main className="container">
        <div>Loading match details...</div>
      </main>
    );
  }
  
  if (error || !match) {
    return (
      <main className="container">
        <div>{error || 'Match not found'}</div>
        <button className="button" onClick={() => router.push('/')}>
          Back to Home
        </button>
      </main>
    );
  }
  
  return (
    <main className="container">
      <div className="header">
        <div>
          <h1 className="title">{match.team1} vs {match.team2}</h1>
          <p>Match ID: {match.matchId}</p>
        </div>
        <div>
          <button className="button secondary" onClick={() => router.push('/')}>
            Back to Home
          </button>
        </div>
      </div>
      
      <div className="match-detail">
        <div className="match-header">
          <div className="match-info">
            <p>Venue: {match.venue}</p>
            <p>Started: {formatDate(match.startTime)}</p>
            <p>Status: {match.isPaused ? 'PAUSED' : 'LIVE'}</p>
          </div>
          <div>
            <button className="button" onClick={handlePauseResume}>
              {match.isPaused ? 'Resume Match' : 'Pause Match'}
            </button>
          </div>
        </div>
        
        <div className="commentary-section">
          <h2>Add Commentary</h2>
          <AddCommentaryForm matchId={match.matchId} onCommentaryAdded={handleCommentaryAdded} />
          
          <h2>Live Commentary</h2>
          <CommentaryList commentary={match.commentary} />
        </div>
      </div>
    </main>
  );
} 