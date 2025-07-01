'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchMatchById, getSocket, joinMatchRoom, leaveMatchRoom, pauseMatch, resumeMatch } from '@/utils/api';
import CommentaryList from '@/components/CommentaryList';
import AddCommentaryForm from '@/components/AddCommentaryForm';
import MatchStats from '@/components/MatchStats';
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
        <div className="loading glass-card">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="loading-icon">
            <line x1="12" y1="2" x2="12" y2="6"></line>
            <line x1="12" y1="18" x2="12" y2="22"></line>
            <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
            <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
            <line x1="2" y1="12" x2="6" y2="12"></line>
            <line x1="18" y1="12" x2="22" y2="12"></line>
            <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
            <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
          </svg>
          <span>Loading match details...</span>
        </div>
      </main>
    );
  }
  
  if (error || !match) {
    return (
      <main className="container">
        <div className="error-container glass-card">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="error-icon">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <p>{error || 'Match not found'}</p>
        </div>
        <button className="button glass-button" onClick={() => router.push('/')}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Home
        </button>
      </main>
    );
  }
  
  return (
    <main className="container">
      <div className="header glass-card">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
          </svg>
          <h1 className="title">{match.team1} vs {match.team2}</h1>
        </div>
        <div>
          <button className="button glass-button" onClick={() => router.push('/')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back to Home
          </button>
        </div>
      </div>
      
      <div className="match-layout">
        <div className="match-main-content">
          <div className="match-detail glass-card">
            <div className="match-header">
              <div className="match-info">
                <p className="match-id">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  Match ID: {match.matchId}
                </p>
                <p>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  Venue: {match.venue}
                </p>
                <p>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  Started: {formatDate(match.startTime)}
                </p>
                <div className={`match-status ${match.isPaused ? 'paused' : 'live'}`}>
                  {match.isPaused ? 'PAUSED' : 'LIVE'}
                </div>
              </div>
              <div>
                <button className={`button ${match.isPaused ? 'glass-button' : 'secondary'}`} onClick={handlePauseResume}>
                  {match.isPaused ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                      </svg>
                      Resume Match
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="6" y="4" width="4" height="16"></rect>
                        <rect x="14" y="4" width="4" height="16"></rect>
                      </svg>
                      Pause Match
                    </>
                  )}
                </button>
              </div>
            </div>
            
            {/* Match Stats Section */}
            <MatchStats commentary={match.commentary} />
            
            <div className="section-header">
              <h2 className="section-title">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                Add Commentary
              </h2>
            </div>
            <AddCommentaryForm matchId={match.matchId} onCommentaryAdded={handleCommentaryAdded} />
          </div>
        </div>
        
        <div className="commentary-sidebar glass-morphism">
          <div className="section-header">
            <h2 className="section-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="8" y1="6" x2="21" y2="6"></line>
                <line x1="8" y1="12" x2="21" y2="12"></line>
                <line x1="8" y1="18" x2="21" y2="18"></line>
                <line x1="3" y1="6" x2="3.01" y2="6"></line>
                <line x1="3" y1="12" x2="3.01" y2="12"></line>
                <line x1="3" y1="18" x2="3.01" y2="18"></line>
              </svg>
              Live Commentary
            </h2>
          </div>
          <CommentaryList commentary={match.commentary} />
        </div>
      </div>
    </main>
  );
} 