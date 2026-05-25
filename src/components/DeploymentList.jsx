import React, { useState, useEffect, useRef } from 'react';
import './DeploymentList.css';

function TerminalLogs({ logs }) {
  const terminalEndRef = useRef(null);

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  return (
    <div className="terminal-box">
      {logs && logs.length > 0 ? (
        logs.map((log, index) => (
          <div key={index} className="terminal-line">
            {log}
          </div>
        ))
      ) : (
        <div className="terminal-line" style={{color: 'var(--text-muted)'}}>
          [System] Awaiting logs stream...
        </div>
      )}
      <div ref={terminalEndRef} />
    </div>
  );
}


function DeploymentCard({ deployment }) {
  const [showLogs, setShowLogs] = useState(
    deployment.status === 'Docker_Deploying' || 
    deployment.status === 'Lambda_Invoking' ||
    deployment.status === 'Pending'
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return <span className="status-badge pending"><span className="spinner"></span>Pending</span>;
      case 'Docker_Deploying':
        return <span className="status-badge docker_deploying"><span className="spinner"></span>Docker Setup</span>;
      case 'Lambda_Invoking':
        return <span className="status-badge lambda_invoking"><span className="spinner"></span>DNS Setup</span>;
      case 'Completed':
        return <span className="status-badge completed">✓ Completed</span>;
      case 'Failed':
        return <span className="status-badge failed">✗ Failed</span>;
      default:
        return <span className="status-badge">{status}</span>;
    }
  };

  const getDecorationClass = (status) => {
    switch (status) {
      case 'Pending': return 'pending-badge-decoration';
      case 'Docker_Deploying':
      case 'Lambda_Invoking': return 'running-badge-decoration';
      case 'Completed': return 'success-badge-decoration';
      case 'Failed': return 'failed-badge-decoration';
      default: return '';
    }
  };

  return (
    <div className="deployment-card">
      <div className={getDecorationClass(deployment.status)}></div>
      
      <div className="card-header">
        <div className="card-info">
          <div className="client-name">{deployment.clientName}</div>
          <div className="client-domain">{deployment.domain}</div>
          <div className="client-image">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{verticalAlign: 'middle', marginRight: '3px'}}>
              <rect x="2" y="2" width="20" height="8" rx="2" ry="2"/>
              <rect x="2" y="14" width="20" height="8" rx="2" ry="2"/>
              <line x1="6" y1="6" x2="6.01" y2="6"/>
              <line x1="6" y1="18" x2="6.01" y2="18"/>
            </svg>
            <span>{deployment.image}</span>
          </div>
        </div>
        <div>
          {getStatusBadge(deployment.status)}
        </div>
      </div>

      <div className="logs-section">
        <div className="logs-header" onClick={() => setShowLogs(!showLogs)}>
          <span className="logs-title">
            <svg 
              width="12" 
              height="12" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5"
              style={{
                transform: showLogs ? 'rotate(90deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease',
                marginRight: '4px'
              }}
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
            Deployment Logs
          </span>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            {showLogs ? 'Hide' : 'Show'}
          </span>
        </div>
        
        {showLogs && (
          <div style={{ marginTop: '0.5rem' }}>
            <TerminalLogs logs={deployment.logs} />
          </div>
        )}
      </div>
    </div>
  );
}

export default function DeploymentList({ deployments }) {
  return (
    <div className="glass-card">
      <div className="card-title">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{color: 'var(--color-accent)'}}>
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <line x1="9" y1="3" x2="9" y2="21"/>
          <line x1="15" y1="3" x2="15" y2="21"/>
          <line x1="3" y1="9" x2="21" y2="9"/>
          <line x1="3" y1="15" x2="21" y2="15"/>
        </svg>
        <span>Active Deployments</span>
      </div>

      <div className="deployments-container">
        {deployments.length === 0 ? (
          <div className="empty-state">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <div>No Client Deployments Found</div>
            <p style={{fontSize: '0.8rem', marginTop: '0.25rem'}}>Use the form to onboard a client and deploy their container.</p>
          </div>
        ) : (
          deployments.map((dep) => (
            <DeploymentCard key={dep.id || dep._id} deployment={dep} />
          ))
        )}
      </div>
    </div>
  );
}
