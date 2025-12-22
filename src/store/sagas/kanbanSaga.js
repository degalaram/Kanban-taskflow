// Kanban Saga - Handles side effects for Kanban board operations
// All API calls and localStorage operations are managed here

import { put, call, takeLatest, select, delay } from 'redux-saga/effects';
import {
  loadKanbanRequest,
  loadKanbanSuccess,
  loadKanbanFailure,
  addSectionRequest,
  addSectionSuccess,
  updateSectionRequest,
  updateSectionSuccess,
  deleteSectionRequest,
  deleteSectionSuccess,
  reorderSectionsRequest,
  reorderSectionsSuccess,
  addTaskRequest,
  addTaskSuccess,
  updateTaskRequest,
  updateTaskSuccess,
  deleteTaskRequest,
  deleteTaskSuccess,
  moveTaskRequest,
  moveTaskSuccess,
  reorderTasksRequest,
  reorderTasksSuccess,
  saveComplete,
  saveError,
} from '../slices/kanbanSlice';

// Simulated API delay time
const API_DELAY = 800;

// Helper function to generate unique ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Helper function to save data to localStorage
const saveToLocalStorage = (sections, tasks) => {
  try {
    localStorage.setItem('taskflow_kanban', JSON.stringify({ sections, tasks }));
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
};

// Helper function to load data from localStorage
const loadFromLocalStorage = () => {
  try {
    const data = localStorage.getItem('taskflow_kanban');
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading from localStorage:', error);
  }
  return null;
};

// Simulated API call wrapper
// This adds artificial delay to simulate network latency
const simulateApiCall = (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, API_DELAY);
  });
};

// === LOAD KANBAN DATA SAGA ===
function* handleLoadKanban() {
  try {
    // Simulate API delay
    yield delay(API_DELAY);
    
    // Load from localStorage
    const data = loadFromLocalStorage();
    
    if (data) {
      yield put(loadKanbanSuccess(data));
    } else {
      // Return default data if nothing in localStorage
      const defaultData = {
        sections: [
          { id: 'section-1', title: 'To Do', order: 0 },
          { id: 'section-2', title: 'In Progress', order: 1 },
          { id: 'section-3', title: 'Done', order: 2 },
        ],
        tasks: {
          'section-1': [],
          'section-2': [],
          'section-3': [],
        },
      };
      
      // Save default data to localStorage
      saveToLocalStorage(defaultData.sections, defaultData.tasks);
      
      yield put(loadKanbanSuccess(defaultData));
    }
  } catch (error) {
    yield put(loadKanbanFailure(error.message));
  }
}

// === ADD SECTION SAGA ===
function* handleAddSection(action) {
  try {
    yield delay(API_DELAY);
    
    const { title } = action.payload;
    
    // Get current state
    const state = yield select((state) => state.kanban);
    
    // Create new section
    const newSection = {
      id: 'section-' + generateId(),
      title: title,
      order: state.sections.length,
    };
    
    // Update state first (optimistic update would dispatch success immediately)
    yield put(addSectionSuccess(newSection));
    
    // Get updated state and save to localStorage
    const updatedState = yield select((state) => state.kanban);
    saveToLocalStorage(updatedState.sections, updatedState.tasks);
    
  } catch (error) {
    yield put(saveError(error.message));
  }
}

// === UPDATE SECTION SAGA ===
function* handleUpdateSection(action) {
  try {
    yield delay(API_DELAY);
    
    yield put(updateSectionSuccess(action.payload));
    
    // Save to localStorage
    const state = yield select((state) => state.kanban);
    saveToLocalStorage(state.sections, state.tasks);
    
  } catch (error) {
    yield put(saveError(error.message));
  }
}

// === DELETE SECTION SAGA ===
function* handleDeleteSection(action) {
  try {
    yield delay(API_DELAY);
    
    yield put(deleteSectionSuccess(action.payload));
    
    // Save to localStorage
    const state = yield select((state) => state.kanban);
    saveToLocalStorage(state.sections, state.tasks);
    
  } catch (error) {
    yield put(saveError(error.message));
  }
}

// === REORDER SECTIONS SAGA ===
function* handleReorderSections(action) {
  try {
    yield delay(300); // Shorter delay for reordering
    
    yield put(reorderSectionsSuccess(action.payload));
    
    // Save to localStorage
    const state = yield select((state) => state.kanban);
    saveToLocalStorage(state.sections, state.tasks);
    
  } catch (error) {
    yield put(saveError(error.message));
  }
}

// === ADD TASK SAGA ===
function* handleAddTask(action) {
  try {
    yield delay(API_DELAY);
    
    const { sectionId, title, description } = action.payload;
    
    // Create new task
    const newTask = {
      id: 'task-' + generateId(),
      title: title,
      description: description || '',
      status: sectionId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    yield put(addTaskSuccess({ sectionId, task: newTask }));
    
    // Save to localStorage
    const state = yield select((state) => state.kanban);
    saveToLocalStorage(state.sections, state.tasks);
    
  } catch (error) {
    yield put(saveError(error.message));
  }
}

// === UPDATE TASK SAGA ===
function* handleUpdateTask(action) {
  try {
    yield delay(API_DELAY);
    
    const updates = {
      ...action.payload.updates,
      updatedAt: new Date().toISOString(),
    };
    
    yield put(updateTaskSuccess({
      sectionId: action.payload.sectionId,
      taskId: action.payload.taskId,
      updates,
    }));
    
    // Save to localStorage
    const state = yield select((state) => state.kanban);
    saveToLocalStorage(state.sections, state.tasks);
    
  } catch (error) {
    yield put(saveError(error.message));
  }
}

// === DELETE TASK SAGA ===
function* handleDeleteTask(action) {
  try {
    yield delay(API_DELAY);
    
    yield put(deleteTaskSuccess(action.payload));
    
    // Save to localStorage
    const state = yield select((state) => state.kanban);
    saveToLocalStorage(state.sections, state.tasks);
    
  } catch (error) {
    yield put(saveError(error.message));
  }
}

// === MOVE TASK SAGA ===
function* handleMoveTask(action) {
  try {
    yield delay(300); // Shorter delay for drag operations
    
    yield put(moveTaskSuccess(action.payload));
    
    // Save to localStorage
    const state = yield select((state) => state.kanban);
    saveToLocalStorage(state.sections, state.tasks);
    
  } catch (error) {
    yield put(saveError(error.message));
  }
}

// === REORDER TASKS SAGA ===
function* handleReorderTasks(action) {
  try {
    yield delay(300); // Shorter delay for reordering
    
    yield put(reorderTasksSuccess(action.payload));
    
    // Save to localStorage
    const state = yield select((state) => state.kanban);
    saveToLocalStorage(state.sections, state.tasks);
    
  } catch (error) {
    yield put(saveError(error.message));
  }
}

// Root kanban saga - watches for actions
export default function* kanbanSaga() {
  yield takeLatest(loadKanbanRequest.type, handleLoadKanban);
  yield takeLatest(addSectionRequest.type, handleAddSection);
  yield takeLatest(updateSectionRequest.type, handleUpdateSection);
  yield takeLatest(deleteSectionRequest.type, handleDeleteSection);
  yield takeLatest(reorderSectionsRequest.type, handleReorderSections);
  yield takeLatest(addTaskRequest.type, handleAddTask);
  yield takeLatest(updateTaskRequest.type, handleUpdateTask);
  yield takeLatest(deleteTaskRequest.type, handleDeleteTask);
  yield takeLatest(moveTaskRequest.type, handleMoveTask);
  yield takeLatest(reorderTasksRequest.type, handleReorderTasks);
}
