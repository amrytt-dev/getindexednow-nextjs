import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { useNavigate } from 'react-router-dom';
import { getAllEmailTemplates, deleteEmailTemplate } from '@/utils/emailTemplatesApi';
import { toast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Plus, Edit, Trash2, Search, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function EmailTemplatesList() {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState('');
  const [search, setSearch] = useState('');
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const [previewSubject, setPreviewSubject] = useState<string>('');

  const fetchTemplates = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAllEmailTemplates();
      setTemplates(data);
    } catch (e: any) {
      setError(e.message || 'Failed to load templates');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this template?')) return;
    setDeletingId(id);
    try {
      await deleteEmailTemplate(id);
      toast({ title: 'Deleted', description: 'Template deleted.' });
      fetchTemplates();
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    }
    setDeletingId('');
  };

  // Filter templates by subject or html
  const filteredTemplates = templates.filter((template: any) => {
    const searchLower = search.toLowerCase();
    return (
      template.subject.toLowerCase().includes(searchLower) ||
      (template.rawHtml && template.rawHtml.toLowerCase().includes(searchLower))
    );
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Email Templates</CardTitle>
        <Button onClick={() => navigate('/admin/settings/email-templates/create')} className="flex items-center space-x-2">
          <Plus className="h-4 w-4 mr-1" />
          <span>Create New Email Template</span>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by subject or HTML..."
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
                <TableHead>Subject</TableHead>
                <TableHead>Is Active</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTemplates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                    Email templates not found
                  </TableCell>
                </TableRow>
              ) : (
                filteredTemplates.map((template: any) => (
                  <TableRow key={template.id}>
                    <TableCell>{template.subject}</TableCell>
                    <TableCell>{template.isActive ? 'Yes' : 'No'}</TableCell>
                    <TableCell>{new Date(template.createdAt).toLocaleString()}</TableCell>
                    <TableCell className="space-x-2 flex">
                      <Button size="icon" variant="ghost" onClick={() => {
                        setPreviewHtml(template.rawHtml);
                        setPreviewSubject(template.subject);
                      }} className="h-8 w-8 p-0">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => navigate(`/admin/settings/email-templates/${template.id}`)} className="h-8 w-8 p-0">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => handleDelete(template.id)} disabled={deletingId === template.id} className="h-8 w-8 p-0 text-red-600 hover:text-red-700">
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
      <Dialog open={!!previewHtml} onOpenChange={() => setPreviewHtml(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Preview: {previewSubject}</DialogTitle>
          </DialogHeader>
          <div className="border rounded bg-white  p-4 min-h-[240px] h-full overflow-auto shadow-inner">
            {/* For security, consider sanitizing HTML with DOMPurify if you allow user HTML input. */}
            <div dangerouslySetInnerHTML={{ __html: previewHtml || '' }} />
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
} 