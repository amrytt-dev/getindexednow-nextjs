const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export type PublicSeoPage = {
  id: string;
  slug: string;
  title: string;
  keywords?: string | null;
  description?: string | null;
  ogTitle?: string | null;
  ogDescription?: string | null;
  ogImageUrl?: string | null;
  twitterCard?: string | null;
  canonicalUrl?: string | null;
  metaRobots?: string | null;
  jsonLd?: any;
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

export async function fetchSeoPageBySlug(slug: string): Promise<PublicSeoPage | null> {
  const res = await fetch(`${BASE_URL}/api/public/seo-pages/${encodeURIComponent(slug)}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Failed to load SEO page');
  return res.json();
}


