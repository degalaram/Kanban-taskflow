
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import ErrorBoundary from './components/ErrorBoundary';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AllTasksPage from './pages/AllTasksPage';
import CalendarPage from './pages/CalendarPage';
import FavoritesPage from './pages/FavoritesPage';
import SettingsPage from './pages/SettingsPage';
import NotFound from './pages/NotFound';
import Header from './components/Header';
import Sidebar from './components/Sidebar';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

const AuthenticatedLayout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  
  return (
    <div className="min-h-screen bg-kanban-bg flex flex-col">
      {/* Header at top */}
      <Header onMenuToggle={() => setIsMobileMenuOpen((v) => !v)} isMobileMenuOpen={isMobileMenuOpen} />
      
      {/* Sidebar and main content below */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar isMobileMenuOpen={isMobileMenuOpen} onMobileMenuClose={() => setIsMobileMenuOpen(false)} />
        <main className="flex-1 flex flex-col overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
      {/* Toaster components for notifications */}
      <Toaster />
      <Sonner />
      
      {/* Router setup */}
      <HashRouter>
        <Routes>
          {/* STEP 5: Public Routes */}
          
          {/* Login Page */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />

          {/* STEP 6: Protected Routes */}
          
          {/* Dashboard Page */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <DashboardPage />
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />
          
          {/* All Tasks Page */}
          <Route
            path="/tasks"
            element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <AllTasksPage />
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />
          
          {/* Calendar Page */}
          <Route
            path="/calendar"
            element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <CalendarPage />
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />
          
          {/* Favorites Page */}
          <Route
            path="/favorites"
            element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <FavoritesPage />
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />
          
          {/* Settings Page */}
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <SettingsPage />
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />

          {/* STEP 7: Default Route */}
          
          {/* Redirect root to dashboard or login */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* STEP 8: 404 Not Found Page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </HashRouter>
    </ErrorBoundary>
  );
};

export default App;
