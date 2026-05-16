import React, { useState } from 'react';

const CandidateForm = ({ onCandidateAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    skills: '',
    experience: '',
    bio: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const processedData = {
      ...formData,
      skills: formData.skills.split(',').map(s => s.trim()).filter(s => s !== ''),
      experience: Number(formData.experience)
    };

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/candidates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(processedData)
      });
      
      if (response.ok) {
        alert('Candidate added successfully!');
        setFormData({ name: '', email: '', skills: '', experience: '', bio: '' });
        if (onCandidateAdded) onCandidateAdded();
      } else {
        const err = await response.json();
        alert('Error: ' + err.error);
      }
    } catch (error) {
      alert('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card animate-fade-in">
      <h2 style={{ marginBottom: '1.5rem' }}>Add New Candidate</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="input-group">
            <label>Full Name</label>
            <input 
              type="text" 
              placeholder="e.g. Rahul Sharma" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          <div className="input-group">
            <label>Email Address</label>
            <input 
              type="email" 
              placeholder="rahul@example.com" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>
        </div>
        
        <div className="input-group">
          <label>Skills (comma separated)</label>
          <input 
            type="text" 
            placeholder="React, Node.js, MongoDB" 
            value={formData.skills}
            onChange={(e) => setFormData({...formData, skills: e.target.value})}
            required
          />
        </div>
        
        <div className="input-group">
          <label>Years of Experience</label>
          <input 
            type="number" 
            placeholder="2" 
            value={formData.experience}
            onChange={(e) => setFormData({...formData, experience: e.target.value})}
            required
          />
        </div>
        
        <div className="input-group">
          <label>Short Bio / Projects</label>
          <textarea 
            rows="4" 
            placeholder="Describe background and key projects..."
            value={formData.bio}
            onChange={(e) => setFormData({...formData, bio: e.target.value})}
          ></textarea>
        </div>
        
        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
          {loading ? 'Adding...' : 'Save Candidate Profile'}
        </button>
      </form>
    </div>
  );
};

export default CandidateForm;
