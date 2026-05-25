import React, { useState, useEffect } from 'react';
import OnboardingForm from './components/OnboardingForm';
import DeploymentList from './components/DeploymentList';
import './App.css';

// BACKEND API URL
const API_BASE =
  'https://aws-automation-control-panel-backend.onrender.com/api';

export default function App() {
  const [deployments, setDeployments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiOnline, setApiOnline] = useState(false);
  const [isMockMode, setIsMockMode] = useState(true);
  const [deployMethod, setDeployMethod] = useState('SSM');

  // 1. Initial Load & Health Check
  useEffect(() => {
    async function checkHealthAndLoad() {
      try {
        const healthRes = await fetch(
          `${API_BASE}/health`
        );

        if (healthRes.ok) {
          const data = await healthRes.json();

          setApiOnline(true);
          setIsMockMode(data.mockServices);
          setDeployMethod(data.deployMethod);
        } else {
          setApiOnline(false);
        }
      } catch (err) {
        console.error(
          'API health check failed:',
          err
        );

        setApiOnline(false);
      }

      try {
        const listRes = await fetch(
          `${API_BASE}/deployments`
        );

        if (listRes.ok) {
          const data = await listRes.json();

          setDeployments(data);
        }
      } catch (err) {
        console.error(
          'Failed to load deployments:',
          err
        );
      }
    }

    checkHealthAndLoad();

    // Health Check Every 10 Seconds
    const healthInterval = setInterval(
      async () => {
        try {
          const res = await fetch(
            `${API_BASE}/health`
          );

          setApiOnline(res.ok);

          if (res.ok) {
            const data = await res.json();

            setIsMockMode(data.mockServices);
            setDeployMethod(data.deployMethod);
          }
        } catch {
          setApiOnline(false);
        }
      },
      10000
    );

    return () =>
      clearInterval(healthInterval);
  }, []);

  // 2. Deployment Polling Loop
  useEffect(() => {
    const activeDeployments =
      deployments.filter(
        (dep) =>
          dep.status === 'Pending' ||
          dep.status ===
            'Docker_Deploying' ||
          dep.status ===
            'Lambda_Invoking'
      );

    if (activeDeployments.length === 0)
      return;

    const interval = setInterval(
      async () => {
        const promises =
          activeDeployments.map(
            async (dep) => {
              try {
                const id =
                  dep.id || dep._id;

                const res = await fetch(
                  `${API_BASE}/status/${id}`
                );

                if (res.ok) {
                  return await res.json();
                }
              } catch (err) {
                console.error(
                  'Error polling status:',
                  err
                );
              }

              return null;
            }
          );

        const results =
          await Promise.all(promises);

        setDeployments((prevList) => {
          return prevList.map((item) => {
            const itemId =
              item.id || item._id;

            const updatedItem =
              results.find(
                (r) =>
                  r &&
                  (r.id === itemId ||
                    r._id === itemId)
              );

            return updatedItem
              ? updatedItem
              : item;
          });
        });
      },
      1500
    );

    return () => clearInterval(interval);
  }, [deployments]);

  // 3. Handle Deployment Submit
  const handleDeploy = async (
    clientData
  ) => {
    setIsSubmitting(true);

    try {
      const res = await fetch(
        `${API_BASE}/deploy`,
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json'
          },
          body: JSON.stringify(clientData)
        }
      );

      if (!res.ok) {
        const errorData =
          await res.json();

        alert(
          `Error initiating deployment: ${errorData.error}`
        );

        return;
      }

      const result = await res.json();

      // Reload Deployments
      const listRes = await fetch(
        `${API_BASE}/deployments`
      );

      if (listRes.ok) {
        const data =
          await listRes.json();

        setDeployments(data);
      } else {
        // Fallback Local Entry
        const localRecord = {
          _id: result.id,
          ...clientData,
          status: 'Pending',
          logs: [
            '[System] Submitted via UI. Enqueuing job...'
          ],
          createdAt:
            new Date().toISOString()
        };

        setDeployments((prev) => [
          localRecord,
          ...prev
        ]);
      }
    } catch (err) {
      console.error(
        'Deployment request failed:',
        err
      );

      alert(
        'Network error connecting to Backend Control Panel.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <div className="logo-section">
          <div className="logo-badge">
            Ω
          </div>

          <div>
            <h1>Control Panel</h1>

            <p
              style={{
                fontSize: '0.85rem',
                color:
                  'var(--text-muted)'
              }}
            >
              Hosting Deployment
              Automation
            </p>
          </div>
        </div>

        <div className="system-status">
          <div
            className={`status-dot ${
              apiOnline ? 'pulsing' : ''
            }`}
            style={{
              backgroundColor:
                apiOnline
                  ? 'var(--status-success)'
                  : 'var(--status-failed)',

              boxShadow: apiOnline
                ? '0 0 8px var(--status-success)'
                : '0 0 8px var(--status-failed)'
            }}
          ></div>

          <span>
            API:{' '}
            {apiOnline
              ? 'ONLINE'
              : 'OFFLINE'}
          </span>

          {apiOnline && (
            <span
              style={{
                color:
                  'var(--text-muted)',
                marginLeft: '0.5rem',
                fontSize: '0.75rem'
              }}
            >
              (
              {isMockMode
                ? 'Mocks Active'
                : `Real Cloud Deployment: ${deployMethod}`}
              )
            </span>
          )}
        </div>
      </header>

      <main className="dashboard-grid">
        <section>
          <OnboardingForm
            onDeploy={handleDeploy}
            isSubmitting={isSubmitting}
          />

          <div
            className="glass-card"
            style={{
              marginTop: '2rem',
              padding: '1.5rem'
            }}
          >
            <h3
              style={{
                fontSize: '0.9rem',
                fontWeight: 600,
                color:
                  'var(--text-secondary)',
                textTransform:
                  'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '0.5rem'
              }}
            >
              Documentation
            </h3>

            <p
              style={{
                fontSize: '0.8rem',
                color:
                  'var(--text-muted)',
                lineHeight: '1.4'
              }}
            >
              This panel automates
              Docker deployment on
              EC2 servers. It saves
              the deployment record
              as <strong>Pending</strong>
              , enqueues the task in
              a <strong>BullMQ</strong>{' '}
              worker, connects to
              EC2 via{' '}
              <strong>
                {deployMethod}
              </strong>{' '}
              to start the container,
              and triggers an{' '}
              <strong>
                AWS Lambda
              </strong>{' '}
              post-deployment setup.
            </p>
          </div>
        </section>

        <section>
          <DeploymentList
            deployments={deployments}
          />
        </section>
      </main>
    </div>
  );
}
