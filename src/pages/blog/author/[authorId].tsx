import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  LucideBookOpen,
  LucideArrowLeft,
  LucideArrowRight,
  LucideCalendar,
  LucideClock,
  LucideTag,
  LucideUser,
  LucideLoader2,
  LucideChevronLeft,
  LucideChevronRight,
  LucideEye,
  LucideFileText,
  LucideMail,
  LucideCheck,
  LucideSearch,
  LucideFilter,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { blogApi, type BlogPost } from "@/utils/blogApi";
import {
  AuthorPageSkeleton,
  BlogPostGridSkeleton,
} from "@/components/BlogSkeleton";

export default function AuthorPage() {
  const router = useRouter();
  const { authorId } = router.query;
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [author, setAuthor] = useState<BlogPost["author"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalPosts: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch author and posts
  const fetchAuthorPosts = useCallback(async () => {
    if (!authorId || typeof authorId !== "string") return;

    try {
      setLoading(true);
      setError(null);

      const response = await blogApi.getPostsByAuthor(authorId, {
        page: currentPage,
        search: debouncedSearchQuery,
      });

      setPosts(response.posts);
      setPagination(response.pagination);

      // Get author info from first post
      if (response.posts.length > 0 && response.posts[0].author) {
        setAuthor(response.posts[0].author);
      }
    } catch (err) {
      console.error("Error fetching author posts:", err);
      setError("Failed to load author posts. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [authorId, currentPage, debouncedSearchQuery]);

  useEffect(() => {
    fetchAuthorPosts();
  }, [fetchAuthorPosts]);

  // Reset page when search changes
  useEffect(() => {
    if (debouncedSearchQuery !== searchQuery) {
      setCurrentPage(1);
    }
  }, [debouncedSearchQuery, searchQuery]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  if (loading) {
    return <AuthorPageSkeleton />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => router.push("/blog")}>
            <LucideArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Button>
        </div>
      </div>
    );
  }

  if (!author) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Author Not Found</h1>
          <p className="text-gray-600 mb-6">
            The author you're looking for doesn't exist.
          </p>
          <Button onClick={() => router.push("/blog")}>
            <LucideArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Author Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/blog")}
            className="mr-4"
          >
            <LucideArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Button>
        </div>

        <Card className="p-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            <Avatar className="h-24 w-24">
              <AvatarImage
                src={author.avatar || "/placeholder-avatar.jpg"}
                alt={author.name}
              />
              <AvatarFallback>
                <LucideUser className="h-12 w-12" />
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">{author.name}</h1>
              {author.bio && (
                <p className="text-gray-600 mb-4 max-w-2xl">{author.bio}</p>
              )}

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <LucideFileText className="h-4 w-4 mr-1" />
                  {pagination.totalPosts} posts
                </div>
                {author.email && (
                  <div className="flex items-center">
                    <LucideMail className="h-4 w-4 mr-1" />
                    {author.email}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-8"
      >
        <Card className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <LucideSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search posts by this author..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Posts Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {posts.length === 0 ? (
          <Card className="p-12 text-center">
            <LucideBookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No posts found</h3>
            <p className="text-gray-600">
              {searchQuery
                ? "No posts match your search criteria."
                : "This author hasn't published any posts yet."}
            </p>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {posts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow">
                  {post.featuredImage && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <LucideCalendar className="h-4 w-4 mr-1" />
                      {formatDate(post.publishedAt)}
                      <span className="mx-2">•</span>
                      <LucideClock className="h-4 w-4 mr-1" />
                      {getReadingTime(post.content)} min read
                    </div>

                    <h3 className="text-xl font-semibold mb-3 line-clamp-2">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="hover:text-primary transition-colors"
                      >
                        {post.title}
                      </Link>
                    </h3>

                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>

                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.slice(0, 3).map((tag) => (
                          <Badge
                            key={tag.id}
                            variant="secondary"
                            className="text-xs"
                          >
                            <LucideTag className="h-3 w-3 mr-1" />
                            {tag.name}
                          </Badge>
                        ))}
                        {post.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{post.tags.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <LucideEye className="h-4 w-4 mr-1" />
                        {post.views || 0} views
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/blog/${post.slug}`}>
                          Read More
                          <LucideArrowRight className="h-4 w-4 ml-1" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!pagination.hasPrevPage}
            >
              <LucideChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>

            <div className="flex items-center space-x-1">
              {Array.from(
                { length: pagination.totalPages },
                (_, i) => i + 1
              ).map((page) => (
                <Button
                  key={page}
                  variant={page === currentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                  className="w-10"
                >
                  {page}
                </Button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!pagination.hasNextPage}
            >
              Next
              <LucideChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
