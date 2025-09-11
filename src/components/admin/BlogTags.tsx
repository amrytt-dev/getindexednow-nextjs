import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { adminBlogApi, type BlogTag } from "@/utils/blogApi";
import TagDialog from "./TagDialog";
import DeleteTagDialog from "./DeleteTagDialog";

const BlogTags = () => {
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingTag, setEditingTag] = useState<BlogTag | null>(null);
  const [deletingTag, setDeletingTag] = useState<BlogTag | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      setLoading(true);
      const response = await adminBlogApi.getTags();
      setTags(response.tags || []);
    } catch (error) {
      console.error("Error fetching tags:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTag = () => {
    setEditingTag(null);
    setShowCreateDialog(true);
  };

  const handleEditTag = (tag: BlogTag) => {
    setEditingTag(tag);
    setShowCreateDialog(true);
  };

  const handleDeleteTag = (tag: BlogTag) => {
    setDeletingTag(tag);
  };

  const confirmDelete = async () => {
    if (!deletingTag) return;

    try {
      setDeleteLoading(true);
      await adminBlogApi.deleteTag(deletingTag.id);
      await fetchTags();
      setDeletingTag(null);
    } catch (error) {
      console.error("Error deleting tag:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSaveTag = async () => {
    await fetchTags();
    setShowCreateDialog(false);
    setEditingTag(null);
  };

  const filteredTags = tags.filter(
    (tag) =>
      tag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tag.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Blog Tags</h1>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Blog Tags</h1>
        <Button onClick={handleCreateTag}>
          <Plus className="h-4 w-4 mr-2" />
          Create Tag
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredTags.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">
                {searchTerm
                  ? "No tags found matching your search."
                  : "No tags created yet."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTags.map((tag) => (
                <div
                  key={tag.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-semibold">{tag.name}</h3>
                      <Badge variant="secondary">{tag.slug}</Badge>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditTag(tag)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteTag(tag)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <TagDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        tag={editingTag}
        onSave={handleSaveTag}
      />

      <DeleteTagDialog
        open={!!deletingTag}
        onOpenChange={() => setDeletingTag(null)}
        tag={deletingTag}
        onConfirm={confirmDelete}
        loading={deleteLoading}
      />
    </div>
  );
};

export default BlogTags;
