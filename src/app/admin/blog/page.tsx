'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

type Post = { id: string; title: string; slug: string; category: string; published: number; created_at: string };

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchPosts(); }, []);

  async function fetchPosts() {
    const res = await fetch('/api/blog');
    setPosts(await res.json());
    setLoading(false);
  }

  async function deletePost(id: string) {
    if (!confirm('Stergi acest articol?')) return;
    await fetch('/api/blog', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    fetchPosts();
  }

  async function togglePublished(post: Post) {
    await fetch('/api/blog', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...post, published: post.published ? 0 : 1 }) });
    fetchPosts();
  }

  if (loading) return <div className="text-text-light">Se incarca...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-primary">Blog ({posts.length})</h1>
        <Link href="/admin/blog/new" className="bg-accent text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-accent-hover text-sm">+ Articol nou</Link>
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surface">
            <tr>
              <th className="text-left py-3 px-4 font-medium text-text-lighter">Titlu</th>
              <th className="text-left py-3 px-4 font-medium text-text-lighter hidden md:table-cell">Categorie</th>
              <th className="text-left py-3 px-4 font-medium text-text-lighter">Status</th>
              <th className="text-left py-3 px-4 font-medium text-text-lighter hidden md:table-cell">Data</th>
              <th className="text-left py-3 px-4 font-medium text-text-lighter">Actiuni</th>
            </tr>
          </thead>
          <tbody>
            {posts.map(post => (
              <tr key={post.id} className="border-t border-border hover:bg-surface/50">
                <td className="py-3 px-4 font-medium text-primary">{post.title}</td>
                <td className="py-3 px-4 text-text-light hidden md:table-cell">{post.category || '-'}</td>
                <td className="py-3 px-4">
                  <button onClick={() => togglePublished(post)} className={`badge ${post.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {post.published ? 'Publicat' : 'Draft'}
                  </button>
                </td>
                <td className="py-3 px-4 text-text-lighter text-xs hidden md:table-cell">{new Date(post.created_at).toLocaleDateString('ro-RO')}</td>
                <td className="py-3 px-4 flex gap-2">
                  <Link href={`/admin/blog/${post.id}/edit`} className="text-primary hover:text-accent text-sm font-medium">Edit</Link>
                  <button onClick={() => deletePost(post.id)} className="text-accent hover:text-accent-hover text-sm font-medium">Sterge</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
