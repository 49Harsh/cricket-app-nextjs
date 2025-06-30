import React, { useEffect, useState } from 'react';
import { fetchMatches } from '../utils/api';
import MatchCard from './MatchCard';

interface Match {
  matchId: string;
  team1: string;
  team2: string;
  venue: string;
  startTime: string;
  isPaused: boolean;
}

const MatchList: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getMatches = async () => {
      try {
        const data = await fetchMatches();
        setMatches(data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching matches');
        setLoading(false);
      }
    };

    getMatches();
  }, []);

  if (loading) {
    return <div>Loading matches...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (matches.length === 0) {
    return <div>No matches currently available</div>;
  }

  return (
    <div className="match-list">
      {matches.map((match) => (
        <MatchCard key={match.matchId} match={match} />
      ))}
    </div>
  );
};

export default MatchList; 