// lib/wordpress.ts
// Centralized WordPress REST API client. No component should call fetch()
// against wp-json directly — everything routes through here.

const WORDPRESS_URL = process.env.WORDPRESS_URL as string;

if (!WORDPRESS_URL) {
  console.warn("WORDPRESS_URL is not set — WordPress calls will fail.");
}

async function wpFetch<T>(path: string, revalidate = 60): Promise<T> {
  const res = await fetch(`${WORDPRESS_URL}/wp-json/wp/v2/${path}`, {
    next: { revalidate }
  });
  if (!res.ok) {
    throw new Error(`WordPress API error (${res.status}) on ${path}`);
  }
  return res.json() as Promise<T>;
}

export interface WPPage {
  id: number;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  featured_media: number;
}

export interface WPPost {
  id: number;
  slug: string;
  date: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  featured_media: number;
  categories: number[];
  author: number;
}

export interface WPCategory {
  id: number;
  name: string;
  slug: string;
  count: number;
}

export async function getWordPressPages() {
  return wpFetch<WPPage[]>("pages?per_page=50");
}

export async function getWordPressPage(slug: string) {
  const pages = await wpFetch<WPPage[]>(`pages?slug=${slug}`);
  return pages[0] ?? null;
}

export async function getWordPressPosts(page = 1, perPage = 12) {
  return wpFetch<WPPost[]>(`posts?page=${page}&per_page=${perPage}&_embed`);
}

export async function getWordPressPost(slug: string) {
  const posts = await wpFetch<WPPost[]>(`posts?slug=${slug}&_embed`);
  return posts[0] ?? null;
}

export async function getWordPressCategories() {
  return wpFetch<WPCategory[]>("categories?per_page=50");
}

export async function getFeaturedMediaUrl(mediaId: number): Promise<string | null> {
  if (!mediaId) return null;
  try {
    const media = await wpFetch<{ source_url: string }>(`media/${mediaId}`);
    return media.source_url;
  } catch {
    return null;
  }
}
