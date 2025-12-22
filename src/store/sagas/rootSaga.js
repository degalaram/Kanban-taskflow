// Root Saga - Combines all sagas into one
// This is the entry point for all saga middleware

import { all, fork } from 'redux-saga/effects';
import authSaga from './authSaga';
import kanbanSaga from './kanbanSaga';

// Root saga that runs all other sagas
// 'all' runs multiple sagas in parallel
// 'fork' creates a new saga task that runs in the background
export default function* rootSaga() {
  yield all([
    fork(authSaga),
    fork(kanbanSaga),
  ]);
}
