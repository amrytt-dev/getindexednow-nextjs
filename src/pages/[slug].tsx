import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { fetchSeoPageBySlug, type PublicSeoPage } from "@/utils/seoApi";

export default function DynamicSeoPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [page, setPage] = useState<PublicSeoPage | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchPage = async () => {
      if (!slug || typeof slug !== "string") return;

      setLoading(true);
      setNotFound(false);

      try {
        const data = await fetchSeoPageBySlug(slug);
        if (!mounted) return;

        if (!data) {
          setNotFound(true);
        } else {
          setPage(data);
        }
      } catch (error) {
        console.error("Error fetching SEO page:", error);
        if (mounted) {
          setNotFound(true);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchPage();

    return () => {
      mounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto py-16">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="container mx-auto py-16">
        <Head>
          <title>Page Not Found - GetIndexedNow</title>
          <meta
            name="description"
            content="The page you're looking for doesn't exist."
          />
        </Head>
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            404 - Page Not Found
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <button
            onClick={() => router.push("/")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (!page) {
    return null;
  }

  return (
    <>
      <Head>
        <title>{page.title}</title>
        {page.description && (
          <meta name="description" content={page.description} />
        )}
        {page.keywords && <meta name="keywords" content={page.keywords} />}
        {page.canonicalUrl && <link rel="canonical" href={page.canonicalUrl} />}
        {page.metaRobots && <meta name="robots" content={page.metaRobots} />}

        {/* Open Graph */}
        {page.ogTitle && <meta property="og:title" content={page.ogTitle} />}
        {page.ogDescription && (
          <meta property="og:description" content={page.ogDescription} />
        )}
        {page.ogImageUrl && (
          <meta property="og:image" content={page.ogImageUrl} />
        )}
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content={page.canonicalUrl || `https://getindexednow.com/${slug}`}
        />

        {/* Twitter */}
        {page.twitterCard && (
          <meta name="twitter:card" content={page.twitterCard} />
        )}
        {page.ogTitle && <meta name="twitter:title" content={page.ogTitle} />}
        {page.ogDescription && (
          <meta name="twitter:description" content={page.ogDescription} />
        )}
        {page.ogImageUrl && (
          <meta name="twitter:image" content={page.ogImageUrl} />
        )}

        {/* JSON-LD */}
        {page.jsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(page.jsonLd) }}
          />
        )}
      </Head>

      <div className="container mx-auto px-4 py-12">
        <article className="max-w-4xl mx-auto">
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {page.title}
            </h1>
            {page.description && (
              <p className="text-xl text-gray-600 leading-relaxed">
                {page.description}
              </p>
            )}
          </header>

          <div className="prose prose-lg max-w-none">
            <div
              dangerouslySetInnerHTML={{ __html: page.content }}
              className="text-gray-700 leading-relaxed"
            />
          </div>

          {page.updatedAt && (
            <footer className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Last updated:{" "}
                {new Date(page.updatedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </footer>
          )}
        </article>
      </div>
    </>
  );
}
