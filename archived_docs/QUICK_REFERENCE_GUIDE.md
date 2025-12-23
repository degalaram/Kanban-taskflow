# Quick Reference Guide - Simplified Code Structure

## Project Architecture

```
Kanban Dashboard Application
├── Redux Store (State Management)
│   ├── Slices (Reducers)
│   │   ├── authSlice.js - User login & authentication
│   │   └── kanbanSlice.js - Tasks & sections data
│   └── Sagas (Side Effects)
│       ├── authSaga.js - Login/logout operations
│       └── kanbanSaga.js - Task CRUD operations
│
├── React Components
│   ├── App.jsx - Main routing & layout
│   ├── Header.jsx - Top navigation & search
│   ├── Sidebar.jsx - Left menu navigation
│   ├── KanbanBoard.jsx - Main board with sections
│   ├── KanbanSection.jsx - Single column
│   ├── TaskCard.jsx - Individual task
│   └── AddTaskForm.jsx - Add new task form
│
├── Pages
│   ├── LoginPage.jsx - Login screen
│   ├── DashboardPage.jsx - Main dashboard
│   ├── AllTasksPage.jsx - All tasks view
│   ├── CalendarPage.jsx - Calendar view
│   ├── FavoritesPage.jsx - Favorite tasks
│   └── SettingsPage.jsx - Settings
│
└── UI Components (shadcn/ui)
    ├── button.jsx
    ├── input.jsx
    ├── dialog.jsx
    └── ... (other UI components)
```

---

## Data Flow (How It Works)

### 1. **User Login Flow**
```
User clicks "Login" 
    ↓
LoginPage dispatches loginRequest action
    ↓
authSaga.js handles the request
    ↓
Validates username/password
    ↓
Creates session & user object
    ↓
Saves to localStorage
    ↓
Dispatches loginSuccess
    ↓
authSlice updates Redux state
    ↓
App.jsx redirects to Dashboard
```

### 2. **Add Task Flow**
```
User clicks "Add Task" button
    ↓
AddTaskForm component shows
    ↓
User enters title & description
    ↓
Form dispatches addTaskRequest
    ↓
kanbanSaga.js creates new task object
    ↓
Dispatches addTaskSuccess
    ↓
kanbanSlice adds task to state
    ↓
Task appears in KanbanSection
```

### 3. **Drag & Drop Flow**
```
User drags task
    ↓
KanbanBoard.handleDragEnd fires
    ↓
Checks source and destination
    ↓
Dispatches moveTaskRequest or reorderTasksRequest
    ↓
kanbanSaga processes the request
    ↓
kanbanSlice updates task positions
    ↓
UI rerenders with new positions
```

---

## Key Concepts Explained (Beginner Friendly)

### **Redux State Management**
- **State**: Single object containing all app data
- **Action**: Object describing what happened (e.g., {type: 'LOGIN_REQUEST'})
- **Reducer**: Function that changes state based on action
- **Dispatch**: Function to send actions to Redux

```javascript
// Example Flow:
const action = { type: 'ADD_TASK', payload: { title: 'New task' } };
dispatch(action);  // Send to Redux
// Redux calls reducer
// Reducer updates state
// Component rerenders with new state
```

### **Redux-Saga (Side Effects)**
- Handles async operations (API calls, delays, etc.)
- Listens for specific actions
- Processes them and dispatches new actions
- Keeps Redux slices pure (no side effects)

```javascript
// Simple Pattern:
Action dispatched → Saga listens → Does async work → Dispatches result action
```

### **React Hooks Used**
- **useState**: Local component state
- **useEffect**: Run code when component mounts/updates
- **useDispatch**: Get dispatch function
- **useSelector**: Get data from Redux state

---

## Common Patterns in Simplified Code

### **Pattern 1: Request/Success/Failure**
```javascript
// For async operations:
dispatch(loadKanbanRequest());      // Start loading
// ... async work happens ...
dispatch(loadKanbanSuccess(data));  // Success
// OR
dispatch(loadKanbanFailure(error)); // Error
```

### **Pattern 2: Toggle State**
```javascript
const handleToggle = () => {
  setState(!state);  // Switch between true/false
};
```

