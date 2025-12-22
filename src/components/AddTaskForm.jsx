// Add Task Form Component
// Form for adding new tasks to a section
// SIMPLIFIED VERSION - with clear step-by-step comments

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTaskRequest } from '../store/slices/kanbanSlice';
import { Plus, X } from 'lucide-react';

const AddTaskForm = ({ sectionId, onClose }) => {
  // STEP 1: Local state for form inputs
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // STEP 2: Get dispatch function
  const dispatch = useDispatch();

  // STEP 3: Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    
    // Check if title is not empty
    if (title.trim()) {
      // Send add task action to Redux
      dispatch(addTaskRequest({
        sectionId,
        title: title.trim(),
        description: description.trim(),
      }));
      
      // Clear form
      setTitle('');
      setDescription('');
      
      // Close form
      onClose();
    }
  };

  // STEP 4: Handle cancel button
  const handleCancel = () => {
    setTitle('');
    setDescription('');
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-kanban-task rounded-lg border border-border p-3 mb-2 animate-slide-up">
      {/* STEP 5: Title Input */}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter task title..."
        className="w-full px-2 py-2 text-sm rounded border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground"
        autoFocus
      />

      {/* STEP 6: Description Input */}
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Add a description (optional)"
        className="w-full mt-2 px-2 py-2 text-sm rounded border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none placeholder:text-muted-foreground"
        rows={2}
      />

      {/* STEP 7: Action Buttons */}
      <div className="flex items-center gap-2 mt-3">
        {/* Submit button - disabled if title is empty */}
        <button
          type="submit"
          disabled={!title.trim()}
          className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Task
        </button>
        
        {/* Cancel button */}
        <button
          type="button"
          onClick={handleCancel}
          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
};

export default AddTaskForm;
