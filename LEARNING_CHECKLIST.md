# Learning Checklist - Master This Codebase

## Understanding the Project Structure
- [ ] Read the README.md to understand project purpose
- [ ] Open the project in VS Code
- [ ] Explore folder structure in sidebar
- [ ] Understand the app is a Kanban task management tool
- [ ] Identify Redux, React, and UI libraries being used

## Core Concepts (Read in This Order)

### Week 1: Foundation
- [ ] Read CODE_SIMPLIFICATION_SUMMARY.md
- [ ] Read QUICK_REFERENCE_GUIDE.md
- [ ] Understand what Redux does
- [ ] Understand what React does
- [ ] Know what Sagas do

### Week 2: State Management
- [ ] Study `src/store/slices/authSlice.js`
  - [ ] Understand initial state structure
  - [ ] Understand each reducer action
  - [ ] See how state is updated
- [ ] Study `src/store/slices/kanbanSlice.js`
  - [ ] See task state structure
  - [ ] See section state structure
  - [ ] Understand all reducers

### Week 3: Side Effects
- [ ] Study `src/store/sagas/authSaga.js`
  - [ ] How login flow works
  - [ ] How token refresh works
  - [ ] Understand action watchers
- [ ] Study `src/store/sagas/kanbanSaga.js`
  - [ ] How CRUD operations work
  - [ ] How data is saved
  - [ ] How handlers process actions

### Week 4: React Components
- [ ] Study `src/App.jsx`
  - [ ] Understand routing
  - [ ] Understand ProtectedRoute
  - [ ] See component hierarchy
- [ ] Study `src/components/AddTaskForm.jsx`
  - [ ] Form handling
  - [ ] Dispatch pattern
  - [ ] Input state management

### Week 5: Complex Components
- [ ] Study `src/components/KanbanBoard.jsx`
  - [ ] Understand drag-drop logic
  - [ ] See how sections render
  - [ ] Understand filtering
- [ ] Study `src/components/TaskCard.jsx`
  - [ ] See task operations
  - [ ] Understand edit mode
  - [ ] See delete functionality

### Week 6: Remaining Components
- [ ] Study `src/components/Header.jsx`
  - [ ] Search functionality
  - [ ] Theme toggle
  - [ ] User information display
- [ ] Study `src/components/KanbanSection.jsx`
  - [ ] Section management
  - [ ] Task rendering

## Hands-On Practice Tasks

### Practice 1: Trace Data Flow
- [ ] Start at LoginPage.jsx
- [ ] Follow dispatch to authSlice.js
- [ ] Follow action to authSaga.js
- [ ] See state update in authSlice.js
- [ ] Verify user is logged in
- [ ] Check localStorage was updated

### Practice 2: Add a Console Log
- [ ] Open `src/components/AddTaskForm.jsx`
- [ ] Add `console.log('Form submitted')` in handleSubmit
- [ ] Run the app and test
- [ ] See the log in browser console
- [ ] Remove the log

### Practice 3: Change a Message
- [ ] Open `src/components/Header.jsx`
- [ ] Find the "Loading your tasks..." text
- [ ] Change it to something else
- [ ] Run the app and verify change
- [ ] Revert the change

### Practice 4: Add a Button
- [ ] In `src/components/AddTaskForm.jsx`
- [ ] Add a new "Clear" button
- [ ] Make it clear both inputs
- [ ] Test that it works
- [ ] Don't commit this change

### Practice 5: Understand State Changes
- [ ] Open Redux DevTools (install if needed)
- [ ] Login to the app
- [ ] Watch state changes in DevTools
- [ ] Add a task
- [ ] Move a task to another section
- [ ] Delete a task
- [ ] See each action and state change

### Practice 6: Modify a Reducer
- [ ] Open `src/store/slices/kanbanSlice.js`
- [ ] Find setSearchQuery reducer
- [ ] Add a console.log when it's called
- [ ] Search for a task in the app
- [ ] Verify the log appears
- [ ] Remove the log

### Practice 7: Read Data from State
- [ ] Open `src/components/KanbanBoard.jsx`
- [ ] Find where state is selected
- [ ] Add `console.log('Sections:', sections)`
- [ ] Open app and check browser console
- [ ] See the sections array structure
- [ ] Remove the log

### Practice 8: Handle an Event
- [ ] Open `src/components/AddTaskForm.jsx`
- [ ] Modify handleSubmit to log the task object
- [ ] Add a task and check console
- [ ] See the task structure
- [ ] Understand all task properties

### Practice 9: Trace a Drag & Drop
- [ ] Open `src/components/KanbanBoard.jsx`
- [ ] Find handleDragEnd function
- [ ] Add console.log to log the drag result
- [ ] Drag a task and check console
- [ ] Understand source and destination
- [ ] Remove the log

### Practice 10: Understand Conditional Rendering
- [ ] Open `src/components/KanbanBoard.jsx`
- [ ] Find the conditional render for loading state
- [ ] Find the conditional render for edit mode in TaskCard
- [ ] Understand the pattern `condition ? trueJSX : falseJSX`
- [ ] Locate 3 more conditional renders

## Understand These Patterns

