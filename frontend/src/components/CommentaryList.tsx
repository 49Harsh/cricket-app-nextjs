import React from 'react';

interface CommentaryItem {
  over: number;
  ball: number;
  eventType: string;
  runs?: number;
  batsman?: string;
  bowler?: string;
  description?: string;
  timestamp: string;
}

interface CommentaryListProps {
  commentary: CommentaryItem[];
}

const CommentaryList: React.FC<CommentaryListProps> = ({ commentary }) => {
  const formatDate = (dateString: string) => {
    try {
      // Check if the date string is valid
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Just now';
      }
      return date.toLocaleTimeString();
    } catch (error) {
      return 'Just now';
    }
  };

  const formatOvers = (over: number, ball: number) => {
    return `${over}.${ball}`;
  };

  if (commentary.length === 0) {
    return <div className="no-commentary">No commentary available yet</div>;
  }

  return (
    <div className="commentary-list">
      {commentary.map((item, index) => (
        <div key={index} className="commentary-item">
          <div className="commentary-meta">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            {formatOvers(item.over, item.ball)} overs
            <span className={`commentary-type ${item.eventType}`}>
              {item.eventType.toUpperCase()}
            </span>
            <span className="commentary-time">{formatDate(item.timestamp)}</span>
          </div>
          <div className="commentary-text">
            {item.eventType === 'run' && item.runs !== undefined && (
              <span>
                <strong>{item.batsman || 'Batsman'}</strong> scored{' '}
                <strong>{item.runs}</strong> run{item.runs !== 1 ? 's' : ''}
              </span>
            )}
            {item.eventType === 'wicket' && (
              <span>
                <strong>WICKET!</strong> {item.batsman || 'Batsman'} is out!
              </span>
            )}
            {item.eventType === 'wide' && (
              <span>
                <strong>WIDE</strong> by {item.bowler || 'Bowler'}
              </span>
            )}
            {item.eventType === 'no_ball' && (
              <span>
                <strong>NO BALL</strong> by {item.bowler || 'Bowler'}
              </span>
            )}
            {(item.eventType === 'bye' || item.eventType === 'leg_bye') && (
              <span>
                <strong>{item.eventType.toUpperCase()}</strong>{' '}
                {item.runs !== undefined ? item.runs : 1} run
                {item.runs !== undefined && item.runs !== 1 ? 's' : ''}
              </span>
            )}
            {item.description && <p>{item.description}</p>}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentaryList; 