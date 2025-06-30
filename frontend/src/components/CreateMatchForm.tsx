import React, { useState } from 'react';
import { startMatch } from '../utils/api';
import { useRouter } from 'next/navigation';

const CreateMatchForm: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    team1: '',
    team2: '',
    venue: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Validate form
      if (!formData.team1 || !formData.team2 || !formData.venue) {
        throw new Error('All fields are required');
      }

      const match = await startMatch(formData);
      router.push(`/match/${match.matchId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form">
      <h2>Start a New Match</h2>
      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="team1">Team 1</label>
          <input
            id="team1"
            name="team1"
            type="text"
            value={formData.team1}
            onChange={handleChange}
            placeholder="Enter team name"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="team2">Team 2</label>
          <input
            id="team2"
            name="team2"
            type="text"
            value={formData.team2}
            onChange={handleChange}
            placeholder="Enter team name"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="venue">Venue</label>
          <input
            id="venue"
            name="venue"
            type="text"
            value={formData.venue}
            onChange={handleChange}
            placeholder="Enter match venue"
            required
          />
        </div>
        <button
          className="button"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Starting Match...' : 'Start Match'}
        </button>
      </form>
    </div>
  );
};

export default CreateMatchForm; 