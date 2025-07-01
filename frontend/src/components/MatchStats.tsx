import React from 'react';
import { calculateMatchStatistics, Commentary, MatchStats as MatchStatsType } from '@/utils/api';

interface MatchStatsProps {
  commentary: Commentary[];
}

const MatchStats: React.FC<MatchStatsProps> = ({ commentary }) => {
  const stats = calculateMatchStatistics(commentary);

  return (
    <div className="match-stats glass-morphism">
      <div className="score-summary glass-card">
        <div className="total-score">
          <h3>Total Score</h3>
          <div className="score-value">{stats.totalRuns}</div>
        </div>
      </div>

      {/* Current Bowler Stats */}
      {stats.currentBowler && (
        <div className="current-bowler glass-card">
          <h3>Current Bowler</h3>
          <div className="player-card">
            <div className="player-name">{stats.currentBowler.name}</div>
            <div className="player-stats">
              <div className="stat-item">
                <div className="stat-value">{stats.currentBowler.overs.toFixed(1)}</div>
                <div className="stat-label">Overs</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{stats.currentBowler.runs}</div>
                <div className="stat-label">Runs</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{stats.currentBowler.wickets}</div>
                <div className="stat-label">Wickets</div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Batsmen Stats */}
      <div className="batsmen-stats glass-card">
        <h3>Batsmen</h3>
        {stats.batsmen.length > 0 ? (
          <table className="stats-table">
            <thead>
              <tr>
                <th>Batsman</th>
                <th>Runs</th>
                <th>Balls</th>
                <th>4s</th>
                <th>6s</th>
              </tr>
            </thead>
            <tbody>
              {stats.batsmen
                .sort((a, b) => b.runs - a.runs)
                .map((batsman, index) => (
                  <tr key={index} className="glass-row">
                    <td>{batsman.name}</td>
                    <td>{batsman.runs}</td>
                    <td>{batsman.ballsFaced}</td>
                    <td>{batsman.fours}</td>
                    <td>{batsman.sixes}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        ) : (
          <div className="no-stats">No batsmen data available</div>
        )}
      </div>

      {/* Bowlers Stats */}
      <div className="bowlers-stats glass-card">
        <h3>Bowlers</h3>
        {stats.bowlers.length > 0 ? (
          <table className="stats-table">
            <thead>
              <tr>
                <th>Bowler</th>
                <th>Overs</th>
                <th>Runs</th>
                <th>Wickets</th>
              </tr>
            </thead>
            <tbody>
              {stats.bowlers.map((bowler, index) => (
                <tr 
                  key={index} 
                  className={`glass-row ${stats.currentBowler?.name === bowler.name ? 'current-player' : ''}`}
                >
                  <td>{bowler.name}</td>
                  <td>{bowler.overs.toFixed(1)}</td>
                  <td>{bowler.runs}</td>
                  <td>{bowler.wickets}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-stats">No bowler data available</div>
        )}
      </div>
    </div>
  );
};

export default MatchStats; 