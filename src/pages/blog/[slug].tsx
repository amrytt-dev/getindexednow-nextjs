import { GetStaticPaths, GetStaticProps } from "next";
import BlogDetail from "@/components/pages/BlogDetail";
import { blogApi, type BlogPost } from "@/utils/blogApi";

interface BlogDetailPageProps {
  slug: string;
}

export default function BlogDetailPage(_props: BlogDetailPageProps) {
  // The BlogDetail component currently reads slug via react-router useParams.
  // We'll refactor it later to accept props or use Next router.
  // For now we render it as-is to keep layout while we adapt components next.
  return <BlogDetail />;
}

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const posts = await blogApi.getPosts({ limit: 100, status: "published" });
    const paths = posts.posts.map((p) => ({ params: { slug: p.slug } }));
    return { paths, fallback: "blocking" };
  } catch (e) {
    return { paths: [], fallback: "blocking" };
  }
};

export const getStaticProps: GetStaticProps<BlogDetailPageProps> = async (
  ctx
) => {
  const slug = ctx.params?.slug as string;
  if (!slug) {
    return { notFound: true };
  }
  try {
    await blogApi.getPostBySlug(slug);
    return { props: { slug }, revalidate: 60 };
  } catch (e) {
    return { notFound: true };
  }
};
