import React from 'react';

const ResultCard = ({ candidate, isAi }) => {
  const rankClass = `badge badge-${candidate.rank.toLowerCase()}`;

  return (
    <div className="glass-card animate-fade-in" style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div>
          <h3 style={{ color: 'var(--primary)' }}>{candidate.name}</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{candidate.email}</p>
        </div>
        <span className={rankClass}>{candidate.rank} Match</span>
      </div>

      {!isAi && (
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Skill Match Score</span>
            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--accent)' }}>{candidate.matchScore}%</span>
          </div>
          <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ height: '100%', background: 'var(--accent)', width: `${candidate.matchScore}%`, transition: 'width 1s ease-out' }}></div>
          </div>
        </div>
      )}

      {isAi ? (
        <p style={{ fontSize: '0.925rem', color: 'var(--text-main)', fontStyle: 'italic', background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '0.5rem' }}>
          "{candidate.explanation}"
        </p>
      ) : (
        <>
          <div style={{ marginBottom: '0.5rem' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>MATCHED SKILLS</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {candidate.matchedSkills?.map((skill, i) => (
                <span key={i} style={{ fontSize: '0.75rem', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', padding: '2px 8px', borderRadius: '4px' }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            <strong>Exp:</strong> {candidate.experience} yrs | <strong>Bio:</strong> {candidate.bio?.substring(0, 50)}...
          </p>
        </>
      )}
    </div>
  );
};

export default ResultCard;
