import React, { useState } from 'react';
import { addCommentary } from '../utils/api';

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

      // Reset form for runs and description
      setFormData(prev => ({
        ...prev,
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
    <div className="form">
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
          />
        </div>

        <button
          className="button"
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