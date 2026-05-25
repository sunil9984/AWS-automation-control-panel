import React, { useEffect, useState } from 'react';
import DeploymentList from './components/DeploymentList';

const API_URL =
  'https://aws-automation-control-panel-backend.onrender.com';

export default function App() {
  const [deployments, setDeployments] = useState([]);

  const [formData, setFormData] = useState({
    clientName: '',
    domain: '',
    image: ''
  });

  // Fetch Deployments
  const fetchDeployments = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/deployments`
      );

      const data = await response.json();

      setDeployments(data);
    } catch (err) {
      console.error('Failed to fetch deployments:', err);
    }
  };

  // Load Deployments Initially
  useEffect(() => {
    fetchDeployments();

    const interval = setInterval(() => {
      fetchDeployments();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Submit Deployment
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${API_URL}/api/deploy`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        }
      );

      const data = await response.json();

      if (data.success) {
        alert('Deployment queued successfully');

        setFormData({
          clientName: '',
          domain: '',
          image: ''
        });

        fetchDeployments();
      } else {
        alert(data.error || 'Deployment failed');
      }
    } catch (err) {
      console.error(err);

      alert(
        'Error initiating deployment'
      );
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>AWS Automation Control Panel</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="clientName"
          placeholder="Client Name"
          value={formData.clientName}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="domain"
          placeholder="Domain"
          value={formData.domain}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="image"
          placeholder="Docker Image"
          value={formData.image}
          onChange={handleChange}
          required
        />

        <button type="submit">
          Deploy
        </button>
      </form>

      <DeploymentList deployments={deployments} />
    </div>
  );
}