- [ ] **useState Pattern**: See in AddTaskForm.jsx
- [ ] **useDispatch Pattern**: See in all components
- [ ] **useSelector Pattern**: See in KanbanBoard.jsx
- [ ] **useEffect Pattern**: See in Header.jsx
- [ ] **Conditional Rendering**: See in multiple components
- [ ] **Array Mapping**: See in KanbanBoard.jsx sections rendering
- [ ] **Object Spreading**: See in all slices
- [ ] **Default Parameters**: See in saga handlers
- [ ] **Arrow Functions**: See throughout code
- [ ] **Ternary Operators**: See in all components

## Understand These Concepts

- [ ] **Redux Actions**: What they are and why needed
- [ ] **Reducers**: How they update state
- [ ] **Store**: Single source of truth
- [ ] **Dispatch**: How to send actions
- [ ] **Selectors**: How to get state
- [ ] **Sagas**: How to handle async
- [ ] **Drag & Drop**: How @hello-pangea/dnd works
- [ ] **Protected Routes**: How authentication works
- [ ] **Local Storage**: How data persists
- [ ] **React Hooks**: What they are and when to use

## Quiz Yourself

### True or False
- [ ] Redux state is stored in multiple places in the app
- [ ] You can directly modify Redux state
- [ ] Sagas handle all async operations
- [ ] Components can dispatch actions
- [ ] selectors are used to get data from Redux
- [ ] localStorage persists data forever
- [ ] Reducers can have side effects
- [ ] useSelector can be called inside loops

### Answer These
- [ ] What happens when a user clicks "Add Task"?
- [ ] Where is task data stored? (where in Redux)
- [ ] How does a task move from "To Do" to "Done"?
- [ ] What does handleDragEnd do?
- [ ] How does the app know if user is logged in?
- [ ] Where is user data stored?
- [ ] What is the purpose of authSaga.js?
- [ ] What is the purpose of kanbanSlice.js?
- [ ] How are sections rendered?
- [ ] How are tasks rendered inside sections?

## Reading Code Strategy

### For Each File:
1. **Read the comments first** - They explain everything
2. **Look at STEP comments** - Follow the numbered steps
3. **Read function names** - They describe what happens
4. **Understand the flow** - How data moves
5. **Try to modify it** - Small changes to test understanding

### Look for These Patterns:
- [ ] Helper functions (generateId, saveToLocalStorage)
- [ ] Event handlers (handleClick, handleChange)
- [ ] Request/Success/Failure patterns
- [ ] Conditional logic (if/else)
- [ ] Array/object operations
- [ ] Redux dispatch patterns

## Debugging Checklist

When code doesn't work:
- [ ] Check browser console for errors
- [ ] Check Redux DevTools for state changes
- [ ] Add console.log to trace execution
- [ ] Check that actions are dispatched
- [ ] Check that state is updated
- [ ] Check that components rerender
- [ ] Check browser localStorage
- [ ] Check network tab (if API calls)

## Project Completion Checklist

Before moving to next project:
- [ ] Can explain Redux store structure
- [ ] Can trace any action through the system
- [ ] Can understand any reducer
- [ ] Can understand any saga
- [ ] Can understand any component
- [ ] Can add a new feature
- [ ] Can fix a bug
- [ ] Can modify existing features
- [ ] Can debug using console and DevTools
- [ ] Can explain drag-and-drop logic
- [ ] Can explain authentication flow
- [ ] Can explain task CRUD operations

## Resources to Study

### Inside Project:
- [x] CODE_SIMPLIFICATION_SUMMARY.md
- [x] QUICK_REFERENCE_GUIDE.md
- [ ] All comments in code files
- [ ] File structure and organization

### Official Docs:
- [ ] Redux: https://redux.js.org/
- [ ] React: https://react.dev/
- [ ] React Router: https://reactrouter.com/
- [ ] @hello-pangea/dnd: https://github.com/hello-pangea/dnd
- [ ] Tailwind CSS: https://tailwindcss.com/

## Time Estimate

- **Understanding Structure**: 2-3 days
- **Learning Redux**: 1 week
- **Learning Sagas**: 4-5 days
- **Learning Components**: 1 week
- **Practice & Projects**: 2+ weeks
- **Total**: 4-6 weeks for solid understanding

## Next Steps After Mastering

1. **Modify Features**
   - [ ] Add new task properties (priority, due date)
   - [ ] Add task filtering by status
   - [ ] Add user profile page

2. **Add New Features**
   - [ ] Task comments
   - [ ] Task attachments
   - [ ] Recurring tasks
   - [ ] Task templates

3. **Connect to Backend**
   - [ ] Replace localStorage with API calls
   - [ ] Add real authentication
   - [ ] Add user management
   - [ ] Add data persistence

4. **Improve UI**
   - [ ] Add animations
   - [ ] Improve responsiveness
   - [ ] Add dark mode
   - [ ] Add more themes

5. **Optimize Performance**
   - [ ] Memoize components
   - [ ] Optimize re-renders
   - [ ] Lazy load components
   - [ ] Code splitting

---

## Study Tips

✅ **Do:**
- Read comments multiple times
- Trace data flow manually
- Use debugger and DevTools
- Practice coding along
- Take notes while reading
- Ask questions about patterns
- Practice with small projects
- Test your understanding

❌ **Don't:**
- Skip comments and comments
- Try to memorize syntax
- Jump between files randomly
- Copy-paste without understanding
- Assume you understand without testing
- Give up when confused
- Ignore error messages
- Rush through the code

---

**Good luck with your learning journey!** 🚀
