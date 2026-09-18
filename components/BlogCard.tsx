import Image from "next/image";
import Link from "next/link";
import type { WPPost } from "@/lib/wordpress";

export default function BlogCard({ post, imageUrl }: { post: WPPost; imageUrl: string | null }) {
  return (
    <Link href={`/blog/${post.slug}`} className="block group">
      <div className="relative aspect-video bg-gray-100 rounded-xl overflow-hidden mb-3">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={post.title.rendered}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        )}
      </div>
      <h3
        className="font-medium text-base mb-1"
        dangerouslySetInnerHTML={{ __html: post.title.rendered }}
      />
      <p className="text-xs text-gray-500">{new Date(post.date).toLocaleDateString()}</p>
    </Link>
  );
}
