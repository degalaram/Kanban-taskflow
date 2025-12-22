// Kanban Saga - Handles side effects for Kanban board operations
// This file manages data loading, saving, and operations like add/update/delete
// SIMPLIFIED VERSION - with clear step-by-step comments

import { put, takeLatest } from 'redux-saga/effects';
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
  saveError,
} from '../slices/kanbanSlice';

// STEP 1: Set delay time to simulate server response (in milliseconds)
const API_DELAY = 800;

// STEP 2: Create unique ID using timestamp
function generateId() {
  return Date.now() + Math.random();
}

// STEP 3: Save data to browser storage
function saveToLocalStorage(sections, tasks) {
  try {
    // Convert object to string and save
    localStorage.setItem('taskflow_kanban', JSON.stringify({ sections, tasks }));
    return true;
  } catch (error) {
    console.error('Error saving to storage:', error);
    return false;
  }
}

// STEP 4: Load data from browser storage
function loadFromLocalStorage() {
  try {
    const data = localStorage.getItem('taskflow_kanban');
    if (data) {
      return JSON.parse(data); // Convert string back to object
    }
  } catch (error) {
    console.error('Error loading from storage:', error);
  }
  return null;
}

// ============================================
// HANDLER FUNCTIONS - Handle each action
// ============================================

// HANDLER 1: Load kanban data when app starts
function* handleLoadKanban() {
  try {
    // Wait for API_DELAY milliseconds to simulate network
    yield new Promise(resolve => setTimeout(resolve, API_DELAY));
    
    // Try to load from storage
    const data = loadFromLocalStorage();
    
    if (data) {
      // Found saved data - load it
      yield put(loadKanbanSuccess(data));
    } else {
      // No saved data - use defaults
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
      
      // Save defaults to storage
      saveToLocalStorage(defaultData.sections, defaultData.tasks);
      
      // Load defaults into state
      yield put(loadKanbanSuccess(defaultData));
    }
  } catch (error) {
    // If error occurs, show error message
    yield put(loadKanbanFailure(error.message));
  }
}

// HANDLER 2: Add new section
function* handleAddSection(action) {
  try {
    // Wait for delay
    yield new Promise(resolve => setTimeout(resolve, API_DELAY));
    
    // Get data from action
    const { title } = action.payload;
    
    // Create new section object
    const newSection = {
      id: 'section-' + generateId(),
      title: title,
      order: Date.now(),
    };
    
    // Add to Redux state
    yield put(addSectionSuccess(newSection));
    
  } catch (error) {
    yield put(saveError(error.message));
  }
}

// HANDLER 3: Update section title
function* handleUpdateSection(action) {
  try {
    yield new Promise(resolve => setTimeout(resolve, API_DELAY));
    
    // Update section in state
    yield put(updateSectionSuccess(action.payload));
    
  } catch (error) {
    yield put(saveError(error.message));
  }
}

// HANDLER 4: Delete section
function* handleDeleteSection(action) {
  try {
    yield new Promise(resolve => setTimeout(resolve, API_DELAY));
    
    // Remove section from state
    yield put(deleteSectionSuccess(action.payload));
    
  } catch (error) {
    yield put(saveError(error.message));
  }
}

// HANDLER 5: Reorder sections (when dragging)
function* handleReorderSections(action) {
  try {
    // Faster delay for drag-drop
    yield new Promise(resolve => setTimeout(resolve, 300));
    
    // Update section order in state
    yield put(reorderSectionsSuccess(action.payload));
    
  } catch (error) {
    yield put(saveError(error.message));
  }
}

// HANDLER 6: Add new task
function* handleAddTask(action) {
  try {
    yield new Promise(resolve => setTimeout(resolve, API_DELAY));
    
    // Get data from action
    const { sectionId, title, description } = action.payload;
    
    // Create new task object
    const newTask = {
      id: 'task-' + generateId(),
      title: title,
      description: description || '',
      status: sectionId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // Add to state
    yield put(addTaskSuccess({ sectionId, task: newTask }));
    
  } catch (error) {
    yield put(saveError(error.message));
  }
}

// HANDLER 7: Update task
function* handleUpdateTask(action) {
  try {
    yield new Promise(resolve => setTimeout(resolve, API_DELAY));
    
    // Create updates object with timestamp
    const updates = {
      ...action.payload.updates,
      updatedAt: new Date().toISOString(),
    };
    
    // Update task in state
    yield put(updateTaskSuccess({
      sectionId: action.payload.sectionId,
      taskId: action.payload.taskId,
      updates,
    }));
    
  } catch (error) {
    yield put(saveError(error.message));
  }
}

// HANDLER 8: Delete task
function* handleDeleteTask(action) {
  try {
    yield new Promise(resolve => setTimeout(resolve, API_DELAY));
    
    // Remove task from state
    yield put(deleteTaskSuccess(action.payload));
    
  } catch (error) {
    yield put(saveError(error.message));
  }
}

// HANDLER 9: Move task between sections
function* handleMoveTask(action) {
  try {
    // Faster delay for drag-drop
    yield new Promise(resolve => setTimeout(resolve, 300));
    
    // Move task in state
    yield put(moveTaskSuccess(action.payload));
    
  } catch (error) {
    yield put(saveError(error.message));
  }
}

// HANDLER 10: Reorder tasks in section
function* handleReorderTasks(action) {
  try {
    // Faster delay for drag-drop
    yield new Promise(resolve => setTimeout(resolve, 300));
    
    // Update task order in state
    yield put(reorderTasksSuccess(action.payload));
    
  } catch (error) {
    yield put(saveError(error.message));
  }
}

// ============================================
// ROOT SAGA - Watch for and handle actions
// ============================================

export default function* kanbanSaga() {
  // Watch for each action type and run the corresponding handler
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
