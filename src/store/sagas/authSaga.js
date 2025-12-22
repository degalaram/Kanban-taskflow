// Auth Saga - Handles side effects for authentication
// This file manages login, token refresh, and logout operations
// SIMPLIFIED VERSION - with clear step-by-step comments

import { put, takeLatest } from 'redux-saga/effects';
import {
  loginRequest,
  loginSuccess,
  loginFailure,
  refreshTokenRequest,
  refreshTokenSuccess,
  refreshTokenFailure,
  logout,
} from '../slices/authSlice';

// STEP 1: API delay time (in milliseconds)
const API_DELAY = 1500;

// STEP 2: Token expiration times
const ACCESS_TOKEN_EXPIRY = 30 * 1000; // 30 seconds
const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days

// STEP 3: Create a random token string
function generateToken() {
  return 'token_' + Date.now() + Math.random();
}

// STEP 4: Create session object with tokens
function createSession() {
  const now = Date.now();
  return {
    accessToken: generateToken(),
    refreshToken: generateToken(),
    accessTokenExpiry: now + ACCESS_TOKEN_EXPIRY,
    refreshTokenExpiry: now + REFRESH_TOKEN_EXPIRY,
    createdAt: now,
  };
}

// STEP 5: Simulate login API call
function simulateLoginApi(username, password) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simple check - password must be at least 4 characters
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
}

// STEP 6: Simulate token refresh API call
function simulateRefreshApi(refreshToken) {
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
}

// ============================================
// HANDLER FUNCTIONS
// ============================================

// HANDLER 1: Login user
function* handleLogin(action) {
  try {
    // Get username and password from action
    const { username, password } = action.payload;
    
    // Simulate API call and wait for response
    // Use yield with Promise since this is a generator function
    const response = yield new Promise((resolve) => {
      simulateLoginApi(username, password).then(resolve);
    });
    
    // Save session to browser storage
    localStorage.setItem('taskflow_session', JSON.stringify(response.session));
    
    // Update Redux state - login successful
    yield put(loginSuccess(response));
    
  } catch (error) {
    // Update Redux state - login failed with error
    yield put(loginFailure(error.message));
  }
}

// HANDLER 2: Refresh authentication token
function* handleRefreshToken(action) {
  try {
    // Get saved session from storage
    const sessionStr = localStorage.getItem('taskflow_session');
    const session = sessionStr ? JSON.parse(sessionStr) : null;
    
    // Check if session exists
    if (!session || !session.refreshToken) {
      throw new Error('No refresh token available');
    }
    
    // Check if token is expired
    if (Date.now() > session.refreshTokenExpiry) {
      throw new Error('Refresh token expired');
    }
    
    // Call API to refresh token
    // Use yield with Promise since this is a generator function
    const newSession = yield new Promise((resolve) => {
      simulateRefreshApi(session.refreshToken).then(resolve);
    });
    
    // Save new session to storage
    localStorage.setItem('taskflow_session', JSON.stringify(newSession));
    
    // Update Redux state with new token
    yield put(refreshTokenSuccess(newSession));
    
  } catch (error) {
    // Clear session if refresh fails
    localStorage.removeItem('taskflow_session');
    
    // Update Redux state - token refresh failed
    yield put(refreshTokenFailure());
  }
}

// HANDLER 3: Logout user
function* handleLogout() {
  // Clear session from browser storage
  localStorage.removeItem('taskflow_session');
}

// ============================================
// ROOT SAGA - Watch for actions
// ============================================

export default function* authSaga() {
  // Watch for login action and call handleLogin
  yield takeLatest(loginRequest.type, handleLogin);
  
  // Watch for token refresh action and call handleRefreshToken
  yield takeLatest(refreshTokenRequest.type, handleRefreshToken);
  
  // Watch for logout action and call handleLogout
  yield takeLatest(logout.type, handleLogout);
}
