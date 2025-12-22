// Kanban slice (simplified)
import { createSlice } from '@reduxjs/toolkit';

function generateId() {
  return Date.now().toString() + Math.floor(Math.random() * 1000).toString();
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem('taskflow_kanban');
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

const defaultSections = [
  { id: 'section-1', title: 'To Do', order: 0 },
  { id: 'section-2', title: 'In Progress', order: 1 },
  { id: 'section-3', title: 'Done', order: 2 },
];

const stored = loadFromStorage();

const initialState = {
  sections: stored?.sections || defaultSections,
  tasks: stored?.tasks || {
    'section-1': [],
    'section-2': [],
    'section-3': [],
  },
  isLoading: false,
  isSaving: false,
  error: null,
  searchQuery: '',
};

const kanbanSlice = createSlice({
  name: 'kanban',
  initialState,
  reducers: {
    loadKanbanRequest(state) {
      state.isLoading = true;
      state.error = null;
    },
    loadKanbanSuccess(state, action) {
      state.isLoading = false;
      state.sections = action.payload.sections;
      state.tasks = action.payload.tasks;
    },
    loadKanbanFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    addSectionRequest(state) { state.isSaving = true; },
    addSectionSuccess(state, action) {
      state.isSaving = false;
      const s = action.payload;
      state.sections.push(s);
      state.tasks[s.id] = [];
    },

    updateSectionRequest(state) { state.isSaving = true; },
    updateSectionSuccess(state, action) {
      state.isSaving = false;
      const { id, title } = action.payload;
      const sec = state.sections.find(s => s.id === id);
      if (sec) sec.title = title;
    },

    deleteSectionRequest(state) { state.isSaving = true; },
    deleteSectionSuccess(state, action) {
      state.isSaving = false;
      const id = action.payload;
      state.sections = state.sections.filter(s => s.id !== id);
      delete state.tasks[id];
    },

    reorderSectionsRequest(state) { state.isSaving = true; },
    reorderSectionsSuccess(state, action) {
      state.isSaving = false;
      state.sections = action.payload;
    },

    addTaskRequest(state) { state.isSaving = true; },
    addTaskSuccess(state, action) {
      state.isSaving = false;
      const { sectionId, task } = action.payload;
      if (!state.tasks[sectionId]) state.tasks[sectionId] = [];
      state.tasks[sectionId].push(task);
    },

    updateTaskRequest(state) { state.isSaving = true; },
    updateTaskSuccess(state, action) {
      state.isSaving = false;
      const { sectionId, taskId, updates } = action.payload;
      const list = state.tasks[sectionId] || [];
      const idx = list.findIndex(t => t.id === taskId);
      if (idx !== -1) state.tasks[sectionId][idx] = { ...state.tasks[sectionId][idx], ...updates };
    },

    deleteTaskRequest(state) { state.isSaving = true; },
    deleteTaskSuccess(state, action) {
      state.isSaving = false;
      const { sectionId, taskId } = action.payload;
      state.tasks[sectionId] = (state.tasks[sectionId] || []).filter(t => t.id !== taskId);
    },

    moveTaskRequest(state) { state.isSaving = true; },
    moveTaskSuccess(state, action) {
      state.isSaving = false;
      const { sourceSectionId, destSectionId, sourceIndex, destIndex } = action.payload;
      const task = state.tasks[sourceSectionId].splice(sourceIndex, 1)[0];
      if (!state.tasks[destSectionId]) state.tasks[destSectionId] = [];
      state.tasks[destSectionId].splice(destIndex, 0, { ...task, status: destSectionId });
    },

    reorderTasksRequest(state) { state.isSaving = true; },
    reorderTasksSuccess(state, action) {
      state.isSaving = false;
      const { sectionId, tasks } = action.payload;
      state.tasks[sectionId] = tasks;
    },

    saveComplete(state) { state.isSaving = false; },
    saveError(state, action) { state.isSaving = false; state.error = action.payload; },

    setSearchQuery(state, action) { state.searchQuery = action.payload; },
  }
});

export const {
  loadKanbanRequest, loadKanbanSuccess, loadKanbanFailure,
  addSectionRequest, addSectionSuccess, updateSectionRequest, updateSectionSuccess,
  deleteSectionRequest, deleteSectionSuccess, reorderSectionsRequest, reorderSectionsSuccess,
  addTaskRequest, addTaskSuccess, updateTaskRequest, updateTaskSuccess,
  deleteTaskRequest, deleteTaskSuccess, moveTaskRequest, moveTaskSuccess,
  reorderTasksRequest, reorderTasksSuccess, saveComplete, saveError, setSearchQuery
} = kanbanSlice.actions;

export default kanbanSlice.reducer;
// Kanban Slice - Manages Kanban board state using Redux Toolkit
// This file handles all the state changes for the Kanban board

import { createSlice } from '@reduxjs/toolkit';

// STEP 1: Helper function to create unique ID
function generateId() {
  return Date.now() + Math.random();
}

// STEP 2: Load saved data from browser storage
function getStoredKanbanData() {
  try {
    const data = localStorage.getItem('taskflow_kanban');
    if (data) {
      return JSON.parse(data); // Convert string back to object
    }
  } catch (error) {
    console.error('Error reading from storage:', error);
  }
  return null; // Return null if no data found
}

// STEP 3: Default sections - these show when app starts
const defaultSections = [
  { id: 'section-1', title: 'To Do', order: 0 },
  { id: 'section-2', title: 'In Progress', order: 1 },
  { id: 'section-3', title: 'Done', order: 2 },
];

// STEP 4: Get stored data or use default
const storedData = getStoredKanbanData();

// STEP 5: Initial state - the starting data structure
const initialState = {
  sections: storedData ? storedData.sections : defaultSections,
  tasks: storedData ? storedData.tasks : {
    'section-1': [],
    'section-2': [],
    'section-3': [],
  },
  isLoading: false,
  isSaving: false,
  error: null,
  searchQuery: '',
};

// STEP 6: Create the Redux slice - this manages all state changes
const kanbanSlice = createSlice({
  name: 'kanban',
  initialState,
  reducers: {
    // ========== LOAD ACTIONS ==========
    
    // Show loading state
    loadKanbanRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    
    // Save loaded data
    loadKanbanSuccess: (state, action) => {
      state.isLoading = false;
      state.sections = action.payload.sections;
      state.tasks = action.payload.tasks;
    },
    
    // Show error if load fails
    loadKanbanFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // ========== SECTION ACTIONS ==========
    
    // Start adding section
    addSectionRequest: (state) => {
      state.isSaving = true;
    },
    
    // Add new section to state
    addSectionSuccess: (state, action) => {
      state.isSaving = false;
      const newSection = action.payload;
      state.sections.push(newSection);
      state.tasks[newSection.id] = [];
    },
    
    // Start updating section
    updateSectionRequest: (state) => {
      state.isSaving = true;
    },
    
    // Update section title
    updateSectionSuccess: (state, action) => {
      state.isSaving = false;
      const { id, title } = action.payload;
      // Find and update section
      const section = state.sections.find((s) => s.id === id);
      if (section) {
        section.title = title;
      }
    },

    // Start deleting section
    deleteSectionRequest: (state) => {
      state.isSaving = true;
    },
    
    // Remove section from state
    deleteSectionSuccess: (state, action) => {
      state.isSaving = false;
      const sectionId = action.payload;
      state.sections = state.sections.filter((s) => s.id !== sectionId);
      delete state.tasks[sectionId];
    },

    // Start reordering sections
    reorderSectionsRequest: (state) => {
      state.isSaving = true;
    },
    
    // Update section order
    reorderSectionsSuccess: (state, action) => {
      state.isSaving = false;
      state.sections = action.payload;
    },

    // ========== TASK ACTIONS ==========
    
    // Start adding task
    addTaskRequest: (state) => {
      state.isSaving = true;
    },
    
    // Add new task to section
    addTaskSuccess: (state, action) => {
      state.isSaving = false;
      const { sectionId, task } = action.payload;
      if (!state.tasks[sectionId]) {
        state.tasks[sectionId] = [];
      }
      state.tasks[sectionId].push(task);
    },

    // Start updating task
    updateTaskRequest: (state) => {
      state.isSaving = true;
    },
    
    // Update task details
    updateTaskSuccess: (state, action) => {
      state.isSaving = false;
      const { sectionId, taskId, updates } = action.payload;
      const tasks = state.tasks[sectionId];
      if (tasks) {
        const taskIndex = tasks.findIndex((t) => t.id === taskId);
        if (taskIndex !== -1) {
          // Merge updates into existing task
          state.tasks[sectionId][taskIndex] = {
            ...state.tasks[sectionId][taskIndex],
            ...updates,
          };
        }
      }
    },

    // Start deleting task
    deleteTaskRequest: (state) => {
      state.isSaving = true;
    },
    
    // Remove task from section
    deleteTaskSuccess: (state, action) => {
      state.isSaving = false;
      const { sectionId, taskId } = action.payload;
      if (state.tasks[sectionId]) {
        state.tasks[sectionId] = state.tasks[sectionId].filter(
          (t) => t.id !== taskId
        );
      }
    },

    // Start moving task
    moveTaskRequest: (state) => {
      state.isSaving = true;
    },
    
    // Move task to different section
    moveTaskSuccess: (state, action) => {
      state.isSaving = false;
      const { sourceSectionId, destSectionId, sourceIndex, destIndex } = action.payload;
      
      // Get task from source
      const task = state.tasks[sourceSectionId][sourceIndex];
      
      // Remove from source section
      state.tasks[sourceSectionId].splice(sourceIndex, 1);
      
      // Add to destination section
      if (!state.tasks[destSectionId]) {
        state.tasks[destSectionId] = [];
      }
      state.tasks[destSectionId].splice(destIndex, 0, {
        ...task,
        status: destSectionId,
      });
    },

    // Start reordering tasks
    reorderTasksRequest: (state) => {
      state.isSaving = true;
    },
    
    // Update task order in section
    reorderTasksSuccess: (state, action) => {
      state.isSaving = false;
      const { sectionId, tasks } = action.payload;
      state.tasks[sectionId] = tasks;
    },

    // Task saved successfully
    saveComplete: (state) => {
      state.isSaving = false;
    },
    
    // Task save failed
    saveError: (state, action) => {
      state.isSaving = false;
      state.error = action.payload;
    },
    
    // Update search query for filtering
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
  },
});

// STEP 7: Export all actions - these functions trigger state changes
export const {
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
  setSearchQuery,
} = kanbanSlice.actions;

// STEP 8: Export reducer - connects to Redux store
export default kanbanSlice.reducer;
