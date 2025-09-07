
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Plus, Edit, Trash2, ChevronDown, ChevronRight, Search, HelpCircle, Eye, EyeOff } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Use VITE_API_URL for backend base URL
const API_BASE = import.meta.env.VITE_API_URL;
const API_URL = `${API_BASE}/api/admin/faqs`;

// Form validation schema
interface FaqFormData {
  question: string;
  answer: string;
  category: string;
  status: 'published' | 'draft';
}

export default function Faqs() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [editingFaq, setEditingFaq] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [categoryInput, setCategoryInput] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FaqFormData>({
    defaultValues: {
      question: '',
      answer: '',
      category: '',
      status: 'published',
    },
  });

  const watchedCategory = watch('category');

  // Fetch FAQs from API
  const fetchFaqs = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (categoryFilter && categoryFilter !== 'all') params.append('category', categoryFilter);
      const res = await fetch(`${API_URL}?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      if (data.code === 0) {
        setFaqs(data.result);
      } else {
        setError('Failed to load FAQs');
      }
    } catch (e) {
      setError('Failed to load FAQs');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFaqs();
    // eslint-disable-next-line
  }, [search, categoryFilter]);

  // Extract unique categories (case-insensitive, trimmed)
  const categories = Array.from(
    new Set(faqs.map((f: any) => f.category?.toLowerCase().trim()).filter(Boolean))
  ).map(
    (cat) => faqs.find((f: any) => f.category?.toLowerCase().trim() === cat)?.category || cat
  );

  // Summary stats
  const stats = {
    total: faqs.length,
    published: faqs.filter((f: any) => f.status === 'published').length,
    draft: faqs.filter((f: any) => f.status === 'draft').length,
    categories: categories.length,
  };

  // Filtered categories for dropdown
  const filteredCategories = categories.filter(
    (cat) =>
      cat.toLowerCase().includes(categoryInput.toLowerCase()) &&
      cat.toLowerCase() !== categoryInput.toLowerCase()
  );

  // Form submission handler
  const onSubmit = async (formData: FaqFormData) => {
    try {
      const token = localStorage.getItem('token');
      let res, data;
      
      if (editingFaq) {
        res = await fetch(`${API_URL}/${editingFaq.id}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });
        data = await res.json();
        if (data.code === 0) {
          toast({ title: 'FAQ Updated', description: 'The FAQ has been updated successfully.' });
        } else {
          throw new Error(data.error || 'Failed to update FAQ');
        }
      } else {
        res = await fetch(API_URL, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });
        data = await res.json();
        if (data.code === 0) {
          toast({ title: 'FAQ Created', description: 'The FAQ has been created successfully.' });
        } else {
          throw new Error(data.error || 'Failed to create FAQ');
        }
      }
      
      setShowDialog(false);
      setEditingFaq(null);
      reset();
      setCategoryInput('');
      fetchFaqs();
    } catch (e: any) {
      toast({ title: 'Error', description: e.message || 'Failed to save FAQ.' });
    }
  };

  // Edit FAQ
  const handleEdit = (faq: any) => {
    setEditingFaq(faq);
    setValue('question', faq.question);
    setValue('answer', faq.answer);
    setValue('category', faq.category);
    setValue('status', faq.status);
    setCategoryInput(faq.category);
    setShowDialog(true);
  };

  // Delete FAQ
  const handleDelete = async (faqId: string) => {
    if (!window.confirm('Are you sure you want to delete this FAQ?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/${faqId}`, { 
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      if (data.code === 0) {
        toast({ title: 'FAQ Deleted', description: 'The FAQ has been deleted successfully.' });
        fetchFaqs();
      } else {
        throw new Error(data.error || 'Failed to delete FAQ');
      }
    } catch (e: any) {
      toast({ title: 'Error', description: e.message || 'Failed to delete FAQ.' });
    }
  };

  // Toggle Publish/Draft
  const togglePublish = async (faq: any) => {
    const newStatus = faq.status === 'published' ? 'draft' : 'published';
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/${faq.id}/status`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.code === 0) {
        toast({
          title: `FAQ ${newStatus === 'published' ? 'Published' : 'Unpublished'}`,
          description: `The FAQ has been ${newStatus === 'published' ? 'published' : 'unpublished'} successfully.`,
        });
        fetchFaqs();
      } else {
        throw new Error(data.error || 'Failed to update status');
      }
    } catch (e: any) {
      toast({ title: 'Error', description: e.message || 'Failed to update status.' });
    }
  };

  // Handle dialog close
  const handleDialogClose = () => {
    setShowDialog(false);
    setEditingFaq(null);
    reset();
    setCategoryInput('');
  };

  // UI
  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <HelpCircle className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total FAQs</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-5 w-5 bg-green-600 rounded-full"></div>
              <div>
                <p className="text-sm text-muted-foreground">Published</p>
                <p className="text-2xl font-bold">{stats.published}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-5 w-5 bg-yellow-600 rounded-full"></div>
              <div>
                <p className="text-sm text-muted-foreground">Drafts</p>
                <p className="text-2xl font-bold">{stats.draft}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-5 w-5 bg-purple-600 rounded-full"></div>
              <div>
                <p className="text-sm text-muted-foreground">Categories</p>
                <p className="text-2xl font-bold">{stats.categories}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* FAQs Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>FAQ Management</span>
            <Button onClick={() => {
              setShowDialog(true);
              setEditingFaq(null);
              reset();
              setCategoryInput('');
            }} className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add FAQ</span>
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search FAQs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={categoryFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCategoryFilter('all')}
              >
                All
              </Button>
              {categories.map(category => (
                <Button
                  key={category}
                  variant={categoryFilter === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCategoryFilter(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading FAQs...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-600">{error}</div>
          ) : faqs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <HelpCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium">No FAQs found</p>
              <p className="text-sm">Create your first FAQ to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {faqs.map((faq: any) => (
                <Card key={faq.id} className="border-l-4 border-l-blue-500">
                  <Collapsible
                    open={expandedFaq === faq.id}
                    onOpenChange={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                  >
                    <CollapsibleTrigger className="w-full">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {expandedFaq === faq.id ? (
                              <ChevronDown className="h-5 w-5 text-muted-foreground" />
                            ) : (
                              <ChevronRight className="h-5 w-5 text-muted-foreground" />
                            )}
                            <div className="text-left">
                              <p className="font-medium">{faq.question}</p>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge variant="secondary">{faq.category}</Badge>
                                <Badge variant={faq.status === 'published' ? 'default' : 'secondary'}>
                                  {faq.status === 'published' ? 'Published' : 'Draft'}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(faq);
                              }}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                togglePublish(faq);
                              }}
                              className="h-8 w-8 p-0"
                            >
                              {faq.status === 'published' ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(faq.id);
                              }}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CardContent className="pt-0">
                        <div className="bg-muted/50 p-4 rounded-lg">
                          <p className="text-sm text-muted-foreground mb-2">Answer:</p>
                          <p>{faq.answer}</p>
                        </div>
                        <div className="flex justify-between items-center mt-3 text-sm text-muted-foreground">
                          <span>Created: {new Date(faq.createdAt).toLocaleDateString()}</span>
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit FAQ Dialog */}
      <Dialog open={showDialog} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingFaq ? 'Edit FAQ' : 'Add New FAQ'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="question">Question *</Label>
              <Input
                id="question"
                {...register('question', { 
                  required: 'Question is required',
                  minLength: { value: 10, message: 'Question must be at least 10 characters' }
                })}
                placeholder="Enter the FAQ question"
                className={errors.question ? 'border-red-500' : ''}
              />
              {errors.question && (
                <p className="text-sm text-red-500">{errors.question.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="answer">Answer *</Label>
              <Textarea
                id="answer"
                {...register('answer', { 
                  required: 'Answer is required',
                  minLength: { value: 20, message: 'Answer must be at least 20 characters' }
                })}
                placeholder="Enter the detailed answer"
                rows={4}
                className={errors.answer ? 'border-red-500' : ''}
              />
              {errors.answer && (
                <p className="text-sm text-red-500">{errors.answer.message}</p>
              )}
            </div>

            <div className="space-y-2 relative">
              <Label htmlFor="category">Category *</Label>
              <Input
                id="category"
                {...register('category', { 
                  required: 'Category is required',
                  minLength: { value: 2, message: 'Category must be at least 2 characters' }
                })}
                placeholder="e.g., Getting Started, Billing, Technical"
                autoComplete="off"
                onFocus={() => setShowCategoryDropdown(true)}
                onBlur={() => setTimeout(() => setShowCategoryDropdown(false), 150)}
                onChange={(e) => {
                  setValue('category', e.target.value);
                  setCategoryInput(e.target.value);
                  setShowCategoryDropdown(true);
                }}
                className={errors.category ? 'border-red-500' : ''}
              />
              {showCategoryDropdown && filteredCategories.length > 0 && (
                <div className="absolute z-10 bg-background border rounded-md shadow-lg w-full mt-1 max-h-40 overflow-auto">
                  {filteredCategories.map((cat) => (
                    <div
                      key={cat}
                      className="px-3 py-2 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors"
                      onMouseDown={() => {
                        setValue('category', cat);
                        setCategoryInput(cat);
                        setShowCategoryDropdown(false);
                      }}
                    >
                      {cat}
                    </div>
                  ))}
                </div>
              )}
              {errors.category && (
                <p className="text-sm text-red-500">{errors.category.message}</p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="published"
                {...register('status')}
                onChange={(e) => setValue('status', e.target.checked ? 'published' : 'draft')}
                className="rounded border-gray-300"
              />
              <Label htmlFor="published">Publish immediately</Label>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleDialogClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : (editingFaq ? 'Update' : 'Create') + ' FAQ'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
