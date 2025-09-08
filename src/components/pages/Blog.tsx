import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  LucideBookOpen,
  LucideSearch,
  LucideArrowRight,
  LucideUser,
  LucideCalendar,
  LucideClock,
  LucideTag,
  LucideMessageSquare,
  LucideShare2,
  LucideBookmark,
  LucideX,
  LucideChevronLeft,
  LucideChevronRight,
  LucideRss,
  LucideMail,
  LucideLoader2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { blogApi, type BlogPost, type BlogCategory } from "@/utils/blogApi";
import {
  BlogListSkeleton,
  BlogPostGridSkeleton,
} from "@/components/BlogSkeleton";

interface BlogProps {
  initialPosts?: BlogPost[];
  initialCategories?: BlogCategory[];
  initialPopular?: BlogPost[];
  initialFeatured?: BlogPost | null;
}

export const Blog = ({
  initialPosts,
  initialCategories,
  initialPopular,
  initialFeatured,
}: BlogProps = {}) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [popularPosts, setPopularPosts] = useState<BlogPost[]>([]);
  const [featuredPost, setFeaturedPost] = useState<BlogPost | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const postsPerPage = 6;

  // Fetch initial data
  useEffect(() => {
    const hasInitial = !!(
      initialPosts ||
      initialCategories ||
      initialPopular ||
      initialFeatured
    );
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        if (hasInitial) {
          const p = initialPosts || [];
          setPosts(p);
          setFilteredPosts(p);
          setCategories(initialCategories || []);
          setPopularPosts(initialPopular || []);
          setFeaturedPost(initialFeatured || null);
        } else {
          // Fetch all data in parallel
          const [
            postsResponse,
            categoriesResponse,
            popularResponse,
            featuredResponse,
          ] = await Promise.all([
            blogApi.getPosts({ limit: 50, status: "published" }), // Explicitly request published posts
            blogApi.getCategories(),
            blogApi.getPopularPosts(),
            blogApi.getFeaturedPosts(),
          ]);

          setPosts(postsResponse.posts);
          setFilteredPosts(postsResponse.posts);
          setCategories(categoriesResponse.categories);
          setPopularPosts(popularResponse.posts);
          setFeaturedPost(featuredResponse.posts[0] || null);
        }
      } catch (err) {
        console.error("Error fetching blog data:", err);
        setError("Failed to load blog posts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [initialPosts, initialCategories, initialPopular, initialFeatured]);

  // Filter posts based on search query, category, and tab
  useEffect(() => {
    setSearchLoading(true);

    // Simulate a small delay for better UX
    const timer = setTimeout(() => {
      let filtered = [...posts];

      // Apply search filter
      if (searchQuery) {
        filtered = filtered.filter(
          (post) =>
            post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.tags.some((tag) =>
              tag.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
        );
      }

      // Apply category filter
      if (selectedCategory) {
        filtered = filtered.filter(
          (post) => post.category.slug === selectedCategory
        );
      }

      // Apply tab filter
      if (activeTab === "featured") {
        filtered = filtered.filter((post) => post.featured);
      } else if (activeTab === "popular") {
        filtered = filtered.filter((post) => post.popular);
      }

      setFilteredPosts(filtered);
      setCurrentPage(1); // Reset to first page when filters change
      setSearchLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory, activeTab, posts]);

  // Calculate pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Format date to readable format
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Handler for category selection
  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category === selectedCategory ? null : category);
  };

  // Get author display name
  const getAuthorName = (author: BlogPost["author"]) => {
    if (author.firstName && author.lastName) {
      return `${author.firstName} ${author.lastName}`;
    }
    return author.firstName || author.lastName || "Anonymous";
  };

  // Get author initials for avatar
  const getAuthorInitials = (author: BlogPost["author"]) => {
    if (author.firstName && author.lastName) {
      return `${author.firstName[0]}${author.lastName[0]}`;
    }
    return (author.firstName || author.lastName || "A")[0];
  };

  if (loading) {
    return <BlogListSkeleton />;
  }

  if (error) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 bg-gradient-to-br from-primary/5 to-secondary/5 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center justify-center mb-6 px-4 py-1.5 text-sm font-medium rounded-full bg-primary/10 text-primary">
                <LucideBookOpen className="mr-2 h-4 w-4" />
                Blog & Resources
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Insights on{" "}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Website Indexing
                </span>{" "}
                and SEO
              </h1>
              <p className="text-lg text-foreground/70 mb-8">
                Expert tips, strategies, and news to help you get your websites
                indexed faster and improve your search engine rankings.
              </p>

              {/* Search Bar */}
              <div className="relative max-w-lg">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                  {searchLoading ? (
                    <LucideLoader2 className="h-5 w-5 text-foreground/40 animate-spin" />
                  ) : (
                    <LucideSearch className="h-5 w-5 text-foreground/40" />
                  )}
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles, topics, or tags..."
                  className="w-full pl-12 pr-4 py-3 rounded-lg border border-border bg-card shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-foreground/40 hover:text-foreground"
                  >
                    <LucideX className="h-5 w-5" />
                  </button>
                )}
              </div>
            </motion.div>

            {/* Featured Post Card */}
            {featuredPost && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="lg:ml-auto"
              >
                <a
                  href={`/blog/${featuredPost.slug}`}
                  className="block relative rounded-xl overflow-hidden group shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10 z-10"></div>
                  <img
                    src={featuredPost.coverImage}
                    alt={featuredPost.title}
                    className="w-full h-[350px] object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-20 text-white">
                    <div className="flex items-center mb-3">
                      <Badge className="bg-primary/80 hover:bg-primary text-white border-0">
                        Featured
                      </Badge>
                      <span className="mx-2 text-white/70">•</span>
                      <span className="text-sm text-white/90">
                        {formatDate(
                          featuredPost.publishDate || featuredPost.createdAt
                        )}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold mb-2 group-hover:text-primary-foreground transition-colors">
                      {featuredPost.title}
                    </h3>
                    <p className="text-white/80 line-clamp-2 mb-4">
                      {featuredPost.excerpt}
                    </p>
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-3 border-2 border-white/30">
                        <AvatarFallback>
                          {getAuthorInitials(featuredPost.author)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-white">
                          {getAuthorName(featuredPost.author)}
                        </p>
                        <p className="text-xs text-white/70">Author</p>
                      </div>
                    </div>
                  </div>
                </a>
              </motion.div>
            )}
          </div>
        </div>
        <div className="absolute -z-10 top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.1),transparent_70%)]"></div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:w-1/4"
            >
              <div className="sticky top-24 space-y-8">
                {/* Categories */}
                <div className="bg-card border border-border rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-bold mb-4">Categories</h3>
                  <ul className="space-y-2">
                    {categories.map((category) => (
                      <li key={category.slug}>
                        <button
                          onClick={() => handleCategorySelect(category.slug)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${
                            selectedCategory === category.slug
                              ? "bg-primary/10 text-primary font-medium"
                              : "text-foreground/70 hover:bg-muted hover:text-foreground"
                          }`}
                        >
                          <span>{category.name}</span>
                          <span className="bg-muted rounded-full px-2 py-0.5 text-xs">
                            {category.count || 0}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Popular Posts */}
                <div className="bg-card border border-border rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-bold mb-4">Popular Articles</h3>
                  <div className="space-y-4">
                    {popularPosts.map((post) => (
                      <a
                        key={post.id}
                        href={`/blog/${post.slug}`}
                        className="flex items-start space-x-3 group"
                      >
                        <div className="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden">
                          <img
                            src={post.coverImage}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium leading-tight group-hover:text-primary transition-colors">
                            {post.title}
                          </h4>
                          <div className="flex items-center mt-1 text-xs text-foreground/60">
                            <LucideCalendar className="h-3 w-3 mr-1" />
                            <span>
                              {formatDate(post.publishDate || post.createdAt)}
                            </span>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Newsletter Signup */}
                <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-6">
                  <h3 className="text-lg font-bold mb-2">
                    Subscribe to Our Newsletter
                  </h3>
                  <p className="text-sm text-foreground/70 mb-4">
                    Get the latest articles and resources sent straight to your
                    inbox.
                  </p>
                  <div className="space-y-3">
                    <Input
                      type="email"
                      placeholder="Your email address"
                      className="w-full bg-white/50 border-white/20"
                    />
                    <Button className="w-full" variant="secondary">
                      <LucideMail className="mr-2 h-4 w-4" />
                      Subscribe
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="lg:w-3/4"
            >
              {/* Tabs & Filters */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full sm:w-auto"
                >
                  <TabsList className="h-10 p-1 bg-muted rounded-lg">
                    <TabsTrigger
                      value="all"
                      className="rounded-md px-4 py-1.5 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
                    >
                      All Posts
                    </TabsTrigger>
                    <TabsTrigger
                      value="featured"
                      className="rounded-md px-4 py-1.5 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
                    >
                      Featured
                    </TabsTrigger>
                    <TabsTrigger
                      value="popular"
                      className="rounded-md px-4 py-1.5 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
                    >
                      Popular
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                {/* Active Filters */}
                <div className="flex items-center gap-2">
                  {selectedCategory && (
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1 bg-muted/50 hover:bg-muted"
                    >
                      {categories.find((cat) => cat.slug === selectedCategory)
                        ?.name || selectedCategory}
                      <button
                        onClick={() => setSelectedCategory(null)}
                        className="ml-1 p-0.5 rounded-full hover:bg-muted-foreground/20"
                      >
                        <LucideX className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}

                  {searchQuery && (
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1 bg-muted/50 hover:bg-muted"
                    >
                      Search: {searchQuery}
                      <button
                        onClick={() => setSearchQuery("")}
                        className="ml-1 p-0.5 rounded-full hover:bg-muted-foreground/20"
                      >
                        <LucideX className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}

                  {(selectedCategory || searchQuery) && (
                    <button
                      onClick={() => {
                        setSelectedCategory(null);
                        setSearchQuery("");
                      }}
                      className="text-xs text-primary hover:underline"
                    >
                      Clear all
                    </button>
                  )}
                </div>
              </div>

              {/* Blog Post Grid */}
              {searchLoading ? (
                <BlogPostGridSkeleton count={6} />
              ) : currentPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                  {currentPosts.map((post) => (
                    <Card
                      key={post.id}
                      className="border-0 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col h-full"
                    >
                      <a href={`/blog/${post.slug}`}>
                        <div className="relative overflow-hidden aspect-video">
                          <img
                            src={post.coverImage}
                            alt={post.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-3 left-3 z-10">
                            <Badge className="bg-white/90 hover:bg-white text-foreground border-0 shadow-sm">
                              {post.category.name}
                            </Badge>
                          </div>
                        </div>
                      </a>
                      <div className="p-5 flex flex-col flex-1">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center text-xs text-foreground/60">
                            <LucideCalendar className="h-3 w-3 mr-1" />
                            <span>
                              {formatDate(post.publishDate || post.createdAt)}
                            </span>
                            <span className="mx-2">•</span>
                            <LucideClock className="h-3 w-3 mr-1" />
                            <span>{post.readTime} min read</span>
                          </div>
                        </div>
                        <a
                          href={`/blog/${post.slug}`}
                          className="hover:text-primary transition-colors"
                        >
                          <h3 className="text-lg font-bold mb-3 line-clamp-2">
                            {post.title}
                          </h3>
                        </a>
                        <p className="text-sm text-foreground/70 mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between mt-auto">
                          <a
                            href={`/blog/author/${post.author.id}`}
                            className="flex items-center hover:opacity-80 transition-opacity"
                          >
                            <Avatar className="h-8 w-8 mr-2">
                              <AvatarFallback>
                                {getAuthorInitials(post.author)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs font-medium">
                              {getAuthorName(post.author)}
                            </span>
                          </a>
                          <a
                            href={`/blog/${post.slug}`}
                            className="text-primary text-sm font-medium flex items-center"
                          >
                            Read More
                            <LucideArrowRight className="ml-1 h-3 w-3" />
                          </a>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="bg-muted/30 rounded-lg p-12 text-center">
                  <LucideSearch className="h-12 w-12 text-foreground/30 mx-auto mb-4" />
                  <h4 className="text-xl font-medium mb-2">
                    No articles found
                  </h4>
                  <p className="text-foreground/70 mb-6">
                    We couldn't find any articles matching your search criteria.
                  </p>
                  <Button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory(null);
                      setActiveTab("all");
                    }}
                    variant="default"
                  >
                    Clear Filters
                  </Button>
                </div>
              )}

              {/* Pagination */}
              {filteredPosts.length > postsPerPage && (
                <div className="flex justify-center mt-10">
                  <nav className="inline-flex items-center space-x-1">
                    <button
                      onClick={() => paginate(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded-md text-foreground/70 hover:bg-muted disabled:opacity-50 disabled:pointer-events-none"
                    >
                      <LucideChevronLeft className="h-5 w-5" />
                    </button>

                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      // Calculate the page number to display
                      let pageNum;

                      // If we have 5 or fewer pages, just show them all
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      }
                      // If we're near the start
                      else if (currentPage <= 3) {
                        pageNum = i + 1;
                      }
                      // If we're near the end
                      else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      }
                      // We're somewhere in the middle
                      else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => paginate(pageNum)}
                          className={`w-10 h-10 rounded-md ${
                            currentPage === pageNum
                              ? "bg-primary text-primary-foreground"
                              : "text-foreground/70 hover:bg-muted"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    <button
                      onClick={() =>
                        paginate(Math.min(totalPages, currentPage + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-md text-foreground/70 hover:bg-muted disabled:opacity-50 disabled:pointer-events-none"
                    >
                      <LucideChevronRight className="h-5 w-5" />
                    </button>
                  </nav>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex items-center justify-center mb-4 px-4 py-1.5 text-sm font-medium rounded-full bg-white/20 text-secondary">
              <LucideRss className="mr-2 h-4 w-4" />
              Stay Updated
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Subscribe to Our Newsletter
            </h2>
            <p className="text-foreground/70 mb-8">
              Get weekly SEO tips, indexing strategies, and industry insights
              delivered straight to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Your email address"
                className="h-12 bg-white/80 border-white/30"
              />
              <Button className="h-12" variant="secondary">
                Subscribe
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
