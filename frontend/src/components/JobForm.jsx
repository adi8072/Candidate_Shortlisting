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
    <div className="glass-card animate-fade-in">
      <h2 style={{ marginBottom: '1.5rem' }}>Job Requirements</h2>
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
        <label>Minimum Experience (Years)</label>
        <input 
          type="number" 
          placeholder="1" 
          value={jobData.minExperience}
          onChange={(e) => setJobData({...jobData, minExperience: e.target.value})}
        />
      </div>
      
      <div className="input-group">
        <label>Preferred Skills (Optional)</label>
        <input 
          type="text" 
          placeholder="e.g. AWS, Docker" 
          value={jobData.preferredSkills}
          onChange={(e) => setJobData({...jobData, preferredSkills: e.target.value})}
        />
      </div>
      
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <button 
          className="btn btn-primary" 
          style={{ flex: 1 }}
          onClick={() => handleMatch('basic')}
          disabled={loading || aiLoading}
        >
          {loading ? 'Matching...' : 'Basic Shortlist'}
        </button>
        <button 
          className="btn btn-accent" 
          style={{ flex: 1 }}
          onClick={() => handleMatch('ai')}
          disabled={loading || aiLoading}
        >
          {aiLoading ? 'Analyzing...' : 'AI-Powered Shortlist'}
        </button>
      </div>
    </div>
  );
};

export default JobForm;
