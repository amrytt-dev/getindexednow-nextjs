import { fetchWithAuth } from "./fetchWithAuth";

const PUBLIC_API_BASE = process.env.NEXT_PUBLIC_API_URL || "";
const withPublicBase = (path: string) =>
  `${PUBLIC_API_BASE.replace(/\/$/, "")}${path}`;

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  seo?: any;
  status: "draft" | "published" | "archived";
  featured: boolean;
  popular: boolean;
  readTime: number;
  viewCount: number;
  publishDate?: string;
  createdAt: string;
  updatedAt: string;
  category: BlogCategory;
  tags: BlogTag[];
  author: {
    id: string;
    firstName?: string;
    lastName?: string;
    email: string;
  };
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  count?: number;
}

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
  count?: number;
}

export interface BlogQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  tag?: string;
  author?: string;
  status?: "published" | "draft" | "archived";
  featured?: boolean;
  popular?: boolean;
}

export interface BlogResponse {
  posts: BlogPost[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalPosts: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface CategoriesResponse {
  categories: BlogCategory[];
}

export interface TagsResponse {
  tags: BlogTag[];
}

export interface SinglePostResponse {
  post: BlogPost;
}

// Public Blog API (no authentication required)
export const blogApi = {
  // Get all blog posts with filtering and pagination
  getPosts: async (params: BlogQueryParams = {}): Promise<BlogResponse> => {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.append("page", params.page.toString());
    if (params.limit) searchParams.append("limit", params.limit.toString());
    if (params.search) searchParams.append("search", params.search);
    if (params.category) searchParams.append("category", params.category);
    if (params.tag) searchParams.append("tag", params.tag);
    if (params.author) searchParams.append("author", params.author);
    if (params.status) searchParams.append("status", params.status);
    if (params.featured !== undefined)
      searchParams.append("featured", params.featured.toString());
    if (params.popular !== undefined)
      searchParams.append("popular", params.popular.toString());

    const response = await fetch(
      withPublicBase(`/api/blog/posts?${searchParams.toString()}`)
    );
    if (!response.ok) {
      throw new Error("Failed to fetch blog posts");
    }
    return response.json();
  },

  // Get featured posts for banner
  getFeaturedPosts: async (): Promise<{ posts: BlogPost[] }> => {
    const response = await fetch(withPublicBase("/api/blog/featured"));
    if (!response.ok) {
      throw new Error("Failed to fetch featured posts");
    }
    return response.json();
  },

  // Get popular posts
  getPopularPosts: async (): Promise<{ posts: BlogPost[] }> => {
    const response = await fetch(withPublicBase("/api/blog/popular"));
    if (!response.ok) {
      throw new Error("Failed to fetch popular posts");
    }
    return response.json();
  },

  // Get categories with post counts
  getCategories: async (): Promise<CategoriesResponse> => {
    const response = await fetch(withPublicBase("/api/blog/categories"));
    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }
    return response.json();
  },

  // Get tags
  getTags: async (): Promise<TagsResponse> => {
    const response = await fetch(withPublicBase("/api/blog/tags"));
    if (!response.ok) {
      throw new Error("Failed to fetch tags");
    }
    return response.json();
  },

  // Get single blog post by slug
  getPostBySlug: async (slug: string): Promise<SinglePostResponse> => {
    const response = await fetch(withPublicBase(`/api/blog/posts/${slug}`));
    if (!response.ok) {
      throw new Error("Blog post not found");
    }
    return response.json();
  },
};

// Admin Blog API (requires authentication)
export const adminBlogApi = {
  // Get all blog posts (admin view - includes all statuses)
  getPosts: async (params: BlogQueryParams = {}): Promise<BlogResponse> => {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.append("page", params.page.toString());
    if (params.limit) searchParams.append("limit", params.limit.toString());
    if (params.search) searchParams.append("search", params.search);
    if (params.status) searchParams.append("status", params.status);

    return await fetchWithAuth(`/admin/blog/posts?${searchParams.toString()}`);
  },

  // Get single blog post
  getPost: async (id: string): Promise<SinglePostResponse> => {
    return await fetchWithAuth(`/admin/blog/posts/${id}`);
  },

  // Create blog post
  createPost: async (
    data: Omit<
      BlogPost,
      | "id"
      | "createdAt"
      | "updatedAt"
      | "viewCount"
      | "category"
      | "tags"
      | "author"
    > & { categoryId: string; tagIds: string[] }
  ): Promise<SinglePostResponse> => {
    return await fetchWithAuth("/admin/blog/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  },

  // Update blog post
  updatePost: async (
    id: string,
    data: Partial<
      Omit<
        BlogPost,
        | "id"
        | "createdAt"
        | "updatedAt"
        | "viewCount"
        | "category"
        | "tags"
        | "author"
      > & { categoryId?: string; tagIds?: string[] }
    >
  ): Promise<SinglePostResponse> => {
    return await fetchWithAuth(`/admin/blog/posts/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  },

  // Delete blog post
  deletePost: async (id: string): Promise<{ message: string }> => {
    return await fetchWithAuth(`/admin/blog/posts/${id}`, {
      method: "DELETE",
    });
  },

  // Get all categories
  getCategories: async (): Promise<CategoriesResponse> => {
    const res: any = await fetchWithAuth("/admin/blog/categories");
    const mapped = Array.isArray(res?.categories)
      ? res.categories.map((c: any) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          description: c.description ?? undefined,
          count: c._count?.posts ?? 0,
        }))
      : [];
    return { categories: mapped };
  },

  // Create category
  createCategory: async (data: {
    name: string;
    slug: string;
    description?: string;
  }): Promise<{ category: BlogCategory }> => {
    return await fetchWithAuth("/admin/blog/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  },

  // Update category
  updateCategory: async (
    id: string,
    data: { name: string; slug: string; description?: string }
  ): Promise<{ category: BlogCategory }> => {
    return await fetchWithAuth(`/admin/blog/categories/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  },

  // Delete category
  deleteCategory: async (id: string): Promise<{ message: string }> => {
    return await fetchWithAuth(`/admin/blog/categories/${id}`, {
      method: "DELETE",
    });
  },

  // Get all tags
  getTags: async (): Promise<TagsResponse> => {
    const res: any = await fetchWithAuth("/admin/blog/tags");
    const mapped = Array.isArray(res?.tags)
      ? res.tags.map((t: any) => ({
          id: t.id,
          name: t.name,
          slug: t.slug,
          count: t._count?.posts ?? 0,
        }))
      : [];
    return { tags: mapped };
  },

  // Create tag
  createTag: async (data: {
    name: string;
    slug: string;
  }): Promise<{ tag: BlogTag }> => {
    return await fetchWithAuth("/admin/blog/tags", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  },

  // Update tag
  updateTag: async (
    id: string,
    data: { name: string; slug: string }
  ): Promise<{ tag: BlogTag }> => {
    return await fetchWithAuth(`/admin/blog/tags/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  },

  // Delete tag
  deleteTag: async (id: string): Promise<{ message: string }> => {
    return await fetchWithAuth(`/admin/blog/tags/${id}`, {
      method: "DELETE",
    });
  },

  // Upload image
  uploadImage: async (file: File): Promise<{ url: string }> => {
    const form = new FormData();
    form.append("file", file);
    return await fetchWithAuth("/admin/blog/uploads", {
      method: "POST",
      body: form as any,
    });
  },

  // Delete image by url
  deleteImage: async (url: string): Promise<{ ok: true }> => {
    return await fetchWithAuth("/admin/blog/uploads", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
  },
};
