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
      <p>Match ID: {match.matchId}</p>
      <p>Venue: {match.venue}</p>
      <p>Started: {formatDate(match.startTime)}</p>
      <div className={`match-status ${match.isPaused ? 'paused' : 'live'}`}>
        {match.isPaused ? 'PAUSED' : 'LIVE'}
      </div>
    </div>
  );
};

export default MatchCard; 