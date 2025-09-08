import { GetStaticProps } from "next";
import BlogComponent from "@/components/pages/Blog";
import { blogApi, type BlogPost, type BlogCategory } from "@/utils/blogApi";

interface BlogIndexProps {
  initialPosts: BlogPost[];
  initialCategories: BlogCategory[];
  initialPopular: BlogPost[];
  initialFeatured: BlogPost | null;
}

export default function BlogIndexPage(props: BlogIndexProps) {
  return (
    <BlogComponent
      initialPosts={props.initialPosts}
      initialCategories={props.initialCategories}
      initialPopular={props.initialPopular}
      initialFeatured={props.initialFeatured}
    />
  );
}

export const getStaticProps: GetStaticProps<BlogIndexProps> = async () => {
  try {
    const [
      postsResponse,
      categoriesResponse,
      popularResponse,
      featuredResponse,
    ] = await Promise.all([
      blogApi.getPosts({ limit: 50, status: "published" }),
      blogApi.getCategories(),
      blogApi.getPopularPosts(),
      blogApi.getFeaturedPosts(),
    ]);

    return {
      props: {
        initialPosts: postsResponse.posts,
        initialCategories: categoriesResponse.categories,
        initialPopular: popularResponse.posts,
        initialFeatured: featuredResponse.posts[0] || null,
      },
      revalidate: 60,
    };
  } catch (e) {
    return {
      props: {
        initialPosts: [],
        initialCategories: [],
        initialPopular: [],
        initialFeatured: null,
      },
      revalidate: 30,
    };
  }
};
