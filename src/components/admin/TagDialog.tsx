import React, { useState, useEffect } from 'react';
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
import { adminBlogApi, type BlogTag } from '@/utils/blogApi';

interface TagDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tag?: BlogTag | null;
  onSave: (createdOrUpdated?: BlogTag) => void;
}

export default function TagDialog({ open, onOpenChange, tag, onSave }: TagDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = Boolean(tag);

  useEffect(() => {
    if (tag) {
      setFormData({
        name: tag.name,
        slug: tag.slug,
      });
    } else {
      setFormData({
        name: '',
        slug: '',
      });
    }
    setError(null);
  }, [tag, open]);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: generateSlug(name),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.slug) {
      setError('Name and slug are required');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let saved: BlogTag | undefined = undefined;
      if (isEditing && tag) {
        const res = await adminBlogApi.updateTag(tag.id, formData);
        saved = res.tag as any;
      } else {
        const res = await adminBlogApi.createTag(formData);
        saved = res.tag as any;
      }

      onSave(saved);
      onOpenChange(false);
    } catch (err: any) {
      console.error('Error saving tag:', err);
      setError(err.message || 'Failed to save tag');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Tag' : 'Create New Tag'}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update the tag information below.' : 'Add a new tag to organize your blog posts.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}
          
          <div>
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Enter tag name..."
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              placeholder="tag-slug"
              className="mt-1"
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : (isEditing ? 'Update' : 'Create')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
