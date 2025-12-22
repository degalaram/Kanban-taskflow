import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

const EditTaskModal = ({ isOpen, task, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
    }
  }, [task, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      onSave({
        title: title.trim(),
        description: description.trim(),
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="task-title" className="text-sm font-medium">
                Task Title
              </Label>
              <Input
                id="task-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter task title"
                className="mt-2"
                autoFocus
              />
            </div>

            <div>
              <Label htmlFor="task-description" className="text-sm font-medium">
                Description (Optional)
              </Label>
              <Textarea
                id="task-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter task description..."
                className="mt-2 resize-none"
                rows={4}
              />
            </div>

            {task && (
              <div className="text-xs text-muted-foreground pt-2">
                Created: {new Date(task.createdAt).toLocaleDateString()}
              </div>
            )}
          </div>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!title.trim()}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTaskModal;
