import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useNavigate, useParams } from 'react-router-dom';
import { getEmailTemplateById, createEmailTemplate, updateEmailTemplate } from '@/utils/emailTemplatesApi';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';

export default function EmailTemplateForm() {
  const [subject, setSubject] = useState('');
  const [html, setHtml] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  useEffect(() => {
    if (isEdit) {
      setLoading(true);
      getEmailTemplateById(id)
        .then((data) => {
          setSubject(data.subject);
          setHtml(data.rawHtml);
          setIsActive(data.isActive);
        })
        .catch((e) => setError(e.message || 'Failed to load template'))
        .finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      // Generate emailType from subject (lowercase, replace spaces with hyphens)
      const emailType = subject.toLowerCase().replace(/\s+/g, '-');
      if (isEdit) {
        await updateEmailTemplate(id, { subject, rawHtml: html, isActive, emailType });
        toast({ title: 'Updated', description: 'Template updated.' });
      } else {
        await createEmailTemplate({ subject, rawHtml: html, isActive, emailType });
        toast({ title: 'Created', description: 'Template created.' });
      }
      navigate('/admin/settings/email-templates');
    } catch (e: any) {
      setError(e.message || 'Failed to save template');
    }
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/admin/settings/email-templates')}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Email Templates</span>
        </Button>
      </div>
    
    <Card>
      <form onSubmit={handleSave}>
        <CardHeader>
          <CardTitle>{isEdit ? 'Edit Email Template' : 'Create Email Template'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <div className="py-8 text-center text-muted-foreground">Loading...</div>
          ) : error ? (
            <div className="py-8 text-center text-red-500">{error}</div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">Subject</label>
                <Input value={subject} onChange={e => setSubject(e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 mb-2">HTML</label>
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Editor */}
                  <div className="flex-1 flex flex-col">
                    <Textarea
                      value={html}
                      onChange={e => setHtml(e.target.value)}
                      rows={10}
                      required
                      placeholder="<div class='p-6 text-xl'>Welcome to GetIndexedNow</div>"
                      className="h-full min-h-[240px] resize-y"
                    />
                    <span className="text-xs text-muted-foreground mt-1">Edit your HTML here</span>
                  </div>
                  {/* Preview */}
                  <div className="flex-1 flex flex-col">
                    <div className="border rounded-md bg-white  p-4 min-h-[240px] h-full overflow-auto shadow-inner">
                      {/*
                        For security, consider sanitizing HTML with DOMPurify if you allow user HTML input.
                        import DOMPurify from 'dompurify';
                        <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }} />
                      */}
                      <div dangerouslySetInnerHTML={{ __html: html }} />
                    </div>
                    <span className="text-xs text-muted-foreground mt-1">Live Preview</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch checked={isActive} onCheckedChange={setIsActive} id="isActive" />
                <label htmlFor="isActive" className="text-sm">Is Active</label>
              </div>
            </>
          )}
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" disabled={saving || loading || !!error}>{saving ? 'Saving...' : 'Save'}</Button>
        </CardFooter>
      </form>
    </Card>
    </div>
  );
} 