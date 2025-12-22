// Auth Slice - Manages authentication state using Redux Toolkit
// This is a basic example of creating a slice with reducers

import { createSlice } from '@reduxjs/toolkit';

// Helper function to get session from localStorage
const getStoredSession = () => {
  try {
    const session = localStorage.getItem('taskflow_session');
    if (session) {
      return JSON.parse(session);
    }
  } catch (error) {
    console.error('Error reading session from localStorage:', error);
  }
  return null;
};

// Helper function to get user from localStorage
const getStoredUser = () => {
  try {
    const user = localStorage.getItem('taskflow_user');
    if (user) {
      return JSON.parse(user);
    }
  } catch (error) {
    console.error('Error reading user from localStorage:', error);
  }
  return null;
};

// Initial state for authentication
const initialState = {
  // User information
  user: getStoredUser(),
  // Session tokens
  session: getStoredSession(),
  // Loading states
  isLoading: false,
  isRefreshing: false,
  // Error message
  error: null,
  // Whether user is authenticated
  isAuthenticated: !!getStoredSession(),
};

// Create the auth slice using createSlice from Redux Toolkit
// createSlice automatically generates action creators and action types
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Action to start login process
    loginRequest: (state, action) => {
      state.isLoading = true;
      state.error = null;
    },
    // Action when login succeeds
    loginSuccess: (state, action) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.session = action.payload.session;
      state.isAuthenticated = true;
      state.error = null;
      // Save user to localStorage
      localStorage.setItem('taskflow_user', JSON.stringify(action.payload.user));
    },
    // Action when login fails
    loginFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },
    // Action to start token refresh
    refreshTokenRequest: (state) => {
      state.isRefreshing = true;
    },
    // Action when token refresh succeeds
    refreshTokenSuccess: (state, action) => {
      state.isRefreshing = false;
      state.session = action.payload;
    },
    // Action when token refresh fails
    refreshTokenFailure: (state) => {
      state.isRefreshing = false;
      state.user = null;
      state.session = null;
      state.isAuthenticated = false;
      localStorage.removeItem('taskflow_user');
    },
    // Action to update profile
    updateProfile: (state, action) => {
      const { username, email } = action.payload;
      state.user = {
        ...state.user,
        username,
        email,
      };
      // Save updated user to localStorage
      localStorage.setItem('taskflow_user', JSON.stringify(state.user));
    },
    // Action to logout user
    logout: (state) => {
      state.user = null;
      state.session = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('taskflow_user');
      localStorage.removeItem('taskflow_session');
    },
    // Action to clear any errors
    clearError: (state) => {
      state.error = null;
    },
  },
});

// Export actions - these are the functions we call to dispatch actions
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

// Export reducer - this is connected to the store
export default authSlice.reducer;
