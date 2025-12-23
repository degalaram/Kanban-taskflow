
import { all, fork } from 'redux-saga/effects';
import authSaga from './authSaga';
import kanbanSaga from './kanbanSaga';

export default function* rootSaga() {
  yield all([
    fork(authSaga),
    fork(kanbanSaga),
  ]);
}
