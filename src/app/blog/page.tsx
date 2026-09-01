import PublicLayout from '@/components/PublicLayout';
import { ensureSeeded, getAllBlogPosts } from '@/lib/db';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog | AutoVizibil',
  description: 'Sfaturi utile despre cumpararea si intretinerea masinilor. Ghiduri, comparatii si informatii practice.',
};

export default function BlogPage() {
  ensureSeeded();
  const posts = getAllBlogPosts().filter(p => p.published === 1);

  return (
    <PublicLayout>
      <section className="bg-surface py-12 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-primary">Blog</h1>
          <p className="text-text-light mt-2">Sfaturi, ghiduri si informatii utile despre masini.</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map(post => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group block bg-white rounded-xl overflow-hidden border border-border hover:shadow-lg transition-all">
              <div className="relative aspect-[16/9] overflow-hidden bg-surface-dark">
                {post.image && (
                  <Image src={post.image} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, 33vw" />
                )}
                {post.category && <span className="absolute top-3 left-3 badge badge-featured">{post.category}</span>}
              </div>
              <div className="p-5">
                <h2 className="font-bold text-lg text-primary group-hover:text-accent transition-colors">{post.title}</h2>
                <p className="text-sm text-text-light mt-2 line-clamp-2">{post.excerpt}</p>
                <p className="text-xs text-text-lighter mt-3">{new Date(post.created_at).toLocaleDateString('ro-RO', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </PublicLayout>
  );
}
