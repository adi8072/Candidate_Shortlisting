import React, { useState, useEffect } from 'react';
import CandidateForm from './components/CandidateForm';
import JobForm from './components/JobForm';
import ResultCard from './components/ResultCard';
import ChatBot from './components/ChatBot';

function App() {
  const [activeTab, setActiveTab] = useState('job');
  const [results, setResults] = useState([]);
  const [isAiView, setIsAiView] = useState(false);
  const [candidatesCount, setCandidatesCount] = useState(0);

  const fetchCount = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/candidates');
      const data = await res.json();
      setCandidatesCount(data.length);
    } catch (e) {}
  };

  useEffect(() => {
    fetchCount();
  }, []);

  const handleMatchResults = (data, isAi) => {
    setResults(data);
    setIsAiView(isAi);
  };

  return (
    <div className="container">
      <header style={{ textAlign: 'center', marginBottom: '3rem', paddingTop: '2rem' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem', background: 'linear-gradient(to right, #6366f1, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          TalentMatch AI
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
          Intelligent Candidate Shortlisting & Ranking System
        </p>
      </header>

      <div className="tab-nav">
        <button 
          className={`tab-btn ${activeTab === 'job' ? 'active' : ''}`}
          onClick={() => setActiveTab('job')}
        >
          Match Talent
        </button>
        <button 
          className={`tab-btn ${activeTab === 'candidate' ? 'active' : ''}`}
          onClick={() => setActiveTab('candidate')}
        >
          Onboard Candidates ({candidatesCount})
        </button>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr 2fr', alignItems: 'start' }}>
        <aside>
          {activeTab === 'candidate' ? (
            <CandidateForm onCandidateAdded={fetchCount} />
          ) : (
            <JobForm onMatch={handleMatchResults} />
          )}
        </aside>

        <main>
          {results.length > 0 ? (
            <div className="animate-fade-in">
              <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {isAiView ? '🤖 AI Insights' : '🎯 Best Matches'}
                <span style={{ fontSize: '0.875rem', fontWeight: 400, color: 'var(--text-muted)' }}>
                  ({results.length} results found)
                </span>
              </h2>
              <div style={{ display: 'grid', gap: '1.5rem' }}>
                {results.map((res, i) => (
                  <ResultCard key={i} candidate={res} isAi={isAiView} />
                ))}
              </div>
            </div>
          ) : (
            <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
              <h3>Ready to find your next star?</h3>
              <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                {activeTab === 'candidate' 
                  ? 'Fill out the form on the left to add a candidate to the database.' 
                  : 'Enter job requirements on the left to see matching candidates.'}
              </p>
            </div>
          )}
        </main>
      </div>
      <ChatBot />
    </div>
  );
}

export default App;
