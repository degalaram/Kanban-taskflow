// Task Card Component
// Displays a single task with editing and deletion features
// SIMPLIFIED VERSION - clearer and easier to understand

import React, { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { useDispatch, useSelector } from 'react-redux';
import { deleteTaskRequest, updateTaskRequest, moveTaskRequest } from '../store/slices/kanbanSlice';
import { 
  GripVertical, 
  MoreHorizontal, 
  Trash2, 
  Edit2, 
  Clock,
  X,
  Check,
  Star,
  ArrowRight,
  Circle,
  CheckCircle,
  Loader
} from 'lucide-react';

const TaskCard = ({ task, index, sectionId }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description);
  const [showMoveMenu, setShowMoveMenu] = useState(false);
  const dispatch = useDispatch();
  const { sections, tasks } = useSelector((state) => state.kanban);
  const handleDelete = () => {
    // Send delete request to Redux
    dispatch(deleteTaskRequest({ sectionId, taskId: task.id }));
    setIsMenuOpen(false);
  };

  const handleEditStart = () => {
    setEditTitle(task.title);
    setEditDescription(task.description);
    setIsEditing(true);
    setIsMenuOpen(false);
  };

  const handleEditSave = () => {
    if (editTitle.trim()) {
      // Send update to Redux
      dispatch(updateTaskRequest({
        sectionId,
        taskId: task.id,
        updates: {
          title: editTitle.trim(),
          description: editDescription.trim(),
        },
      }));
      setIsEditing(false);
    }
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditTitle(task.title);
    setEditDescription(task.description);
  };

  const handleToggleFavorite = () => {
    dispatch(updateTaskRequest({
      sectionId,
      taskId: task.id,
      updates: {
        isFavorite: !task.isFavorite,
      },
    }));
    setIsMenuOpen(false);
  };

  const handleMoveToSection = (targetSectionId) => {
    // Don't move to same section
    if (targetSectionId === sectionId) return;
    
    // Find task position in current section
    const sourceIndex = tasks[sectionId].findIndex(t => t.id === task.id);
    const destIndex = tasks[targetSectionId]?.length || 0;
    
    // Send move request to Redux
    dispatch(moveTaskRequest({
      sourceSectionId: sectionId,
      destSectionId: targetSectionId,
      sourceIndex,
      destIndex,
    }));
    
    setShowMoveMenu(false);
    setIsMenuOpen(false);
  };

  // Get section icon based on title
  const getSectionIcon = (title) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('done') || lowerTitle.includes('complete')) {
      return <CheckCircle className="w-4 h-4 text-done" />;
    }
    if (lowerTitle.includes('progress') || lowerTitle.includes('doing')) {
      return <Loader className="w-4 h-4 text-inprogress" />;
    }
    return <Circle className="w-4 h-4 text-muted-foreground" />;
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`group bg-kanban-task rounded-lg border border-border p-3 mb-2 task-shadow transition-all ${
            snapshot.isDragging ? 'task-shadow-hover ring-2 ring-primary/20' : ''
          } ${isEditing ? 'ring-2 ring-primary' : ''}`}
        >
          {isEditing ? (
            // Edit Mode
            <div className="space-y-3">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full px-2 py-1.5 text-sm rounded border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Task title"
                autoFocus
              />
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="w-full px-2 py-1.5 text-sm rounded border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                placeholder="Description (optional)"
                rows={2}
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={handleEditCancel}
                  className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <button
                  onClick={handleEditSave}
                  className="p-1.5 rounded bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            // View Mode
            <>
              <div className="flex items-start gap-2">
                {/* Drag Handle */}
                <div
                  {...provided.dragHandleProps}
                  className="mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
                >
                  <GripVertical className="w-4 h-4 text-muted-foreground" />
                </div>

                {/* Task Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-medium text-foreground line-clamp-2">
                      {task.title}
                    </h4>
                    {task.isFavorite && (
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                    )}
                  </div>
                  {task.description && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {task.description}
                    </p>
                  )}
                </div>

                {/* Actions Menu */}
                <div className="relative">
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-muted transition-all"
                  >
                    <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                  </button>

                  {/* Dropdown Menu */}
                  {isMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => {
                          setIsMenuOpen(false);
                          setShowMoveMenu(false);
                        }}
                      />
                      <div className="absolute right-0 top-6 z-20 w-44 bg-popover border border-border rounded-lg shadow-lg py-1 animate-fade-in">
                        <button
                          onClick={handleEditStart}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={handleToggleFavorite}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                        >
                          <Star className={`w-4 h-4 ${task.isFavorite ? 'text-yellow-500 fill-yellow-500' : ''}`} />
                          {task.isFavorite ? 'Unfavorite' : 'Favorite'}
                        </button>
                        
                        {/* Move to Section - Inline options for cleaner UI */}
                        <div className="border-t border-border my-1" />
                        <div className="px-3 py-1.5">
                          <span className="text-xs text-muted-foreground font-medium">Move to</span>
                        </div>
                        {sections.map((section) => (
                          <button
                            key={section.id}
                            onClick={() => handleMoveToSection(section.id)}
                            disabled={section.id === sectionId}
                            className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors ${
                              section.id === sectionId 
                                ? 'text-muted-foreground bg-muted/50 cursor-not-allowed'
                                : 'text-foreground hover:bg-muted'
                            }`}
                          >
                            {getSectionIcon(section.title)}
                            <span className="truncate">{section.title}</span>
                            {section.id === sectionId && (
                              <Check className="w-3 h-3 ml-auto text-primary" />
                            )}
                          </button>
                        ))}
                        
                        <div className="border-t border-border my-1" />
                        <button
                          onClick={handleDelete}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Task Footer */}
              <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border">
                <Clock className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {formatDate(task.createdAt)}
                </span>
              </div>
            </>
          )}
        </div>
      )}
    </Draggable>
  );
};

// ChevronRight for submenu indicator
const ChevronRight = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

export default TaskCard;
