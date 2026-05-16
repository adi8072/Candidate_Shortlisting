import React, { useState } from 'react';

const JobForm = ({ onMatch }) => {
  const [jobData, setJobData] = useState({
    requiredSkills: '',
    minExperience: '',
    preferredSkills: ''
  });
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const handleMatch = async (type) => {
    const isAi = type === 'ai';
    if (isAi) setAiLoading(true);
    else setLoading(true);

    const payload = {
      requiredSkills: jobData.requiredSkills.split(',').map(s => s.trim()).filter(s => s !== ''),
      minExperience: Number(jobData.minExperience),
      preferredSkills: jobData.preferredSkills.split(',').map(s => s.trim()).filter(s => s !== '')
    };

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const endpoint = isAi ? '/api/ai/shortlist' : '/api/match';
      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      if (response.ok) {
        onMatch(data, isAi);
      } else {
        alert(data.error || 'Matching failed');
      }
    } catch (error) {
      alert('Failed to connect to server');
    } finally {
      setAiLoading(false);
      setLoading(false);
    }
  };

  return (
    <div className="glass-card">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
        <div style={{ padding: '0.75rem', background: 'var(--accent)', borderRadius: '0.75rem', color: 'var(--bg-dark)' }}>🎯</div>
        <h2 style={{ margin: 0 }}>Job Specs</h2>
      </div>

      <div className="input-group">
        <label>Required Skills</label>
        <input 
          type="text" 
          placeholder="e.g. React, Node.js" 
          value={jobData.requiredSkills}
          onChange={(e) => setJobData({...jobData, requiredSkills: e.target.value})}
        />
      </div>
      
      <div className="input-group">
        <label>Min Experience (Years)</label>
        <input 
          type="number" 
          placeholder="1" 
          value={jobData.minExperience}
          onChange={(e) => setJobData({...jobData, minExperience: e.target.value})}
        />
      </div>
      
      <div className="input-group" style={{ marginBottom: '2rem' }}>
        <label>Preferred Skills</label>
        <input 
          type="text" 
          placeholder="e.g. AWS, Docker" 
          value={jobData.preferredSkills}
          onChange={(e) => setJobData({...jobData, preferredSkills: e.target.value})}
        />
      </div>
      
      <div style={{ display: 'grid', gap: '1rem' }}>
        <button 
          className="btn btn-primary" 
          onClick={() => handleMatch('basic')}
          disabled={loading || aiLoading}
        >
          {loading ? 'Processing...' : '⚡ Quick Match'}
        </button>
        <button 
          className="btn btn-accent" 
          onClick={() => handleMatch('ai')}
          disabled={loading || aiLoading}
        >
          {aiLoading ? 'Analyzing...' : '🤖 AI Intelligent Match'}
        </button>
      </div>
    </div>
  );
};

export default JobForm;
