import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AlertTriangle, Trash2, FileText } from 'lucide-react';
import { BlogTag } from '@/utils/blogApi';

interface DeleteTagDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tag: BlogTag | null;
  onConfirm: () => void;
  loading?: boolean;
}

export default function DeleteTagDialog({ 
  open, 
  onOpenChange, 
  tag, 
  onConfirm, 
  loading = false 
}: DeleteTagDialogProps) {
  const [confirmationText, setConfirmationText] = useState('');
  const isInUse = tag && (tag.count || 0) > 0;
  const canDelete = !isInUse && confirmationText === tag?.name;

  const handleConfirm = () => {
    if (canDelete) {
      onConfirm();
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setConfirmationText('');
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-red-500" />
            Delete Tag
          </DialogTitle>
          <DialogDescription>
            {isInUse 
              ? 'This tag cannot be deleted because it is used in blog posts.'
              : 'This action cannot be undone. This will permanently delete the tag.'
            }
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {isInUse ? (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-md">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-amber-800 mb-1">
                    Tag in Use
                  </h4>
                  <p className="text-amber-700 text-sm mb-2">
                    The tag <strong>"{tag?.name}"</strong> cannot be deleted because it is used in{' '}
                    <strong>{tag?.count} blog post{(tag?.count || 0) > 1 ? 's' : ''}</strong>.
                  </p>
                  <div className="flex items-center gap-2 text-amber-600 text-sm">
                    <FileText className="w-4 h-4" />
                    <span>Tag must be removed from posts before deletion</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-red-800 mb-1">
                      Warning: Irreversible Action
                    </h4>
                    <p className="text-red-700 text-sm">
                      You are about to delete the tag <strong>"{tag?.name}"</strong>. 
                      This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <Label htmlFor="confirmation">
                  Type <strong>"{tag?.name}"</strong> to confirm deletion:
                </Label>
                <Input
                  id="confirmation"
                  value={confirmationText}
                  onChange={(e) => setConfirmationText(e.target.value)}
                  placeholder={tag?.name}
                  className="mt-1"
                />
              </div>
            </>
          )}
        </div>
        
        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => handleOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          {!isInUse && (
            <Button 
              type="button" 
              variant="destructive" 
              onClick={handleConfirm}
              disabled={!canDelete || loading}
            >
              {loading ? 'Deleting...' : 'Delete Tag'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
