import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { useNavigate } from 'react-router-dom';
import { getWithAuth, deleteWithAuth } from '@/utils/fetchWithAuth';
import { toast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Plus, Edit, Trash2, Search, Eye, AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

type SeoPage = {
  id: string;
  slug: string;
  title: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImageUrl?: string;
  twitterCard?: string;
  published: boolean;
  updatedAt: string;
};

export default function SeoPagesList() {
  const navigate = useNavigate();
  const [pages, setPages] = useState<SeoPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState('');
  const [search, setSearch] = useState('');
  const [previewData, setPreviewData] = useState<SeoPage | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ show: boolean; page: SeoPage | null }>({ show: false, page: null });

  const fetchPages = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getWithAuth<SeoPage[]>('/admin/seo-pages');
      setPages(data);
    } catch (e: any) {
      setError(e.message || 'Failed to load SEO pages');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleDelete = async (page: SeoPage) => {
    setDeleteDialog({ show: true, page });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.page) return;
    
    setDeletingId(deleteDialog.page.id);
    try {
      await deleteWithAuth(`/admin/seo-pages/${deleteDialog.page.id}`);
      toast({ title: 'Deleted', description: 'SEO page deleted successfully.' });
      fetchPages();
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    } finally {
      setDeletingId('');
      setDeleteDialog({ show: false, page: null });
    }
  };

  // Filter pages by slug or title
  const filteredPages = pages.filter((page) => {
    const searchLower = search.toLowerCase();
    return (
      page.slug.toLowerCase().includes(searchLower) ||
      page.title.toLowerCase().includes(searchLower)
    );
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>SEO Pages</CardTitle>
        <Button onClick={() => navigate('/admin/settings/seo/create')} className="flex items-center space-x-2">
          <Plus className="h-4 w-4 mr-1" />
          <span>Create New SEO Page</span>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by slug or title..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        {loading ? (
          <div className="py-8 text-center text-muted-foreground">Loading...</div>
        ) : error ? (
          <div className="py-8 text-center text-red-500">{error}</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Slug</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Published</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPages.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    SEO pages not found
                  </TableCell>
                </TableRow>
              ) : (
                filteredPages.map((page) => (
                  <TableRow key={page.id}>
                    <TableCell className="font-mono text-sm">{page.slug}</TableCell>
                    <TableCell>{page.title}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        page.published 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {page.published ? 'Published' : 'Draft'}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(page.updatedAt).toLocaleString()}</TableCell>
                    <TableCell className="space-x-2 flex">
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => setPreviewData(page)} 
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => navigate(`/admin/settings/seo/${page.id}`)} 
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => handleDelete(page)} 
                        disabled={deletingId === page.id} 
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
      
      {/* Preview Dialog */}
      <Dialog open={!!previewData} onOpenChange={() => setPreviewData(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Preview: {previewData?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">SEO Details</h4>
              <div className="space-y-2 text-sm">
                <div><strong>Slug:</strong> {previewData?.slug}</div>
                <div><strong>Title:</strong> {previewData?.title}</div>
                <div><strong>Description:</strong> {previewData?.description || 'Not set'}</div>
                <div><strong>Keywords:</strong> {previewData?.keywords || 'Not set'}</div>
                <div><strong>Published:</strong> {previewData?.published ? 'Yes' : 'No'}</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Social Media</h4>
              <div className="space-y-2 text-sm">
                <div><strong>OG Title:</strong> {previewData?.ogTitle || 'Not set'}</div>
                <div><strong>OG Description:</strong> {previewData?.ogDescription || 'Not set'}</div>
                <div><strong>OG Image:</strong> {previewData?.ogImageUrl || 'Not set'}</div>
                <div><strong>Twitter Card:</strong> {previewData?.twitterCard || 'Not set'}</div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.show} onOpenChange={(open) => !open && setDeleteDialog({ show: false, page: null })}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <span>Delete SEO Page</span>
            </DialogTitle>
            <DialogDescription className="pt-4">
              Are you sure you want to delete the SEO page <strong>"{deleteDialog.page?.title}"</strong>?
              <br /><br />
              This action cannot be undone. The SEO page will be permanently removed from the system.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteDialog({ show: false, page: null })}
              disabled={deletingId === deleteDialog.page?.id}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={confirmDelete}
              disabled={deletingId === deleteDialog.page?.id}
            >
              {deletingId === deleteDialog.page?.id ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}