### **Pattern 3: Update Form Input**
```javascript
const [title, setTitle] = useState('');

const handleChange = (e) => {
  setTitle(e.target.value);
};
```

### **Pattern 4: Conditional Rendering**
```javascript
{isEditing ? (
  <EditForm />  // Show if true
) : (
  <DisplayView />  // Show if false
)}
```

---

## File-by-File Study Guide

### **Start with These (Simplest)**

**1. authSlice.js** (60 lines, pure Redux)
- No side effects
- Clear action definitions
- Perfect to understand reducers

**2. App.jsx** (165 lines, component structure)
- Routing setup
- ProtectedRoute concept
- Component hierarchy

**3. AddTaskForm.jsx** (70 lines, simple component)
- Form handling
- useState basics
- Dispatch pattern

### **Then Move To (Medium)**

**4. KanbanBoard.jsx** (240 lines, complex component)
- Drag-and-drop logic
- useSelector usage
- Multiple handlers

**5. authSaga.js** (150 lines, basic side effects)
- Async operations
- Action watching
- Error handling

### **Finally Study (Advanced)**

**6. kanbanSaga.js** (300 lines, complex side effects)
- Multiple handlers
- State management with sagas
- Complex logic

**7. TaskCard.jsx** (290 lines, complex component)
- State management
- Conditional rendering
- Multiple features

---

## Important Code Patterns

### **Dispatch Action Pattern**
```javascript
const dispatch = useDispatch();

const handleClick = () => {
  dispatch(actionName({ data: 'value' }));
};
```

### **Get State Pattern**
```javascript
const { data, isLoading } = useSelector((state) => state.sliceName);
```

### **Conditional Class Pattern**
```javascript
className={`base-class ${isActive ? 'active-class' : 'inactive-class'}`}
```

### **Array Manipulation Pattern**
```javascript
// Filter array
const filtered = array.filter((item) => item.id !== removeId);

// Map array
const updated = array.map((item) => ({
  ...item,
  property: newValue
}));

// Find item
const found = array.find((item) => item.id === searchId);
```

---

## Terminology You'll See

| Term | Meaning |
|------|---------|
| **Action** | Event describing something that happened |
| **Dispatch** | Send an action to Redux |
| **Reducer** | Function that updates state |
| **Saga** | Handles side effects (async operations) |
| **Selector** | Function to get data from state |
| **Handler** | Function called on user interaction |
| **Props** | Data passed from parent to child component |
| **State** | Component's local data |
| **Effect** | Side effect (API call, timer, etc.) |

---

## Debugging Tips

### **Check Redux State**
```javascript
const state = useSelector((state) => state);
console.log('Current State:', state);
```

### **Check Action Dispatch**
```javascript
const handleClick = () => {
  console.log('Dispatching action...');
  dispatch(actionName(data));
};
```

### **Check Component Props**
```javascript
const MyComponent = (props) => {
  console.log('Props:', props);
  // ...
};
```

### **Check Function Execution**
```javascript
const handleClick = () => {
  console.log('Click handler called');
  // do something
};
```

---

## Common Mistakes to Avoid

❌ **Don't:**
- Mutate state directly: `state.array[0] = newValue`
- Use indexes as keys in lists: `key={index}`
- Call hooks conditionally
- Forget to add dispatch dependencies in useEffect

✅ **Do:**
- Create new state: `[...state]` or `{...state}`
- Use unique IDs as keys: `key={item.id}`
- Call hooks at top level
- Add proper dependency arrays

---

## Next Learning Steps

1. **Understand Redux** - Read the Redux state structure
2. **Learn Sagas** - Follow how async operations work
3. **Master Components** - Study component structure
4. **Practice** - Make small changes and see results
5. **Build** - Create features yourself

---

## Resources in This Project

- **STATE**: `src/store/` - Redux store configuration
- **COMPONENTS**: `src/components/` - React components
- **PAGES**: `src/pages/` - Page components
- **STYLES**: `tailwind.config.js` - Styling configuration

---

**Keep this guide handy while studying the code!**
