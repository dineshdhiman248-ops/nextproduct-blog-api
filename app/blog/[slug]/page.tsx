import { notFound } from "next/navigation";
import { getWordPressPost, getFeaturedMediaUrl } from "@/lib/wordpress";
import Image from "next/image";

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getWordPressPost(params.slug).catch(() => null);
  if (!post) notFound();

  const imageUrl = await getFeaturedMediaUrl(post.featured_media);

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-semibold mb-4" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
      <p className="text-sm text-gray-500 mb-8">{new Date(post.date).toLocaleDateString()}</p>
      {imageUrl && (
        <div className="relative aspect-video rounded-2xl overflow-hidden mb-8">
          <Image src={imageUrl} alt={post.title.rendered} fill className="object-cover" />
        </div>
      )}
      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
    </article>
  );
}
