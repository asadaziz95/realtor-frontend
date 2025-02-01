import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";
import ProtectedRoute from './ProtectedRoute';
import Dashboard from './Dashboard';
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
 <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  </BrowserRouter>
  </StrictMode>,
)
