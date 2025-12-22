/* Kanban sagas (simplified) */
import { put, takeLatest, select } from 'redux-saga/effects';
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

const API_DELAY = 800;

function generateId() {
  return Date.now() + Math.random();
}

function saveToLocalStorage(sections, tasks) {
  try { localStorage.setItem('taskflow_kanban', JSON.stringify({ sections, tasks })); return true; } catch { return false; }
}

function loadFromLocalStorage() {
  try { const raw = localStorage.getItem('taskflow_kanban'); return raw ? JSON.parse(raw) : null; } catch { return null; }
}

function* handleLoadKanban() {
  try {
    yield new Promise(r => setTimeout(r, API_DELAY));
    const data = loadFromLocalStorage();
    if (data) {
      yield put(loadKanbanSuccess(data));
    } else {
      const defaultData = {
        sections: [
          { id: 'section-1', title: 'To Do', order: 0 },
          { id: 'section-2', title: 'In Progress', order: 1 },
          { id: 'section-3', title: 'Done', order: 2 },
        ],
        tasks: { 'section-1': [], 'section-2': [], 'section-3': [] },
      };
      saveToLocalStorage(defaultData.sections, defaultData.tasks);
      yield put(loadKanbanSuccess(defaultData));
    }
  } catch (err) { yield put(loadKanbanFailure(err.message)); }
}

function* handleAddSection(action) {
  try {
    yield new Promise(r => setTimeout(r, API_DELAY));
    const { title } = action.payload;
    const newSection = { id: 'section-' + generateId(), title, order: Date.now() };
    yield put(addSectionSuccess(newSection));
    // Save updated state to localStorage
    const state = yield select((s) => s.kanban);
    saveToLocalStorage(state.sections, state.tasks);
  } catch (err) { yield put(saveError(err.message)); }
}

function* handleUpdateSection(action) { try { yield new Promise(r => setTimeout(r, API_DELAY)); yield put(updateSectionSuccess(action.payload)); const state = yield select((s) => s.kanban); saveToLocalStorage(state.sections, state.tasks); } catch (err) { yield put(saveError(err.message)); } }
function* handleDeleteSection(action) { try { yield new Promise(r => setTimeout(r, API_DELAY)); yield put(deleteSectionSuccess(action.payload)); const state = yield select((s) => s.kanban); saveToLocalStorage(state.sections, state.tasks); } catch (err) { yield put(saveError(err.message)); } }
function* handleReorderSections(action) { try { yield new Promise(r => setTimeout(r, 300)); yield put(reorderSectionsSuccess(action.payload)); const state = yield select((s) => s.kanban); saveToLocalStorage(state.sections, state.tasks); } catch (err) { yield put(saveError(err.message)); } }

function* handleAddTask(action) { try { yield new Promise(r => setTimeout(r, API_DELAY)); const { sectionId, title, description } = action.payload; const newTask = { id: 'task-' + generateId(), title, description: description || '', status: sectionId, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }; yield put(addTaskSuccess({ sectionId, task: newTask })); const state = yield select((s) => s.kanban); saveToLocalStorage(state.sections, state.tasks); } catch (err) { yield put(saveError(err.message)); } }

function* handleUpdateTask(action) { try { yield new Promise(r => setTimeout(r, API_DELAY)); const updates = { ...action.payload.updates, updatedAt: new Date().toISOString() }; yield put(updateTaskSuccess({ sectionId: action.payload.sectionId, taskId: action.payload.taskId, updates })); const state = yield select((s) => s.kanban); saveToLocalStorage(state.sections, state.tasks); } catch (err) { yield put(saveError(err.message)); } }
function* handleDeleteTask(action) { try { yield new Promise(r => setTimeout(r, API_DELAY)); yield put(deleteTaskSuccess(action.payload)); const state = yield select((s) => s.kanban); saveToLocalStorage(state.sections, state.tasks); } catch (err) { yield put(saveError(err.message)); } }
function* handleMoveTask(action) { try { yield new Promise(r => setTimeout(r, 300)); yield put(moveTaskSuccess(action.payload)); const state = yield select((s) => s.kanban); saveToLocalStorage(state.sections, state.tasks); } catch (err) { yield put(saveError(err.message)); } }
function* handleReorderTasks(action) { try { yield new Promise(r => setTimeout(r, 300)); yield put(reorderTasksSuccess(action.payload)); const state = yield select((s) => s.kanban); saveToLocalStorage(state.sections, state.tasks); } catch (err) { yield put(saveError(err.message)); } }

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
