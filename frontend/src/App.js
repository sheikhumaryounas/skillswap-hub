import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import PageBackground from './components/common/PageBackground';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Users from './pages/FindUsers';
import Requests from './pages/Requests';
import Sessions from './pages/Sessions';
import Leaderboard from './pages/Leaderboard';
import Notifications from './pages/Notifications';
// Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const DynamicBackground = () => {
  const location = useLocation();
  const path = location.pathname;

  let bgImage = '';
  if (path === '/') return null; // Home page handles its own background
  else if (path === '/dashboard') bgImage = 'dashboard-bg.png';
  else if (path === '/users') bgImage = 'explore-bg.png';
  else if (path === '/requests') bgImage = 'requests-bg.png';
  else if (path === '/sessions') bgImage = 'sessions-bg.png';
  else if (path === '/notifications') bgImage = 'notifications-bg.png';
  else if (path === '/profile') bgImage = 'profile-bg.png';
  else if (path === '/leaderboard') bgImage = 'leaderboard-bg.png';
  
  if (!bgImage) return null;

  return <PageBackground imageName={bgImage} />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <DynamicBackground />
          <Navbar />
          <div className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />

              {/* Placeholder Routes (baad mein banaenge) */}
              <Route 
                path="/users" 
                element={
                  <ProtectedRoute>
                    <Users />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/requests" 
                element={
                  <ProtectedRoute>
                    <Requests />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/sessions" 
                element={
                  <ProtectedRoute>
                    <Sessions />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/leaderboard" 
                element={
                  <ProtectedRoute>
                    <Leaderboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/notifications" 
                element={
                  <ProtectedRoute>
                    <Notifications />
                  </ProtectedRoute>
                } 
              />

              {/* Catch all */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;