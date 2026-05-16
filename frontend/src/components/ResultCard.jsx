import React from 'react';

const ResultCard = ({ candidate, isAi }) => {
  const rankClass = `badge badge-${candidate.rank.toLowerCase()}`;

  return (
    <div className="glass-card animate-up" style={{ padding: '1.75rem', position: 'relative', overflow: 'hidden' }}>
      {/* Decorative background glow */}
      <div style={{ 
        position: 'absolute', 
        top: '-10%', 
        right: '-10%', 
        width: '100px', 
        height: '100px', 
        background: isAi ? 'var(--primary)' : 'var(--accent)', 
        filter: 'blur(60px)', 
        opacity: 0.1 
      }}></div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ 
            width: '45px', 
            height: '45px', 
            borderRadius: '12px', 
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.2rem'
          }}>
            👤
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'white' }}>{candidate.name}</h3>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>{candidate.email}</p>
          </div>
        </div>
        <span className={rankClass}>{candidate.rank} Match</span>
      </div>

      {!isAi && (
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Technical Alignment</span>
            <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--accent)' }}>{candidate.matchScore}%</span>
          </div>
          <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ 
              height: '100%', 
              background: 'linear-gradient(to right, var(--accent), #22d3ee)', 
              width: `${candidate.matchScore}%`, 
              borderRadius: '4px',
              transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)' 
            }}></div>
          </div>
        </div>
      )}

      {isAi ? (
        <div style={{ 
          padding: '1.25rem', 
          background: 'rgba(139, 92, 246, 0.05)', 
          borderLeft: '3px solid var(--primary)',
          borderRadius: '0.5rem',
          marginTop: '1rem'
        }}>
          <p style={{ fontSize: '0.9rem', color: '#e2e8f0', margin: 0, lineHeight: 1.6 }}>
            <strong>AI Insight:</strong> {candidate.explanation}
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', alignItems: 'end' }}>
          <div>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', fontWeight: 600 }}>Core Competencies</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {candidate.matchedSkills?.map((skill, i) => (
                <span key={i} style={{ 
                  fontSize: '0.7rem', 
                  background: 'rgba(255, 255, 255, 0.05)', 
                  color: 'white', 
                  padding: '0.25rem 0.6rem', 
                  borderRadius: '0.5rem',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <strong>{candidate.experience}Y</strong> Experience
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultCard;
