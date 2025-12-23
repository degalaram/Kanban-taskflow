
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Star, CheckCircle, Clock, Circle } from 'lucide-react';
import { updateTaskRequest } from '../store/slices/kanbanSlice';

const FavoritesPage = () => {
  const { sections, tasks } = useSelector((state) => state.kanban);
  const dispatch = useDispatch();

  const favoriteTasks = [];
  sections.forEach((section) => {
    const sectionTasks = tasks[section.id] || [];
    sectionTasks.forEach((task) => {
      if (task.isFavorite) {
        favoriteTasks.push({
          ...task,
          sectionTitle: section.title,
          sectionId: section.id,
        });
      }
    });
  });

  favoriteTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const toggleFavorite = (task) => {
    dispatch(
      updateTaskRequest({
        sectionId: task.sectionId,
        taskId: task.id,
        updates: { isFavorite: !task.isFavorite },
      })
    );
  };

  return (
    <div className="flex-1 p-6 overflow-auto">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Favorites</h1>
        <p className="text-muted-foreground">Your starred tasks for quick access</p>
      </div>

      {/* Task Count */}
      <div className="mb-4">
        <span className="text-sm text-muted-foreground">
          {favoriteTasks.length} {favoriteTasks.length === 1 ? 'favorite' : 'favorites'}
        </span>
      </div>

      {/* Favorites List */}
      {favoriteTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Star className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No favorites yet</h3>
          <p className="text-muted-foreground">
            Star tasks from the Dashboard to add them here
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {favoriteTasks.map((task) => (
            <div
              key={task.id}
              className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                {/* Status Icon */}
                <div className="mt-0.5">{getStatusIcon(task.sectionTitle)}</div>

                {/* Task Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-foreground truncate">
                      {task.title}
                    </h3>
                  </div>
                  {task.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {task.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="px-2 py-1 bg-muted rounded">
                      {task.sectionTitle}
                    </span>
                    <span>{formatDate(task.createdAt)}</span>
                  </div>
                </div>

                {/* Star Button */}
                <button
                  onClick={() => toggleFavorite(task)}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
