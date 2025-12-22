import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

const RenameSectionModal = ({ isOpen, section, onClose, onRename }) => {
  const [newTitle, setNewTitle] = useState(section?.title || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newTitle.trim() && newTitle.trim() !== section?.title) {
      onRename(newTitle.trim());
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename Section</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="section-name" className="text-sm font-medium">
                Section Name
              </Label>
              <Input
                id="section-name"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Enter section name"
                className="mt-2"
                autoFocus
              />
            </div>
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
              disabled={!newTitle.trim() || newTitle.trim() === section?.title}
            >
              Rename
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RenameSectionModal;
