import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Save, ArrowLeft, Eye, Loader2 } from "lucide-react";
import { useRouter } from "next/router";
import {
  adminBlogApi,
  type BlogPost,
  type BlogCategory,
  type BlogTag,
} from "@/utils/blogApi";

const BlogPostEditor = () => {
  const router = useRouter();
  const { id } = router.query;
  const isEditing = Boolean(id);

  const [post, setPost] = useState<Partial<BlogPost>>({
    title: "",
    excerpt: "",
    content: "",
    status: "draft",
    featuredImage: "",
    categoryId: "",
    tagIds: [],
  });
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch categories and tags
      const [categoriesRes, tagsRes] = await Promise.all([
        adminBlogApi.getCategories(),
        adminBlogApi.getTags(),
      ]);

      setCategories(categoriesRes.categories || []);
      setTags(tagsRes.tags || []);

      // Fetch post if editing
      if (isEditing && id) {
        const postRes = await adminBlogApi.getPost(id as string);
        setPost(postRes.post);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      if (isEditing && id) {
        await adminBlogApi.updatePost(id as string, post);
      } else {
        await adminBlogApi.createPost(post);
      }

      router.push("/admin/blog/posts");
    } catch (error) {
      console.error("Error saving post:", error);
    } finally {
      setSaving(false);
    }
  };

  const handlePreview = () => {
    if (post.slug) {
      window.open(`/blog/${post.slug}`, "_blank");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            {isEditing ? "Edit Post" : "Create New Post"}
          </h1>
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
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => router.push("/admin/blog/posts")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Posts
          </Button>
          <h1 className="text-2xl font-bold">
            {isEditing ? "Edit Post" : "Create New Post"}
          </h1>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={handlePreview}
            disabled={!post.slug}
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {saving ? "Saving..." : "Save Post"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Post Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={post.title}
                  onChange={(e) => setPost({ ...post, title: e.target.value })}
                  placeholder="Enter post title..."
                />
              </div>

              <div>
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={post.excerpt}
                  onChange={(e) =>
                    setPost({ ...post, excerpt: e.target.value })
                  }
                  placeholder="Enter post excerpt..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={post.content}
                  onChange={(e) =>
                    setPost({ ...post, content: e.target.value })
                  }
                  placeholder="Enter post content..."
                  rows={10}
                />
              </div>

              <div>
                <Label htmlFor="featuredImage">Featured Image URL</Label>
                <Input
                  id="featuredImage"
                  value={post.featuredImage}
                  onChange={(e) =>
                    setPost({ ...post, featuredImage: e.target.value })
                  }
                  placeholder="Enter featured image URL..."
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Post Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={post.status}
                  onValueChange={(value) =>
                    setPost({ ...post, status: value as "draft" | "published" })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={post.categoryId}
                  onValueChange={(value) =>
                    setPost({ ...post, categoryId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag) => (
                    <Badge
                      key={tag.id}
                      variant={
                        post.tagIds?.includes(tag.id) ? "default" : "outline"
                      }
                      className="cursor-pointer"
                      onClick={() => {
                        const tagIds = post.tagIds || [];
                        const newTagIds = tagIds.includes(tag.id)
                          ? tagIds.filter((id) => id !== tag.id)
                          : [...tagIds, tag.id];
                        setPost({ ...post, tagIds: newTagIds });
                      }}
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BlogPostEditor;
