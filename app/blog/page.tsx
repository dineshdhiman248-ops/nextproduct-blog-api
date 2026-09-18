import { getWordPressPosts, getFeaturedMediaUrl } from "@/lib/wordpress";
import BlogCard from "@/components/BlogCard";

export default async function BlogPage() {
  const posts = await getWordPressPosts(1, 12).catch(() => []);
  const withImages = await Promise.all(
    posts.map(async (post) => ({
      post,
      imageUrl: await getFeaturedMediaUrl(post.featured_media)
    }))
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="font-display text-4xl text-ink mb-10">Blog</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {withImages.map(({ post, imageUrl }) => (
          <BlogCard key={post.id} post={post} imageUrl={imageUrl} />
        ))}
      </div>
    </div>
  );
}
