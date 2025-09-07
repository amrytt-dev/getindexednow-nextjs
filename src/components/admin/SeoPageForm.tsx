import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useNavigate, useParams } from 'react-router-dom';
import { getWithAuth, postWithAuth, putWithAuth, deleteWithAuth } from '@/utils/fetchWithAuth';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Save, Trash2, X, AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

type FormState = {
  slug: string;
  title: string;
  keywords?: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImageUrl?: string;
  twitterCard?: string;
  canonicalUrl?: string;
  metaRobots?: string;
  jsonLd?: string; // JSON string in textarea
  published: boolean;
};

export default function SeoPageForm() {
  const { id } = useParams();
  const isCreate = id === 'create';
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>({ slug: '', title: '', published: false });
  const [loading, setLoading] = useState(!isCreate);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (isCreate) return;
    setLoading(true);
    setError('');
    (async () => {
      try {
        const data = await getWithAuth<any>(`/admin/seo-pages/${id}`);
        setForm({
          slug: data.slug || '',
          title: data.title || '',
          keywords: data.keywords || '',
          description: data.description || '',
          ogTitle: data.ogTitle || '',
          ogDescription: data.ogDescription || '',
          ogImageUrl: data.ogImageUrl || '',
          twitterCard: data.twitterCard || '',
          canonicalUrl: data.canonicalUrl || '',
          metaRobots: data.metaRobots || '',
          jsonLd: data.jsonLd ? JSON.stringify(data.jsonLd, null, 2) : '',
          published: !!data.published,
        });
      } catch (e: any) {
        setError(e.message || 'Failed to load SEO page');
      } finally {
        setLoading(false);
      }
    })();
  }, [id, isCreate]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.slug || !form.title) {
      toast({ title: 'Error', description: 'Slug and title are required', variant: 'destructive' });
      return;
    }

    setSaving(true);
    setError('');
    try {
      const payload: any = {
        ...form,
        jsonLd: form.jsonLd ? JSON.parse(form.jsonLd) : null,
      };
      
      if (isCreate) {
        await postWithAuth('/admin/seo-pages', payload);
        toast({ title: 'Created', description: 'SEO page created successfully.' });
      } else {
        await putWithAuth(`/admin/seo-pages/${id}`, payload);
        toast({ title: 'Updated', description: 'SEO page updated successfully.' });
      }
      navigate('/admin/settings/seo');
    } catch (e: any) {
      setError(e.message || 'Failed to save SEO page');
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (isCreate) return;
    setDeleting(true);
    try {
      await deleteWithAuth(`/admin/seo-pages/${id}`);
      toast({ title: 'Deleted', description: 'SEO page deleted successfully.' });
      navigate('/admin/settings/seo');
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    } finally {
      setDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/admin/settings/seo')}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to SEO Pages</span>
        </Button>
      </div>

      <Card>
        <form onSubmit={handleSave}>
          <CardHeader>
            <CardTitle>{isCreate ? 'Create SEO Page' : 'Edit SEO Page'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {loading ? (
              <div className="py-8 text-center text-muted-foreground">Loading...</div>
            ) : error ? (
              <div className="py-8 text-center text-red-500">{error}</div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Basic SEO Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Basic SEO</h3>
                  <div>
                    <label className="block text-sm font-medium mb-1">Slug *</label>
                    <Input 
                      value={form.slug} 
                      onChange={e => setForm({ ...form, slug: e.target.value })} 
                      placeholder="e.g., home, about-us, contact"
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Title *</label>
                    <Input 
                      value={form.title} 
                      onChange={e => setForm({ ...form, title: e.target.value })} 
                      placeholder="Page title"
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <Textarea 
                      value={form.description || ''} 
                      onChange={e => setForm({ ...form, description: e.target.value })} 
                      placeholder="Meta description for search engines"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Keywords</label>
                    <Input 
                      value={form.keywords || ''} 
                      onChange={e => setForm({ ...form, keywords: e.target.value })} 
                      placeholder="keyword1, keyword2, keyword3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Canonical URL</label>
                    <Input 
                      value={form.canonicalUrl || ''} 
                      onChange={e => setForm({ ...form, canonicalUrl: e.target.value })} 
                      placeholder="https://example.com/page"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Meta Robots</label>
                    <Input 
                      value={form.metaRobots || ''} 
                      onChange={e => setForm({ ...form, metaRobots: e.target.value })} 
                      placeholder="index,follow"
                    />
                  </div>
                </div>

                {/* Social Media Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Social Media</h3>
                  <div>
                    <label className="block text-sm font-medium mb-1">OG Title</label>
                    <Input 
                      value={form.ogTitle || ''} 
                      onChange={e => setForm({ ...form, ogTitle: e.target.value })} 
                      placeholder="Open Graph title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">OG Description</label>
                    <Textarea 
                      value={form.ogDescription || ''} 
                      onChange={e => setForm({ ...form, ogDescription: e.target.value })} 
                      placeholder="Open Graph description"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">OG Image URL</label>
                    <Input 
                      value={form.ogImageUrl || ''} 
                      onChange={e => setForm({ ...form, ogImageUrl: e.target.value })} 
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Twitter Card</label>
                    <Input 
                      value={form.twitterCard || ''} 
                      onChange={e => setForm({ ...form, twitterCard: e.target.value })} 
                      placeholder="summary or summary_large_image"
                    />
                  </div>
                </div>

                {/* JSON-LD Section - Full Width */}
                <div className="lg:col-span-2 space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Structured Data (JSON-LD)</h3>
                  <div>
                    <label className="block text-sm font-medium mb-1">JSON-LD Schema</label>
                    <Textarea 
                      value={form.jsonLd || ''} 
                      onChange={e => setForm({ ...form, jsonLd: e.target.value })} 
                      placeholder='{"@context": "https://schema.org", "@type": "WebPage", "name": "Page Title"}'
                      rows={6}
                      className="font-mono text-sm"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Enter valid JSON-LD structured data for search engines
                    </p>
                  </div>
                </div>

                {/* Published Status */}
                <div className="lg:col-span-2">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={form.published} 
                      onCheckedChange={(checked) => setForm({ ...form, published: checked })} 
                      id="published" 
                    />
                    <label htmlFor="published" className="text-sm font-medium">Published</label>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Published pages will be accessible via their slug URL
                  </p>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="flex space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/admin/settings/seo')}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              {!isCreate && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              )}
            </div>
            <Button type="submit" disabled={saving || loading || !!error}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <span>Delete SEO Page</span>
            </DialogTitle>
            <DialogDescription className="pt-4">
              Are you sure you want to delete the SEO page <strong>"{form.title}"</strong>?
              <br /><br />
              This action cannot be undone. The SEO page will be permanently removed from the system.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}


