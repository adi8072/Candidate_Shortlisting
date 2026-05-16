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
    <div className="glass-card">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
        <div style={{ padding: '0.75rem', background: 'var(--primary)', borderRadius: '0.75rem', color: 'white' }}>👤</div>
        <h2 style={{ margin: 0 }}>Add Candidate</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Full Name</label>
          <input 
            type="text" 
            placeholder="John Doe" 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
        </div>

        <div className="input-group">
          <label>Email</label>
          <input 
            type="email" 
            placeholder="john@example.com" 
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
        </div>
        
        <div className="input-group">
          <label>Skills</label>
          <input 
            type="text" 
            placeholder="React, Python, AWS..." 
            value={formData.skills}
            onChange={(e) => setFormData({...formData, skills: e.target.value})}
            required
          />
        </div>
        
        <div className="input-group">
          <label>Years of Experience</label>
          <input 
            type="number" 
            placeholder="0" 
            value={formData.experience}
            onChange={(e) => setFormData({...formData, experience: e.target.value})}
            required
          />
        </div>
        
        <div className="input-group">
          <label>Bio & Background</label>
          <textarea 
            rows="3" 
            placeholder="Briefly describe background..."
            value={formData.bio}
            onChange={(e) => setFormData({...formData, bio: e.target.value})}
          ></textarea>
        </div>
        
        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
          {loading ? 'Saving...' : 'Add to Database'}
        </button>
      </form>
    </div>
  );
};

export default CandidateForm;
