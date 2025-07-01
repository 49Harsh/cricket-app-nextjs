import { useRouter } from 'next/navigation';
import React from 'react';

interface MatchCardProps {
  match: {
    matchId: string;
    team1: string;
    team2: string;
    venue: string;
    startTime: string;
    isPaused: boolean;
  };
}

const MatchCard: React.FC<MatchCardProps> = ({ match }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/match/${match.matchId}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="match-card" onClick={handleClick}>
      <h2>{match.team1} vs {match.team2}</h2>
      <p>
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
  );
};

export default MatchCard; 