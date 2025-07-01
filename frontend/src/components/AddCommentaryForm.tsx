import React, { useState, useEffect } from 'react';
import { addCommentary, fetchMatchById } from '../utils/api';

interface AddCommentaryFormProps {
  matchId: string;
  onCommentaryAdded: () => void;
}

const AddCommentaryForm: React.FC<AddCommentaryFormProps> = ({ matchId, onCommentaryAdded }) => {
  const [formData, setFormData] = useState({
    over: 0,
    ball: 0,
    eventType: 'run',
    runs: 0,
    batsman: '',
    bowler: '',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastCommentary, setLastCommentary] = useState<{over: number, ball: number} | null>(null);

  // Fetch last ball information when component mounts or match changes
  useEffect(() => {
    const getLastCommentary = async () => {
      try {
        const matchData = await fetchMatchById(matchId);
        if (matchData.commentary && matchData.commentary.length > 0) {
          const commentaries = matchData.commentary;
          const lastItem = commentaries[commentaries.length - 1];
          setLastCommentary({ over: lastItem.over, ball: lastItem.ball });
          
          // Calculate next ball position
          let nextOver = lastItem.over;
          let nextBall = lastItem.ball;
          
          // If it's not a wide or no-ball, increment the ball count
          if (!['wide'].includes(lastItem.eventType)) {
            nextBall++;
          }
          
          // If we've reached 6 balls, move to next over
          if (nextBall > 5) {
            nextOver++;
            nextBall = 0;
          }
          
          setFormData(prev => ({
            ...prev,
            over: nextOver,
            ball: nextBall
          }));
        }
      } catch (err) {
        console.error('Failed to fetch last ball information:', err);
      }
    };
    
    getLastCommentary();
  }, [matchId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'over' || name === 'ball' || name === 'runs' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Validate form
      if (formData.over < 0 || formData.ball < 0 || formData.ball > 6) {
        throw new Error('Invalid over or ball number');
      }
      
      await addCommentary(matchId, formData);
      onCommentaryAdded();

      // Calculate next ball position after submitting this commentary
      let nextOver = formData.over;
      let nextBall = formData.ball;
      
      // If it's not a wide or no-ball, increment the ball count
      if (!['wide'].includes(formData.eventType)) {
        nextBall++;
      }
      
      // If we've reached 6 balls, move to next over
      if (nextBall > 5) {
        nextOver++;
        nextBall = 0;
      }
      
      // Reset form for next entry
      setFormData(prev => ({
        ...prev,
        over: nextOver,
        ball: nextBall,
        runs: 0,
        description: '',
      }));

      setIsSubmitting(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form glass-card">
      <h3>Add Commentary</h3>
      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="over">Over</label>
            <input
              id="over"
              name="over"
              type="number"
              min="0"
              value={formData.over}
              onChange={handleChange}
              required
              className="glass-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="ball">Ball</label>
            <input
              id="ball"
              name="ball"
              type="number"
              min="0"
              max="6"
              value={formData.ball}
              onChange={handleChange}
              required
              className="glass-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="eventType">Event Type</label>
            <select
              id="eventType"
              name="eventType"
              value={formData.eventType}
              onChange={handleChange}
              required
              className="glass-input"
            >
              <option value="run">Run</option>
              <option value="wicket">Wicket</option>
              <option value="wide">Wide</option>
              <option value="no_ball">No Ball</option>
              <option value="bye">Bye</option>
              <option value="leg_bye">Leg Bye</option>
            </select>
          </div>
        </div>

        {(formData.eventType === 'run' || formData.eventType === 'bye' || formData.eventType === 'leg_bye') && (
          <div className="form-group">
            <label htmlFor="runs">Runs</label>
            <input
              id="runs"
              name="runs"
              type="number"
              min="0"
              value={formData.runs}
              onChange={handleChange}
              className="glass-input"
            />
          </div>
        )}

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="batsman">Batsman</label>
            <input
              id="batsman"
              name="batsman"
              type="text"
              value={formData.batsman}
              onChange={handleChange}
              placeholder="Batsman name"
              className="glass-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="bowler">Bowler</label>
            <input
              id="bowler"
              name="bowler"
              type="text"
              value={formData.bowler}
              onChange={handleChange}
              placeholder="Bowler name"
              className="glass-input"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description (Optional)</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Add additional details here"
            rows={3}
            className="glass-input"
          />
        </div>

        <button
          className="button glass-button"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Adding...' : 'Add Commentary'}
        </button>
      </form>
    </div>
  );
};

export default AddCommentaryForm; 