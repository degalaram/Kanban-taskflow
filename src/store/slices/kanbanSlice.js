import { createSlice } from '@reduxjs/toolkit';

function generateId() {
  return Date.now().toString() + Math.floor(Math.random() * 1000).toString();
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem('taskflow_kanban');
    if (!raw) return null;
    return JSON.parse(raw);
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
  sections: stored && stored.sections ? stored.sections : defaultSections,
  tasks: stored && stored.tasks ? stored.tasks : { 'section-1': [], 'section-2': [], 'section-3': [] },
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

    addSectionRequest(state) {
      state.isSaving = true;
    },

    addSectionSuccess(state, action) {
      state.isSaving = false;
      const s = action.payload;
      state.sections.push(s);
      state.tasks[s.id] = [];
    },

    updateSectionRequest(state) {
      state.isSaving = true;
    },

    updateSectionSuccess(state, action) {
      state.isSaving = false;
      const { id, title } = action.payload;
      const sec = state.sections.find((x) => x.id === id);
      if (sec) sec.title = title;
    },

    deleteSectionRequest(state) {
      state.isSaving = true;
    },

    deleteSectionSuccess(state, action) {
      state.isSaving = false;
      const id = action.payload;
      state.sections = state.sections.filter((s) => s.id !== id);
      delete state.tasks[id];
    },

    reorderSectionsRequest(state) {
      state.isSaving = true;
    },

    reorderSectionsSuccess(state, action) {
      state.isSaving = false;
      state.sections = action.payload;
    },

    addTaskRequest(state) {
      state.isSaving = true;
    },

    addTaskSuccess(state, action) {
      state.isSaving = false;
      const { sectionId, task } = action.payload;
      if (!state.tasks[sectionId]) state.tasks[sectionId] = [];
      state.tasks[sectionId].push(task);
    },

    updateTaskRequest(state) {
      state.isSaving = true;
    },

    updateTaskSuccess(state, action) {
      state.isSaving = false;
      const { sectionId, taskId, updates } = action.payload;
      const list = state.tasks[sectionId] || [];
      const idx = list.findIndex((t) => t.id === taskId);
      if (idx !== -1) state.tasks[sectionId][idx] = { ...state.tasks[sectionId][idx], ...updates };
    },

    deleteTaskRequest(state) {
      state.isSaving = true;
    },

    deleteTaskSuccess(state, action) {
      state.isSaving = false;
      const { sectionId, taskId } = action.payload;
      state.tasks[sectionId] = (state.tasks[sectionId] || []).filter((t) => t.id !== taskId);
    },

    moveTaskRequest(state) {
      state.isSaving = true;
    },

    moveTaskSuccess(state, action) {
      state.isSaving = false;
      const { sourceSectionId, destSectionId, sourceIndex, destIndex } = action.payload;
      const task = state.tasks[sourceSectionId].splice(sourceIndex, 1)[0];
      if (!state.tasks[destSectionId]) state.tasks[destSectionId] = [];
      state.tasks[destSectionId].splice(destIndex, 0, { ...task, status: destSectionId });
    },

    reorderTasksRequest(state) {
      state.isSaving = true;
    },

    reorderTasksSuccess(state, action) {
      state.isSaving = false;
      const { sectionId, tasks } = action.payload;
      state.tasks[sectionId] = tasks;
    },

    saveComplete(state) {
      state.isSaving = false;
    },

    saveError(state, action) {
      state.isSaving = false;
      state.error = action.payload;
    },

    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
    },
  },
});

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

export default kanbanSlice.reducer;
