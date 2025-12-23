
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CheckCircle, Clock, Circle, Star, MoreHorizontal, ArrowRight, Trash2, Check } from 'lucide-react';
import { updateTaskRequest, deleteTaskRequest, moveTaskRequest } from '../store/slices/kanbanSlice';

const AllTasksPage = () => {
  const { sections, tasks } = useSelector((state) => state.kanban);
  const dispatch = useDispatch();

  const [openMenuId, setOpenMenuId] = useState(null);
  const [showMoveMenuId, setShowMoveMenuId] = useState(null);

  const allTasks = [];
  sections.forEach((section) => {
    const sectionTasks = tasks[section.id] || [];
    sectionTasks.forEach((task, index) => {
      allTasks.push({
        ...task,
        sectionTitle: section.title,
        sectionId: section.id,
        taskIndex: index,
      });
    });
  });

  allTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const getStatusIcon = (sectionTitle) => {
    const title = sectionTitle.toLowerCase();
    if (title.includes('done') || title.includes('complete')) {
      return <CheckCircle className="w-5 h-5 text-done" />;
    }
    if (title.includes('progress') || title.includes('doing')) {
      return <Clock className="w-5 h-5 text-inprogress" />;
    }
    return <Circle className="w-5 h-5 text-muted-foreground" />;
  };

  const getSectionIcon = (title) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('done') || lowerTitle.includes('complete')) {
      return <CheckCircle className="w-4 h-4 text-done" />;
    }
    if (lowerTitle.includes('progress') || lowerTitle.includes('doing')) {
      return <Clock className="w-4 h-4 text-inprogress" />;
    }
    return <Circle className="w-4 h-4 text-muted-foreground" />;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleToggleFavorite = (task) => {
    dispatch(updateTaskRequest({
      sectionId: task.sectionId,
      taskId: task.id,
      updates: {
        isFavorite: !task.isFavorite,
      },
    }));
  };

  const handleMoveToSection = (task, targetSectionId) => {
    if (targetSectionId === task.sectionId) return;
    
    const destIndex = tasks[targetSectionId]?.length || 0;
    
    dispatch(moveTaskRequest({
      sourceSectionId: task.sectionId,
      destSectionId: targetSectionId,
      sourceIndex: task.taskIndex,
      destIndex,
    }));
    
    setOpenMenuId(null);
    setShowMoveMenuId(null);
  };

  const handleDelete = (task) => {
    dispatch(deleteTaskRequest({
      sectionId: task.sectionId,
      taskId: task.id,
    }));
    setOpenMenuId(null);
  };

  const handleMarkComplete = (task) => {
    const doneSection = sections.find(s => 
      s.title.toLowerCase().includes('done') || s.title.toLowerCase().includes('complete')
    );
    if (doneSection && doneSection.id !== task.sectionId) {
      handleMoveToSection(task, doneSection.id);
    }
  };

  const isTaskCompleted = (task) => {
    const title = task.sectionTitle.toLowerCase();
    return title.includes('done') || title.includes('complete');
  };

  return (
    <div className="flex-1 p-4 md:p-6 overflow-auto">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">All Tasks</h1>
        <p className="text-muted-foreground">View all your tasks in one place</p>
      </div>

      {/* Task Count */}
      <div className="mb-4">
        <span className="text-sm text-muted-foreground">
          {allTasks.length} {allTasks.length === 1 ? 'task' : 'tasks'} total
        </span>
      </div>

      {/* Tasks List */}
      {allTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No tasks yet</h3>
          <p className="text-muted-foreground">
            Create your first task from the Dashboard
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {allTasks.map((task) => (
            <div
              key={task.id}
              className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                {/* Clickable Status Icon to mark complete */}
                <button 
                  className="mt-0.5 hover:scale-110 transition-transform"
                  onClick={() => !isTaskCompleted(task) && handleMarkComplete(task)}
                  title={isTaskCompleted(task) ? 'Completed' : 'Click to mark as completed'}
                >
                  {getStatusIcon(task.sectionTitle)}
                </button>

                {/* Task Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className={`font-medium text-foreground truncate ${isTaskCompleted(task) ? 'line-through opacity-70' : ''}`}>
                      {task.title}
                    </h3>
                    {task.isFavorite && (
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                    )}
                  </div>
                  {task.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {task.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 md:gap-4 text-xs text-muted-foreground flex-wrap">
                    <span className="px-2 py-1 bg-muted rounded">
                      {task.sectionTitle}
                    </span>
                    <span>{formatDate(task.createdAt)}</span>
                  </div>
                </div>

                {/* Actions Menu */}
                <div className="relative">
                  <button
                    onClick={() => setOpenMenuId(openMenuId === task.id ? null : task.id)}
                    className="p-2 rounded hover:bg-muted transition-colors"
                  >
                    <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
                  </button>

                  {openMenuId === task.id && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => {
                          setOpenMenuId(null);
                          setShowMoveMenuId(null);
                        }}
                      />
                      <div className="absolute right-0 top-10 z-20 w-44 bg-popover border border-border rounded-lg shadow-lg py-1 animate-fade-in">
                        {/* Toggle Favorite */}
                        <button
                          onClick={() => {
                            handleToggleFavorite(task);
                            setOpenMenuId(null);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                        >
                          <Star className={`w-4 h-4 ${task.isFavorite ? 'text-yellow-500 fill-yellow-500' : ''}`} />
                          {task.isFavorite ? 'Unfavorite' : 'Favorite'}
                        </button>

                        {/* Mark Complete (if not already) */}
                        {!isTaskCompleted(task) && (
                          <button
                            onClick={() => handleMarkComplete(task)}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-done hover:bg-muted transition-colors"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Mark Complete
                          </button>
                        )}

                        {/* Move to Section */}
                        <div className="relative">
                          <button
                            onClick={() => setShowMoveMenuId(showMoveMenuId === task.id ? null : task.id)}
                            className="w-full flex items-center justify-between gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                          >
                            <span className="flex items-center gap-2">
                              <ArrowRight className="w-4 h-4" />
                              Move to
                            </span>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                          
                          {showMoveMenuId === task.id && (
                            <div className="absolute right-full top-0 mr-1 w-40 bg-popover border border-border rounded-lg shadow-lg py-1 animate-fade-in">
                              {sections.map((section) => (
                                <button
                                  key={section.id}
                                  onClick={() => handleMoveToSection(task, section.id)}
                                  disabled={section.id === task.sectionId}
                                  className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors ${
                                    section.id === task.sectionId 
                                      ? 'text-muted-foreground bg-muted cursor-not-allowed'
                                      : 'text-foreground hover:bg-muted'
                                  }`}
                                >
                                  {getSectionIcon(section.title)}
                                  <span className="truncate">{section.title}</span>
                                  {section.id === task.sectionId && (
                                    <Check className="w-3 h-3 ml-auto" />
                                  )}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="border-t border-border my-1" />
                        
                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(task)}
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllTasksPage;
