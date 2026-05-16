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
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/candidates`);
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
      <header style={{ textAlign: 'center', marginBottom: '4rem', paddingTop: '3rem' }} className="animate-up">
        <h1>TalentMatch AI</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
          The next generation of recruitment. Match top talent with precision using our advanced AI engine.
        </p>
      </header>

      <div className="tab-nav animate-up" style={{ animationDelay: '0.1s' }}>
        <button 
          className={`tab-btn ${activeTab === 'job' ? 'active' : ''}`}
          onClick={() => setActiveTab('job')}
        >
          🎯 Match Talent
        </button>
        <button 
          className={`tab-btn ${activeTab === 'candidate' ? 'active' : ''}`}
          onClick={() => setActiveTab('candidate')}
        >
          👤 Onboard ({candidatesCount})
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(350px, 400px) 1fr', gap: '3rem', alignItems: 'start' }}>
        <aside className="animate-up" style={{ animationDelay: '0.2s' }}>
          {activeTab === 'candidate' ? (
            <CandidateForm onCandidateAdded={fetchCount} />
          ) : (
            <JobForm onMatch={handleMatchResults} />
          )}
        </aside>

        <main className="animate-up" style={{ animationDelay: '0.3s' }}>
          {results.length > 0 ? (
            <div>
              <h2 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {isAiView ? '🤖 AI Intelligence Report' : '🎯 Shortlisted Candidates'}
                <span style={{ fontSize: '0.9rem', fontWeight: 400, color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '0.3rem 0.8rem', borderRadius: '1rem' }}>
                  {results.length} Found
                </span>
              </h2>
              <div style={{ display: 'grid', gap: '1.5rem' }}>
                {results.map((res, i) => (
                  <ResultCard key={i} candidate={res} isAi={isAiView} />
                ))}
              </div>
            </div>
          ) : (
            <div className="glass-card" style={{ textAlign: 'center', padding: '6rem 2rem', borderStyle: 'dashed', borderWidth: '2px' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1.5rem', opacity: 0.5 }}>✨</div>
              <h3>Launch your search</h3>
              <p style={{ color: 'var(--text-muted)', marginTop: '1rem', maxWidth: '400px', margin: '1rem auto' }}>
                {activeTab === 'candidate' 
                  ? 'Add candidate profiles to build your talent pool.' 
                  : 'Configure job requirements on the left to begin the matching process.'}
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
