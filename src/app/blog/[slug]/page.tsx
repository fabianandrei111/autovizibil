import PublicLayout from '@/components/PublicLayout';
import { ensureSeeded, getBlogBySlug } from '@/lib/db';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  ensureSeeded();
  const { slug } = await params;
  const post = getBlogBySlug(slug);
  if (!post) return { title: 'Articol negasit | AutoVizibil' };
  return {
    title: post.seo_title || `${post.title} | AutoVizibil Blog`,
    description: post.seo_description || post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, images: post.image ? [post.image] : [] },
  };
}

export default async function BlogPostPage({ params }: Props) {
  ensureSeeded();
  const { slug } = await params;
  const post = getBlogBySlug(slug);
  if (!post || post.published !== 1) notFound();

  return (
    <PublicLayout>
      <div className="bg-surface border-b border-border">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <nav className="text-sm text-text-lighter flex items-center gap-2">
            <Link href="/" className="hover:text-primary">Acasa</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-primary">Blog</Link>
            <span>/</span>
            <span className="text-primary font-medium truncate">{post.title}</span>
          </nav>
        </div>
      </div>

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {post.category && <span className="badge badge-featured mb-4">{post.category}</span>}
        <h1 className="text-3xl lg:text-4xl font-bold text-primary leading-tight">{post.title}</h1>
        <p className="text-text-lighter text-sm mt-3">{new Date(post.created_at).toLocaleDateString('ro-RO', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        {post.image && (
          <div className="relative aspect-[16/9] rounded-xl overflow-hidden mt-8">
            <Image src={post.image} alt={post.title} fill className="object-cover" sizes="800px" />
          </div>
        )}

        <div className="mt-8 prose prose-lg max-w-none text-text-light leading-relaxed [&_h2]:text-primary [&_h2]:font-bold [&_h2]:text-xl [&_h2]:mt-8 [&_h2]:mb-4 [&_p]:mb-4" dangerouslySetInnerHTML={{ __html: post.content }} />

        <div className="mt-12 pt-8 border-t border-border text-center">
          <Link href="/blog" className="text-accent font-semibold hover:underline">&larr; Inapoi la blog</Link>
        </div>
      </article>
    </PublicLayout>
  );
}
