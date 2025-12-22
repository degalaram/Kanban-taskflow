/* Simplified auth sagas */
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

const API_DELAY = 800;

function generateToken() { return 'token_' + Date.now() + Math.random(); }
function createSession() {
  const now = Date.now();
  return { accessToken: generateToken(), refreshToken: generateToken(), accessTokenExpiry: now + 30 * 1000, refreshTokenExpiry: now + 7 * 24 * 60 * 60 * 1000, createdAt: now };
}

function simulateLoginApi(username, password) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (username && password && password.length >= 4) resolve({ user: { id: 'user_' + Date.now(), username, email: username + '@taskflow.com' }, session: createSession() });
      else reject(new Error('Invalid username or password.'));
    }, API_DELAY);
  });
}

function simulateRefreshApi(refreshToken) { return new Promise((resolve, reject) => setTimeout(() => (refreshToken ? resolve(createSession()) : reject(new Error('Invalid refresh token'))), API_DELAY)); }

function* handleLogin(action) {
  try {
    const { username, password } = action.payload;
    const response = yield new Promise((res) => simulateLoginApi(username, password).then(res));
    localStorage.setItem('taskflow_session', JSON.stringify(response.session));
    yield put(loginSuccess(response));
  } catch (err) { yield put(loginFailure(err.message)); }
}

function* handleRefreshToken() {
  try {
    const sessionStr = localStorage.getItem('taskflow_session');
    const session = sessionStr ? JSON.parse(sessionStr) : null;
    if (!session || !session.refreshToken || Date.now() > session.refreshTokenExpiry) throw new Error('No valid refresh token');
    const newSession = yield new Promise((res) => simulateRefreshApi(session.refreshToken).then(res));
    localStorage.setItem('taskflow_session', JSON.stringify(newSession));
    yield put(refreshTokenSuccess(newSession));
  } catch (err) { localStorage.removeItem('taskflow_session'); yield put(refreshTokenFailure()); }
}

function* handleLogout() { localStorage.removeItem('taskflow_session'); }

export default function* authSaga() { yield takeLatest(loginRequest.type, handleLogin); yield takeLatest(refreshTokenRequest.type, handleRefreshToken); yield takeLatest(logout.type, handleLogout); }
