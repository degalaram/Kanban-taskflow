// Dashboard Page Component
// Main authenticated page containing the layout and Kanban board

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { refreshTokenRequest } from '../store/slices/authSlice';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import KanbanBoard from '../components/KanbanBoard';

const DashboardPage = () => {
  // Get auth state from Redux store
  const { isAuthenticated, session, isRefreshing } = useSelector((state) => state.auth);

  // Get dispatch and navigate functions
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Check authentication and redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Check token expiration and refresh if needed
  useEffect(() => {
    if (!session) return;

    // Function to check if token needs refresh
    const checkTokenExpiration = () => {
      const now = Date.now();
      const expiresIn = session.accessTokenExpiry - now;

      // If token is expired or about to expire (within 5 seconds), refresh it
      if (expiresIn <= 5000 && !isRefreshing) {
        dispatch(refreshTokenRequest());
      }
    };

    // Check immediately
    checkTokenExpiration();

    // Set up interval to check every 5 seconds
    const intervalId = setInterval(checkTokenExpiration, 5000);

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, [session, isRefreshing, dispatch]);

  // Don't render Kanban if not authenticated (show a clear screen instead of blank)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Redirecting to login…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-kanban-bg flex flex-col">
      {/* Header */}
      <Header />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <KanbanBoard />
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
