"use client";

import React, { useState } from 'react';
import MatchList from '@/components/MatchList';
import CreateMatchForm from '@/components/CreateMatchForm';
import '../app/styles.css';

export default function Home() {
  const [showForm, setShowForm] = useState(false);

  return (
    <main className="container">
      <div className="header">
        <h1 className="title">Cricket Live Scoreboard</h1>
        <button 
          className="button"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Hide Form' : 'Start New Match'}
        </button>
      </div>

      {showForm && (
        <CreateMatchForm />
      )}

      <h2>Ongoing Matches</h2>
      <MatchList />
    </main>
  )
}
