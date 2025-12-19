import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { client } from './lib/appwrite'

// Verify Appwrite connection on app initialization
client.ping().then(
  () => console.log('✅ Appwrite connection verified'),
  (error) => console.error('❌ Appwrite connection failed:', error)
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
