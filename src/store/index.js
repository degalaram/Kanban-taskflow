// Redux Store Configuration
// This file sets up the Redux store with Redux Toolkit and Redux Saga

import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import authReducer from './slices/authSlice';
import kanbanReducer from './slices/kanbanSlice';
import rootSaga from './sagas/rootSaga';

// Create the saga middleware
// Saga middleware intercepts actions and can perform side effects
const sagaMiddleware = createSagaMiddleware();

// Configure the store using Redux Toolkit's configureStore
// This automatically sets up the Redux DevTools and adds useful middleware
const store = configureStore({
  // Combine all reducers
  reducer: {
    auth: authReducer,
    kanban: kanbanReducer,
  },
  // Add saga middleware to the default middleware
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Disable serializable check for saga actions
      serializableCheck: false,
    }).concat(sagaMiddleware),
});

// Run the root saga
sagaMiddleware.run(rootSaga);

// Export the store
export default store;
