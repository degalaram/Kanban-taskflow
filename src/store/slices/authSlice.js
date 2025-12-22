// Auth Slice - Manages user login and authentication state
// This file handles all authentication-related state changes

import { createSlice } from '@reduxjs/toolkit';

// STEP 1: Helper function to get saved session from storage
function getStoredSession() {
  try {
    const session = localStorage.getItem('taskflow_session');
    if (session) {
      return JSON.parse(session); // Convert string to object
    }
  } catch (error) {
    console.error('Error reading session:', error);
  }
  return null;
}

// STEP 2: Helper function to get saved user from storage
function getStoredUser() {
  try {
    const user = localStorage.getItem('taskflow_user');
    if (user) {
      return JSON.parse(user); // Convert string to object
    }
  } catch (error) {
    console.error('Error reading user:', error);
  }
  return null;
}

// STEP 3: Initial state - starting data structure
const initialState = {
  user: getStoredUser(), // Logged in user info
  session: getStoredSession(), // Login tokens
  isLoading: false, // Show loading spinner during login
  isRefreshing: false, // Refreshing token state
  error: null, // Error message if login fails
  isAuthenticated: !!getStoredSession(), // Is user logged in?
};

// STEP 4: Create auth reducer - handles all login state changes
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // ========== LOGIN ACTIONS ==========
    
    // Show loading when starting login
    loginRequest: (state, action) => {
      state.isLoading = true;
      state.error = null;
    },
    
    // Login successful - save user info
    loginSuccess: (state, action) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.session = action.payload.session;
      state.isAuthenticated = true;
      state.error = null;
      // Save to browser storage
      localStorage.setItem('taskflow_user', JSON.stringify(action.payload.user));
    },
    
    // Login failed - show error
    loginFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },
    
    // ========== TOKEN REFRESH ACTIONS ==========
    
    // Start refreshing token
    refreshTokenRequest: (state) => {
      state.isRefreshing = true;
    },
    
    // Token refresh successful
    refreshTokenSuccess: (state, action) => {
      state.isRefreshing = false;
      state.session = action.payload;
    },
    
    // Token refresh failed - logout user
    refreshTokenFailure: (state) => {
      state.isRefreshing = false;
      state.user = null;
      state.session = null;
      state.isAuthenticated = false;
      localStorage.removeItem('taskflow_user');
    },
    
    // ========== PROFILE ACTIONS ==========
    
    // Update user profile information
    updateProfile: (state, action) => {
      const { username, email } = action.payload;
      state.user = {
        ...state.user,
        username,
        email,
      };
      // Save updated user to storage
      localStorage.setItem('taskflow_user', JSON.stringify(state.user));
    },
    
    // ========== LOGOUT ACTION ==========
    
    // Logout - clear all data
    logout: (state) => {
      state.user = null;
      state.session = null;
      state.isAuthenticated = false;
      state.error = null;
      // Clear from browser storage
      localStorage.removeItem('taskflow_user');
      localStorage.removeItem('taskflow_session');
    },
    
    // ========== ERROR HANDLING ==========
    
    // Clear any error messages
    clearError: (state) => {
      state.error = null;
    },
  },
});

// STEP 5: Export action functions
export const {
  loginRequest,
  loginSuccess,
  loginFailure,
  refreshTokenRequest,
  refreshTokenSuccess,
  refreshTokenFailure,
  updateProfile,
  logout,
  clearError,
} = authSlice.actions;

// STEP 6: Export reducer - connects to Redux store
export default authSlice.reducer;
