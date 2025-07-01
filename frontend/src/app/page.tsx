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
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3">
            <circle cx="12" cy="12" r="10"></circle>
            <circle cx="12" cy="12" r="2"></circle>
          </svg>
          <h1 className="title">Cricket Live Scoreboard</h1>
        </div>
        <button 
          className="button"
          onClick={() => setShowForm(!showForm)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          {showForm ? 'Hide Form' : 'Start New Match'}
        </button>
      </div>

      {showForm && (
        <CreateMatchForm />
      )}

      <div className="section-header">
        <h2 className="section-title">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
          </svg>
          Ongoing Matches
        </h2>
      </div>
      <MatchList />
    </main>
  )
}
