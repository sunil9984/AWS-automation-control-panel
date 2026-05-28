AWS Automation Control Panel — Frontend

Frontend dashboard for managing automated Docker deployments and monitoring deployment status in real time.

Built using React + Vite with a modern responsive UI.

Features
🎨 Modern deployment dashboard UI 📦 Client onboarding form ⚡ Deployment status tracking 📜 Deployment logs viewer 🔄 Automatic polling updates 🌐 API integration with backend 📱 Responsive design

Tech Stack
React.js Vite CSS3 Fetch API

Folder Structure----
frontend/ │ ├── src/ │ ├── components/ │ │ ├── DeploymentList.jsx │ │ ├── OnboardingForm.jsx │ │ └── *.css │ │ │ ├── App.jsx │ ├── main.jsx │ └── App.css │ ├── package.json └── vite.config.js

⚙️ Installation You can also install this project on yout local machine git clone https://github.com/YOUR_USERNAME/aws-automation-control-panel.git

Navigate to Frontend
cd frontend

Install Dependencies
npm install

Start Development Server
npm run dev

#Backend API Configuration const API_BASE = 'https://your-backend-url.onrender.com/api';

🎯 Features Overview Client Deployment Form

Allows admin to:

Enter client name Configure custom domain Select Docker image

#Deployment Dashboard

Displays: Deployment status Docker progress Lambda invocation state Deployment logs
📦 Build for Production npm run build

🚀 Deploy Frontend

Recommended platforms:

Vercel Netlify 📸 UI Preview

