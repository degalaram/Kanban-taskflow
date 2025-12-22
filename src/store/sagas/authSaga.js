// Auth Saga - Handles side effects for authentication
// Sagas are generator functions that can pause and resume execution

import { put, call, takeLatest, delay } from 'redux-saga/effects';
import {
  loginRequest,
  loginSuccess,
  loginFailure,
  refreshTokenRequest,
  refreshTokenSuccess,
  refreshTokenFailure,
  logout,
} from '../slices/authSlice';

// Simulated API delay time (in milliseconds)
const API_DELAY = 1500;

// Token expiration time (30 seconds for demo, normally would be longer)
const ACCESS_TOKEN_EXPIRY = 30 * 1000; // 30 seconds
const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days

// Helper function to generate a random token
const generateToken = () => {
  return 'token_' + Math.random().toString(36).substr(2) + Date.now().toString(36);
};

// Helper function to create a session object
const createSession = () => {
  const now = Date.now();
  return {
    accessToken: generateToken(),
    refreshToken: generateToken(),
    accessTokenExpiry: now + ACCESS_TOKEN_EXPIRY,
    refreshTokenExpiry: now + REFRESH_TOKEN_EXPIRY,
    createdAt: now,
  };
};

// Simulated login API call
// This function mimics what would happen with a real backend
const simulateLoginApi = (username, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simple validation - in real app this would be server-side
      if (username && password && password.length >= 4) {
        resolve({
          user: {
            id: 'user_' + Date.now(),
            username: username,
            email: username + '@taskflow.com',
          },
          session: createSession(),
        });
      } else {
        reject(new Error('Invalid username or password. Password must be at least 4 characters.'));
      }
    }, API_DELAY);
  });
};

// Simulated token refresh API call
const simulateRefreshApi = (refreshToken) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Check if refresh token exists
      if (refreshToken) {
        resolve(createSession());
      } else {
        reject(new Error('Invalid refresh token'));
      }
    }, API_DELAY);
  });
};

// Login saga - generator function
// The * makes this a generator function
// yield is used to pause execution until the async operation completes
function* handleLogin(action) {
  try {
    // Extract username and password from action payload
    const { username, password } = action.payload;
    
    // Call the simulated API - 'call' is a saga effect that calls a function
    const response = yield call(simulateLoginApi, username, password);
    
    // Save session to localStorage
    localStorage.setItem('taskflow_session', JSON.stringify(response.session));
    
    // Dispatch success action - 'put' is a saga effect that dispatches an action
    yield put(loginSuccess(response));
    
  } catch (error) {
    // Dispatch failure action with error message
    yield put(loginFailure(error.message));
  }
}

// Refresh token saga
function* handleRefreshToken(action) {
  try {
    // Get current session from localStorage
    const sessionStr = localStorage.getItem('taskflow_session');
    const session = sessionStr ? JSON.parse(sessionStr) : null;
    
    if (!session || !session.refreshToken) {
      throw new Error('No refresh token available');
    }
    
    // Check if refresh token is expired
    if (Date.now() > session.refreshTokenExpiry) {
      throw new Error('Refresh token expired');
    }
    
    // Call refresh API
    const newSession = yield call(simulateRefreshApi, session.refreshToken);
    
    // Save new session to localStorage
    localStorage.setItem('taskflow_session', JSON.stringify(newSession));
    
    // Dispatch success action
    yield put(refreshTokenSuccess(newSession));
    
  } catch (error) {
    // Clear session from localStorage
    localStorage.removeItem('taskflow_session');
    
    // Dispatch failure action
    yield put(refreshTokenFailure());
  }
}

// Logout saga
function* handleLogout() {
  // Clear session from localStorage
  localStorage.removeItem('taskflow_session');
}

// Root auth saga
// This watches for specific actions and runs the corresponding saga
// takeLatest means if multiple actions are dispatched, only the latest one is processed
export default function* authSaga() {
  yield takeLatest(loginRequest.type, handleLogin);
  yield takeLatest(refreshTokenRequest.type, handleRefreshToken);
  yield takeLatest(logout.type, handleLogout);
}
