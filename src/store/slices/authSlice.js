// Auth slice (simplified)
import { createSlice } from '@reduxjs/toolkit';

function loadUser() {
  try { return JSON.parse(localStorage.getItem('taskflow_user')); } catch { return null; }
}

function loadSession() {
  try { return JSON.parse(localStorage.getItem('taskflow_session')); } catch { return null; }
}

const initialState = {
  user: loadUser(),
  session: loadSession(),
  isLoading: false,
  isRefreshing: false,
  error: null,
  isAuthenticated: !!loadSession(),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginRequest(state) { state.isLoading = true; state.error = null; },
    loginSuccess(state, action) {
      state.isLoading = false;
      state.user = action.payload.user;
      state.session = action.payload.session;
      state.isAuthenticated = true;
      localStorage.setItem('taskflow_user', JSON.stringify(state.user));
      localStorage.setItem('taskflow_session', JSON.stringify(state.session));
    },
    loginFailure(state, action) { state.isLoading = false; state.error = action.payload; state.isAuthenticated = false; },

    refreshTokenRequest(state) { state.isRefreshing = true; },
    refreshTokenSuccess(state, action) { state.isRefreshing = false; state.session = action.payload; localStorage.setItem('taskflow_session', JSON.stringify(state.session)); },
    refreshTokenFailure(state) { state.isRefreshing = false; state.user = null; state.session = null; state.isAuthenticated = false; localStorage.removeItem('taskflow_user'); localStorage.removeItem('taskflow_session'); },

    updateProfile(state, action) { state.user = { ...state.user, ...action.payload }; localStorage.setItem('taskflow_user', JSON.stringify(state.user)); },

    logout(state) { state.user = null; state.session = null; state.isAuthenticated = false; state.error = null; localStorage.removeItem('taskflow_user'); localStorage.removeItem('taskflow_session'); },

    clearError(state) { state.error = null; },
  }
});

export const { loginRequest, loginSuccess, loginFailure, refreshTokenRequest, refreshTokenSuccess, refreshTokenFailure, updateProfile, logout, clearError } = authSlice.actions;
export default authSlice.reducer;
