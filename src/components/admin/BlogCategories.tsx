import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { adminBlogApi, type BlogCategory } from "@/utils/blogApi";
import CategoryDialog from "./CategoryDialog";
import DeleteCategoryDialog from "./DeleteCategoryDialog";

const BlogCategories = () => {
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<BlogCategory | null>(
    null
  );
  const [deletingCategory, setDeletingCategory] = useState<BlogCategory | null>(
    null
  );
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await adminBlogApi.getCategories();
      setCategories(response.categories || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = () => {
    setEditingCategory(null);
    setShowCreateDialog(true);
  };

  const handleEditCategory = (category: BlogCategory) => {
    setEditingCategory(category);
    setShowCreateDialog(true);
  };

  const handleDeleteCategory = (category: BlogCategory) => {
    setDeletingCategory(category);
  };

  const confirmDelete = async () => {
    if (!deletingCategory) return;

    try {
      setDeleteLoading(true);
      await adminBlogApi.deleteCategory(deletingCategory.id);
      await fetchCategories();
      setDeletingCategory(null);
    } catch (error) {
      console.error("Error deleting category:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSaveCategory = async () => {
    await fetchCategories();
    setShowCreateDialog(false);
    setEditingCategory(null);
  };

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Blog Categories</h1>
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
        <h1 className="text-2xl font-bold">Blog Categories</h1>
        <Button onClick={handleCreateCategory}>
          <Plus className="h-4 w-4 mr-2" />
          Create Category
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredCategories.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">
                {searchTerm
                  ? "No categories found matching your search."
                  : "No categories created yet."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCategories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-semibold">{category.name}</h3>
                      <Badge variant="secondary">{category.slug}</Badge>
                    </div>
                    {category.description && (
                      <p className="text-sm text-gray-600 mt-1">
                        {category.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditCategory(category)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteCategory(category)}
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

      <CategoryDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        category={editingCategory}
        onSave={handleSaveCategory}
      />

      <DeleteCategoryDialog
        open={!!deletingCategory}
        onOpenChange={() => setDeletingCategory(null)}
        category={deletingCategory}
        onConfirm={confirmDelete}
        loading={deleteLoading}
      />
    </div>
  );
};

export default BlogCategories;
