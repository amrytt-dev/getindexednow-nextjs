import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

// Blog Post Card Skeleton
export const BlogPostSkeleton = () => (
  <Card className="border-0 shadow-sm overflow-hidden">
    <div className="relative overflow-hidden aspect-video">
      <Skeleton className="w-full h-full" />
    </div>
    <div className="p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-3" />
          <Skeleton className="h-3 w-12" />
        </div>
      </div>
      <Skeleton className="h-6 w-full mb-3" />
      <Skeleton className="h-4 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2 mb-4" />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  </Card>
);

// Blog Post Grid Skeleton
export const BlogPostGridSkeleton = ({ count = 6 }: { count?: number }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, index) => (
      <BlogPostSkeleton key={index} />
    ))}
  </div>
);

// Author Page Skeleton
export const AuthorPageSkeleton = () => (
  <div className="bg-background min-h-screen">
    {/* Header Skeleton */}
    <section className="relative py-8 md:py-12 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumbs Skeleton */}
          <div className="flex items-center gap-2 mb-6">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-24" />
          </div>

          {/* Author Info Skeleton */}
          <div className="text-center mb-8">
            <Skeleton className="h-24 w-24 mx-auto mb-4 rounded-full" />
            <Skeleton className="h-8 w-48 mx-auto mb-2" />
            <Skeleton className="h-5 w-32 mx-auto mb-4" />
          </div>

          {/* Search Bar Skeleton */}
          <div className="max-w-md mx-auto">
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </section>

    {/* Posts Grid Skeleton */}
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Skeleton className="h-4 w-32" />
          </div>
          <BlogPostGridSkeleton count={9} />
        </div>
      </div>
    </section>
  </div>
);

// Blog Detail Page Skeleton
export const BlogDetailSkeleton = () => (
  <div className="bg-background">
    {/* Header Skeleton */}
    <section className="relative py-8 md:py-12 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-16" />
          </div>
          <Skeleton className="h-12 w-3/4 mb-6" />
          <Skeleton className="h-6 w-1/2 mb-8" />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div>
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
            <div className="flex items-center gap-6">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-14" />
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Main Content Skeleton */}
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumbs Skeleton */}
          <div className="flex items-center gap-2 mb-4">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-32" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Article Content Skeleton */}
            <div className="lg:col-span-2">
              <Skeleton className="w-full h-[400px] rounded-xl mb-8" />
              <div className="space-y-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            </div>

            {/* Sidebar Skeleton */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-8">
                <div className="bg-card border border-border rounded-lg shadow-sm p-6">
                  <Skeleton className="h-6 w-24 mb-4" />
                  <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-4 flex-1" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-6">
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <Skeleton className="h-10 w-full mb-3" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
);

// Blog List Page Skeleton
export const BlogListSkeleton = () => (
  <div className="bg-background">
    {/* Hero Section Skeleton */}
    <section className="relative py-16 md:py-24 bg-gradient-to-br from-primary/5 to-secondary/5 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Text Content Skeleton */}
          <div>
            <Skeleton className="h-6 w-32 mb-6" />
            <Skeleton className="h-12 w-3/4 mb-6" />
            <Skeleton className="h-6 w-full mb-8" />
            <Skeleton className="h-12 w-80" />
          </div>

          {/* Featured Post Card Skeleton */}
          <div className="lg:ml-auto">
            <div className="relative rounded-xl overflow-hidden">
              <Skeleton className="w-full h-[350px]" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center mb-3">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-4 mx-2" />
                  <Skeleton className="h-5 w-24" />
                </div>
                <Skeleton className="h-8 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-4" />
                <div className="flex items-center">
                  <Skeleton className="h-8 w-8 mr-3 rounded-full" />
                  <div>
                    <Skeleton className="h-3 w-20 mb-1" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Main Content Skeleton */}
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar Skeleton */}
          <div className="lg:w-1/4">
            <div className="sticky top-24 space-y-8">
              <div className="bg-card border border-border rounded-lg shadow-sm p-6">
                <Skeleton className="h-6 w-24 mb-4" />
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-6" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg shadow-sm p-6">
                <Skeleton className="h-6 w-32 mb-4" />
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <Skeleton className="w-16 h-16 rounded-md" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-full mb-1" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-6">
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-full mb-4" />
                <Skeleton className="h-10 w-full mb-3" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </div>

          {/* Main Content Skeleton */}
          <div className="lg:w-3/4">
            {/* Tabs & Filters Skeleton */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div className="flex gap-2">
                <Skeleton className="h-10 w-20" />
                <Skeleton className="h-10 w-20" />
                <Skeleton className="h-10 w-20" />
              </div>
            </div>

            {/* Blog Post Grid Skeleton */}
            <BlogPostGridSkeleton count={6} />

            {/* Pagination Skeleton */}
            <div className="flex justify-center mt-10">
              <div className="flex items-center space-x-1">
                <Skeleton className="h-10 w-10" />
                <Skeleton className="h-10 w-10" />
                <Skeleton className="h-10 w-10" />
                <Skeleton className="h-10 w-10" />
                <Skeleton className="h-10 w-10" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
);
