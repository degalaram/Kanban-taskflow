
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { refreshTokenRequest } from '../store/slices/authSlice';
import KanbanBoard from '../components/KanbanBoard';

const DashboardPage = () => {
  const { isAuthenticated, session, isRefreshing } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (!session) return;

    const checkTokenExpiration = () => {
      const now = Date.now();
      const expiresIn = session.accessTokenExpiry - now;

      if (expiresIn <= 5000 && !isRefreshing) {
        dispatch(refreshTokenRequest());
      }
    };

    checkTokenExpiration();

    const intervalId = setInterval(checkTokenExpiration, 5000);

    return () => clearInterval(intervalId);
  }, [session, isRefreshing, dispatch]);

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Redirecting to login…</p>
      </div>
    );
  }

  return <KanbanBoard />;
};

export default DashboardPage;
