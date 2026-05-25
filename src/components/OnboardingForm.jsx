import React, { useState } from 'react';
import './OnboardingForm.css';

export default function OnboardingForm({ onDeploy, isSubmitting }) {
  const [clientName, setClientName] = useState('');
  const [domain, setDomain] = useState('');
  const [image, setImage] = useState('nginx:latest');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!clientName.trim()) {
      setError('Client Name is required');
      return;
    }

    if (!domain.trim()) {
      setError('Domain is required');
      return;
    }

    if (!image.trim()) {
      setError('Docker Image tag is required');
      return;
    }

    // Improved domain validation
    const domainRegex =
      /^([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;

    if (
      !domainRegex.test(domain) &&
      !domain.includes('localhost') &&
      !domain.startsWith('test.')
    ) {
      setError(
        'Please enter a valid domain name (e.g. test.ourplatform.com)'
      );
      return;
    }

    onDeploy({
      clientName,
      domain,
      image
    });

    // Reset form
    setClientName('');
    setDomain('');
  };

  return (
    <div className="glass-card">
      <div className="card-title">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ color: 'var(--color-primary)' }}
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>

        <span>Onboard Client</span>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="clientName">
            Client Name
          </label>

          <input
            id="clientName"
            type="text"
            placeholder="e.g. Acme Corp"
            value={clientName}
            onChange={(e) =>
              setClientName(e.target.value)
            }
            disabled={isSubmitting}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="domain">
            Custom Domain
          </label>

          <input
            id="domain"
            type="text"
            placeholder="e.g. acme.ourplatform.com"
            value={domain}
            onChange={(e) =>
              setDomain(e.target.value)
            }
            disabled={isSubmitting}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">
            Docker Image
          </label>

          <input
            id="image"
            type="text"
            placeholder="e.g. nginx:latest"
            value={image}
            onChange={(e) =>
              setImage(e.target.value)
            }
            disabled={isSubmitting}
            required
          />
        </div>

        {error && (
          <div
            style={{
              color: 'var(--status-failed)',
              fontSize: '0.85rem',
              marginTop: '0.5rem',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
              />

              <line
                x1="12"
                y1="8"
                x2="12"
                y2="12"
              />

              <line
                x1="12"
                y1="16"
                x2="12.01"
                y2="16"
              />
            </svg>

            {error}
          </div>
        )}

        <button
          type="submit"
          className="btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="spinner"></span>
              <span>Queuing...</span>
            </>
          ) : (
            <>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line
                  x1="22"
                  y1="2"
                  x2="11"
                  y2="13"
                />

                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>

              <span>Deploy to EC2</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
