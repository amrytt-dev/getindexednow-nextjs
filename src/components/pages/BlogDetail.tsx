import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  LucideBookOpen,
  LucideArrowLeft,
  LucideArrowRight,
  LucideCalendar,
  LucideClock,
  LucideTag,
  LucideShare2,
  LucideBookmark,
  LucideUser,
  LucideLoader2,
  LucideChevronLeft,
  LucideChevronRight,
  LucideMessageSquare,
  LucideHeart,
  LucideEye,
  LucideFileText,
  LucideMail,
  LucideCheck,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { blogApi, type BlogPost } from "@/utils/blogApi";
import { BlogDetailSkeleton } from "@/components/BlogSkeleton";

export const BlogDetail = () => {
  const router = useRouter();
  const slug = router.query.slug as string | undefined;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [toc, setToc] = useState<
    Array<{ id: string; text: string; level: number }>
  >([]);
  const [contentHtml, setContentHtml] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;

      try {
        setLoading(true);
        setError(null);

        const response = await blogApi.getPostBySlug(slug);
        setPost(response.post);

        // Build Table of Contents and inject stable heading ids
        const slugify = (text: string) =>
          text
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-");

        try {
          const parser = new DOMParser();
          const doc = parser.parseFromString(
            response.post.content || "",
            "text/html"
          );
          const usedIds = new Set<string>();
          const entries: Array<{ id: string; text: string; level: number }> =
            [];
          const headings = Array.from(
            doc.body.querySelectorAll("h1, h2, h3")
          ) as HTMLElement[];
          headings.forEach((h) => {
            const text = h.textContent || "";
            let id = h.id || slugify(text);
            let base = id;
            let i = 1;
            while (!id || usedIds.has(id)) {
              id = base ? `${base}-${i++}` : `section-${i++}`;
            }
            h.id = id;
            usedIds.add(id);
            const level = Number(h.tagName.substring(1));
            entries.push({ id, text, level });
          });
          setToc(entries);
          setContentHtml(doc.body.innerHTML);
        } catch (_) {
          setToc([]);
          setContentHtml(response.post.content || "");
        }

        // Fetch related posts (same category)
        const relatedResponse = await blogApi.getPosts({
          category: response.post.category.slug,
          limit: 3,
          status: "published",
        });
        setRelatedPosts(
          relatedResponse.posts.filter((p) => p.id !== response.post.id)
        );
      } catch (err) {
        console.error("Error fetching blog post:", err);
        setError("Blog post not found or failed to load.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  // Helper functions
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };
  const handleTocClick = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const getAuthorName = (author: BlogPost["author"]) => {
    if (author.firstName && author.lastName) {
      return `${author.firstName} ${author.lastName}`;
    }
    return author.firstName || author.lastName || "Anonymous";
  };

  const getAuthorInitials = (author: BlogPost["author"]) => {
    if (author.firstName && author.lastName) {
      return `${author.firstName[0]}${author.lastName[0]}`;
    }
    return (author.firstName || author.lastName || "A")[0];
  };

  if (loading) {
    return <BlogDetailSkeleton />;
  }

  if (error || !post) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="text-2xl font-bold mb-4">Blog Post Not Found</h1>
          <p className="text-foreground/70 mb-6">
            {error || "The blog post you are looking for does not exist."}
          </p>
          <Link href="/blog">
            <Button>
              <LucideArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background">
      {/* Header */}
      <section className="relative py-8 md:py-12 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Breadcrumbs moved below into content area */}

            <div className="max-w-7xl mx-auto">
              <div className="flex items-center gap-2 mb-4">
                <Badge className="bg-primary/10 text-primary border-0">
                  {post.category.name}
                </Badge>
                {post.featured && (
                  <Badge className="bg-secondary/10 text-secondary border-0">
                    Featured
                  </Badge>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                {post.title}
              </h1>

              <p className="text-lg text-foreground/70 mb-8 leading-relaxed">
                {post.excerpt}
              </p>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Link
                    href={`/blog/author/${post.author.id}`}
                    className="flex items-center gap-4 hover:opacity-80 transition-opacity"
                  >
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="text-lg">
                        {getAuthorInitials(post.author)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {getAuthorName(post.author)}
                      </p>
                      <p className="text-sm text-foreground/60">Author</p>
                    </div>
                  </Link>
                </div>

                <div className="flex items-center gap-6 text-sm text-foreground/60">
                  <div className="flex items-center gap-2">
                    <LucideCalendar className="h-4 w-4" />
                    <span>
                      Published:{" "}
                      {formatDate(post.publishDate || post.createdAt)}
                    </span>
                  </div>
                  {post.updatedAt &&
                    post.updatedAt !== post.publishDate &&
                    post.updatedAt !== post.createdAt && (
                      <div className="flex items-center gap-2">
                        <LucideCalendar className="h-4 w-4" />
                        <span>Updated: {formatDate(post.updatedAt)}</span>
                      </div>
                    )}
                  <div className="flex items-center gap-2">
                    <LucideClock className="h-4 w-4" />
                    <span>{post.readTime} min read</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <LucideEye className="h-4 w-4" />
                    <span>{post.viewCount} views</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {/* Breadcrumbs */}
            <nav
              className="text-sm text-foreground/60 mb-4"
              aria-label="Breadcrumb"
            >
              <ol className="flex items-center gap-2">
                <li>
                  <Link
                    href="/"
                    className="hover:text-foreground transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li className="opacity-60">/</li>
                <li>
                  <Link
                    href="/blog"
                    className="hover:text-foreground transition-colors"
                  >
                    Blogs
                  </Link>
                </li>
                <li className="opacity-60">/</li>
                <li className="text-foreground line-clamp-1 max-w-[70vw] md:max-w-[50vw]">
                  {post.title}
                </li>
              </ol>
            </nav>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Article Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="lg:col-span-2"
              >
                {/* Cover Image */}
                <div className="relative rounded-xl overflow-hidden mb-8">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-[400px] object-cover"
                  />
                </div>

                {/* Article Body */}
                <div className="blog-content prose-lg max-w-none">
                  <div
                    className="text-foreground leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: contentHtml || post.content,
                    }}
                  />
                </div>

                {/* Tags */}
                {post.tags.length > 0 && (
                  <div className="mt-8 pt-8 border-t border-border">
                    <h3 className="text-lg font-semibold mb-4">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <Badge
                          key={tag.id}
                          variant="outline"
                          className="text-sm"
                        >
                          <LucideTag className="mr-1 h-3 w-3" />
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Share and Actions */}
                <div className="mt-8 pt-8 border-t border-border">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <Button variant="outline" size="sm">
                        <LucideShare2 className="mr-2 h-4 w-4" />
                        Share
                      </Button>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-foreground/60">
                      <span>
                        Published:{" "}
                        {formatDate(post.publishDate || post.createdAt)}
                      </span>
                      {post.updatedAt &&
                        post.updatedAt !== post.publishDate &&
                        post.updatedAt !== post.createdAt && (
                          <span>Updated: {formatDate(post.updatedAt)}</span>
                        )}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Sidebar */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="lg:col-span-1"
              >
                <div className="sticky top-24 space-y-8">
                  {/* Table of Contents */}
                  {toc.length > 0 && (
                    <div className="bg-card border border-border rounded-lg shadow-sm p-6">
                      <h3 className="text-lg font-bold mb-4">Contents</h3>
                      <nav className="space-y-1">
                        {toc.map((item) => (
                          <button
                            key={item.id}
                            onClick={handleTocClick(item.id)}
                            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                              item.level === 2
                                ? "pl-6"
                                : item.level === 3
                                ? "pl-9"
                                : ""
                            } text-foreground/70 hover:bg-muted/50 hover:text-foreground`}
                          >
                            {item.text}
                          </button>
                        ))}
                      </nav>

                      <div className="mt-8 p-4 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg">
                        <h4 className="font-medium text-primary mb-2">
                          Need Help?
                        </h4>
                        <p className="text-sm text-foreground/70 mb-3">
                          If you have questions about this article, please
                          contact us.
                        </p>
                        <a
                          href="/contact-us"
                          className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                        >
                          Contact Our Team
                          <LucideArrowRight className="ml-1 h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Newsletter Signup */}
                  <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-6">
                    <h3 className="text-lg font-bold mb-2">
                      Subscribe to Our Newsletter
                    </h3>
                    <p className="text-sm text-foreground/70 mb-4">
                      Get the latest articles and resources sent straight to
                      your inbox.
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
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogDetail;
